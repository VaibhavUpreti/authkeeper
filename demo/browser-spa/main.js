//import { testLibrary } from '../../dist/pistis.js'; // Adjust the import path if necessary

// Configuration for OAuth flow
const config = {
  authorization_endpoint: 'https://dev-k6ckdaso3ygmzm7u.us.auth0.com/authorize', // Replace with your actual authorization endpoint
  token_endpoint: 'https://your-oauth-provider.com/token', // Replace with your actual token endpoint
  client_id: 'PkaNwoOTJGY2rAtNaLr7iR7BznU7wM5o', // Replace with your client ID
  requested_scopes: 'openid profile', // Scopes required for authentication
  redirect_uri: 'http://localhost:8080/callback', // The URI where the provider will redirect after authorization

//   //
//   GET https://{yourDomain}/authorize?
//   audience=API_IDENTIFIER&
//   scope=SCOPE&
//   response_type=code&
//   client_id={yourClientId}&
//   redirect_uri={https://yourApp/callback}&
//   code_challenge=CODE_CHALLENGE&
//   code_challenge_method=S256

};

document.getElementById('test-btn').addEventListener('click', async function () {
    try {
    // Start the OAuth flow
    console.log('Starting OAuth flow...');

    const authUrl = await pistis.startAuthFlow(config)
    console.log('Generated Auth URL:', authUrl);

    // Redirect the user to the authorization URL (simulating the login flow)
   //window.location.href = authUrl;

  } catch (error) {
    console.error('Error during OAuth flow:', error);
  }
});

// Simulate receiving the callback (this should be placed in your redirect URI handler)
//if (window.location.search) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

 // if (code && state) {
    // Handle the callback
    console.log('Callback received with code:', code);
    pistis.handleCallback(config, { state, code })
      .then(tokenResponse => {
        console.log('Token response:', tokenResponse);
        document.getElementById('message').style.display = 'block';
      })
      .catch(error => {
        console.error('Error handling callback:', error);
      });
//  }
//}




// import { OAuthClient, handleCallback, generateState } from "../../dist/pistis/j";

// const client = new OAuthClient({
//   clientId: "YOUR_CLIENT_ID",
//   redirectUri: "http://localhost:3000/callback",
//   providerConfig: {
//     authUrl: "https://auth0.com/oauth/authorize",
//     tokenUrl: "https://auth0.com/oauth/token",
//     scopes: ["openid", "profile", "email"],
//   },
// });


// document.getElementById("login").addEventListener("click", async () => {
//   const state = generateState();
//   const authUrl = await client.getAuthUrl(state); // Use the async PKCE method
//   console.log("hi")
//   window.location.href = authUrl;
// });

// if (window.location.pathname === "/callback") {
//   const queryParams = new URLSearchParams(window.location.search);
//   handleCallback(client, Object.fromEntries(queryParams)).then((tokens) => {
//     console.log("Tokens received:", tokens);
//   });
// }


// // Blog

// var config = {
//     client_id: "",
//     redirect_uri: "http://localhost:8080/",
//     authorization_endpoint: "",
//     token_endpoint: "",
//     requested_scopes: "openid"
// };


