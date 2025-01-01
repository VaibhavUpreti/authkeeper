import React from "react";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1>Welcome to OAuth Demo!</h1>
      <p className="description">
        This is a simple demonstration of OAuth 2.0 authentication flow. Explore how it works with the buttons below.
      </p>
      <div>
        <a href="/authorize" className="link">
          <button className="button">Visit /authorize</button>
        </a>
      </div>
      <div style={{ marginTop: "20px" }}>
        <a href="/refresh-token" className="link">
          <button className="button">Refresh Token</button>
        </a>
      </div>
      <div className="footer">
        <p>
          Powered by <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a>
        </p>
      </div>
    </div>
  );
}

export default App;
