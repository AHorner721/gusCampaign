// set API Keys
let stripe_skey = process.env.STRIPE_SKEY;
let stripe_pubkey = process.env.STRIPE_PUBKEY;

// configure environment for development
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "development") {
  const env = require("dotenv");
  env.config();
  stripe_skey = process.env.testSKEY;
  stripe_pubkey = process.env.testPUB;
  console.log(`using ${process.env.NODE_ENV}environment`);
}

// import middleware
const express = require("express");
const bodyparser = require("body-parser");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Donor = require("./models/donor");

// init express application
const app = express();
const port = process.env.PORT || 3000;

// set database URI
const database = process.env.DATABASE;

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

// donation routes
app.get("/pubkey", (req, res) => {
  res.json({ pubKey: stripe_pubkey });
});

app.post(
  "/donate",
  [
    // Express-Validation. Check/Sanitize body
    body("_replyto") // email address
      .isEmail()
      .normalizeEmail()
      .trim()
      .escape(),
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
      .trim()
      .escape()
      .toInt()
      .isInt({ min: 5, max: 100 })
      .withMessage("Accepting Donations between $5 - $100"),
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
        const stripe = require("stripe")(stripe_skey);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // In cents
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
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
          email: email,
        });
      } catch (err) {
        console.log("Error! ", err.message);
      }
    }
    next();
  }
);

// confirm transaction
app.get("/thanks", (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  donationCollection
    .save()
    .then((response) => {
      console.log(`Donation saved. ID: ${response._id}`);
    })
    .catch((err) => console.log(err));

  donationCollection = {};

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
