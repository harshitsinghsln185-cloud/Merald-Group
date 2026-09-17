require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const Invoice = require('../models/Invoice');
const { inMemoryEmployees } = require('../controllers/employeeController');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding initial Merald Group Enterprise dataset...');

    // Seed Admin
    const adminExists = await Admin.findOne({ email: 'admin@meraldgroup.com' });
    if (!adminExists) {
      await Admin.create({
        name: 'Merald Executive Admin',
        email: 'admin@meraldgroup.com',
        country: 'United Arab Emirates',
        city: 'Dubai',
        officeAddress: 'Merald Tower, Level 24, Financial Center Road, Downtown Dubai',
        password: 'admin123',
      });
      console.log('Default Admin Created -> Email: admin@meraldgroup.com | Password: admin123');
    } else {
      console.log('Admin account already exists.');
    }

    // Seed Employees
    const empCount = await Employee.countDocuments();
    if (empCount === 0) {
      for (const empData of inMemoryEmployees) {
        const { _id, ...cleanData } = empData;
        const newEmp = await Employee.create(cleanData);

        // Auto create invoice
        const invNumber = `MGD-INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        await Invoice.create({
          invoiceNumber: invNumber,
          employeeId: newEmp.employeeId,
          salaryDetails: {
            basicSalary: newEmp.basicSalary,
            payableSalary: newEmp.payableSalary,
            payableMonth: newEmp.payableMonth,
          },
          employeeDetails: {
            employeeCode: newEmp.employeeCode,
            name: newEmp.name,
            passportNumber: newEmp.passportNumber,
            designation: newEmp.designation,
            site: newEmp.site,
            accountNumber: newEmp.accountNumber,
            ifscCode: newEmp.ifscCode,
          },
          generatedDate: new Date(),
        });
      }
      console.log(`Seeded ${inMemoryEmployees.length} initial employees & generated invoices.`);
    } else {
      console.log(`Employee records already present (${empCount} records).`);
    }

    console.log('Seeding process complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
