const GoogleAuth = require('google-auth-library');

const CLIENT_ID = "70088297774-e1akt5l3ou9qms1m7ss1q26q43nvuk48.apps.googleusercontent.com";

function validateToken(token) {
  const auth = new GoogleAuth();
  const client = new auth.OAuth2(CLIENT_ID, '', '');

  return new Promise((resolve) => {
    client.verifyIdToken(
      token,
      CLIENT_ID,
      function(e, login) {
        const payload = login.getPayload();
        resolve({ email: payload.email });
      }
    );
  });
}

module.exports.validateToken = validateToken;