if(process.env.NODE_ENV !== 'production'){
    const env = require('dotenv');
    env.config();
}
const stripe_skey = process.env.STRIPE_SKEY;
const stripe_pubkey = process.env.STRIPE_PUBKEY;

const express = require('express');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.listen(3000);
console.log('Listening on port: 3000');

// Routes
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});
