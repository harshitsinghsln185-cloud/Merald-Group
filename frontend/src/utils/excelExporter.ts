import * as XLSX from 'xlsx';
import type { Employee } from '../types';

export const exportEmployeesToExcel = (employees: Employee[]) => {
  const formattedData = employees.map((emp, index) => ({
    'Sr No': emp.srNo || index + 1,
    'Employee Code': emp.employeeCode,
    'Employee Name': emp.name,
    'Passport Number': emp.passportNumber,
    'Designation': emp.designation,
    'Site': emp.site,
    'Basic Salary': emp.basicSalary,
    'Payable Salary': emp.payableSalary,
    'Month': emp.payableMonth,
    'Account Number': emp.accountNumber,
    'IFSC Code': emp.ifscCode,
    'Status': emp.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set custom column widths for readability
  worksheet['!cols'] = [
    { wch: 8 },  // Sr No
    { wch: 16 }, // Employee Code
    { wch: 24 }, // Employee Name
    { wch: 18 }, // Passport Number
    { wch: 25 }, // Designation
    { wch: 28 }, // Site
    { wch: 15 }, // Basic Salary
    { wch: 15 }, // Payable Salary
    { wch: 18 }, // Month
    { wch: 26 }, // Account Number
    { wch: 15 }, // IFSC Code
    { wch: 12 }, // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Merald Group Employees');

  const fileName = `Merald_Group_Employee_Records_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
