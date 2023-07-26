const getConfig = () => {
  // set API Keys
  let stripe_skey = process.env.STRIPE_SKEY;
  let stripe_pubkey = process.env.STRIPE_PUBKEY;

  // configure environment for development
  if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "development") {
    const env = require("dotenv");
    env.config();
    stripe_skey = process.env.testSKEY;
    stripe_pubkey = process.env.testPUB;
  }
  // set database URI
  const database = process.env.DATABASE;

  return { stripe_skey, stripe_pubkey, database };
};

module.exports = getConfig;
