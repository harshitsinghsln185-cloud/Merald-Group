import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import Employee from '../modules/employees/employee.model';
import Invoice from '../modules/invoices/invoice.model';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding initial Merald Group Enterprise SaaS employee dataset (No hardcoded admins)...');

    const empCount = await Employee.countDocuments();
    if (empCount === 0) {
      const demoEmps = [
        {
          srNo: 1,
          employeeId: 'EMP-1001',
          employeeCode: 'MGD-8041',
          name: 'Sarah Al-Mansoor',
          passportNumber: 'N9824152A',
          designation: 'Senior Project Engineer',
          site: 'Dubai South Megastructure',
          basicSalary: 18500,
          payableSalary: 18500,
          payableMonth: 'September 2026',
          accountNumber: 'AE480330000001294857102',
          ifscCode: 'EBILAE2DXXX',
          status: 'ACTIVE',
        },
        {
          srNo: 2,
          employeeId: 'EMP-1002',
          employeeCode: 'MGD-7392',
          name: 'David Richardson',
          passportNumber: 'Z3918504B',
          designation: 'Operations Director',
          site: 'Abu Dhabi Commercial Hub',
          basicSalary: 32000,
          payableSalary: 32000,
          payableMonth: 'September 2026',
          accountNumber: 'AE290220000009847361524',
          ifscCode: 'FABIAEADXXX',
          status: 'ACTIVE',
        },
      ];

      for (const eData of demoEmps) {
        const newEmp = await Employee.create(eData);
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
      console.log(`Seeded employee records. ZERO admin accounts created.`);
    }

    console.log('Seeding process finished.');
    process.exit(0);
  } catch (error: any) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
