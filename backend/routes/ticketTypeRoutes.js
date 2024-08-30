const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');

router.post('/tickettypes', ticketTypeController.createTicketType);
router.get('/tickettypes', ticketTypeController.getAllTicketTypes);
router.get('/tickettypes/:id', ticketTypeController.getTicketTypeById);
router.get('/tickettypes/:eventid', ticketTypeController.getTicketTypesByEventId);
router.put('/tickettypes/:id', ticketTypeController.updateTicketType);
router.put('/tickettypes/:id/soft-delete', ticketTypeController.softDeleteTicketType);
router.delete('/tickettypes/:id', ticketTypeController.deleteTicketType);

module.exports = router;
