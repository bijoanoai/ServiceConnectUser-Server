// authMiddleware.js
const jwt = require("jsonwebtoken");
const secret="secret_key"

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the same secret key used during sign-in
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded token data (e.g., user ID) to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
