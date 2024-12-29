<p align="center">
    <a href="http://oauth.net/2/" target="_blank" rel="noopener">
      <img src="https://github.com/oauth-xx/oauth2/raw/main/docs/images/logo/oauth2-logo-124px.png?raw=true" alt="OAuth 2.0 Logo">
    </a>
    <a href="/" target="_blank" rel="noopener">
      <img width="124px" src="https://github.com/user-attachments/assets/ba042139-cc56-412d-920c-7c7ecf4d6eec" alt="Javascript">
    </a>
</p>


# auth-keeper — easy to use OAuth 2 JavaScript Client.

[![npm version](https://badge.fury.io/js/auth-keeper.svg)](https://badge.fury.io/js/auth-keeper)
[![CI](https://github.com/VaibhavUpreti/auth-keeper/blob/main/.github/workflows/nodejs.yml/badge.svg)](https://github.com/VaibhavUpreti/auth-keeper/blob/main/.github/workflows/nodejs.yml/badge.svg)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-success.svg)](https://dependabot.com)

auth-keeper is a lightweight JavaScript library for implementing OAuth 2.0 clients in web, desktop, and mobile applications. 

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
npm install auth-keeper
```

From CDN

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/auth-keeper@latest/dist/auth-keeper.js"></script>
```


## Usage

```javascript
import { OAuthClient, startAuthFlow, handleCallback, refreshToken } from 'auth-keeper';
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


## Grant types

For more information look [GRANTS.md](./GRANTS.md)




## Example Applications

These applications show how pistis works and how to integrate with it. Start with the oAuth2 server and use the clients to connect with the server.


## License

[MIT License](./LICENSE)

