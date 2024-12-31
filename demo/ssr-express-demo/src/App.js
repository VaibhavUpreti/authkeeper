import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>Welcome to OAuth Demo!</h1>
        <a href="/authorize">
          <button className="button">Visit /authorize</button>
        </a>
        <br />
        <a href="/refresh-token">
          <button className="button">Refresh Token</button>
        </a>
      </div>
    </div>
  );
}

export default App;
