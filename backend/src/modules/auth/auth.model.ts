import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  country: string;
  state?: string;
  city: string;
  officeAddress: string;
  phone?: string;
  password: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const adminSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    country: { type: String, required: true, trim: true },
    state: { type: String, default: '', trim: true },
    city: { type: String, required: true, trim: true },
    officeAddress: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: true, minlength: 6 },
    status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

adminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IAdmin>('Admin', adminSchema);
