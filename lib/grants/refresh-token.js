/**
 * Refreshes the access token using the refresh token.
 * @param {Object} config - OAuth configuration.
 * @param {string} refreshToken - The refresh token obtained earlier.
 * @returns {Object|null} - Token data if successful, null otherwise.
 */
export async function refreshAccessToken(config, refreshToken) {
    const payload = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.client_id,
   //     client_secret: config.client_secret,
        refresh_token: refreshToken,
    });

    if (config.client_secret) {
        payload.append('client_secret', config.client_secret);
    }
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

    const data = await response.json();

    // Check if we are in the browser and then store the tokens
    if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("id_token", data.id_token);
        localStorage.setItem("expires_in", data.expires_in.toString());
    }
    return data;
}