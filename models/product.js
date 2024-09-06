const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema
const productSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
     },
    image: {
        type: Buffer,

    },
},
{ timestamps: true });

// Joi validation schema
const validateProduct = (product) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
        description: Joi.string().optional(),
        image: Joi.string().optional(),
    });

    return schema.validate(product);
};

const productModel = mongoose.model('product', productSchema);

module.exports = {
    productModel,
    validateProduct,
};
