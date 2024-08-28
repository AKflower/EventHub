// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Routes VNPay
router.post('/pay/vnpay', paymentController.payWithVNPay);
router.post('/notify/vnpay', paymentController.vnpNotify);
router.get('/return/vnpay', paymentController.vnpReturn);

// Routes MoMo
router.post('/pay/momo', paymentController.payWithMoMo);
router.post('/notify/momo', paymentController.momoNotify);
router.get('/return/momo', paymentController.momoReturn);

module.exports = router;
