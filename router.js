const express=require('express')
const router=express.Router()
const userController=require('./models/user/userController')

router.post('/userSignup',userController.userSignup)
router.post('/otpVerify',userController.otpVerify)
router.post('/resendOtp',userController.resendOtp)
router.post('/userSignIn',userController.userSignIn)




module.exports=router