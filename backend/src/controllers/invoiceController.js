const Invoice = require('../models/Invoice');
const Employee = require('../models/Employee');
const { inMemoryEmployees } = require('./employeeController');

// @desc    Get or generate invoice for employee
// @route   GET /api/invoice/:employeeId
// @access  Private
const getInvoiceByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    try {
      // Find existing invoice or create one
      let invoice = await Invoice.findOne({ employeeId });

      if (!invoice) {
        // Find employee
        const employee = await Employee.findOne({
          $or: [{ _id: employeeId }, { employeeId }, { employeeCode: employeeId }],
        });

        if (!employee) {
          return res.status(404).json({ success: false, message: 'Employee not found for invoice generation' });
        }

        const invNumber = `MGD-INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        invoice = await Invoice.create({
          invoiceNumber: invNumber,
          employeeId: employee.employeeId || employee._id,
          salaryDetails: {
            basicSalary: Number(employee.basicSalary),
            payableSalary: Number(employee.payableSalary),
            payableMonth: employee.payableMonth,
          },
          employeeDetails: {
            employeeCode: employee.employeeCode,
            name: employee.name,
            passportNumber: employee.passportNumber,
            designation: employee.designation,
            site: employee.site,
            accountNumber: employee.accountNumber,
            ifscCode: employee.ifscCode,
          },
          generatedDate: new Date(),
        });
      }

      return res.json({ success: true, invoice });
    } catch (dbErr) {
      // Fallback demo mode
      const emp = inMemoryEmployees.find(
        (e) => e._id === employeeId || e.employeeId === employeeId || e.employeeCode === employeeId
      );

      if (!emp) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      const invNumber = `MGD-INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const demoInvoice = {
        _id: 'inv_' + Date.now(),
        invoiceNumber: invNumber,
        employeeId: emp.employeeId,
        salaryDetails: {
          basicSalary: emp.basicSalary,
          payableSalary: emp.payableSalary,
          payableMonth: emp.payableMonth,
        },
        employeeDetails: {
          employeeCode: emp.employeeCode,
          name: emp.name,
          passportNumber: emp.passportNumber,
          designation: emp.designation,
          site: emp.site,
          accountNumber: emp.accountNumber,
          ifscCode: emp.ifscCode,
        },
        generatedDate: new Date(),
      };

      return res.json({ success: true, invoice: demoInvoice });
    }
  } catch (error) {
    console.error('Invoice controller error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve or generate invoice' });
  }
};

module.exports = {
  getInvoiceByEmployeeId,
};
