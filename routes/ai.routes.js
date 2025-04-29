const express = require("express") ;
const { gencode } = require("../controllers/aicontroller");
const router = express.Router() ;

router.post("/generate",gencode) ;


module.exports = router ;