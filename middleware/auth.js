const jwt = require("jsonwebtoken");

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header(process.env.AUTH_TOKEN_KEY);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { auth };
