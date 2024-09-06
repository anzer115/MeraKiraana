const express = require('express') ;
const router = express.Router() ;
require('dotenv').config() ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const { validateAdmin }  = require('../middlewares/admin') ;
const { adminModel } = require('../models/admin') ;
const { productModel } = require('../models/product') ;
const { categoryModel } = require('../models/category');


//A route for creating adming to be in Development Environment 
if(
    typeof process.env.NODE_ENV !== undefined && 
    process.env.NODE_ENV === "DEVELOPMENT")
    {
    router.get("/create", async function(req,res){
       try{
        let salt = await bcrypt.genSalt(10) ;
        let hash = await bcrypt.hash("Anzer@123",salt) ;
        
        let user = new adminModel({
            name: "Anzer Bin Ubaid",
            email: "anzer1255ubaid@gmail.com",
            password: hash,
            role: "admin",
        }) ;
        await user.save() ;

        let token = jwt.sign({ email: "anzer1255ubaid@gmail.com", admin: true }, process.env.JWT_KEY) ;
        res.cookie("token",token) ;
        res.send("admin created successfully") ;

       } catch(err){
        res.send(err.message) ;
       }
    }) ;
}

router.get('/login', function(req,res){
    res.render("admin_login") ;
}) ;

router.post('/login', async function(req,res){
    let { email, password } = req.body ;
    let admin = await adminModel.findOne({ email }) ;
    if(!admin) return res.send("Something Broke") ;
    let valid = await bcrypt.compare(password,admin.password) ;
    if(valid){
        let token = jwt.sign({ email: "anzer1255ubaid@gmail.com", admin: true }, process.env.JWT_KEY) ;
        res.cookie("token",token) ;
        res.redirect('/admin/dashboard') ;
    } else {
        return res.status(400).send("Invalid email or password");
    }
}) ;

router.get('/dashboard', validateAdmin, async function(req,res){
    let prodcount  = await productModel.countDocuments() ;
    let categcount = await categoryModel.countDocuments() ;
     res.render("admin_dashboard", { prodcount , categcount }) ;
}) ;

router.get('/products', async function(req,res){
    let products = await productModel.find() ;
    const resultArray = await productModel.aggregate([
        {
            $sort: { _id: 1 } // Sort by the product ID or any other field to ensure consistency in the first 10 products
        },
        {
            $group: {
                _id: "$category", // Group by the category field
                products: { $push: "$$ROOT" } // Push the entire product document to the array
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id", // Rename _id to category
                products: { $slice: ["$products", 10] } // Slice the products array to get only the first 10 products
            }
        },
    ]);
 
    //convert array to object
    const resultobject = resultArray.reduce((acc,item)=>{
        acc[item.category] = item.products ;
        return acc ;
    }, {}) ;

    res.render("admin_products" , { products: resultobject  }) ;
}) ;

router.get('/logout', function(req,res){
     res.cookie("token", "") ;
     res.redirect("/admin/login") ;
}) ;



module.exports = router ;
