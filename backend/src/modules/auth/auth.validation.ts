import { z } from 'zod';

export const registerAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid corporate email address'),
    country: z.string().min(2, 'Country is required'),
    city: z.string().min(2, 'City is required'),
    officeAddress: z.string().min(5, 'Office address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginAdminSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
