const express = require('express') ;
const router = express.Router() ;
const passport = require('passport') ;
const { cartModel, validateCart } = require('../models/cart')
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin') ;
const { productModel, validateProduct } = require('../models/product') ;


router.get("/", userIsLoggedIn , async function(req,res){
 try{
    let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products") ;
    //Avoid repetetion of same items in cart and handling as quantity
    let cartDataStructure = {} ;
    cart.products.forEach(product=>{
      let key = product._id.toString() ;
      if(cartDataStructure[key]){
        cartDataStructure[key].quantity += 1 ;
      } else {
        cartDataStructure[key] = {
            ...product._doc,
            quantity: 1,
        }
      }
    }) ;
    //Convert object to array of objects
    let finalArray =  Object.values(cartDataStructure) ;

    //Bill detail section
    let finalprice= cart.totalprice + 34 //small cart charges to be added
    
    res.render("cart", { cart: finalArray, finalprice: finalprice, userid: req.session.passport.user, }) ;
 } catch(err){
    res.send(err.message) ;
 }
}) ;

//to decrement the count of products using "-"
router.get("/remove/:id", async function(req,res){
    try{
     let cart = await cartModel.findOne({user: req.session.passport.user}) ;
     let product = await productModel.findOne({_id: req.params.id}) ;
     if(!cart){
        return res.send("There is nothing in the cart") ;
     } else {
        let prodId = cart.products.indexOf(req.params.id) ;
         cart.products.splice(prodId,1) ;
         cart.totalprice = Number(cart.totalprice) - Number(product.price) ;
         await cart.save() ;
     }
     res.redirect("/cart") ;
    } catch(err){
      res.send(err.message) ;
    }
 }) ;
//for the product page
router.get("/add/:id", async function(req,res){
   try{
    let cart = await cartModel.findOne({user: req.session.passport.user}) ;
    let product = await productModel.findOne({_id: req.params.id}) ;
    if(!cart){
        await cartModel.create({
            user: req.session.passport.user,
            products: [req.params.id],
            totalprice: Number(product.price),
        }) ;
    } else {
        cart.products.push(req.params.id) ;
        cart.totalprice = Number(cart.totalprice) + Number(product.price) ;
        await cart.save() ;
    }
    res.redirect("/products") ;
   } catch(err){
     res.send(err.message) ;
   }
}) ;

//for the cart page
router.get("/addtocart/:id", async function(req,res){
  try{
   let cart = await cartModel.findOne({user: req.session.passport.user}) ;
   let product = await productModel.findOne({_id: req.params.id}) ;
   if(!cart){
       await cartModel.create({
           user: req.session.passport.user,
           products: [req.params.id],
           totalprice: Number(product.price),
       }) ;
   } else {
       cart.products.push(req.params.id) ;
       cart.totalprice = Number(cart.totalprice) + Number(product.price) ;
       await cart.save() ;
   }
   res.redirect("/cart") ;
  } catch(err){
    res.send(err.message) ;
  }
}) ;

//Empty the cart
router.post('/empty', async (req, res) => {
  try {
      // Assuming you have a user session or cart identified by user ID
      const userId = req.user._id; // adjust based on your session/user handling
      await cartModel.updateOne({ user: userId }, { $set: { products: [], totalprice: 0 } });

      // Redirect to the cart page after clearing
      res.redirect('/cart');
  } catch (err) {
      console.error(err);
      res.status(500).send("Error emptying cart");
  }
});



router.get("/remove/:id", userIsLoggedIn, async function(req,res){
try{
    let cart = await cartModel.findOne({user: req.session.passport.user }) ;
if(!cart) return res.send("Something went wrong") ;
let index = cart.products.indexOf(req.params.id) ;
if(index !== -1) cart.products.splice(index,1) ;
else return res.send("Items Not in the cart") ;
await cart.save() ;
res.send("done") ;
} catch(err) {
    res.send(err.message) ;
}
}) ;




module.exports = router ;

