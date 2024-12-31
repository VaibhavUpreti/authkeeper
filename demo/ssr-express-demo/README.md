
# Using authkeepr in SSR Express application

## Demo

https://github.com/user-attachments/assets/67de8d11-503b-41f1-ad49-e08f9622eb52


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
2. Export required client crediantials(id, secret) to .env file, refer to [.env.example](./.env.example).
3. Under settings, -> `application uri`, set the following values for callback, logout and web origins.

4. Under settings, -> `Refresh Token Rotation` enable allow refresh tokens.(IMP- It is important to setup a refresh token mechanism before using refresh tokens in production) [refer](../../GRANTS.MD)



Start npm development server

```bash
npm run dev
```


Navigate to http://localhost:5500/ to access the application.