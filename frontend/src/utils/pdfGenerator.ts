import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Employee, Invoice } from '../types';

export const generatePDFInvoice = (employee: Employee, invoice?: Invoice | null) => {
  const doc = new jsPDF();
  const invNumber = invoice?.invoiceNumber || `MGD-INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = invoice?.generatedDate
    ? new Date(invoice.generatedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  // Color Palette
  const primaryColor = [11, 25, 44]; // #0B192C (Deep Navy)
  const accentColor = [16, 185, 129]; // #10B981 (Emerald)
  const darkGray = [51, 65, 85];
  const lightBg = [248, 250, 252];

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Emerald Accent Line
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 38, 210, 3, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MERALD GROUP', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('ENTERPRISE HR & SALARY MANAGEMENT SYSTEM', 14, 29);

  // Document Title & Invoice Number
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL PAYROLL INVOICE', 135, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${invNumber}`, 135, 25);
  doc.text(`Issue Date: ${dateStr}`, 135, 30);

  // Employee Information Section
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, 48, 182, 45, 3, 3, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE INFORMATION', 20, 57);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Code:', 20, 66);
  doc.text('Employee Name:', 20, 73);
  doc.text('Passport Number:', 20, 80);
  doc.text('Designation:', 20, 87);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(employee.employeeCode, 58, 66);
  doc.text(employee.name, 58, 73);
  doc.text(employee.passportNumber, 58, 80);
  doc.text(employee.designation, 58, 87);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Site Location:', 115, 66);
  doc.text('Employee ID:', 115, 73);
  doc.text('Status:', 115, 80);
  doc.text('Payable Month:', 115, 87);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(employee.site, 148, 66);
  doc.text(employee.employeeId, 148, 73);
  doc.text(employee.status, 148, 80);
  doc.text(employee.payableMonth, 148, 87);

  // Salary Table
  autoTable(doc, {
    startY: 100,
    head: [['Description', 'Month', 'Currency', 'Amount']],
    body: [
      ['Basic Employee Salary', employee.payableMonth, 'AED / USD', `$${employee.basicSalary.toLocaleString()}`],
      ['Payable Compensation', employee.payableMonth, 'AED / USD', `$${employee.payableSalary.toLocaleString()}`],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [11, 25, 44],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9.5,
      cellPadding: 6,
    },
  });

  // Total Salary Calculation Box
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 135;

  doc.setFillColor(240, 253, 244); // Light emerald green tint
  doc.roundedRect(120, finalY + 8, 76, 25, 3, 3, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(120, finalY + 8, 76, 25, 3, 3, 'S');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAYABLE SALARY', 125, finalY + 18);

  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text(`$${employee.payableSalary.toLocaleString()}`, 125, finalY + 28);

  // Bank Information Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, finalY + 8, 100, 25, 3, 3, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DISBURSEMENT BANK DETAILS', 18, finalY + 17);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Account No: ${employee.accountNumber}`, 18, finalY + 23);
  doc.text(`SWIFT / IFSC Code: ${employee.ifscCode}`, 18, finalY + 29);

  // Footer Authorization Stamp
  const footerY = finalY + 45;
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY, 196, footerY);

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Merald Group Corporate Office • Level 24, Financial Center Road, Downtown Dubai', 14, footerY + 8);
  doc.text('This invoice is an official computer-generated document authorized by Merald Group HR Department.', 14, footerY + 14);

  // Authorized Stamp
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(140, footerY + 2, 50, 18, 2, 2, 'S');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('MERALD GROUP', 148, footerY + 9);
  doc.text('AUTHORIZED PAYROLL', 143, footerY + 14);

  // Save the PDF
  doc.save(`Merald_Group_Invoice_${employee.employeeCode}_${employee.payableMonth.replace(/\s+/g, '_')}.pdf`);
};
