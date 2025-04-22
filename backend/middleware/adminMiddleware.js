const db = require("../db");

// Middleware to check if the user has admin role (roleId = 1)
const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if user exists and has admin role
    const result = await db.query(
      'SELECT "roleId" FROM users WHERE id = $1 AND "isDelete" = FALSE',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: User not found",
      });
    }

    const user = result.rows[0];
    if (user.roleId !== 1) {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    // User has admin role, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = adminMiddleware;
