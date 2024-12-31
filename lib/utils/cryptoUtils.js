const isBrowser = typeof window !== 'undefined';

class CryptoUtils {
    static generateRandomString(length = 28) {
        if (isBrowser) {
            const array = new Uint32Array(length);
            window.crypto.getRandomValues(array);
            return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
        } else {
            const array = new Uint8Array(length);
            require('crypto').randomFillSync(array);
            return Array.from(array, byte => ('0' + byte.toString(16)).substr(-2)).join('');
        }
    }

    static base64urlencode(buffer) {
        let base64String;
        if (isBrowser) {
            base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
        } else {
            base64String = Buffer.from(buffer).toString('base64');
        }

        return base64String
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static async sha256(plain) {
        if (isBrowser) {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            const hashed = await window.crypto.subtle.digest('SHA-256', data);
            return new Uint8Array(hashed);
        } else {
            const crypto = require('crypto');
            const hash = crypto.createHash('sha256');
            hash.update(plain);
            return hash.digest();
        }
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
