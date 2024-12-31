import express from 'express';
import * as authkeeper from 'authkeeper';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const { OAuthClient } = authkeeper;
const app = express();
app.use(cookieParser()); 


const oauthConfig = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET_KEY,
  redirect_uri: process.env.REDIRECT_URI,
  authorization_url: process.env.AUTHORIZATION_URL,
  token_url: process.env.TOKEN_URL,
  scope: process.env.SCOPE,
};

const oauthClient = new OAuthClient(oauthConfig);
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OAuth Demo</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        margin: 0;
        background-color: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .container {
        text-align: center;
        background-color: white;
        padding: 40px 60px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
        box-sizing: border-box;
      }

      h1 {
        font-size: 36px;
        font-weight: 600;
        color: #20232a;
        margin-bottom: 30px;
        letter-spacing: 0.5px;
      }

      .description {
        font-size: 18px;
        color: #616161;
        margin-bottom: 20px;
        line-height: 1.5;
      }

      .button {
        padding: 15px 30px;
        font-size: 18px;
        color: white;
        background-color: #61dafb;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        display: inline-block;
        text-decoration: none;
      }

      .button:hover {
        background-color: #21a1f1;
        transform: translateY(-2px);
      }

      .button:focus {
        outline: none;
      }

      .button:active {
        transform: translateY(2px);
      }

      .link {
        text-decoration: none;
      }

      .footer {
        margin-top: 20px;
        color: #616161;
        font-size: 14px;
      }

      .footer a {
        color: #61dafb;
        text-decoration: none;
      }

      .footer a:hover {
        text-decoration: underline;
      }

      @media (max-width: 480px) {
        .container {
          padding: 30px 20px;
        }

        h1 {
          font-size: 30px;
        }

        .description {
          font-size: 16px;
        }

        .button {
          font-size: 16px;
          padding: 12px 25px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to OAuth Demo!</h1>
      <p class="description">
        This is a simple demonstration of OAuth 2.0 authentication flow. Explore how it works with the buttons below.
      </p>
      <div>
        <a href="/authorize" class="link">
          <button class="button">Visit /authorize</button>
        </a>
      </div>
      <div style="margin-top: 20px;">
        <a href="/refresh-token" class="link">
          <button class="button">Refresh Token</button>
        </a>
      </div>
      <div class="footer">
        <p>Powered by <a href="https://reactjs.org" target="_blank">React</a></p>
      </div>
    </div>
  </body>
</html>

  `);
});


app.get('/authorize', async (req, res) => {
  try {
    const authUrl = await oauthClient.startAuthFlow(oauthConfig);
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error starting auth flow:', error);
    res.status(500).send('Error starting auth flow');
  }
});


app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // // Should verify that the state matches the one you sent during the auth flow (to prevent CSRF attacks)
  // if (state !== 'someState') { // Replace 'someState' with the actual state you generated earlier
  //   return res.status(400).send('State mismatch, possible CSRF attack');
  // }

  if (code) {
    try {
      const tokenData = await oauthClient.exchangeAuthCodeForToken(code);
      res.cookie('access_token', tokenData.access_token, { httpOnly: true });
      res.cookie('id_token', tokenData.id_token, { httpOnly: true });
      res.cookie('refresh_token', tokenData.refresh_token, { httpOnly: true });
      res.cookie('expires_in', tokenData.expires_in, { httpOnly: true });

      res.redirect("/user")
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      res.status(500).send('Error obtaining access token');
    }
  } else {
    res.status(400).send('Authorization code not found in the request.');
  }
});


app.get('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(400).send('No refresh token found in cookies');
  }
  try {
    if (refreshToken) {
      const tokenData = await oauthClient.refreshAccessToken(refreshToken);
      res.cookie('access_token', tokenData.access_token, { httpOnly: true });
      res.cookie('id_token', tokenData.id_token, { httpOnly: true });
      res.cookie('refresh_token', tokenData.refresh_token, { httpOnly: true });
      res.cookie('expires_in', tokenData.expires_in, { httpOnly: true });
      res.redirect('/user?success=true');
    } else {
      res.status(400).send('Failed to refresh the token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).send('Error refreshing token');
  }
});

app.get("/user", async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token not found. Please authenticate again." });
    }

    // Fetch user information using the access token
    const userData = await oauthClient.getUserInfo(accessToken);

    res.status(200).json({
      message: "User information retrieved successfully.",
      user: userData, // Assuming `getUserInfo` already returns a parsed object
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({
      message: "An error occurred while retrieving user information.",
      error: error.message,
    });
  }
});


const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});