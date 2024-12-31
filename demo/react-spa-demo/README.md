# OAuth in SPA React with authkeeper

## Demo

https://authkeeper-spa.vercel.app/


https://github.com/user-attachments/assets/2eff0c93-e800-4356-a37f-be6ba721fa96

## Setup

```bash
git clone https://github.com/VaibhavUpreti/authkeeper.git  
```

Navigate to the codebase

```bash
cd authkeeper
cd demo/ssr-express-demo
```


Install required packages

```bash
npm i
```


Setup OAuth Provider(eg. Auth0)

1. Create a new Oauth application in Auth0 dashboard, type- regular web app.
2. Export required client crediantials(id) to .env file, refer to [.env.example](./.env.example).
3. Under settings, -> `application uri`, set the following values for callback, logout and web origins.

4. Under settings, -> `Refresh Token Rotation` enable allow refresh tokens.(IMP- It is important to setup a refresh token mechanism before using refresh tokens in production) [refer](../../GRANTS.MD)


Start npm development server

```bash
npm run dev
```

Navigate to http://localhost:5500/ to access the application.
