const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donorSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        min: 5,
        required: true
    },
    paymentIntent:{
        type: String,
        required: true
    },
}, {timestamps:true});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;