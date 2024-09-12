const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const db = require("./db");
const cron = require("node-cron");

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
