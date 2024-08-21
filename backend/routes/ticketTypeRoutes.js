// routes/ticketTypeRoutes.js
const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');

// Các endpoint liên quan đến loại vé
router.post('/tickettypes', ticketTypeController.createTicketType);
router.get('/tickettypes', ticketTypeController.getAllTicketTypes);
router.get('/tickettypes/:id', ticketTypeController.getTicketTypeById);
router.put('/tickettypes/:id', ticketTypeController.updateTicketType);
router.delete('/tickettypes/:id', ticketTypeController.deleteTicketType);

module.exports = router;
