const db = require("../db");

const createBooking = async (req, res) => {
  const { userId, ticketIds, mail, phone } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO bookings ("userId", "ticketIds", mail, phone) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, ticketIds, mail, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllBookings = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM bookings");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Booking Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getBookingsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Ngày không hợp lệ" });
  }

  try {
    const result = await db.query(
      `SELECT * FROM bookings WHERE DATE("createdTime") = $1 AND "isDelete" = FALSE`,
      [date]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
};

const getTotalBookingsByMonth = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Tháng và năm không hợp lệ" });
  }

  try {
    const result = await db.query(
      `SELECT COUNT(*) AS total FROM bookings 
          WHERE EXTRACT(MONTH FROM "createdTime") = $1 
          AND EXTRACT(YEAR FROM "createdTime") = $2 
          AND "isDelete" = FALSE`,
      [month, year]
    );

    res.status(200).json({ total: result.rows[0].total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
};

const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { userId, ticketIds, mail, phone } = req.body;

  try {
    const result = await db.query(
      `UPDATE bookings SET "userId" = $1, "ticketIds" = $2, mail = $3, phone = $4, "modifiedTime" = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
      [userId, ticketIds, mail, phone, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Booking Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const softDeleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE bookings SET "isDelete" = TRUE WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking soft deleted successfully" });
  } catch (error) {
    console.error("Error updating isDelete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM bookings WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Booking Not Found");
    }
    res
      .status(200)
      .json({ message: "Booking Deleted", deletedBooking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByDate,
  getTotalBookingsByMonth,
  updateBooking,
  softDeleteBooking,
  deleteBooking,
};
