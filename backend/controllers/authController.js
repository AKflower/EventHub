const db = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'eventhub173@gmail.com', 
      pass: 'ibai twbs skiz olry',  
    },
  });

  const mailOptions = {
    from: 'eventhub173@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
  const { password, fullName, phone, birth, gender, mail } = req.body;

  try {
    const userCheck = await db.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Mail already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const result = await db.query(
      `INSERT INTO users ( password, "fullName", phone, birth, gender, mail, emailVerificationToken) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        hashedPassword,
        fullName,
        phone,
        birth,
        gender,
        mail,
        emailVerificationToken,
      ]
    );

    const verificationLink = `http://localhost:3001/api/auth/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(mail, verificationLink);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const result = await db.query(
      `UPDATE users 
       SET isEmailVerified = TRUE, emailVerificationToken = NULL
       WHERE emailVerificationToken = $1
       RETURNING *`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    res.status(200).send('Email successfully verified!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


const login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid mail or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid mail or password" });
    }

    const token = jwt.sign(
      { id: user.id, mail: user.mail },
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
  verifyEmail,
  login,
  logout,
};
