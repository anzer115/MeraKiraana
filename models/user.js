const mongoose = require('mongoose');
const Joi = require('joi');

// Address Schema
const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

// User Schema
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            minlength: 6,
        },
        phone: {
            type: Number,
            minlength: 10,
            maxlength: 15,
        },
        addressess: {
            type: [AddressSchema],
         },
    },
    { timestamps: true }
);

// Joi validation schema
const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(10).max(15).optional(),
        addressess: Joi.array().items(
            Joi.object({
                state: Joi.string().required(),
                zip: Joi.number().required(),
                city: Joi.string().required(),
                address: Joi.string().required(),
            })
        ).min(1).required(),
    });

    return schema.validate(user);
};

const userModel = mongoose.model('user', userSchema);

module.exports = {
    userModel,
    validateUser,
};
