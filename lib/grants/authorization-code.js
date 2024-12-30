// src/grants/authorization-code.js
import OAuthClient from '../utils.js';

export const AuthorizationCodeGrant = (config) =>
    new OAuthClient({ ...config, grantType: 'authorization_code' });
