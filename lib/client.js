import CryptoUtils from './utils/cryptoUtils.js';
import { getPkceAuthToken } from './grants/pkce-grant.js';

class OAuthClient {
    constructor(config) {
      this.client_id = config.client_id;
      this.client_secret = config.client_secret;
      this.redirect_uri = config.redirect_uri;
      this.authorization_url = config.authorization_url;
      this.token_url = config.token_url;
      this.scope = config.scope;
    }

    async startAuthFlow() {
      const state = CryptoUtils.generateRandomString();
      localStorage.setItem("pkce_state", state);

      const codeVerifier = CryptoUtils.generateRandomString();
      localStorage.setItem("pkce_code_verifier", codeVerifier);

      const codeChallenge = await CryptoUtils.pkceChallengeFromVerifier(codeVerifier);

      const url = `${this.authorization_url}?response_type=code&client_id=${encodeURIComponent(this.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(this.scope)}&redirect_uri=${encodeURIComponent(this.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

      window.location = url;
      // return url;
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
          // Get Auth Token
          await this.exchangeAuthCodeForToken(q.code);
        }
      }
      // localStorage.removeItem("pkce_state");
      // localStorage.removeItem("pkce_code_verifier");
    }
  
    async exchangeAuthCodeForToken(code) {
      const codeVerifier = localStorage.getItem("pkce_code_verifier");
      if (!codeVerifier) {
          console.error("Code verifier is missing from localStorage.");
          return null;
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
  
      const response = await fetch(this.token_url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
          const errorText = await response.text(); // Get the raw error message if not ok
          console.error("Token exchange failed with status:", response.status, "Response:", errorText);
          return null; // Return null on failure
      }
  
      let data;
      try {
          data = await response.json();
      } catch (err) {
          console.error("Error parsing response JSON:", err);
          return null; // Return null if there was an error parsing
      }
  
      if (!data) {
          console.error("No token data returned.");
          return null;
      }
  
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("id_token", data.id_token);
      localStorage.setItem("expires_in", data.expires_in.toString());
  
      const baseUrl = new URL(this.token_url).origin;
      const userInfoUrl = `${baseUrl}/userinfo`;
  
      const userInfoResponse = await fetch(userInfoUrl, {
        method: "GET",
          headers: {
              "Authorization": `Bearer ${data.access_token}`,
          },
      });
  
      if (!userInfoResponse.ok) {
          const errorText = await userInfoResponse.text();
          console.error("User info request failed with status:", userInfoResponse.status, "Response:", errorText);
          return null;
      }
  
      let userInfo;
      try {
          userInfo = await userInfoResponse.json();
      } catch (err) {
          console.error("Error parsing user info response JSON:", err);
          return null;
      }
  
      localStorage.setItem("current_user", JSON.stringify(userInfo));
  
      return {
        auth_token: data.access_token,
        id_token: data.id_token,
        expires_in: data.expires_in,
        user_info: userInfo,
    };
  }
  }  

export { OAuthClient };  