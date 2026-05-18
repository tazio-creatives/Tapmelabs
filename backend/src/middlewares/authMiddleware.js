const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid. User not found.",
        data: null,
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token.";

    return res.status(401).json({ success: false, message, data: null });
  }
}

module.exports = { protect };
