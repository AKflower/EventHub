// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Các endpoint liên quan đến sự kiện
router.post('/events', eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
