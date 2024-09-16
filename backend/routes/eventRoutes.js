// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Các endpoint liên quan đến sự kiện
router.post('/events', eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/filter', eventController.getEventsByCategoryAndIsFree);
router.get('/events/by-date', eventController.getEventsByDate);
router.get('/events/search', eventController.searchEvents);
router.get('/events/count-by-city', eventController.getEventCountByCity);
router.get('/events/count-by-category', eventController.getEventCountByCategory);
router.get('/events/:quantity/top', eventController.getTop8EventsByTicketSales);
router.get('/events/created-by/:createdById', eventController.getEventsByCreatedById);
router.get('/events/:id', eventController.getEventById);
router.get('/search-by-name', eventController.searchEventsByName);
router.patch('/events/:id/active', eventController.patchEventIsActive);
router.put('/events/:id', eventController.updateEvent);
router.put('/events/:id/soft-delete', eventController.softDeleteEvent);
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
