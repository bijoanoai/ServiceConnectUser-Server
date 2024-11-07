const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const verifyToken = require("../middlewares/authMiddleware");


router.post('/userSignup',userController.userSignup)
router.post('/otpVerify',userController.otpVerify)
router.post('/resendOtp',userController.resendOtp)
router.post('/userSignIn',userController.userSignIn)
// Protect this route with verifyToken middleware
router.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "Access to protected route granted", user: req.user });
  });



module.exports=router