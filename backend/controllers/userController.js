const db = require("../db");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { password, fullName, phone, birth, gender, mail, roleId } = req.body;

  try {
    const userCheck = await db.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Mail already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (password, "fullName", phone, birth, gender, mail, "roleId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [hashedPassword, fullName, phone, birth, gender, mail, roleId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { mail,oldPassword, newPassword } = req.body;
  const result = await db.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid mail or password" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid mail or password" });
    }
  try {
    const userResult = await db.query(
      `SELECT password FROM users WHERE id = $1 AND "isDelete" = FALSE`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or has been deleted" });
    }

    const currentPassword = userResult.rows[0].password;

    const isMatch = await bcrypt.compare(oldPassword, currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      id,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, birth, gender, mail } = req.body;

  try {
    const result = await db.query(
      `UPDATE users SET  "fullName" = $1, phone = $2, birth = $3, gender = $4, mail = $5 WHERE id = $6 RETURNING *`,
      [fullName, phone, birth, gender, mail, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const softDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE users SET "isDelete" = TRUE WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User soft deleted successfully" });
  } catch (error) {
    console.error("Error updating isDelete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User Not Found");
    }
    res
      .status(200)
      .json({ message: "User Deleted", deletedUser: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  changePassword,
  getUserById,
  updateUser,
  deleteUser,
  softDeleteUser,
};
