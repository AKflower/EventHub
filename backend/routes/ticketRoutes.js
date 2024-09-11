const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/tickets', ticketController.createTicket);
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/total-per-type', ticketController.getTotalTicketsSoldPerType);
router.get('/tickets/per-date', ticketController.getTicketsSoldByDay);
router.get('/tickets/:id', ticketController.getTicketById);
router.put('/tickets/:id', ticketController.updateTicket);
router.put('/tickets/:id/soft-delete', ticketController.softDeleteTicket);
router.delete('/tickets/:id', ticketController.deleteTicket);

module.exports = router;
