const express = require("express");
const { getProductNames } = require("../controllers/productController");

const router = express.Router();

// Route to fetch all product names
router.get("/products", getProductNames);

module.exports = router;
