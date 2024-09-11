const db = require("../db");

const getAllBills = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM bills");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM bills WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Bill not found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching bill:", err);
    res.status(500).send("Internal Server Error");
  }
};

// API: Tổng doanh thu theo sự kiện
const getTotalRevenueByEvent = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.name AS "eventName", SUM(b.total) AS "totalRevenue"
      FROM bills b
      JOIN bookings bk ON b."bookingId" = bk.id
      JOIN events e ON bk."eventId" = e.id
      WHERE b."isDelete" = false
      GROUP BY e.name
      ORDER BY "totalRevenue" DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching total revenue by event:', err);
    res.status(500).send('Internal Server Error');
  }
};

const createBill = async (req, res) => {
  const { userId, bookingId, total, paymentMethodId, statusId } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO bills ("userId", "bookingId", total, "paymentMethodId", "statusId") 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, bookingId, total, paymentMethodId, statusId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating bill:", err);
    res.status(500).send("Internal Server Error");
  }
};

const updateBill = async (req, res) => {
  const { id } = req.params;
  const { userId, bookingId, total, paymentMethodId, statusId } = req.body;
  try {
    const result = await db.query(
      `UPDATE bills SET "userId" = $1, "bookingId" = $2, total = $3, 
       "paymentMethodId" = $4, "statusId" = $5, "modifiedTime" = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING *`,
      [userId, bookingId, total, paymentMethodId, statusId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Bill not found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating bill:", err);
    res.status(500).send("Internal Server Error");
  }
};

const softDeleteBill = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE bills SET "isDelete" = TRUE WHERE id = $1`,
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

const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM bills WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Bill not found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting bill:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllBills,
  getBillById,
  getTotalRevenueByEvent,
  createBill,
  updateBill,
  softDeleteBill,
  deleteBill,
};
