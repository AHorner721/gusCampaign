const { google } = require("googleapis");
// const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

class EmailAuth {
  clientID = process.env.EMAIL_CLIENT_ID;
  clientSecret = process.env.EMAIL_CLIENT_SECRET;
  redirectURI = process.env.EMAIL_REDIRECT_URI;
  oauth2Client = new google.auth.OAuth2(
    this.clientID,
    this.clientSecret,
    this.redirectURI
  );

  async getAuthorizeURL() {
    const authorizeURL = await this.oauth2Client.generateAuthUrl({
      access_type: "offline", // enable refresh tokens
      // scope: "https://www.googleapis.com/auth/gmail.send", // request Gmail access
      scope: "https://mail.google.com/", // request Gmail access
    });
    return authorizeURL;
  }

  async getTokens(authorizationCode) {
    let { tokens } = await this.oauth2Client.getToken(authorizationCode);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }
}

module.exports = EmailAuth;
