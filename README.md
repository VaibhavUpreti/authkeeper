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
[![CI](https://github.com/VaibhavUpreti/authkeeper/blob/main/.github/workflows/nodejs.yml/badge.svg)](https://github.com/VaibhavUpreti/authkeeper/blob/main/.github/workflows/nodejs.yml/badge.svg)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-success.svg)](https://dependabot.com)

authkeeper is a lightweight JavaScript library for implementing OAuth 2.0 clients in web, desktop, and mobile applications. 

It supports the following [grant types](https://oauth.net/2/grant-types/) out of the box

- [Authorization code](https://oauth.net/2/grant-types/authorization-code/) - SSR apps
- [PKCE](https://oauth.net/2/pkce/) - browser based, native apps, mobile apps
- [refresh tokens](https://oauth.net/2/grant-types/refresh-token/)

Supported features:

- [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
  - [Authorization Code Flow](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)
  - [Access Token Scopes](https://datatracker.ietf.org/doc/html/rfc6749#section-3.3)
  - [Refresh token](https://datatracker.ietf.org/doc/html/rfc6749#section-1.5)
  - [Implicit grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2)
  <!-- - [Resource Owner Password Credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.3) -->
  - [Client Credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4)
<!-- - [OAuth 2.0 Token Revocation](https://datatracker.ietf.org/doc/html/rfc7009)
- [OAuth 2.0 Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662) -->
<!-- - [OAuth 2.0 Threat Model and Security Considerations](https://datatracker.ietf.org/doc/html/rfc6819)
- [OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)
- [Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636) -->

## Installation

```bash 
npm install authkeeper
```

From CDN

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/authkeeper@latest/dist/authkeeper.js"></script>
```


## Usage

```javascript
import { OAuthClient, startAuthFlow, handleCallback, refreshToken } from 'authkeeper';
```

Choose appropriate client configuration

```javascript
const client = new OAuthClient({
  client_id: 'your-client-id',
  client_secret: 'your-client-secret',
  redirect_uri: 'https://your-redirect-uri.com/callback',
  authorization_url: 'https://oauth-provider.com/auth',
  token_url: 'https://oauth-provider.com/token',
  scope: 'openid profile email',
});
```


### Using with SSR applications

Using authkeeper with express, importing the required functions

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const { OAuthClient, startAuthFlow, handleCallback, refreshToken } = require('authkeeper');

```

```javascript

// Route to start the OAuth flow
app.get('/authorize', (req, res) => {
  const authUrl = startAuthFlow(client);
  res.redirect(authUrl); // Redirect to OAuth provider's authorization URL
});

// Callback route to handle OAuth response and store tokens in cookies
app.get('/callback', async (req, res) => {
  const tokenResponse = await handleCallback(client, req.query);
  res.cookie('access_token', tokenResponse.access_token, {
    httpOnly: true,
    secure: true, // Ensure secure flag in production
  });
  res.cookie('refresh_token', tokenResponse.refresh_token, {
    httpOnly: true,
    secure: true,
  });
  res.send('OAuth2 Flow completed successfully!');
});

// Example route that requires authentication
app.get('/protected', (req, res) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return res.status(401).send('Unauthorized');
  }
  // Use accessToken to call protected APIs or services
  res.send('Protected Content');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

```



## Grant types

For more information look [GRANTS.md](./GRANTS.md)




## Example Applications

These applications show how pistis works and how to integrate with it. Start with the oAuth2 server and use the clients to connect with the server.


## License

[MIT License](./LICENSE)

