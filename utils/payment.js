const getConfig = require("./config");
const { stripe_skey } = getConfig();

const stripe = require("stripe")(stripe_skey);

const getPaymentIntent = async (amount) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // In cents
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

module.exports = getPaymentIntent;
