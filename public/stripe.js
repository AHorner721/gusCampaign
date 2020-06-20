// create client side checkout session

window.onload = (event) =>{
    const stripe = Stripe('pk_test_hGJqkCrgCXL6N2x5kadHnjG400VKyWMBZt');
    var elements = document.getElementById('card-element');
    elements = stripe.elements();
    var style = {
      base: {
        // Add your base input styles here. For example:
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    };
    const card = elements.create('card', {style: style});
    card.mount('#card-element');

    // card validation error handling
    card.on('change', function(event) {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
    
    const cardholderName = document.getElementById('cardholder-name');
    const cardButton = document.getElementById('card-button');
    const clientSecret = cardButton.dataset.secret;

// Upon button clicking, complete the payment:
cardButton.addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {name: cardholderName.value},
      }
    });
    if (result.error) {
      document.getElementById('card-errors').textContent = result.error.message;
      return false;
    } else {
      document.getElementById('card').submit();
    }
  } catch(err) {
    document.getElementById('card-errors').textContent = err.message;
    return false;
  }
});

}

