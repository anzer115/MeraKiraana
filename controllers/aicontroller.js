const generateContent = require("../services/ai.services");
const { fetchProductNames } = require("../models/productmodel");
const { productModel } = require('../models/product');
const fetch = require('node-fetch');

module.exports.gencode = async (req, res) => {
    const { dish } = req.body;

    if (!dish) {
        return res.status(400).json({ success: false, message: "Dish name is required." });
    }

    try {
        const availableGroceries = await fetchProductNames();
        if (availableGroceries.length === 0) {
            return res.status(500).json({ success: false, message: "No products found in the database." });
        }

        const ingredients = await generateContent(dish, availableGroceries);

        // Convert ingredients object into array of ingredient names
        const ingredientNames = Object.values(ingredients);

        // 🛠️ Now make an internal POST request to your /cart/add-generated
        const response = await fetch('http://localhost:3000/cart/add-generated', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie, // Important to send user's session cookies!
            },
            body: JSON.stringify({ ingredients: ingredientNames }),
        });

        console.log(response) ;  
        const data = await response.text();
        console.log(data) ; // You can read .json() too if you want

        res.status(response.status).send(data);

    } catch (error) {
        console.error("Error fetching products or generating content:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};