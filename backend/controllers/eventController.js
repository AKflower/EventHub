const db = require("../db"); // Kết nối tới PostgreSQL

const createEvent = async (req, res) => {
  const {
    logo,
    coverImg,
    name,
    venueName,
    city,
    district,
    ward,
    street,
    category,
    description,
    startTime,
    endTime,
    accOwner,
    accNumber,
    bank,
    branch,
    isFree,
    createdById,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO events 
            (logo, "coverImg", name, "venueName", city, district, ward, street, category, description, "startTime", "endTime", "accOwner", "accNumber", bank, branch, "isFree", "createdById") 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
            RETURNING *`,
      [
        logo,
        coverImg,
        name,
        venueName,
        city,
        district,
        ward,
        street,
        category,
        description,
        startTime,
        endTime,
        accOwner,
        accNumber,
        bank,
        branch,
        isFree,
        createdById,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllEvents = async (req, res) => {
  try {
    const queryText = `
      SELECT e.*, s."statusName"
      FROM events e
      JOIN "eventStatus" s ON e."statusId" = s.id
      WHERE e."isDelete" = false AND e."isActive" = true;
    `;
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getEventById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query(
      `SELECT e.*, s."statusName"
      FROM events e
      JOIN "eventStatus" s ON e."statusId" = s.id 
      WHERE e.id = $1 AND e."isDelete" = FALSE AND e."isActive" = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getEventsByCategoryAndIsFree = async (req, res) => {
  const { categories, isFree, city } = req.query;

  const categoryList = Array.isArray(categories) ? categories : [categories];

  try {
    let queryText = `
      SELECT e.*, s."statusName"
      FROM events e
      JOIN "eventStatus" s ON e."statusId" = s.id  
      WHERE e."isDelete" = false AND e."statusId" != 3 AND e."isActive" = true`;
    const values = [];

    if (categories !== undefined) {
      queryText += " AND e.category = ANY($1::text[])";
      values.push(categoryList);
    }

    if (isFree !== undefined) {
      queryText += ` AND "e.isFree" = $${values.length + 1}`;
      values.push(isFree);
    }

    if (city !== undefined) {
      queryText += ` AND e.city = $${values.length + 1}`;
      values.push(city);
    }

    const result = await db.query(queryText, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getEventsByCreatedById = async (req, res) => {
  const { createdById } = req.params;

  try {
    const result = await db.query(
      `SELECT e.*, s."statusName"
       FROM events e
       JOIN "eventStatus" s ON e."statusId" = s.id
       WHERE e."createdById" = $1 AND e."isDelete" = FALSE
       ORDER BY e."createdTime" DESC`,
      [createdById]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No events found for this user");
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching events by createdById:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getEventsByDate = async (req, res) => {
  const { date } = req.query;
  try {
    const queryText = `SELECT e.*, s."statusName"
      FROM events e
      JOIN "eventStatus" s ON e."statusId" = s.id 
      WHERE e."startTime"::date = $1 AND e."isDelete" = false AND e."isActive" = true`;
    const result = await db.query(queryText, [date]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching events by date:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getEventCountByCity = async (req, res) => {
  try {
    const queryText = `
      SELECT city, COUNT(*) as "eventCount"
      FROM events
      WHERE "isDelete" = false AND "isActive" = true
      GROUP BY city
    `;
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching event count by city:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getEventCountByCategory = async (req, res) => {
  try {
    const queryText = `
      SELECT category, COUNT(*) as "eventCount"
      FROM events
      WHERE "isDelete" = false AND "isActive" = true
      GROUP BY category
    `;
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching event count by category:", err);
    res.status(500).send("Internal Server Error");
  }
};

const searchEventsByName = async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      return res.status(400).send("Name query parameter is required");
    }

    const queryText = `
      SELECT * FROM events
      WHERE name ILIKE $1
        AND "isDelete" = false AND "isActive" = true
    `;

    const result = await db.query(queryText, [`%${name}%`]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error searching events by name:", err);
    res.status(500).send("Internal Server Error");
  }
};

const searchEvents = async (req, res) => {
  const { name, categories, isFree, city } = req.query;

  const categoryList = Array.isArray(categories) ? categories : [categories];

  try {
    let queryText = `
      SELECT e.*, s."statusName"
      FROM events e
      JOIN "eventStatus" s ON e."statusId" = s.id
      WHERE e."isDelete" = false AND e."statusId" != 3 AND e."isActive" = true
    `;
    const values = [];

    if (name) {
      queryText += ` AND e.name ILIKE $${values.length + 1}`;
      values.push(`%${name}%`);
    }

    if (categories !== undefined) {
      queryText += ` AND e.category = ANY($${values.length + 1}::text[])`;
      values.push(categoryList);
    }

    if (isFree !== undefined) {
      queryText += ` AND e."isFree" = $${values.length + 1}`;
      values.push(isFree);
    }

    if (city !== undefined) {
      queryText += ` AND e.city = $${values.length + 1}`;
      values.push(city);
    }

    const result = await db.query(queryText, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error searching events:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getTop8EventsByTicketSales = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.*,
		    s."statusName",
        COALESCE(SUM(tt.total), 0) AS "totalTickets",
        COALESCE(SUM(tt.available), 0) AS "availableTickets",
        CASE 
          WHEN SUM(tt.total) > 0 THEN ROUND((SUM(tt.total) - SUM(tt.available)) * 100.0 / SUM(tt.total), 2)
          ELSE 0
        END AS "salesPercentage"
      FROM events e
      LEFT JOIN "ticketTypes" tt ON e.id = tt."eventId"
	    JOIN "eventStatus" s ON e."statusId" = s.id
      WHERE e."isActive" = true AND e."statusId" != 3 AND e."isDelete" = false
      GROUP BY e.id, s."statusName"
      ORDER BY "salesPercentage" DESC
      LIMIT 8;
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching top events by ticket sales:", err);
    res.status(500).send("Internal Server Error");
  }
};

const patchEventIsActive = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const result = await db.query(
      `UPDATE events SET "isActive" = $1, "modifiedTime" = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating event isActive:", err);
    res.status(500).send("Internal Server Error");
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    logo,
    coverImg,
    name,
    venueName,
    city,
    district,
    ward,
    street,
    category,
    description,
    startTime,
    endTime,
    accOwner,
    accNumber,
    bank,
    branch,
    isFree,
    createdById,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE events SET 
            logo = $1, "coverImg" = $2, name = $3, "venueName" = $4, city = $5, district = $6, ward = $7, street = $8, 
            category = $9, description = $10, "startTime" = $11, "endTime" = $12, "accOwner" = $13, "accNumber" = $14, 
            bank = $15, branch = $16, "isFree" = $17, "createdById" = $18, "modifiedTime" = CURRENT_TIMESTAMP 
            WHERE id = $19 RETURNING *`,
      [
        logo,
        coverImg,
        name,
        venueName,
        city,
        district,
        ward,
        street,
        category,
        description,
        startTime,
        endTime,
        accOwner,
        accNumber,
        bank,
        branch,
        isFree,
        createdById,
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

const softDeleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE events SET "isDelete" = TRUE WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event soft deleted successfully" });
  } catch (error) {
    console.error("Error updating isDelete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
  getEventsByCategoryAndIsFree,
  searchEventsByName,
  getEventsByDate,
  getEventsByCreatedById,
  getEventCountByCity,
  getEventCountByCategory,
  getTop8EventsByTicketSales,
  searchEvents,
  patchEventIsActive,
  updateEvent,
  softDeleteEvent,
  deleteEvent,
};
