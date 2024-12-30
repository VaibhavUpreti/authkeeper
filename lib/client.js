import CryptoUtils from './utils/cryptoUtils';

class OAuthClient {
    constructor(config) {
      this.client_id = config.client_id;
      this.client_secret = config.client_secret;
      this.redirect_uri = config.redirect_uri;
      this.authorization_url = config.authorization_url;
      this.token_url = config.token_url;
      this.scope = config.scope;
    }

    // Start OAuth flow (Authorization Code + PKCE)
    async startAuthFlow() {
      const state = CryptoUtils.generateRandomString();
      localStorage.setItem("pkce_state", state);

      const codeVerifier = CryptoUtils.generateRandomString();
      localStorage.setItem("pkce_code_verifier", codeVerifier);

      const codeChallenge = await CryptoUtils.pkceChallengeFromVerifier(codeVerifier);

      const url = `${this.authorization_url}?response_type=code&client_id=${encodeURIComponent(this.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(this.scope)}&redirect_uri=${encodeURIComponent(this.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

      window.location = url;
  }
    // Handle OAuth callback
    async handleCallback() {
      const q = CryptoUtils.parseQueryString(window.location.search.substring(1));
  
      if (q.error) {
        alert("Error: " + q.error);
      }
  
      if (q.code) {
        if (localStorage.getItem("pkce_state") !== q.state) {
          alert("Invalid state");
        } else {
          await this.exchangeAuthCodeForToken(q.code);
        }
      }
  
      localStorage.removeItem("pkce_state");
      localStorage.removeItem("pkce_code_verifier");
    }
  

    async exchangeAuthCodeForToken(code) {
      const codeVerifier = localStorage.getItem("pkce_code_verifier");
      if (!codeVerifier) {
          console.error("Code verifier is missing from localStorage.");
          return null; // Return null if code verifier is missing
      }
  
      const audience = new URL("/api/v2/", this.token_url).origin;
  
      const payload = {
          client_id: this.client_id,
          client_secret: this.client_secret, // Include client_secret if required
          grant_type: "authorization_code",
          code: code,
          redirect_uri: this.redirect_uri,
          code_verifier: codeVerifier,
          audience: audience,
      };
  
      try {
          // Use Fetch API to make the POST request
          const response = await fetch(this.token_url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
          });
  
          // Check if the response is okay before trying to parse it
          if (!response.ok) {
              const errorText = await response.text(); // Get the raw error message if not ok
              console.error("Token exchange failed with status:", response.status, "Response:", errorText);
              return null; // Return null on failure
          }
  
          // Parse the JSON response only if the request was successful
          const data = await response.json();
  
          // Check if data exists before returning it
          if (!data) {
              console.error("No token data returned.");
              return null;
          }
  
          // Save the token to localStorage
          localStorage.setItem("auth_token", JSON.stringify(data));
  
          return data; // Return the token data
  
      } catch (err) {
          console.error("Error during token exchange:", err);
          return null; // Return null on error
      }
  }  


}
  
  export { OAuthClient };

  