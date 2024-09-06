const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery Schema
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true,
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending',
    },
    trackingURL: {
        type: String,
        required: true,
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 0,
    },
    totalprice: {
        type: Number,
        required: true,
        min: 0,
    },
});

// Joi validation schema
const validateDelivery = (delivery) => {
    const schema = Joi.object({
        order: Joi.string().required(),
        deliveryBoy: Joi.string().min(3).max(50).required(),
        status: Joi.string().valid('pending', 'in-transit', 'delivered', 'cancelled').required(),
        trackingURL: Joi.string().uri(),
        estimatedDeliveryTime: Joi.number().min(0).required(),
        totalprice: Joi.number().min(0).required(),
    });

    return schema.validate(delivery);
};

const deliveryModel = mongoose.model('delivery', deliverySchema);

module.exports = {
    deliveryModel,
    validateDelivery,
};
