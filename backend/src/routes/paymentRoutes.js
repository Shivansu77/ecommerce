const express = require('express');
const { createPaymentOrder, verifyPayment, getRazorpayKey } = require('../controller/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/razorpay-key', protect, getRazorpayKey);

module.exports = router;
