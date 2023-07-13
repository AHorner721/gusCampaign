window.onload = async (event) => {
  // get pubkey stripe
  const { pubKey } = await fetch("/pubkey")
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("error", err));

  // get form elements
  const donateButton = document.getElementById("card-button");
  const emailAddress = document.querySelector(".email");
  const clientSecret = donateButton.dataset.secret;
  const amount = donateButton.value * 100;

  console.log(`donating: ${amount}`);

  // initialize Stripe
  const stripe = Stripe(pubKey);
  // NOTE: Need to use var or stripe card element wont work
  var elements = document.querySelector("#payment-element");
  elements = stripe.elements({
    mode: "payment",
    currency: "usd",
    amount: amount,
  });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  // payment error handling
  paymentElement.on("change", function (event) {
    const displayError = document.getElementById("card-errors");
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = "";
    }
  });

  // Upon clicking donate button, complete the payment:
  donateButton.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000/thanks", // change to live url
          receipt_email: emailAddress.value,
        },
      });
      if (result.error) {
        document.getElementById("card-errors").textContent =
          result.error.message;
        return false;
      }
    } catch (err) {
      document.getElementById("card-errors").textContent = err.message;
      return false;
    }
  });
};
