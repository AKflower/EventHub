const db = require("../db"); // Kết nối tới PostgreSQL

const createTicketType = async (req, res) => {
  const {
    eventid,
    name,
    price,
    total,
    minbuy,
    maxbuy,
    starttime,
    endtime,
    description,
    img,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO tickettypes 
            (eventid, name, price, total, minbuy, maxbuy, starttime, endtime, description, img) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
      [
        eventid,
        name,
        price,
        total,
        minbuy,
        maxbuy,
        starttime,
        endtime,
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
    const result = await db.query("SELECT * FROM tickettypes");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getTicketTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM tickettypes WHERE id = $1", [
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

const updateTicketType = async (req, res) => {
  const { id } = req.params;
  const {
    eventid,
    name,
    price,
    total,
    minbuy,
    maxbuy,
    starttime,
    endtime,
    description,
    img,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE tickettypes SET 
            eventid = $1, name = $2, price = $3, total = $4, minbuy = $5, maxbuy = $6, 
            starttime = $7, endtime = $8, description = $9, img = $10, modifiedtime = CURRENT_TIMESTAMP 
            WHERE id = $11 RETURNING *`,
      [
        eventid,
        name,
        price,
        total,
        minbuy,
        maxbuy,
        starttime,
        endtime,
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
      "UPDATE tickettypes SET isDelete = TRUE WHERE id = $1",
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
      "DELETE FROM tickettypes WHERE id = $1 RETURNING *",
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
  updateTicketType,
  softDeleteTicketType,
  deleteTicketType,
};
