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
        html: `Dear customer,\n\n
                    This is a reminder that the event "${name}" you registered for will take place tomorrow at ${startTime}.\n\n
                    We look forward to seeing you there!`,
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
