# Supported Grants

It supports the following [grant types](https://oauth.net/2/grant-types/) out of the box

- [Authorization code](https://oauth.net/2/grant-types/authorization-code/) - SSR apps
- [PKCE](https://oauth.net/2/pkce/) - browser based, mobile apps
- [refresh tokens](https://oauth.net/2/grant-types/refresh-token/)


**Important:** Do not refresh tokens unless you have implemented a refresh token rotation mechanism.

### Keeping Refresh Tokens Secure

Whenever an application exchanges a refresh token for an access token, a new refresh token should be issued. This ensures that a long-lived refresh token is not left vulnerable, granting access to unauthorized resources.

By constantly rotating and invalidating refresh tokens, you significantly reduce the risk of token compromise.

You may store refresh tokens in local storage or browser memory, provided that a token rotation mechanism is in place to maintain security.