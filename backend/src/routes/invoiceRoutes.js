const express = require('express');
const router = express.Router();
const { getInvoiceByEmployeeId } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/:employeeId', protect, getInvoiceByEmployeeId);

module.exports = router;
