const ProductController = require("../controllers/ProductController");
const formidable = require("express-formidable")
const express = require("express");
const { requireSignin, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

  

router.post("/create-product",requireSignin, isAdmin, formidable(), ProductController.CreateProduct)
router.get("/get-product", ProductController.getAllProducts)
router.get("/get-product/:slug", ProductController.getSingleProducts)
router.get("/product-photo/:pid", ProductController.photocontroller)
router.delete("/product-photo/:pid", ProductController.deletecontroller)
router.put("/update-product/:pid", requireSignin, isAdmin, formidable(), ProductController.updatecontroller)
router.post("/product-filters", ProductController.productfiltercontroller)
router.get("/product-count", ProductController.Productcountcontroller)
router.get("/product-list/:page", ProductController.ProductListController)
router.get("/search/:keyword", ProductController.SearchProductController)
router.get("/related-product/:pid/:cid", ProductController.RelatedProductController)
router.get("/braintree/token" , ProductController.braintreeTokenController)
router.post('/braintree/payment' , ProductController.brainTreePaymentController),


module.exports = router;
