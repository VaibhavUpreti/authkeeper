// src/utils/pkce.js
const PKCE = {
    generateCodeChallenge: () => {
        const verifier = crypto.randomUUID();
        const challenge = btoa(String.fromCharCode(...new Uint8Array(sha256(verifier)))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        return { verifier, codeChallenge: challenge };
    },
    storeVerifier: (verifier) => localStorage.setItem('pkce_verifier', verifier),
    getVerifier: () => localStorage.getItem('pkce_verifier'),
};

// Dummy SHA256 function for illustration
const sha256 = async (data) => {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return new Uint8Array(buffer);
};

export default PKCE;
