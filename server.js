// pass dependencies to app: createDonation, saveDonation,
// publickey, getPaymentIntent
const app = require("./app");
const { connectDatabase } = require("./db");

if (process.env.NODE_ENV) {
  console.log(`using ${process.env.NODE_ENV}environment`);
}

const port = process.env.PORT || 3000;

connectDatabase();

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
