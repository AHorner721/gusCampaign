try {
    var stripe = require('stripe')('sk_test_3yHRTPRWUJozGogUqgLmkORi00omiwRcUw');
    const paymentIntent =  stripe.paymentIntents.create({
        amount: 1477, // $14.77, an easily identifiable amount
        currency: 'usd',
      });
      console.log('Worked! ', paymentIntent.id);
    } catch(err) {
      console.log('Error! ', err.message);
}