const userSchema = require("../models/user/userSchema");
const bcrypt = require("bcrypt");
const otpSchema = require("../models/otp/otpSchema");
const jwt = require("jsonwebtoken");
const secret="secret_key"

// OTP Generation Function with Expiry Time
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const expiryTime = 1 * 60 * 1000; // 1 minutes expiry time
  return { otp, expiresAt: Date.now() + expiryTime };
};

// user signup

const userSignup = async (req, res) => {
    const { emailOrPhone, password, confirmPassword } = req.body;
  
    if (!emailOrPhone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
  
    try {
      const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone);
      const isPhone = /^\d{10}$/.test(emailOrPhone);
      const userData = {
        password: await bcrypt.hash(password, 10),
      };
  
      if (isEmail) {
        userData.email = emailOrPhone;
      } else if (isPhone) {
        userData.phone = emailOrPhone;
      } else {
        return res.status(400).json({ message: "Invalid email id or phone number format" });
      }
  
      const existingUser = await userSchema.findOne(
        isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }
      );
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      const { otp, expiresAt } = generateOtp();
      const otpData = new otpSchema({
        otp: otp.toString(),
        contact: emailOrPhone,
        expiresAt,
        tempUserData: userData, // Temporarily store user data here
      });
  
      await otpData.save();
      console.log(`Generated OTP: ${otp}`);
  
      return res.status(201).json({ OTP: otp, message: "OTP sent successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error, please try again later." });
    }
  };
  

// otp verification

const otpVerify = async (req, res) => {
    try {
      const { otp, emailOrPhone } = req.body;
      console.log(otp,'input');
      
  
      const existingOtpData = await otpSchema.findOne({ contact: emailOrPhone });
        console.log('existingOtpData',existingOtpData);
        
      if (!existingOtpData) {
        return res.status(404).json({ message: "OTP not found. Please request a new one." });
      }
  
      if (String(otp).trim() !== String(existingOtpData.otp).trim()) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
  
      if (Date.now() > existingOtpData.expiresAt) {
        // await otpSchema.deleteOne({ contact: emailOrPhone });
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
  
      const { tempUserData } = existingOtpData; // Retrieve temp user data

      const newUser = new userSchema(tempUserData); // Register user with retrieved data
      await newUser.save();
  
      await otpSchema.deleteOne({ contact: emailOrPhone }); // Remove OTP document after registration
  
      return res.status(201).json({ data: newUser, message: "User registered successfully!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred during OTP verification" });
    }
  };

  // resend otp

  const resendOtp = async (req, res) => {
    try {
      const { emailOrPhone } = req.body;
  
      // Find the existing OTP document for the user
      const existingOtpData = await otpSchema.findOne({ contact: emailOrPhone });
  
      // Check if OTP document exists
      if (!existingOtpData) {
        return res.status(404).json({ message: "No OTP found. Please register first." });
      }
  
      // Generate a new OTP and expiration time
      const { otp, expiresAt } = generateOtp();
  
      // Update the existing OTP document with the new OTP and expiration
      existingOtpData.otp = otp.toString();
      existingOtpData.expiresAt = expiresAt;
  
      // Save the updated OTP document
      await otpSchema.findOneAndUpdate({contact: emailOrPhone},{otp:otp,expiresAt:expiresAt});
      console.log(`New OTP sent: ${otp}`);
  
      return res.status(200).json({ OTP: otp, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while resending the OTP" });
    }
  };

  // User signIn 

  const userSignIn = async (req, res) => {
    const { emailOrPhone, password } = req.body;
  
    try {
      // Find the user by email or phone
      const user = await userSchema.findOne(
        /\S+@\S+\.\S+/.test(emailOrPhone) ? { email: emailOrPhone } : { phone: emailOrPhone }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: user._id }, // Payload with user ID
        secret, // Secret key
        { expiresIn: "1h" } // Token expiration
      );
  
      return res.status(200).json({ accessToken, message: "Login successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred during login" });
    }
  };



  
  


module.exports = {
  userSignup,
  otpVerify,
  resendOtp,
  userSignIn
};
