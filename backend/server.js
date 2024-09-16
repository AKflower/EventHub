const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const db = require("./db");
const cron = require("node-cron");
const moment = require('moment')
const nodemailer = require("nodemailer");

const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketTypeRoutes = require("./routes/ticketTypeRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const billRoutes = require('./routes/billRoutes');

cron.schedule("* * * * *", async () => {
  try {
    const deleteQuery = `
          DELETE FROM bookings 
          WHERE "statusId" IN (1, 2) 
          AND "createdTime" < NOW() - INTERVAL '1 minutes';
      `;
    await db.query(deleteQuery);
    console.log("Cron job executed: Outdated bookings deleted");
  } catch (error) {
    console.error("Error deleting outdated bookings:", error);
  }
});

const updateEventStatus = async () => {
  try {
    const queryText = `
      SELECT id, "startTime", "endTime", "statusId"
      FROM events
      WHERE "isDelete" = false AND "statusId" IN (1, 2);
    `;
    const result = await db.query(queryText);
    const now = moment();

    for (const event of result.rows) {
      let newStatusId = event.statusId;

      if (now.isBetween(event.startTime, event.endTime)) {
        newStatusId = 2;  
      } else if (now.isAfter(event.endTime)) {
        newStatusId = 3;  
      }

      if (newStatusId !== event.statusId) {
        await db.query(`
          UPDATE events
          SET "statusId" = $1
          WHERE id = $2;
        `, [newStatusId, event.id]);
      }
    }
  } catch (err) {
    console.error("Error updating event status:", err);
  }
};

cron.schedule('*/1 * * * *', updateEventStatus);

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
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await db.query(`
      SELECT e.name, e."startTime", b.mail
      FROM events e
      JOIN bookings b ON e.id = b."eventId"
      WHERE e."isDelete" = false 
        AND e."isActive" = true 
        AND e."statusId" != 3
        AND e."startTime"::date BETWEEN CURRENT_DATE + INTERVAL '1 day' AND CURRENT_DATE + INTERVAL '2 day'
	    GROUP BY e.id, b.mail
    `);

    const events = result.rows;

    for (const event of events) {
      const { name, startTime, mail } = event;
      var start = formatDate(startTime)
      const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'eventhub173@gmail.com', 
          pass: 'jprz kvkb ncra wflf',  
        },
      });
    
      const mailOptions = {
        from: 'eventhub173@gmail.com',
        to: mail,
        subject: `Reminder: Event "${name}" is happening tomorrow!`,
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
            <h1>Reminder</h1>
        </div>
        <div class="content">
            <h2>Hello, ${mail}</h2>
            <p>  This is a reminder that the event "${name}" you registered for will take place tomorrow at ${start}.\n\n
            We look forward to seeing you there!</p>
            <p>Your booking details are as follows:</p>
            <div class="details">
                <p><strong>Event:</strong> ${name}</p>
         
                <p><strong>Date & Time:</strong> ${start}</p>
          
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
    }

    console.log('Emails sent successfully');
  } catch (err) {
    console.error('Error sending event reminders:', err);
  }
});

app.use(cors());

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", bookingRoutes);
app.use("/api", eventRoutes);
app.use("/api", ticketTypeRoutes);
app.use("/api", ticketRoutes);
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", galleryRoutes);
app.use('/api', billRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
