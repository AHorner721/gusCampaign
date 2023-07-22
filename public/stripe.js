window.onload = async (event) => {
  // get pubkey
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

  let elements = stripe.elements({
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

  // Show a spinner on payment submission
  function setLoading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("#submit").disabled = true;
      document.querySelector("#spinner").classList.remove("hide");
    } else {
      document.querySelector("#submit").disabled = false;
      document.querySelector("#spinner").classList.add("hide");
    }
  }

  // Upon clicking donate button, complete the payment:
  donateButton.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log(donateButton.value);
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/thanks`, // on success redirect to thank you page
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
    setLoading(false);
  });
};
