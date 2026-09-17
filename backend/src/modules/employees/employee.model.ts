import mongoose, { Schema, Document } from 'mongoose';

export type EmployeeStatusEnum = 'ACTIVE' | 'INACTIVE' | 'LEAVE';

export interface IEmployee extends Document {
  srNo: number;
  employeeId: string;
  employeeCode: string;
  name: string;
  passportNumber: string;
  designation: string;
  site: string;
  country?: string;
  state?: string;
  city?: string;
  phone?: string;
  basicSalary: number;
  payableSalary: number;
  payableMonth: string;
  accountNumber: string;
  ifscCode: string;
  paymentSlip?: string;
  status: EmployeeStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema: Schema = new Schema(
  {
    srNo: { type: Number },
    employeeId: { type: String, required: true, unique: true, index: true },
    employeeCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    passportNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    designation: { type: String, required: true, trim: true },
    site: { type: String, required: true, trim: true },
    country: { type: String, default: 'United Arab Emirates', trim: true },
    state: { type: String, default: 'Dubai', trim: true },
    city: { type: String, default: 'Dubai', trim: true },
    phone: { type: String, default: '', trim: true },
    basicSalary: { type: Number, required: true },
    payableSalary: { type: Number, required: true },
    payableMonth: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    ifscCode: { type: String, required: true, uppercase: true, trim: true },
    paymentSlip: { type: String, default: '' },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'LEAVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

employeeSchema.index({ name: 'text', designation: 'text', site: 'text' });

export default mongoose.model<IEmployee>('Employee', employeeSchema);
