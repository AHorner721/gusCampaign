// check if in production mode
if(process.env.NODE_ENV !== 'production'){
    const env = require('dotenv');
    env.config();
}

// API Key
const stripe_skey = process.env.STRIPE_SKEY;

// Import Express & Init Express App
const express = require('express');
const bodyparser = require('body-parser');
const {body, validationResult} = require('express-validator');
const app = express();
const port = process.env.PORT || 3000;

// Init View Engine
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

// Routes
app.get('/', (req,res)=>{
    res.render('index');
});

app.get('/thanks', (req, res)=>{
    res.render('thanks');
});

app.post('/',[
  body('_replyto')
    .isEmail()
    .normalizeEmail(),
  body('first')
    .isLength({min: 3, max: 50}).withMessage('Name Length')
    .isAlpha().withMessage('Name must be letters').trim().escape(),
  body('last')
    .isLength({min: 3, max: 50}).withMessage('Name Length')
    .isAlpha().withMessage('Name must be letters').trim().escape(),
  body('amount')
    .toInt().isInt({min: 5, max: 1000})
    .withMessage('Accepting Donations between $5 - $1000')
], async (req, res, next) => {
    // Check if request has any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    const name =  `${req.body.first} ${req.body.last}`;
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
    next(); 
  });

app.post('/charge', (req, res, next)=>{
  console.log('payment processing...');
  res.render('thanks');
  next(); 
});

app.listen(port, ()=>{
    console.log('Listening on port: '+ port);
});