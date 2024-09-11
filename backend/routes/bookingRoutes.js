const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/user/:userId', bookingController.getBookingByUserIdAndFilter);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/by-date', bookingController.getBookingsByDate);
router.get('/bookings/total', bookingController.getTotalBookingsByMonth);
router.get('/bookings/total-per-event', bookingController.getTotalBookingsPerEvent);
router.get('/bookings/top-user', bookingController.getTopUsersByBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.get('/bookings/:id/paysuccess', bookingController.updateStatusBookingPaid);
router.put('/bookings/:id/soft-delete', bookingController.softDeleteBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;
