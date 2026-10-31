const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Check if token is in the correct 'Bearer <token>' format
  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format." });
  }

  try {
    // Get the token value after 'Bearer '
    const tokenValue = token.split(" ")[1];
    
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};