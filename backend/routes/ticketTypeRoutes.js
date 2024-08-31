const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');

router.post('/tickettypes', ticketTypeController.createTicketType);
router.get('/tickettypes', ticketTypeController.getAllTicketTypes);
router.get('/tickettypes/event/:eventId', ticketTypeController.getTicketTypesByEventId);
router.get('/tickettypes/:id', ticketTypeController.getTicketTypeById);
router.put('/tickettypes/:id', ticketTypeController.updateTicketType);
router.put('/tickettypes/:id/soft-delete', ticketTypeController.softDeleteTicketType);
router.delete('/tickettypes/:id', ticketTypeController.deleteTicketType);

module.exports = router;
