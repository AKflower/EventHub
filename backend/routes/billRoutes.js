const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/bills', billController.getAllBills);
router.get('/bills/total-revenue', billController.getTotalRevenueByEvent);
router.get('/bills/:id', billController.getBillById);
router.post('/bills', billController.createBill);
router.put('/bills/:id', billController.updateBill);
router.put('/bills/:id/soft-delete', billController.softDeleteBill);
router.delete('/bills/:id', billController.deleteBill);

module.exports = router;
