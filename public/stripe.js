// const pubkey = 'pk_live_51I9vq5LLN4Zq9k3nNIAK0gdJSP472vVzMAMKSUxlT0gckuxlryR5oVAfKanO467KuaSkI37MxYc2TfP102PSeolJ00BeFOJHze';
const pubkey =
  "pk_test_51I9vq5LLN4Zq9k3ndePolStBv9EswdLCObdAYr24hG3Hl91JsavNAJ97xsIwymriEtkJ1WuOUAmqbpl4ynsIfoIr00dQff0bwS";
// create stripe card element
window.onload = (event) => {
  const stripe = Stripe(pubkey);
  // NOTE: Need to use var or stripe card element wont work
  var elements = document.querySelector("#card-element");
  elements = stripe.elements();
  var style = {
    base: {
      // base input styles
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  const card = elements.create("card", { style: style });
  card.mount("#card-element");

  // card validation error handling
  card.on("change", function (event) {
    const displayError = document.getElementById("card-errors");
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = "";
    }
  });

  const cardHolderName = document.getElementById("cardHolderName");
  const cardButton = document.getElementById("card-button");
  const clientSecret = cardButton.dataset.secret;

  // Upon clicking donate button, complete the payment:
  cardButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: { name: cardHolderName.value },
        },
      });
      if (result.error) {
        document.getElementById("card-errors").textContent =
          result.error.message;
        return false;
      } else {
        document.getElementById("card").submit();
      }
    } catch (err) {
      document.getElementById("card-errors").textContent = err.message;
      return false;
    }
  });
};
