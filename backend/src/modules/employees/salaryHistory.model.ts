import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeSalaryHistory extends Document {
  employeeId: string;
  month: number;
  year: number;
  payableMonth: string;
  basicSalary: number;
  payableSalary: number;
  accountNumber: string;
  ifscCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const salaryHistorySchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, index: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    payableMonth: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    payableSalary: { type: Number, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of employeeId + month + year
salaryHistorySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IEmployeeSalaryHistory>(
  'EmployeeSalaryHistory',
  salaryHistorySchema
);
