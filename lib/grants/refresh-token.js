/**
 * Refreshes the access token using the refresh token.
 * @param {Object} config - OAuth configuration.
 * @param {string} refreshToken - The refresh token obtained earlier.
 * @returns {Object|null} - Token data if successful, null otherwise.
 */
export async function refreshAccessToken(config, refreshToken) {
    // Prepare payload for the token refresh request
    const payload = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.client_id,
       // client_secret: config.client_secret,
        refresh_token: refreshToken,
    });

    // Make the POST request to refresh the token
    const response = await fetch(config.token_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded", 
        },
        body: payload.toString(),
    });

    if (!response.ok) {
        console.error("Refresh token request failed:", await response.text());
        return null;
    }

    // Parse the response to get the tokens
    const data = await response.json();

    // Store the new tokens in localStorage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("id_token", data.id_token);
    localStorage.setItem("expires_in", data.expires_in.toString());

    return data;
}