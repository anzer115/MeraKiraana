const { fetchProductNames } = require("../models/productmodel");

async function getProductNames(req, res) {
    try {
        const names = await fetchProductNames();
        res.json({ success: true, products: names });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch product names" });
    }
}

module.exports = { getProductNames };
