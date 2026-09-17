const express = require('express');
const router = express.Router();
const {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  forgotPassword,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getAdminProfile);

module.exports = router;
