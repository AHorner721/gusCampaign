const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

class emailAuth {
  constructor() {
    this.clientID = process.env.EMAIL_CLIENT_ID;
    this.clientSecret = process.env.EMAIL_CLIENT_SECRET;
    this.redirectURI = process.env.EMAIL_REDIRECT_URI;
    this.oauth2Client = new OAuth2Client(
      this.clientID,
      this.clientSecret,
      this.redirectURI
    );
  }
  authorizeURL = this.oauth2Client.generateAuthUrl({
    access_type: "offline", // enable refresh tokens
    scope: "https://www.googleapis.com/auth/gmail.readonly", // request Gmail access
  });

  async getTokens(authorizationCode) {
    const authCode = authorizationCode;
    const tokens = await this.oauth2Client.getToken(authCode);
    const accessToken = tokens.credentials.access_token;
    const refreshToken = tokens.credentials.refresh_token;
    return [accessToken, refreshToken];
  }
}

module.exports = emailAuth;

/*
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'your_redirect_uri';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate the URL to authorize the user
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Allows you to get a refresh token
  scope: 'https://www.googleapis.com/auth/gmail.readonly', // Request Gmail access
});
// Redirect the user to the authorizeUrl to grant access.

// Redirect the user to the authorizeUrl to grant access.
// After user grants access, capture the authorization code from the callback URL
// You should set up a route or endpoint to handle the callback from Google.
// In that route, you can extract the authorization code from the URL and use it here.
// For example, in an Express.js route, you can access the code like this:
const authorizationCode = req.query.code;

// Exchange the authorization code for an access token and refresh token
const tokens = await oauth2Client.getToken(authorizationCode);
const accessToken = tokens.credentials.access_token;
const refreshToken = tokens.credentials.refresh_token;

*/
