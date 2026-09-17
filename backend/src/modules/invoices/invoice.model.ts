import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  employeeId: string;
  salaryDetails: {
    basicSalary: number;
    payableSalary: number;
    payableMonth: string;
  };
  employeeDetails: {
    employeeCode: string;
    name: string;
    passportNumber: string;
    designation: string;
    site: string;
    accountNumber: string;
    ifscCode: string;
  };
  generatedDate: Date;
}

const invoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true },
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
    generatedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
