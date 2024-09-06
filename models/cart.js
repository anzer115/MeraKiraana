const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Schema
const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true,
        },
    ],
    totalprice: {
        type: Number,
        required: true,
        
    },
});

// Joi validation schema
const validateCart = (cart) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).min(1).required(),
        totalprice: Joi.number().required(),
    });

    return schema.validate(cart);
};

const cartModel = mongoose.model('cart', cartSchema);

module.exports = {
     cartModel,
    validateCart,
};
