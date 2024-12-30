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
      window.location.reload();
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
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "", marginBottom: "30px" }}>AuthKeeper SPA Demo</h1>
      <div className="card" style={{
   
      }}>
        <button
          onClick={initiateAuthFlow}
          style={{
          }}
        >
          Login with OAuth
        </button>
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#7f8c8d" }}>
          Click the button to authenticate with OAuth
        </p>
      </div>
      {userInfo && (
  
  <div id="user-info" style={{
    margin: "20px auto",
    padding: "20px",
    maxWidth: "600px",
    background: "#f9f9f9",
    borderRadius: "8px",
    textAlign: "left",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  }}>
    {/* Green check mark and success message */}
    <div style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
    }}>
      <span style={{
        display: "inline-block",
        width: "24px",
        height: "24px",
        backgroundColor: "#28a745",
        color: "#fff",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "24px",
        fontSize: "16px",
        marginRight: "10px",
      }}>
        ✓
      </span>
      <h2 style={{
        margin: 0,
        color: "#28a745",
        fontSize: "18px",
        fontWeight: "bold",
      }}>
        User Successfully Authorized
      </h2>
    </div>

    {/* User information */}
    <h3 style={{ color: "#000000", marginBottom: "10px" }}>User Information</h3>
    <pre style={{
      background: "#000000",
      color: "#ffffff",
      padding: "15px",
      borderRadius: "5px",
      overflow: "auto",
      fontSize: "14px",
      fontFamily: "Courier New, Courier, monospace",
    }}>
      {JSON.stringify(userInfo, null, 2)}
    </pre>
  </div>
)}

      <p className="read-the-docs" style={{ marginTop: "20px", fontSize: "14px", color: "#7f8c8d" }}>
        <span>AuthKeeper</span> |{" "}
        <a
          href="https://github.com/VaibhavUpreti/authkeeper"
          target="_blank"
          style={{ textDecoration: "none", color: "#3498db", fontWeight: "bold" }}
        >
          <span role="img" aria-label="GitHub">🌟 GitHub</span> Repository
        </a>
      </p>
    </div>
  );
}


export default App;
