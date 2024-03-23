const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registercontroller");
const { requireSignin, isAdmin } = require("../middleware/authmiddleware");
router.post("/register", registerController.registerUser);
router.post("/login", registerController.LoginController);
//protected route   auth
router.get("/user/auth", requireSignin, (req , res) =>{
    res.status(200).send({ok : true})
})
router.get("/admin/auth", requireSignin,isAdmin , (req , res) =>{
    res.status(200).send({ok : true})
})
  

router.post("/forgot/password", registerController.ForgotPassword)
module.exports = router;

router.put("/profile", requireSignin, registerController.updateProfileController)

module.exports = router;
