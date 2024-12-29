import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { testLibrary } from '../../../lib/'

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

function App() {
  const [count, setCount] = useState(0)

  return (    <>
    {pistis.testLibrary(config)}
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
