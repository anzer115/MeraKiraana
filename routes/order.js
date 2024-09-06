const express = require('express') ;
const router = express.Router() ;
const  paymentModel  = require('../models/payment') ;
const  { cartModel, validateCart } = require('../models/cart') ;
const { orderModel,validateOrder } = require('../models/order') ;

//check and verify the data with Backend
router.get("/:userid/:orderid/:paymentid/:signature", async function(req,res){
    let paymentDetails = await paymentModel.findOne({
        orderId: req.params.orderid,
    }) ;

    if(!paymentDetails) return res.send("Unfortunately the payment is not Compeleted. Sorry for the inconvinience!") ;
    if(req.params.signature === paymentDetails.signature && 
        req.params.paymentid ===  paymentDetails.paymentId)
     {
        let cart = await cartModel.findOne({ user: req.params.userid }) ;
        
        await orderModel.create({
        orderId : req.params.orderid,
        user: req.params.userid,
        products: cart.products,
        totalprice: cart.totalprice,
        address:  "",
        status: "processing",
        payment: paymentDetails._id,
      }) ;
      res.redirect(`/map/${req.params.orderid}`) ;
    } else {
        res.send("Invalid Payment")
    }

}) ;

router.post("/address/:orderid", async function(req,res){
   let order = await orderModel.findOne({ orderId: req.params.orderid }) ;
   if(!order) return res.send(" Sorry, this order does not exist ") ;
   if(!req.body.address) return res.send("You must provide an address") ;
   order.address = req.body.address ;
   order.save() ;
   let cart = await cartModel.findOne({ user: order.user });
   if (cart) {
       // Clear the cart's products array and reset the total price
       cart.products = [];
       cart.totalprice = 0;
       await cart.save();
   }
   res.redirect("/products") ;

})


module.exports = router ;
