const express = require('express') ;
const router = express.Router() ;
const { productModel, validateProduct} = require('../models/product') ;
const { categoryModel, validateCategory } = require('../models/category')
const upload = require('../config/multer_config') ;
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin') ;
const { cartModel, validateCart } = require('../models/cart') ;


router.get('/', userIsLoggedIn , async function(req,res){
    let products = await productModel.find() ;
   
    let somethingInCart = false ;
    let cart = await cartModel.findOne({ user: req.session.passport.user }) ;
    if(cart && cart.products.length > 0) somethingInCart= true ;
     
    //Random products at the top
    const rnproducts = await productModel.aggregate([{ $sample: { size:3 } }]) ;
 

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

  res.render("index", { products: resultobject, rnproducts, somethingInCart, cartCount: cart ? cart.products.length : 0 }) ;
})

router.get('/delete/:id', validateAdmin ,async function(req,res){
    //fetch all the products
    if(req.user.admin){
        let prods = await productModel.findOneAndDelete({_id: req.params.id}) ;
         return  res.redirect('/admin/products') ;
    }
     res.send("You are not allowed to do that.") ;
    }) ;

    router.post('/delete', validateAdmin, async function(req, res) {
        if (req.user.admin) {
            let prods = await productModel.findOneAndDelete({ _id: req.body.product_id });
            return res.redirect('/admin/products');
        }
         res.send("You are not allowed to do that.");
    });

router.post('/', upload.single("image"), async function(req,res){
    let {name, price, category, stock, description, image} = req.body ;
    let { error } = validateProduct({
        name, 
        price, 
        category, 
        stock, 
        description, 
        image}) ;

   if(error) return res.send(error.message) ;
   
   let isCategory = await categoryModel.findOne({ name: category }) ;

   if(!isCategory){
     let createCategory = await categoryModel.create({ name: category }) ;
   }

   await productModel.create({
    name, 
    price,
    category,
    image: req.file.buffer ,
    stock,
    description,
}) ;

res.redirect("/admin/dashboard") ;

 

}) ;

module.exports = router ;