import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { OAuthClient } from "authkeeper";  // Import OAuthClient class

// Define the OAuth configuration
const config = {
  client_id: "PkaNwoOTJGY2rAtNaLr7iR7BznU7wM5o",
  // Development
  // redirect_uri: "http://localhost:5500", // Update this to your app's URL
  // Production
  redirect_uri: "https://authkeeper-spa.vercel.app/",
  authorization_url: "https://dev-k6ckdaso3ygmzm7u.us.auth0.com/authorize",
  token_url: "https://dev-k6ckdaso3ygmzm7u.us.auth0.com/oauth/token",
  scope: "openid profile email",
};

function App() {
  const [count, setCount] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const oauthClient = new OAuthClient(config);

  const initiateAuthFlow = () => {
    oauthClient.startAuthFlow();
  };

  // Handle the OAuth callback, exchange the code for a token, and fetch user information
  const fetchUserData = async (code) => {
    const token = await oauthClient.exchangeAuthCodeForToken(code);
    if (token) {
      setAuthToken(token);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }

    // Handle the OAuth callback after redirect with code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      fetchUserData(code);
    }
  }, []);

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={initiateAuthFlow}>
          Login with OAuth
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {userInfo && (
        <div id="user-info">
          <h2>User Information</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
