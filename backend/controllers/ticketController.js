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

// API: Tổng số vé đã bán theo loại vé
const getTotalTicketsSoldPerType = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT tt.name AS "ticketType", ttt.name AS "eventName", COUNT(t.id) AS "totalTicketsSold"
      FROM tickets t
      JOIN "ticketTypes" tt ON t."typeId" = tt.id
      JOIN events ttt ON t."eventId" = ttt.id
      WHERE t."isDelete" = false
      GROUP BY tt.name, ttt.name
      ORDER BY "totalTicketsSold" DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching total tickets sold per type:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getTicketsSoldByDay = async (req, res) => {
  try {
    const queryText = `
      SELECT DATE(t."createdTime") as "saleDate", COUNT(t.id) as "ticketCount"
      FROM tickets t
      WHERE t."isDelete" = false
      GROUP BY "saleDate"
      ORDER BY "saleDate" DESC
    `;
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching tickets sold by day:", err);
    res.status(500).send("Internal Server Error");
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
const createMultipleTickets = async (ticketInfo, eventId, bookingId) => {
  console.log(ticketInfo, eventId);

  if (!ticketInfo || !Array.isArray(ticketInfo)) {
    return res.status(400).send("Invalid ticket information.");
  }

  try {
    const tickets = [];
    for (const info of ticketInfo) {
      const { ticketTypeId, quant } = info;

      if (!ticketTypeId || !quant || quant <= 0) {
        return;
      }

      for (let i = 0; i < quant; i++) {
        const result = await db.query(
          `INSERT INTO tickets ("typeId", "eventId","bookingId") 
               VALUES ($1, $2,$3) RETURNING *`,
          [ticketTypeId, eventId, bookingId]
        );
        tickets.push(result.rows[0]);
      }
    }

    // res.status(201).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  getTotalTicketsSoldPerType,
  getTicketsSoldByDay,
  updateTicket,
  softDeleteTicket,
  deleteTicket,
  createMultipleTickets,
};
