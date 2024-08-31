const db = require("../db"); // Kết nối tới PostgreSQL

const createTicketType = async (req, res) => {
  const {
    eventId,
    name,
    price,
    total,
    minBuy,
    maxBuy,
    startTime,
    endTime,
    description,
    img,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO "ticketTypes" 
            ("eventId", name, price, total, "minBuy", "maxBuy", "startTime", "endTime", description, img) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
      [
        eventId,
        name,
        price,
        total,
        minBuy,
        maxBuy,
        startTime,
        endTime,
        description,
        img,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllTicketTypes = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM "ticketTypes"`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getTicketTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM "ticketTypes" WHERE id = $1`, [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Ticket Type Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getTicketTypesByEventId = async (req, res) => {
  const { eventId } = req.params;
  console.log(eventId);
  try {
      const result = await db.query(
          `SELECT * FROM "ticketTypes" WHERE "eventId" = $1 AND "isDelete" = FALSE`,
          [eventId]
      );

      res.status(200).json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi server');
  }
};

const updateTicketType = async (req, res) => {
  const { id } = req.params;
  const {
    eventId,
    name,
    price,
    total,
    minBuy,
    maxBuy,
    startTime,
    endTime,
    description,
    img,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE "ticketTypes" SET 
            "eventId" = $1, name = $2, price = $3, total = $4, "minBuy" = $5, "maxBuy" = $6, 
            "startTime" = $7, "endTime" = $8, description = $9, img = $10, modifiedtime = CURRENT_TIMESTAMP 
            WHERE id = $11 RETURNING *`,
      [
        eventId,
        name,
        price,
        total,
        minBuy,
        maxBuy,
        startTime,
        endTime,
        description,
        img,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Ticket Type Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const softDeleteTicketType = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE "ticketTypes" SET "isDelete" = TRUE WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Ticket Type not found" });
    }

    res.status(200).json({ message: "Ticket Type soft deleted successfully" });
  } catch (error) {
    console.error("Error updating isDelete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTicketType = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM "ticketTypes" WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Ticket Type Not Found");
    }
    res.status(200).json({
      message: "Ticket Type Deleted",
      deletedTicketType: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createTicketType,
  getAllTicketTypes,
  getTicketTypeById,
  getTicketTypesByEventId,
  updateTicketType,
  softDeleteTicketType,
  deleteTicketType,
};
