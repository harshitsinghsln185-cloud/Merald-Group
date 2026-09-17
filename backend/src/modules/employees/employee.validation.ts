import { z } from 'zod';

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Employee name is required'),
    passportNumber: z.string().min(3, 'Passport number is required'),
    designation: z.string().min(2, 'Designation is required'),
    site: z.string().min(2, 'Site location is required'),
    basicSalary: z.number().min(0, 'Basic salary must be positive'),
    payableSalary: z.number().min(0, 'Payable salary must be positive'),
    payableMonth: z.string().min(3, 'Payable month is required'),
    accountNumber: z.string().min(5, 'Account number is required'),
    ifscCode: z.string().min(3, 'IFSC / SWIFT code is required'),
    paymentSlip: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'LEAVE', 'Active', 'Inactive', 'Leave']).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    passportNumber: z.string().optional(),
    designation: z.string().optional(),
    site: z.string().optional(),
    basicSalary: z.number().optional(),
    payableSalary: z.number().optional(),
    payableMonth: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
    paymentSlip: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'LEAVE', 'Active', 'Inactive', 'Leave']).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
  }),
});
