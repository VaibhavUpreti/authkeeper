export async function startAuthFlow(config) {
    const url = `${config.authorization_url}?response_type=code&client_id=${encodeURIComponent(config.client_id)}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}`;
    return url;
}

export async function handleCallback(config) {

    const payload = {
        client_id: config.client_id,
        response_type: "code",
        scope: "offline_access profile emal",
        redirect_uri: config.redirect_uri
    }
    const response = await fetch(config.authorization_url, {
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
    const data = response.json();
    return data;
}

export async function exchangeAuthCodeForToken(config, code) {
    const payload = {
        client_id: config.client_id,
        client_secret: config.client_secret,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirect_uri,
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

    return response.json();
}
