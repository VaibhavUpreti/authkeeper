class OAuthClient {
    constructor(config) {
      this.client_id = config.client_id;
      this.client_secret = config.client_secret;
      this.redirect_uri = config.redirect_uri;
      this.authorization_url = config.authorization_url;
      this.token_url = config.token_url;
      this.scope = config.scope;
    }
  
    generateRandomString(length = 28) {
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }
  
    // base64url encode
    base64urlencode(str) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
  
    // PKCE helper functions
    async pkceChallengeFromVerifier(v) {
      const hashed = await this.sha256(v);
      return this.base64urlencode(hashed);
    }
  
    sha256(plain) {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest('SHA-256', data);
    }
  
    // Start OAuth flow (Authorization Code + PKCE)
    async startAuthFlow() {
      const state = this.generateRandomString();
      localStorage.setItem("pkce_state", state);
  
      const code_verifier = this.generateRandomString();
      localStorage.setItem("pkce_code_verifier", code_verifier);
  
      const code_challenge = await this.pkceChallengeFromVerifier(code_verifier);
  
      const url = `${this.authorization_url}?response_type=code&client_id=${encodeURIComponent(this.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(this.scope)}&redirect_uri=${encodeURIComponent(this.redirect_uri)}&code_challenge=${encodeURIComponent(code_challenge)}&code_challenge_method=S256`;
  
      window.location = url;
    }
  
    // Handle OAuth callback
    async handleCallback() {
      const q = this.parseQueryString(window.location.search.substring(1));
  
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
      const code_verifier = localStorage.getItem("pkce_code_verifier");
  
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('client_id', this.client_id);
      params.append('redirect_uri', this.redirect_uri);
      params.append('code_verifier', code_verifier);
  
      try {
        const response = await fetch(this.token_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        const data = await response.json();
        if (response.ok) {
          document.getElementById("access_token").innerText = data.access_token;
          document.getElementById("token").classList.remove("hidden");
        } else {
          document.getElementById("error_details").innerText = data.error;
          document.getElementById("error").classList.remove("hidden");
        }
      } catch (err) {
        console.error("Error exchanging auth code:", err);
      }
    }
  
    // Helper function to parse query string
    parseQueryString(query) {
      const params = new URLSearchParams(query);
      const result = {};
      for (let [key, value] of params.entries()) {
        result[key] = value;
      }
      return result;
    }
  }
  
  export { OAuthClient };

  