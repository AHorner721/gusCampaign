if(process.env.NODE_ENV !== 'production'){
    const env = require('dotenv');
    env.config();
}
const stripe_skey = process.env.STRIPE_SKEY;

const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

// Routes
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/thanks', function(req, res){
    res.render('thanks');
});

app.post('/', async (req, res, next) => {
    // TO ADD: data validation, storing errors in an `errors` variable!
    const name = req.body.name;
    const email = req.body.email;
    const amount = req.body.amount;
    console.log('Amount = ' + amount);

    if (amount > 0 ){ // Data is valid!
      try {
        // Create a PI:
        const stripe = require('stripe')(stripe_skey);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // In cents
          currency: 'usd',
          receipt_email: email,
        });
        res.render('card', {name: name, amount: amount, intentSecret: paymentIntent.client_secret });
      } catch(err) {
        console.log('Error! ', err.message);
      }
    }
  });

app.post('/charge', function (req, res, next){
  console.log('payment processing...');
  res.render('thanks'); 
});

app.listen(port, function(){
    console.log('Listening on port: '+ port);
});