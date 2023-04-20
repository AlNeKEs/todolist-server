const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  }
  try {
    const decoded = jwt.decode(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.userID;
    req.username = decoded.username;
    next();
  } catch (e) {
    console.log(e);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = verifyToken;
