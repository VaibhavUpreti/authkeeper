
// Helper Functions
function generateRandomString() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function pkceChallengeFromVerifier(verifier) {
    const hashed = await sha256(verifier);
    return base64urlencode(hashed);
}

function parseQueryString(queryString) {
    return Object.fromEntries(new URLSearchParams(queryString));
}

function sendPostRequest(url, params) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onload = () => {
            try {
                const response = JSON.parse(request.responseText);
                if (request.status === 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            } catch (error) {
                reject({ error: 'Invalid JSON response' });
            }
        };

        request.onerror = () => reject({ error: 'Request failed' });

        const body = new URLSearchParams(params).toString();
        request.send(body);
    });
}

// Library Functions
export async function startAuthFlow(config) {
    const state = generateRandomString();
    localStorage.setItem('pkce_state', state);

    const codeVerifier = generateRandomString();
    localStorage.setItem('pkce_code_verifier', codeVerifier);

    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    const url = `${config.authorization_endpoint}?response_type=code&client_id=${encodeURIComponent(config.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(config.requested_scopes)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

    return url;
}

export async function handleCallback(config, callbackParams) {
    if (localStorage.getItem('pkce_state') !== callbackParams.state) {
        throw new Error('State does not match.');
    }

    const codeVerifier = localStorage.getItem('pkce_code_verifier');
    const params = {
        grant_type: 'authorization_code',
        code: callbackParams.code,
        client_id: config.client_id,
        redirect_uri: config.redirect_uri,
        code_verifier: codeVerifier
    };

    const tokenResponse = await sendPostRequest(config.token_endpoint, params);

    localStorage.removeItem('pkce_state');
    localStorage.removeItem('pkce_code_verifier');

    return tokenResponse;
}

export async function refreshToken(config, refreshToken) {
    const params = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.client_id
    };

    return await sendPostRequest(config.token_endpoint, params);
}
