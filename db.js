const getConfig = require("./utils/config");

const { database } = getConfig();

const mongoose = require("mongoose");
const Donor = require("./models/donor");

const createDonation = (name, amount, paymentIntent) => {
  return new Donor({
    name: name,
    amount: amount,
    paymentIntent: paymentIntent.client_secret,
  });
};

const saveDonation = (donation) => {
  donation
    .save()
    .then((response) => {
      console.log(`Donation saved. ID: ${response._id}`);
    })
    .catch((err) => console.log(err));
};

// connect database
const connectDatabase = () => {
  mongoose
    .connect(database)
    .then((response) => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
};

module.exports = { connectDatabase, createDonation, saveDonation };
