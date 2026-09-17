const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    srNo: {
      type: Number,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    passportNumber: {
      type: String,
      required: [true, 'Passport number is required'],
      trim: true,
      uppercase: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    site: {
      type: String,
      required: [true, 'Site location is required'],
      trim: true,
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
    },
    payableSalary: {
      type: Number,
      required: [true, 'Payable salary is required'],
    },
    payableMonth: {
      type: String,
      required: [true, 'Payable month is required'],
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      trim: true,
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required'],
      trim: true,
      uppercase: true,
    },
    paymentSlip: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Leave'],
      default: 'Active',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search
employeeSchema.index({ passportNumber: 1 });
employeeSchema.index({ employeeCode: 1 });
employeeSchema.index({ name: 'text', designation: 'text', site: 'text' });

module.exports = mongoose.model('Employee', employeeSchema);
