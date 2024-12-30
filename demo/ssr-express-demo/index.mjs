import express from 'express';
import authkeeper from 'authkeeper';  // Default import for CommonJS module
import dotenv from 'dotenv';

dotenv.config();

const { OAuthClient } = authkeeper;  // Destructure OAuthClient

const app = express();

// OAuth Configuration
const oauthConfig = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET_KEY,
  redirect_uri: `${CLIENT_DOMAIN}`,
  authorization_url: AUTHORIZATION_URL,
  token_url: TOKEN_URL,
  scope: SCOPE,
};

// Initialize OAuthClient with configuration
const oauthClient = new OAuthClient(oauthConfig);
