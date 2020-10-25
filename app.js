if(process.env.NODE_ENV !== 'production'){
    const env = require('dotenv');
    env.config();
}
const stripe_skey = process.env.STRIPE_SKEY;

const express = require('express');
const bodyparser = require('body-parser');
const {body, validationResult} = require('express-validator');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

// Routes
app.get('/', (req,res)=>{
    //res.sendFile(__dirname + '/index.html');
    res.render('index');
});

app.get('/thanks', (req, res)=>{
    res.render('thanks');
});

app.post('/',[
  body('_replyto').isEmail(),
  body('name').isLength({min: 1, max: 50})
  .withMessage('Name Empty').isAlpha().withMessage('Name must be letters').trim().escape(),
  body('amount').toInt().isInt({min: 5, max: 1000})
  .withMessage('Accepting Donations between $5 - $1000')
], async (req, res, next) => {
    // TO ADD: data validation, storing errors in an `errors` variable!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    const name = req.body.name;
    const email = req.body._replyto;
    const amount = req.body.amount;
    console.log('Amount = ' + amount);

    if (amount > 0){ // Data is valid!
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

app.post('/charge', (req, res, next)=>{
  console.log('payment processing...');
  res.render('thanks'); 
});

app.listen(port, ()=>{
    console.log('Listening on port: '+ port);
});