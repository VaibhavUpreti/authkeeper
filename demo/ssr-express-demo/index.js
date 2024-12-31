import express from 'express';
import * as authkeeper from 'authkeeper';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const { OAuthClient } = authkeeper;  // Destructure OAuthClient

const app = express();


// OAuth Configuration using process.env
const oauthConfig = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET_KEY,
  redirect_uri: process.env.CLIENT_DOMAIN,
  authorization_url: process.env.AUTHORIZATION_URL,
  token_url: process.env.TOKEN_URL,
  scope: process.env.SCOPE,
};

// Initialize OAuthClient with configuration
const oauthClient = new OAuthClient(oauthConfig);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.get('/authorize', (req, res) => {
  // Assume startAuthFlow is a method in authkeeper to get the authorization URL
  const authUrl = oauthClient.startAuthFlow();  // This should return the OAuth provider's authorization URL
  res.redirect(authUrl); // Redirect to OAuth provider's authorization URL
});

// Start the server
const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
