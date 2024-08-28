const db = require("../db"); // Kết nối tới PostgreSQL

const createBooking = async (req, res) => {
  const { userid, ticketids, mail, phone } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO bookings (userid, ticketids, mail, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [userid, ticketids, mail, phone]
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

const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { userid, ticketids, mail, phone } = req.body;

  try {
    const result = await db.query(
      "UPDATE bookings SET userid = $1, ticketids = $2, mail = $3, phone = $4, modifiedtime = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [userid, ticketids, mail, phone, id]
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
      "UPDATE bookings SET isDelete = TRUE WHERE id = $1",
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
  updateBooking,
  softDeleteBooking,
  deleteBooking,
};
