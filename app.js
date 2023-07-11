// configure environment
require("dotenv").config();

const env = process.env.NODE_ENV;

// API Keys
let stripe_key = process.env.STRIPE_SKEY;
const database = process.env.DATABASE;

if (env.trim() === "development") {
  stripe_key = process.env.testSKEY;
  console.log(`using ${process.env.NODE_ENV}environment`);
}

// Imports
const express = require("express");
const bodyparser = require("body-parser");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Donor = require("./models/donor");

// init express application
const app = express();
const port = process.env.PORT || 3000;

// record donation name and amount
let donationCollection = {};

// Initialize View Engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));

// Redirect HTTP requests to HTTPS
app.use((req, res, next) => {
  if (
    req.headers["x-forwarded-proto"] !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect("https://" + req.hostname + req.url);
  } else {
    next();
  }
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/accomplishments", (req, res) => {
  res.render("accomplishments");
});

// PWA handling manifest, service worker, and loader file
app.get("/manifest.json", (req, res) => {
  res.header("Content-Type", "text/cache-manifest");
  res.sendFile(path.join(__dirname, "manifest.json"));
});
app.get("/sw.js", (req, res) => {
  res.header("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "sw.js"));
});
app.get("/loader.js", (req, res) => {
  res.header("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "loader.js"));
});

// donation route
app.post(
  "/donate",
  [
    // Express-Validation. Check/Sanitize body
    body("_replyto") // email address
      .isEmail()
      .normalizeEmail(),
    body("first")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name Length")
      .isAlpha()
      .withMessage("Name must be letters")
      .trim()
      .escape(),
    body("last")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name Length")
      .isAlpha()
      .withMessage("Name must be letters")
      .trim()
      .escape(),
    body("amount")
      .toInt()
      .isInt({ min: 5, max: 1000 })
      .withMessage("Accepting Donations between $5 - $1000"),
  ],
  async (req, res, next) => {
    // Check if request has any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const name = `${req.body.first} ${req.body.last}`;
    const email = req.body._replyto;
    const amount = req.body.amount;
    console.log("Amount = " + amount);

    if (amount > 0) {
      // Data is valid!
      try {
        // Create a Stripe Payment Intent object:
        const stripe = require("stripe")(stripe_key);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // In cents
          currency: "usd",
          receipt_email: email,
        });

        // create donor document
        donationCollection = new Donor({
          name: name,
          amount: amount,
          paymentIntent: paymentIntent.client_secret,
        });

        // pass PaymentIntent object to client-side
        res.render("card", {
          name: name,
          amount: amount,
          intentSecret: paymentIntent.client_secret,
        });
      } catch (err) {
        console.log("Error! ", err.message);
      }
    }
    next();
  }
);

// complete transaction
app.post("/charge", (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  donationCollection
    .save()
    .then((response) => {
      console.log(`Donor Created: ${response}`);
    })
    .catch((err) => console.log(err));

  donationCollection = {};

  console.log("payment processed");
  res.render("thanks");
  next();
});

// connect database
mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    console.log("connected to database");
    app.listen(port, () => {
      console.log("Listening on port: " + port);
    });
  })
  .catch((err) => console.log(err));
