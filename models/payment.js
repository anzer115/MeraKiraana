const mongoose = require('mongoose');


// Payment Schema
const paymentSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
     },
    status: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required:  true   ,
     },
     currency: {
        type: String,
        required: true ,
    },
    status: {
        type: String,
        default: 'pending',
    }
},
{timestamps: true});


    
const paymentModel = mongoose.model('payment', paymentSchema);

module.exports = paymentModel ;
    
