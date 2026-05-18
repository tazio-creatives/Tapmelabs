function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
      data: null,
    });
  }
  next();
}

module.exports = { requireAdmin };
