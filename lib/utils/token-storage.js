// src/utils/token-storage.js
export const TokenStorage = {
    saveToken: (token) => localStorage.setItem('oauth_token', JSON.stringify(token)),
    getToken: () => JSON.parse(localStorage.getItem('oauth_token')),
    clearToken: () => localStorage.removeItem('oauth_token'),
};
