const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      ref: 'Employee',
    },
    salaryDetails: {
      basicSalary: { type: Number, required: true },
      payableSalary: { type: Number, required: true },
      payableMonth: { type: String, required: true },
    },
    employeeDetails: {
      employeeCode: String,
      name: String,
      passportNumber: String,
      designation: String,
      site: String,
      accountNumber: String,
      ifscCode: String,
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
