const jwt = require('jsonwebtoken');
require('dotenv').config();
async function validateAdmin(req, res, next) {
    try {
        // Ensure cookies are parsed and available
        let token = req.cookies.token;
        if (!token) return res.status(401).send("You need to login first");

        // Verify the JWT token
        let data = jwt.verify(token, process.env.JWT_KEY);
        req.user = data;
        
        // Proceed to the next middleware/route handler
        next();
    } catch (err) {
        // Handle any errors during token verification
        return res.status(403).send("Invalid or expired token");
    }
};

async function userIsLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next() ;
    }
    res.redirect("/users/login") ;
}

module.exports = { validateAdmin, userIsLoggedIn } ;
