// imports
const express = require("express");
const bodyparser = require("body-parser");
const { body, validationResult } = require("express-validator");

const makeApp = (
  createDonation,
  saveDonation,
  getPaymentIntent,
  stripe_pubkey
) => {
  // init express application
  const app = express();

  let donation;

  // Initialize View Engine
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.json());
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
    res.render("pages/index");
  });

  app.get("/photos", (req, res) => {
    res.render("pages/photos");
  });

  // PWA handling manifest, service worker, and loader
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

  // donation handling
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
        .isInt({ min: 5, max: 250 })
        .withMessage("Accepting Donations between $5 - $250"),
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
          const paymentIntent = await getPaymentIntent(amount);

          // create donor document
          donation = createDonation(name, amount, paymentIntent);

          res.status(200);
          // pass PaymentIntent object to client-side
          res.render("pages/card", {
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
    // save donation
    saveDonation(donation);

    res.render("pages/thanks");
    next();
  });

  return app;
};

module.exports = makeApp;
