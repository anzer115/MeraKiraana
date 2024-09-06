const mongoose = require('mongoose');
const Joi = require('joi');

// Category Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
},
{timestamps: true});

// Joi validation schema
const validateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
    });

    return schema.validate(category);
};

const categoryModel = mongoose.model('category', categorySchema);

module.exports = {
    categoryModel,
    validateCategory,
};
