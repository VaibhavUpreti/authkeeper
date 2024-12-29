// Module dependencies
const PKCE = require('./pkce'); // Import your PKCE logic

/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new PKCE();

/**
 * Expose constructors.
 */
exports.PKCE = PKCE;

/**
 * Test Method
 * This allows a user to test the library functionality.
 */
exports.testLibrary = async function testLibrary(config) {
  try {
    console.log('Testing PKCE Library...');

    // Start the Auth Flow
    const authUrl = await exports.startAuthFlow(config);
    console.log('Generated Auth URL:', authUrl);

    // Simulate Callback Handling
    const callbackParams = {
      state: localStorage.getItem('pkce_state'),
      code: 'sample_auth_code'
    };

    const tokenResponse = await exports.handleCallback(config, callbackParams);
    console.log('Token Response:', tokenResponse);

    // Simulate Token Refresh
    const refreshResponse = await exports.refreshToken(config, 'sample_refresh_token');
    console.log('Refresh Token Response:', refreshResponse);

    console.log('Library Tested Successfully');
  } catch (error) {
    console.error('Error Testing Library:', error);
  }
};
