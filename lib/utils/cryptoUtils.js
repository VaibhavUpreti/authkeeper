class CryptoUtils {
    static generateRandomString(length = 28) {
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

    static base64urlencode(buffer) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static async sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    static async pkceChallengeFromVerifier(verifier) {
        const hashed = await this.sha256(verifier);
        return this.base64urlencode(hashed);
    }

    static parseQueryString(query) {
        const params = new URLSearchParams(query);
        const result = {};
        for (let [key, value] of params.entries()) {
            result[key] = value;
        }
        return result;
    }
}

export default CryptoUtils;