const mongoose = require('mongoose');
const Joi = require('joi');

// Order Schema
const orderSchema = mongoose.Schema({
    orderId : {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    }],
    totalprice: {
        type: Number,
        required: true,
        min: 0,
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payment',
        required: true,
    },
  });

// Joi validation schema
const validateOrder = (order) => {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalprice: Joi.number().min(0).required(),
        address: Joi.string().optional(),
        status: Joi.string().required(),
        payment: Joi.string().required(),
     });

    return schema.validate(order);
};

const orderModel = mongoose.model('order', orderSchema);

module.exports = {
    orderModel,
    validateOrder,
};
