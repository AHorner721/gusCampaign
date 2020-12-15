// check if in production mode
if(process.env.NODE_ENV !== 'production'){
    const env = require('dotenv');
    env.config();
}

// API Keys
const stripe_skey = process.env.STRIPE_SKEY;
const mailchimp_key = process.env.MAILCHIMP_KEY;
const database = process.env.DATABASE;

// Imports
const express = require('express');
const bodyparser = require('body-parser');
const {body, validationResult} = require('express-validator');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const mongoose = require('mongoose');
const Donor = require('./models/donor');

// config environment
const app = express();
const port = process.env.PORT || 3000;
mailchimp.setConfig({
  apiKey: mailchimp_key,
  server: 'us2',
});

// globally visibile donation object
// overwritten when new donation is created
let donationCollection = {};

// Initialize View Engine
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

// Routes
app.get('/', (req,res)=>{
    res.render('index');
});

// remove these routes once finished
// app.get('/card', (req, res)=>{
//     res.render('card');
// });
// app.get('/thanks', (req, res)=>{
//     res.render('thanks');
// });
// app.get('/signup', (req, res)=>{
//     res.render('signup');
// });

// newsletter subscription
app.post('/signup',[ 
  body('contactEmail')
    .isEmail()
    .normalizeEmail(),
  body('contactFirstName')
    .isLength({min: 3, max: 50}).withMessage('Name Length')
    .isAlpha().withMessage('Name must be letters').trim().escape(),
  body('contactLastName')
    .isLength({min: 3, max: 50}).withMessage('Name Length')
    .isAlpha().withMessage('Name must be letters').trim().escape(),
], async (req,res,next)=>{    
    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    const audienceID = process.env.AUDIENCE_ID;
    const subscribingUser = {
      firstName: `${req.body.contactFirstName}`,
      lastName: `${req.body.contactLastName}`,
      email: `${req.body.contactEmail}`,
    };

    try{
        const response = await mailchimp.lists.addListMember(
          audienceID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName,
            }
          }
        );
        console.log(
        `Successfully added contact as an audience member. 
        The contact's id is ${response.id}.`);
      }catch(error){
        console.log(error);
      }
    res.render('signup');
    next();
});

// donation route
app.post('/donate',[  // Express-Validation. Check/Sanitize body
  body('_replyto') // email address
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
        // Create a Stripe Payment Intent object:
        const stripe = require('stripe')(stripe_skey);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // In cents
          currency: 'usd',
          receipt_email: email,
        });

        // create donor document
        donationCollection = new Donor({
          name: name,
          amount: amount,
          paymentIntent: paymentIntent.client_secret
        });

        // pass PaymentIntent object to client-side
        res.render('card', {name: name, amount: amount, intentSecret: paymentIntent.client_secret });
      } catch(err) {
        console.log('Error! ', err.message);
      }
    }
    next(); 
  });

// complete transaction
app.post('/charge',[//
  body('address')
    .trim().escape(),
  body('city')
    .trim().escape(),
  body('state')
    .trim().escape(),
], (req, res, next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  donationCollection.save()
    .then((response)=>{
      console.log(`Donor Created: ${response}`);
    }).catch(err=>console.log(err));
    
  console.log('payment processed');
  res.render('thanks');
  next(); 
});

// connect database
mongoose.connect(database, {useNewUrlParser: true, useUnifiedTopology: true})
.then((response)=>{
  console.log('connected to database');
  app.listen(port, ()=>{
    console.log('Listening on port: '+ port);
  });
}).catch(err=>console.log(err));