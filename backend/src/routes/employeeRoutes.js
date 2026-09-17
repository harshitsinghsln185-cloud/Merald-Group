const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchByPassport,
  searchByCode,
  exportEmployeesExcel,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

// Export route placed before :id route
router.get('/export', protect, exportEmployeesExcel);

// Search routes
router.get('/search/passport/:passportNumber', protect, searchByPassport);
router.get('/search/code/:employeeCode', protect, searchByCode);

// Main CRUD routes
router.post('/create', protect, createEmployee);
router.get('/', protect, getEmployees);
router.get('/:id', protect, getEmployeeById);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
