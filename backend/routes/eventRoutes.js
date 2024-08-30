// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Các endpoint liên quan đến sự kiện
router.post('/events', eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.get('/events/filter', eventController.getEventsByCategoryAndIsFree);
router.get('/search-by-name', eventController.searchEventsByName);
router.put('/events/:id', eventController.updateEvent);
router.put('/events/:id/soft-delete', eventController.softDeleteEvent);
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
