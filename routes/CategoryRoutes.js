const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const { requireSignin, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

  

router.post("/create-category",requireSignin, isAdmin, CategoryController.createCategory)
router.put("/update-category/:id",requireSignin, isAdmin, CategoryController.UpdateCategory)
router.get("/getall-category", CategoryController.GetAllCategory)
router.get("/single-category/:slug",requireSignin, isAdmin, CategoryController.SingleCategory)
router.delete("/delete-category/:id",requireSignin, isAdmin, CategoryController.DeleteCategory)
module.exports = router;

  