const express = require('express') ;
const router = express.Router() ;
const  paymentModel  = require('../models/payment') ;
const  { cartModel, validateCart } = require('../models/cart') ;
const { orderModel,validateOrder } = require('../models/order') ;
const { generateRecipe } = require('../services/ai.services')

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

function parseRecipe(rawText) {
  let html = rawText
    // Bold titles like **Paneer Butter Masala**
    .replace(/\*\*(.+?)\*\*/g, '<h3 class="text-2xl font-bold mb-4 text-red-800">$1</h3>')

    // Section headers
    .replace(/Ingredients:/g, '<h4 class="font-semibold text-red-700 text-lg mb-3">Ingredients:</h4><div class="flex flex-wrap gap-2 mb-6">')
    .replace(/Instructions:/g, '</div><h4 class="font-semibold text-red-700 text-lg mb-4 mt-8">Instructions:</h4><div class="relative border-l-4 border-red-200 pl-6 space-y-6">')

    // Ingredients as tag cards
    .replace(/^\* (.+)$/gm, '<span class="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-xl shadow-sm">$1</span>')

    // Instructions as timeline steps
    .replace(/^\d+\.\s(.+)$/gm, (_, stepText, i) => {
      return `
        <div class="relative">
          <div class="absolute -left-8 top-0 w-6 h-6 bg-red-800 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-md step-counter"></div>
          <p class="text-red-800 font-semibold">${stepText}</p>
        </div>
      `;
    })

    // Close timeline div at end
    .replace(/(<div class="relative">[\s\S]+?<\/p>\s*<\/div>)+$/, match => `${match}</div>`);

  return html;
}





router.post("/address/:orderid", async function (req, res) {
  try {
    const order = await orderModel.findOne({ orderId: req.params.orderid });
    if (!order) return res.send("Sorry, this order does not exist");
    if (!req.body.address) return res.send("You must provide an address");

    order.address = req.body.address;
    await order.save();

    const cart = await cartModel.findOne({ user: order.user }).populate("products");
    if (!cart) return res.send("Cart not found");

    if (cart.isAICart) {
      // Step 1: Copy cart before clearing
      const copiedProducts = [...cart.products];
      const copiedTotalPrice = cart.totalprice;

      // Step 2: Get product names for recipe generation
      const productNames = copiedProducts.map(p => p.name);

      // Step 3: Generate recipe using Gemini
      const recipeText = await generateRecipe(cart.dishName,productNames);
      const recipeHtml = parseRecipe(recipeText);
      console.log("Hululululu",recipeText) ;

      // Step 4: Clear the original cart
      cart.products = [];
      cart.totalprice = 0;
      await cart.save();

      // Step 5: Render recipe + order summary
      return res.render("orderSummary", {
        products: copiedProducts,
        totalprice: copiedTotalPrice,
        recipeHtml
      });

    } else {
      // Normal cart – just clear and redirect
      cart.products = [];
      cart.totalprice = 0;
      await cart.save();

      return res.redirect("/products");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router ;
