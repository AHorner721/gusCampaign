const nodemailer = require("nodemailer");
require("dotenv").config();

class Email {
  constructor(firstName, lastName, emailAddress, message) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.message = message;
    this.transporter = null;

    this.mailOptions = {
      from: {
        name: "Gus Campaign App",
        address: process.env.EMAIL_ADDRESS,
      },
      to: [process.env.TO_EMAIL_ADDRESS, process.env.TO_EMAIL_ADDRESS2],
      subject: "Contact Form Submission",
      text: `Name: ${this.firstName} ${this.lastName}
            \nEmail: ${this.emailAddress}
            \nMessage: ${this.message}`,
    };
  }

  createEmail() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.APP_PASS,
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
