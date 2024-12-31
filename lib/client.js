import { getEnvironment } from './utils/getEnvironment.js';
import { startAuthFlow as browserStartAuthFlow, handleCallback as browserHandleCallback, exchangeAuthCodeForToken as browserExchangeAuthCodeForToken } from './grants/pkce-grant.js';
import { startAuthFlow as serverStartAuthFlow, handleCallback as serverHandleCallback, exchangeAuthCodeForToken as serverExchangeAuthCodeForToken } from './grants/authorization-code.js';
import { refreshAccessToken } from './grants/refresh-token.js';

class OAuthClient {
    constructor(config, environment = getEnvironment()) {
        this.config = config;
        this.environment = environment;
    }

    async startAuthFlow() {
        if (this.environment === "browser" || this.environment === "mobile") {
            return browserStartAuthFlow(this.config);
        } else if (this.environment === "server") {
            return serverStartAuthFlow(this.config);
        } else {
            throw new Error(`Unknown environment: ${this.environment}`);
        }
    }

    async handleCallback() {
        if (this.environment === "browser" || this.environment === "mobile") {
            return browserHandleCallback(this.config);
        } else if (this.environment === "server") {
            return serverHandleCallback(this.config);
        } else {
            throw new Error(`Unknown environment: ${this.environment}`);
        }
    }

    async exchangeAuthCodeForToken(code) {
        if (this.environment === "browser" || this.environment === "mobile") {
            return browserExchangeAuthCodeForToken(this.config, code);
        } else if (this.environment === "server") {
            return serverExchangeAuthCodeForToken(this.config, code);
        } else {
            throw new Error(`Unknown environment: ${this.environment}`);
        }
    }

    async refreshAccessToken(refreshToken) {
        if (this.environment === "browser" || this.environment === "mobile") {
          const refreshToken = localStorage.getItem('refresh_token');
          return refreshAccessToken(this.config, refreshToken);
          } else if (this.environment === "server") {
            return refreshAccessToken(this.config, refreshToken);
        } else {
            throw new Error(`Unknown environment: ${this.environment}`);
        }
    }
}

export { OAuthClient };