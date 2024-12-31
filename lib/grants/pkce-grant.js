import CryptoUtils from '../utils/cryptoUtils.js';
import { fetchUserInfo } from '../utils/getUserInfo.js'
/**
 * Initiates the OAuth 2.0 PKCE Authorization Flow.
 * Generates state and code verifier, stores them in localStorage, and redirects to the authorization URL.
 * @param {Object} config - OAuth configuration.
 */
export async function startAuthFlow(config) {
    const state = CryptoUtils.generateRandomString();
    localStorage.setItem("pkce_state", state);

    const codeVerifier = CryptoUtils.generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

    const codeChallenge = await CryptoUtils.pkceChallengeFromVerifier(codeVerifier);

    const url = `${config.authorization_url}?response_type=code&client_id=${encodeURIComponent(config.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

    window.location = url;
}

/**
 * Handles the OAuth 2.0 callback and processes the authorization code.
 * @param {Object} config - OAuth configuration.
 * @returns {Object|null} - Token data if successful, null otherwise.
 */
export async function handleCallback(config) {
    const query = CryptoUtils.parseQueryString(window.location.search.substring(1));

    if (query.error) {
        alert("Error: " + query.error);
        return null;
    }

    if (query.code) {
        if (localStorage.getItem("pkce_state") !== query.state) {
            alert("Invalid state");
            return null;
        }
        return exchangeAuthCodeForToken(config, query.code);
    }

    return null;
}

/**
 * Exchanges the authorization code for tokens.
 * @param {Object} config - OAuth configuration.
 * @param {string} code - Authorization code.
 * @returns {Object|null} - Token data if successful, null otherwise.
 */
export async function exchangeAuthCodeForToken(config, code) {
    const codeVerifier = localStorage.getItem("pkce_code_verifier");
    if (!codeVerifier) {
        console.error("Code verifier is missing from localStorage.");
        return null;
    }

    const payload = {
        client_id: config.client_id,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirect_uri,
        code_verifier: codeVerifier,
    };

    const response = await fetch(config.token_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        console.error("Token exchange failed:", await response.text());
        return null;
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("id_token", data.id_token);
    localStorage.setItem("expires_in", data.expires_in.toString());
    localStorage.setItem("refresh_token", data.refresh_token);


    const userInfo = await fetchUserInfo(config, data.access_token);
    if (userInfo) {
        localStorage.setItem("current_user", JSON.stringify(userInfo));
        return {
            access_token: data.access_token,
            id_token: data.id_token,
            expires_in: data.expires_in,
            user_info: userInfo,
        };
    }

    return null;
}