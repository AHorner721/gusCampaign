const getConfig = require("./utils/config");
const { stripe_pubkey } = getConfig();
const getPaymentIntent = require("./utils/payment");
const { createDonation, saveDonation, connectDatabase } = require("./db");
const makeApp = require("./app");

const app = makeApp(
  createDonation,
  saveDonation,
  getPaymentIntent,
  stripe_pubkey
);

if (process.env.NODE_ENV) {
  console.log(`using ${process.env.NODE_ENV}environment`);
}

const port = process.env.PORT || 3000;

connectDatabase();

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
