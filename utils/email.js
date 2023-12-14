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
      to: [process.env.TO_EMAIL_ADDRESS, process.env.TO_EMAIL_ADDRESS2],
      subject: "Volunteer Form Submission",
      text: `Name: ${this.firstName} ${this.lastName}
            \nPhone: ${this.phoneNumber}, \nEmail: ${this.emailAddress}
            \nVolunteer choices: ${this.volunteerChoices}`,
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
          return false;
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
      });
    } catch (err) {
      console.log("Email error: ", err);
    }
  }
}

module.exports = Email;
