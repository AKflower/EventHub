// controllers/eventController.js
const db = require("../db"); // Kết nối tới PostgreSQL

// Thêm một sự kiện mới
const createEvent = async (req, res) => {
  const {
    logo,
    coverimg,
    name,
    venuename,
    city,
    district,
    ward,
    street,
    category,
    description,
    starttime,
    endtime,
    accowner,
    accnumber,
    bank,
    branch,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO events 
            (logo, coverimg, name, venuename, city, district, ward, street, category, description, starttime, endtime, accowner, accnumber, bank, branch) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
            RETURNING *`,
      [
        logo,
        coverimg,
        name,
        venuename,
        city,
        district,
        ward,
        street,
        category,
        description,
        starttime,
        endtime,
        accowner,
        accnumber,
        bank,
        branch,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Lấy tất cả các sự kiện
const getAllEvents = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM events");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Lấy sự kiện theo ID
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Event Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Cập nhật thông tin sự kiện
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    logo,
    coverimg,
    name,
    venuename,
    city,
    district,
    ward,
    street,
    category,
    description,
    starttime,
    endtime,
    accowner,
    accnumber,
    bank,
    branch,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE events SET 
            logo = $1, coverimg = $2, name = $3, venuename = $4, city = $5, district = $6, ward = $7, street = $8, 
            category = $9, description = $10, starttime = $11, endtime = $12, accowner = $13, accnumber = $14, 
            bank = $15, branch = $16, modifiedtime = CURRENT_TIMESTAMP 
            WHERE id = $17 RETURNING *`,
      [
        logo,
        coverimg,
        name,
        venuename,
        city,
        district,
        ward,
        street,
        category,
        description,
        starttime,
        endtime,
        accowner,
        accnumber,
        bank,
        branch,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Event Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Xóa sự kiện theo ID
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Event Not Found");
    }
    res
      .status(200)
      .json({ message: "Event Deleted", deletedEvent: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
