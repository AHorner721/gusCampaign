const nodemailer = require("nodemailer");
require("dotenv").config();

class Email {
  constructor(
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    volunteerChoices
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.volunteerChoices = volunteerChoices;
    this.transporter = null;

    this.mailOptions = {
      from: {
        name: "Gus Campaign App",
        address: process.env.EMAIL_ADDRESS,
      },
      to: process.env.TO_EMAIL_ADDRESS,
      subject: "Volunteer Form Submission",
      text: `Name: ${this.firstName} ${this.lastName}
            \nPhone: ${this.phoneNumber}, \nEmail: ${this.emailAddress}
            \nVolunteer choices: ${this.volunteerChoices}`,
    };
  }

  createEmail(tokens) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        accessUrl: process.env.ACCESS_URL,
      },
    });
  }

  sendEmail() {
    try {
      this.transporter.sendMail(this.mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (err) {
      console.log("Email error: ", err);
    }
  }
}

module.exports = Email;
