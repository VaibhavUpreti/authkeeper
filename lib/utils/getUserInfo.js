
/**
 * Fetches user information using the access token.
 * @param {Object} config - OAuth configuration.
 * @param {string} accessToken - Access token.
 * @returns {Object|null} - User info if successful, null otherwise.
 */
async function fetchUserInfo(config, accessToken) {
    const baseUrl = new URL(config.token_url).origin;
    const userInfoUrl = `${baseUrl}/userinfo`;

    const response = await fetch(userInfoUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        console.error("User info request failed:", await response.text());
        return null;
    }

    try {
        return await response.json();
    } catch (err) {
        console.error("Error parsing user info response JSON:", err);
        return null;
    }
}