const db = require("../db");
const ticketController = require("./ticketController");
const nodemailer = require("nodemailer");

const createBooking = async (req, res) => {
  const { userId, eventId, ticketInfo } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO bookings ("userId", "eventId", "ticketInfo") VALUES ($1, $2, $3) RETURNING *`,
      [userId, eventId, ticketInfo]
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

const getBookingByUserIdAndFilter = async (req, res) => {
  const { userId } = req.params;
  // Cập nhật filter sau
  const { statusId } = req.query;
  var query = "";
  console.log("stauts: ", statusId);
  if (statusId == 0) {
    query = `SELECT 
    b.*,
    COALESCE(ARRAY_AGG(
        JSON_BUILD_OBJECT(
            'ticketId', t."id",
            'typeId', t."typeId",
            'eventId', t."eventId"
        )
    ) FILTER (WHERE t."id" IS NOT NULL), '{}') AS tickets
FROM 
    bookings b
LEFT JOIN 
    tickets t 
ON 
    b."id" = t."bookingId"
WHERE 
    b."userId" = $1 
    AND b."isDelete" = FALSE
    AND (b."statusId" = 3 OR b."statusId" = 4)
GROUP BY 
    b."id"
ORDER BY
    b."eventId";`;
  } else {
    query = `SELECT 
    b.*,
    COALESCE(ARRAY_AGG(
        JSON_BUILD_OBJECT(
            'ticketId', t."id",
            'typeId', t."typeId",
            'eventId', t."eventId"
        )
    ) FILTER (WHERE t."id" IS NOT NULL), '{}') AS tickets
FROM 
    bookings b
LEFT JOIN 
    tickets t 
ON 
    b."id" = t."bookingId"
WHERE 
    b."userId" = $1 
    AND b."isDelete" = FALSE
    AND b."statusId" = $2
GROUP BY 
    b."id"
    ORDER BY
    b."eventId";`;
  }
  try {
    const result = await db.query(
      query,
      statusId != 0 ? [userId, statusId] : [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
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

// API: Tổng số booking theo từng sự kiện
const getTotalBookingsPerEvent = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.name AS "eventName", COUNT(b.id) AS "totalBookings"
      FROM bookings b
      JOIN events e ON b."eventId" = e.id
      WHERE b."isDelete" = false
      GROUP BY e.name
      ORDER BY "totalBookings" DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching total bookings per event:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getTopUsersByBookings = async (req, res) => {
  try {
    const queryText = `
      SELECT u."fullName", COUNT(b.id) as "totalBookings"
      FROM users u
      JOIN bookings b ON u.id = b."userId"
      WHERE b."isDelete" = false
      GROUP BY u."fullName"
      ORDER BY "totalBookings" DESC
      LIMIT 10;
    `;
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching top users by bookings:", err);
    res.status(500).send("Internal Server Error");
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

//Test
const formatDate =  (dateString) => {
  const date = new Date(dateString);

  // Lấy giờ, phút, ngày, tháng, và năm
  const hours = String(date.getUTCHours()).padStart(2, '0'); // Lấy giờ và đảm bảo 2 chữ số
  const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Lấy phút và đảm bảo 2 chữ số
  const day = String(date.getUTCDate()).padStart(2, '0'); // Lấy ngày và đảm bảo 2 chữ số
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Lấy tháng và đảm bảo 2 chữ số
  const year = date.getUTCFullYear(); // Lấy năm

  // Định dạng theo HH:mm DDMMYYYY
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
const sendMailBooking = async (email, booking, event,amount) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "eventhub173@gmail.com",
      pass: "jprz kvkb ncra wflf",
    },
  });
  booking.start = formatDate(event.startTime);
  booking.end = formatDate(event.endTime);
  console.log(booking);
  const mailOptions = {
    //Sửa nội dung
    from: "eventhub173@gmail.com",
    to: email,
    subject: "Booking confirmation",
    html: `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #379777;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .content h2 {
            font-size: 20px;
            color: #333333;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .details p {
            margin: 5px 0;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            color: #888888;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
            <h2>Hello, ${booking.mail}</h2>
            <p>Thank you for booking with EventHub! We are excited to confirm your reservation.</p>
            <p>Your booking details are as follows:</p>
            <div class="details">
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Event:</strong> ${event.name}</p>
         
<p><strong>Date & Time:</strong> ${booking.start + ' - ' + booking.end}</p>
          
<p><strong>Total Amount:</strong> ${amount.toLocaleString('vi-VN')}</p>
            </div>
            <p>If you have any questions or need to modify your booking, feel free to contact us at eventHub.support@gmail.com or call us at 0123456789.</p>
        </div>
        <div class="footer">
            <p>Thank you for choosing EventHub. Enjoy your event!</p>
            <p>&copy; 2024 EventHub. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const updateStatusBookingPaid = async (req, res) => {
  const { id } = req.params;
  const { vnp_Amount } = req.query;
  try {
    const result = await db.query(
      `UPDATE bookings SET "statusId" = 3, "modifiedTime" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Booking Not Found");
    }
    const createTicketResult = await ticketController.createMultipleTickets(
      result.rows[0].ticketInfo,
      result.rows[0].eventId,
      id
    );
    const event = await db.query(
      `SELECT e."name", e.id, e."startTime", e."endTime" FROM events e WHERE e.id = $1`,
      [result.rows[0].eventId]
    )
    console.log('Amount: ',vnp_Amount,event);
    const bill = await db.query(
      `INSERT INTO bills ("userId", "bookingId", total, "paymentMethodId", "statusId") 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [result.rows[0].userId, result.rows[0].id, vnp_Amount/100, 1, 1]
    );
    await sendMailBooking(result.rows[0].mail, result.rows[0],event.rows[0],vnp_Amount/100);
    // res.status(200).json(result.rows[0]);
    res.redirect(
      `http://localhost:3000/booking/${result.rows[0].id}/payment-success`
    );
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
  getTotalBookingsPerEvent,
  getTopUsersByBookings,
  updateBooking,
  softDeleteBooking,
  deleteBooking,
  updateStatusBookingPaid,
  getBookingByUserIdAndFilter,
};
