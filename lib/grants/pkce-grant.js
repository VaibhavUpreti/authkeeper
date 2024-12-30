export async function getPkceAuthToken(config) {
    // Make the request again to get the code first then make request to get auth token.
    const codeVerifier = localStorage.getItem("pkce_code_verifier");

    // Check if codeVerifier exists in localStorage, if not, exit early
    if (!codeVerifier) {
        console.error("Code verifier is missing from localStorage.");
        return null;
    }

    const audience = new URL("/api/v2/", token_url).origin;

    const payload = {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        code_verifier: codeVerifier,
        audience: audience,
    };

    try {
        const response = await fetch(token_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Token exchange failed with status:", response.status, "Response:", errorText);
            return null;
        }

        const data = await response.json();

        if (!data) {
            console.error("No token data returned.");
            return null;
        }

        // Store the token in localStorage if the exchange is successful
        localStorage.setItem("auth_token", JSON.stringify(data));

        return data;

    } catch (err) {
        console.error("Error during token exchange:", err);
        return null;
    }
}