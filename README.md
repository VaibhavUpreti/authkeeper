<p align="center">
    <a href="http://oauth.net/2/" target="_blank" rel="noopener">
      <img src="https://github.com/oauth-xx/oauth2/raw/main/docs/images/logo/oauth2-logo-124px.png?raw=true" alt="OAuth 2.0 Logo">
    </a>
    <a href="/" target="_blank" rel="noopener">
      <img width="124px" src="https://github.com/user-attachments/assets/ba042139-cc56-412d-920c-7c7ecf4d6eec" alt="Javascript">
    </a>
</p>


# authkeeper — easy to use OAuth 2 JavaScript Client.

[![npm version](https://badge.fury.io/js/authkeeper.svg)](https://badge.fury.io/js/authkeeper)
[![CI](https://github.com/VaibhavUpreti/authkeeper/actions/workflows/nodejs.yml/badge.svg)](https://github.com/VaibhavUpreti/authkeeper/actions/workflows/nodejs.yml)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-success.svg)](https://dependabot.com)

authkeeper is a lightweight JavaScript ES6 module (51.7 kB) for implementing OAuth 2.0 clients in web, desktop, and mobile applications. authkeeper is designed to work seamlessly in both **browser-based** and **server-side (Node.js)** environments. 

It is inspired by the Doorkeeper gem in Ruby, which is widely used for OAuth 2.0 authorization in Ruby on Rails applications. authkeeper provides an easy-to-use API for OAuth 2.0 authentication flows.

Supported features:

- [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
  - [Authorization Code Flow](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)
  - [Access Token Scopes](https://datatracker.ietf.org/doc/html/rfc6749#section-3.3)
  - [Refresh token](https://datatracker.ietf.org/doc/html/rfc6749#section-1.5)
  - [OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)
  - [Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)

  <!-- - [Implicit grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2)
  <!-- - [Resource Owner Password Credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.3) -->
  <!-- - [Client Credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) -->
<!-- - [OAuth 2.0 Token Revocation](https://datatracker.ietf.org/doc/html/rfc7009)
- [OAuth 2.0 Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662) -->
<!-- - [OAuth 2.0 Threat Model and Security Considerations](https://datatracker.ietf.org/doc/html/rfc6819)
 -->

## Usage

```bash 
npm install authkeeper
```

### From CDN

```html
<script type="text/javascript" src="https://www.unpkg.com/authkeeper@1.2.7/dist/authkeeper.js"></script>
```

```html
<script type="module">
    const config = {
        client_id: 'clientid',
        redirect_uri: 'http://localhost:5500/home',
        authorization_url: 'https://api.oauth.com/authorize',
        token_url: 'https://api.oauth.com/token',
        scope: 'openid profile',
    };

    var oauthClient = new authkeeper.OAuthClient(config);
    
    // To start the auth flow
    document.getElementById("start").addEventListener("click", function() {
        oauthClient.startAuthFlow().then(url => {
         window.location=url;
        });
    });

    async function getAuthUrl() {
        const url = await oauthClient.startAuthFlow();
        console.log(url);
    }
    
    // After the user is redirected back, call handleCallback
    window.onload = function() {
        oauthClient.handleCallback();
    };
</script>

```

### Using with SSR applications

Using authkeeper with express and SSR node applications(react, vue, nextjs, ... ), importing the required functions

Import `authkeeper` and set up your OAuth configuration:

```javascript
import * as authkeeper from 'authkeeper';
const { OAuthClient } = authkeeper;

// Use any OAuth Provider of your choice
const oauthConfig = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET_KEY,
  redirect_uri: process.env.REDIRECT_URI,
  authorization_url: process.env.AUTHORIZATION_URL,
  token_url: process.env.TOKEN_URL,
  scope: process.env.SCOPE,
};

const oauthClient = new OAuthClient(oauthConfig);
```

**Building Login URI**

Generate the login URL to redirect users for OAuth authorization:

```javascript
const authUrl = await oauthClient.startAuthFlow(oauthConfig);
```

example

```javascript
app.get('/authorize', async (req, res) => {
  try {
    const authUrl = await oauthClient.startAuthFlow(oauthConfig);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error starting auth flow:', error);
    res.status(500).send('Error starting auth flow');
  }
});
```


**Get Auth Token, ID Token, Refresh Token**

Exchange the authorization code for tokens

```javascript
// Returns token depending upon the scope provided in config
const tokenData = await oauthClient.exchangeAuthCodeForToken(code);
```


**Refresh Token**

Use the refresh token to get a new access token

```javascript
// Already existing Refresh Token set in browser cookie after login
const refreshToken = req.cookies.refresh_token;
// Refreshes the refresh token and sets it in the browser as a HTTP only cookie
const tokenData = await oauthClient.refreshAccessToken(refreshToken);
```


**Get User Data**

Retrieve user information based on the fields in your OAuth scope

```javascript
// Returns userData in json provided the fields present in the scope of configuration
const accessToken = req.cookies.access_token;
const userData = await oauthClient.getUserInfo(accessToken);
```


## Supported OAuth Grant types

For more information look [GRANTS.md](./GRANTS.md)

## Example Applications

These applications show how authkeeper works and how to integrate with it. Start with the oAuth2 server and use the clients to connect with the server.


1. [SSR application](./demo/ssr-express-demo/README.md)
2. [React SPA](./demo/react-spa-demo/README.md) -  https://authkeeper-spa.vercel.app/
3. [Native Mobile Apps/ browser based spa](./demo/browser-spa/README.md)

## License

[MIT License](./LICENSE)