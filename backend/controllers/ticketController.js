const db = require("../db"); // Kết nối tới PostgreSQL

const createTicket = async (req, res) => {
  const { typeId, eventId } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO tickets ("typeId", "eventId") 
             VALUES ($1, $2) RETURNING *`,
      [typeId, eventId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllTickets = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tickets");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
          SELECT 
              tickets.id,
              "ticketTypes".name AS ticket_type_name,
              "ticketTypes".price,
              "ticketTypes"."startTime",
              "ticketTypes"."endTime",
              "ticketTypes".description AS ticket_description,
              events.name AS event_name,
              events."venueName",
              events.city,
              events.district,
              events.ward,
              events.street
          FROM tickets
          JOIN "ticketTypes" ON tickets."typeId" = "ticketTypes".id
          JOIN events ON tickets."eventId" = events.id
          WHERE tickets.id = $1 AND tickets."isDelete" = FALSE
      `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Ticket không tồn tại");
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { typeId, eventId } = req.body;

  try {
    const result = await db.query(
      `UPDATE tickets SET 
             "typeId" = $1, "eventId" = $2, "modifiedTime" = CURRENT_TIMESTAMP 
             WHERE id = $3 RETURNING *`,
      [typeId, eventId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Ticket Not Found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const softDeleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE tickets SET "isDelete" = TRUE WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket soft deleted successfully" });
  } catch (error) {
    console.error("Error updating isDelete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Ticket Not Found");
    }
    res
      .status(200)
      .json({ message: "Ticket Deleted", deletedTicket: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  softDeleteTicket,
  deleteTicket,
};
