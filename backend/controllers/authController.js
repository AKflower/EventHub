// controllers/authController.js
const db = require("../db"); // Kết nối tới PostgreSQL
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password, fullname, phone, birth, gender, mail } = req.body;

  try {
    const userCheck = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, password, fullname, phone, birth, gender, mail) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [username, hashedPassword, fullname, phone, birth, gender, mail]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const logout = (req, res) => {
  // Ở đây bạn có thể xử lý việc đăng xuất bằng cách xóa JWT token khỏi client
  // Ví dụ: xóa token khỏi cookie hoặc bộ nhớ local
  res.json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout,
};
