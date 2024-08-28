// server.js
const express = require('express');
const app = express();
const port = 3000;

const db = require('./db'); // Kết nối tới PostgreSQL
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketTypeRoutes = require('./routes/ticketTypeRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', eventRoutes);
app.use('/api', ticketTypeRoutes);
app.use('/api', ticketRoutes);
app.use('/api', authRoutes);
app.use('/api', paymentRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
