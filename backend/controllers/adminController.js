const db = require("../db");
const eventController = require("./eventController");
const userController = require("./userController");
const bookingController = require("./bookingController");
const ticketController = require("./ticketController");

// Dashboard data
const getDashboardData = async (req, res) => {
  try {
    // Total users
    const usersResult = await db.query(
      'SELECT COUNT(*) FROM users WHERE "isDelete" = FALSE'
    );
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Total events
    const eventsResult = await db.query(
      'SELECT COUNT(*) FROM events WHERE "isDelete" = FALSE'
    );
    const totalEvents = parseInt(eventsResult.rows[0].count);

    // Total bookings - assuming statusId 3 is for completed bookings
    const bookingsResult = await db.query(
      'SELECT COUNT(*) FROM bookings WHERE "statusId" = 3'
    );
    const totalBookings = parseInt(bookingsResult.rows[0].count);

    // Total revenue - assuming statusId 2 is for paid bills
    const revenueResult = await db.query(
      "SELECT SUM(total) FROM bills WHERE \"statusId\" = '2'"
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].sum || 0);

    // Recent bookings
    const recentBookingsResult = await db.query(`
      SELECT b.id, b."eventId", e.name AS "eventName", b."userId", u."fullName" AS "userName", 
             bl.total AS "totalPrice", b."statusId", bs."statusName", b."createdTime"
      FROM bookings b
      JOIN events e ON b."eventId" = e.id
      JOIN users u ON b."userId" = u.id
      JOIN "bookingStatus" bs ON b."statusId" = bs.id
      LEFT JOIN bills bl ON b.id = bl."bookingId"
      ORDER BY b."createdTime" DESC
      LIMIT 5
    `);

    // Upcoming events
    const upcomingEventsResult = await db.query(`
      SELECT id, name, "startTime", "endTime", "minPrice", city, "venueName"
      FROM events
      WHERE "isDelete" = FALSE AND "startTime" > NOW()
      ORDER BY "startTime"
      LIMIT 5
    `);

    res.status(200).json({
      stats: {
        totalUsers,
        totalEvents,
        totalBookings,
        totalRevenue,
      },
      recentBookings: recentBookingsResult.rows,
      upcomingEvents: upcomingEventsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Event management
const getAllEvents = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.id, e.name, e.description, e."startTime", e."endTime", 
             e.city, e.district, e.ward, e.street, e."venueName",
             e."categoryId", e."minPrice", e."isFree", e."isDelete", e."createdTime"
      FROM events e
      WHERE e."isDelete" = FALSE
      ORDER BY e."startTime" DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin-specific event creation
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
    categoryId,
    description,
    startTime,
    endTime,
    accOwner,
    accNumber,
    bank,
    branch,
    isFree,
  } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO events (
        logo, "coverImg", name, "venueName", city, district, ward, street, 
        "categoryId", description, "startTime", "endTime", "accOwner", 
        "accNumber", bank, branch, "isFree"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING *
    `,
      [
        logo,
        coverImg,
        name,
        venueName,
        city,
        district,
        ward,
        street,
        categoryId,
        description,
        startTime,
        endTime,
        accOwner,
        accNumber,
        bank,
        branch,
        isFree,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
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
    categoryId,
    description,
    startTime,
    endTime,
    accOwner,
    accNumber,
    bank,
    branch,
    isFree,
  } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE events 
      SET logo = $1, "coverImg" = $2, name = $3, "venueName" = $4, 
          city = $5, district = $6, ward = $7, street = $8, 
          "categoryId" = $9, description = $10, "startTime" = $11, "endTime" = $12, 
          "accOwner" = $13, "accNumber" = $14, bank = $15, branch = $16, "isFree" = $17
      WHERE id = $18 AND "isDelete" = FALSE
      RETURNING *
    `,
      [
        logo,
        coverImg,
        name,
        venueName,
        city,
        district,
        ward,
        street,
        categoryId,
        description,
        startTime,
        endTime,
        accOwner,
        accNumber,
        bank,
        branch,
        isFree,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    // Soft delete by setting isDelete to TRUE
    const result = await db.query(
      `
      UPDATE events 
      SET "isDelete" = TRUE 
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User management
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u."fullName", u.phone, u.birth, u.gender, 
             u.mail, u."roleId", COALESCE(r.name, 'Người dùng') AS "roleName", u."isDelete", 
             u."isEmailVerified", u."createdTime"
      FROM users u
      LEFT JOIN roles r ON u."roleId" = r.id
      WHERE u."isDelete" = FALSE
      ORDER BY u.id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, birth, gender, mail } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE users 
      SET "fullName" = $1, phone = $2, birth = $3, gender = $4, mail = $5
      WHERE id = $6
      RETURNING *
    `,
      [fullName, phone, birth, gender, mail, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Soft delete by setting isDelete to TRUE
    const result = await db.query(
      `
      UPDATE users 
      SET "isDelete" = TRUE 
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE users 
      SET "roleId" = $1
      WHERE id = $2
      RETURNING *
    `,
      [roleId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Booking management
const getAllBookings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.id, b."eventId", e.name AS "eventName", b."userId", 
             u."fullName" AS "userName", bl.total AS "totalPrice", b."statusId", 
             bs."statusName", b."createdTime", b.mail, b.phone, b."ticketInfo"
      FROM bookings b
      JOIN events e ON b."eventId" = e.id
      JOIN users u ON b."userId" = u.id
      JOIN "bookingStatus" bs ON b."statusId" = bs.id
      LEFT JOIN bills bl ON b.id = bl."bookingId"
      WHERE b."isDelete" = FALSE
      ORDER BY b."createdTime" DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Ticket management
const getAllTickets = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.id, t."eventId", e.name AS "eventName", 
             t."typeId", tt.name AS "ticketTypeName", tt.price, tt.description,
             t."isDelete", t."createdTime"
      FROM tickets t
      JOIN events e ON t."eventId" = e.id
      JOIN "ticketTypes" tt ON t."typeId" = tt.id
      ORDER BY t."createdTime" DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Ticket Types management
const getAllTicketTypes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT tt.id, tt."eventId", e.name AS "eventName", tt.name, tt.price,
             tt.total, tt."minBuy", tt."maxBuy", tt."startTime", tt."endTime",
             tt.description, tt.available, tt."isDelete", tt."createdTime"
      FROM "ticketTypes" tt
      JOIN events e ON tt."eventId" = e.id
      WHERE tt."isDelete" = FALSE
      ORDER BY tt."createdTime" DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching ticket types:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Bill management
const getAllBills = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.id, b."userId", u."fullName" AS "userName", 
             b."bookingId", b.total, b."paymentMethodId", 
             COALESCE(pm.method, 'Unknown') AS "paymentMethod",
             b."statusId", COALESCE(bs."statusName", 'Unknown') AS "billStatus", 
             b."createdTime", bk.mail, bk.phone,
             e.name AS "eventName", e.id AS "eventId"
      FROM bills b
      LEFT JOIN users u ON b."userId" = u.id
      LEFT JOIN "paymentMethod" pm ON b."paymentMethodId"::integer = pm.id
      LEFT JOIN "billStatus" bs ON b."statusId"::integer = bs.id
      LEFT JOIN bookings bk ON b."bookingId" = bk.id
      LEFT JOIN events e ON bk."eventId" = e.id
      WHERE b."isDelete" = FALSE
      ORDER BY b."createdTime" DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get bill details by ID
const getBillById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT b.id, b."userId", u."fullName" AS "userName", 
             b."bookingId", b.total, b."paymentMethodId", 
             COALESCE(pm.method, 'Unknown') AS "paymentMethod",
             b."statusId", COALESCE(bs."statusName", 'Unknown') AS "billStatus", 
             b."createdTime", bk.mail, bk.phone, bk."ticketInfo",
             e.name AS "eventName", e.id AS "eventId",
             e."startTime", e."endTime", e."venueName", e.city
      FROM bills b
      LEFT JOIN users u ON b."userId" = u.id
      LEFT JOIN "paymentMethod" pm ON b."paymentMethodId"::integer = pm.id
      LEFT JOIN "billStatus" bs ON b."statusId"::integer = bs.id
      LEFT JOIN bookings bk ON b."bookingId" = bk.id
      LEFT JOIN events e ON bk."eventId" = e.id
      WHERE b.id = $1 AND b."isDelete" = FALSE
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update bill status
const updateBillStatus = async (req, res) => {
  const { id } = req.params;
  const { statusId } = req.body;

  try {
    // Validate statusId exists in billStatus table
    const statusCheck = await db.query(
      'SELECT id FROM "billStatus" WHERE id = $1',
      [statusId]
    );

    if (statusCheck.rows.length === 0) {
      return res.status(400).json({ message: "Invalid status ID" });
    }

    const result = await db.query(
      `UPDATE bills SET "statusId" = $1 WHERE id = $2 AND "isDelete" = FALSE RETURNING *`,
      [statusId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating bill status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete bill (soft delete)
const deleteBill = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE bills SET "isDelete" = TRUE WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get bill status options
const getBillStatuses = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, "statusName" FROM "billStatus" ORDER BY id'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bill statuses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get payment methods
const getPaymentMethods = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, method FROM "paymentMethod" ORDER BY id'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reports
const getSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    let queryText = `
      SELECT DATE(b."createdTime") AS date, COUNT(*) AS bookings_count, 
             SUM(bl.total) AS revenue
      FROM bookings b
      JOIN bills bl ON b.id = bl."bookingId"
      WHERE b."statusId" = 3
    `;

    const queryParams = [];
    if (startDate && endDate) {
      queryText += ` AND b."createdTime" BETWEEN $1 AND $2`;
      queryParams.push(startDate, endDate);
    }

    queryText += ` GROUP BY DATE(b."createdTime") ORDER BY date`;

    const result = await db.query(queryText, queryParams);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEventsReport = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.id, e.name, COUNT(b.id) AS bookings_count, 
             SUM(bl.total) AS revenue
      FROM events e
      LEFT JOIN bookings b ON e.id = b."eventId" AND b."statusId" = 3
      LEFT JOIN bills bl ON b.id = bl."bookingId"
      WHERE e."isDelete" = FALSE
      GROUP BY e.id, e.name
      ORDER BY bookings_count DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error generating events report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get booking count by city for analytics
const getBookingsByCity = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.city, COUNT(b.id) AS booking_count
      FROM bookings b
      JOIN events e ON b."eventId" = e.id
      WHERE b."statusId" = 3 AND b."isDelete" = FALSE
      GROUP BY e.city
      ORDER BY booking_count DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings by city:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get booking count by category for analytics
const getBookingsByCategory = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.category, COUNT(b.id) AS booking_count
      FROM bookings b
      JOIN events e ON b."eventId" = e.id
      JOIN categories c ON e."categoryId" = c.id
      WHERE b."statusId" = 3 AND b."isDelete" = FALSE
      GROUP BY c.category
      ORDER BY booking_count DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const result = await db.query("SELECT id, name FROM roles ORDER BY id");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, category AS name FROM categories ORDER BY id"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDashboardData,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  getAllBookings,
  getAllTickets,
  getAllTicketTypes,
  getAllBills,
  getBillById,
  updateBillStatus,
  deleteBill,
  getBillStatuses,
  getPaymentMethods,
  getSalesReport,
  getEventsReport,
  getBookingsByCity,
  getBookingsByCategory,
  getAllRoles,
  getAllCategories,
};
