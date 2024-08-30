const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.get('/bookings/by-date', bookingController.getBookingsByDate);
router.get('/bookings/total', bookingController.getTotalBookingsByMonth);
router.put('/bookings/:id', bookingController.updateBooking);
router.put('/bookings/:id/soft-delete', bookingController.softDeleteBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;
