const express = require('express') ;
const app = express() ;
const expressSession = require('express-session') ;
const path = require('path') ;
const passport = require('passport') ;
const cookieParser = require('cookie-parser') ;
require('dotenv').config() ;
require("./config/google_oauth_config") ;
require('./config/db') ;
const indexRouter = require('./routes/index') ;
const authRouter = require('./routes/auth') ;
const adminRouter = require('./routes/admin') ;
const productRouter = require('./routes/product') ;
const categoryRouter = require('./routes/category') ;
const userRouter = require('./routes/user') ;
const cartRouter = require('./routes/cart') ;
const paymentRouter = require('./routes/payment') ;
const orderRouter = require('./routes/order') ;
const airoutes = require('./routes/ai.routes') ;
const productRoutes = require("./routes/product.routes");

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // React dev server origin
  credentials: true, // if you use cookies/sessions
}));
app.use(cookieParser()) ;
app.set('view engine','ejs') ;
app.use(express.static(path.join(__dirname,'public'))) ;

app.use(express.json()) ;
app.use(express.urlencoded({extended: true})) ;
app.use(expressSession({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
})) ;
app.use(passport.initialize()) ;
app.use(passport.session()) ;

app.use('/', indexRouter) ;
app.use('/auth', authRouter) ;
app.use('/admin',adminRouter) ;
app.use('/products', productRouter) ;
app.use("/categories", categoryRouter) ;
app.use("/users", userRouter) ;
app.use("/cart", cartRouter) ;
app.use("/payment", paymentRouter) ;
app.use("/order", orderRouter) ;
app.use('/ai',airoutes) ;
app.use("/api", productRoutes);

app.listen(process.env.PORT || 3000) ;

