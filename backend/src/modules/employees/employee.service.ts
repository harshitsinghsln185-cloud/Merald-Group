import Employee, { IEmployee, EmployeeStatusEnum } from './employee.model';
import EmployeeSalaryHistory from './salaryHistory.model';
import Invoice from '../invoices/invoice.model';
import * as XLSX from 'xlsx';

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

export function parseMonthYear(str: string): { month: number; year: number; formatted: string } {
  const currentYear = new Date().getFullYear();
  if (!str) return { month: new Date().getMonth() + 1, year: currentYear, formatted: 'September 2026' };

  const clean = str.trim();
  const parts = clean.split(/[\s,-]+/);
  let month = 9;
  let year = 2026;

  for (const part of parts) {
    const num = parseInt(part, 10);
    if (!isNaN(num)) {
      if (num >= 1900 && num <= 2100) {
        year = num;
      } else if (num >= 1 && num <= 12) {
        month = num;
      }
    } else {
      const lower = part.toLowerCase();
      const idx = MONTH_NAMES.findIndex((m) => m.startsWith(lower));
      if (idx !== -1) {
        month = idx + 1;
      }
    }
  }

  const mName = MONTH_NAMES[month - 1];
  const capitalized = mName.charAt(0).toUpperCase() + mName.slice(1);
  return { month, year, formatted: `${capitalized} ${year}` };
}

// Demo in-memory fallback list
let inMemoryEmployees: any[] = [
  {
    _id: 'emp_6501',
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
    paymentSlip: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    createdAt: new Date('2025-01-15'),
  },
  {
    _id: 'emp_6502',
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
    paymentSlip: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    createdAt: new Date('2025-02-10'),
  },
  {
    _id: 'emp_6503',
    srNo: 3,
    employeeId: 'EMP-1003',
    employeeCode: 'MGD-5120',
    name: 'Aisha Abdullah',
    passportNumber: 'K4829103C',
    designation: 'HR Lead & Talent Manager',
    site: 'Corporate HQ - Dubai Tower',
    basicSalary: 21000,
    payableSalary: 21000,
    payableMonth: 'September 2026',
    accountNumber: 'AE910400000004729104859',
    ifscCode: 'DIBKAEDUXXX',
    paymentSlip: '',
    status: 'ACTIVE',
    createdAt: new Date('2025-03-01'),
  },
  {
    _id: 'emp_6504',
    srNo: 4,
    employeeId: 'EMP-1004',
    employeeCode: 'MGD-4819',
    name: 'Marcus Vance',
    passportNumber: 'L7392019D',
    designation: 'Lead Architect',
    site: 'Sharjah Innovation Campus',
    basicSalary: 26500,
    payableSalary: 26500,
    payableMonth: 'September 2026',
    accountNumber: 'AE820500000001928374650',
    ifscCode: 'ADCBKAE2DXXX',
    paymentSlip: '',
    status: 'LEAVE',
    createdAt: new Date('2025-04-12'),
  },
  {
    _id: 'emp_6505',
    srNo: 5,
    employeeId: 'EMP-1005',
    employeeCode: 'MGD-3940',
    name: 'Priya Sharma',
    passportNumber: 'R1093847E',
    designation: 'Financial Controller',
    site: 'Corporate HQ - Dubai Tower',
    basicSalary: 24000,
    payableSalary: 24000,
    payableMonth: 'September 2026',
    accountNumber: 'AE120300000005839201948',
    ifscCode: 'ENBDUAE2DXXX',
    paymentSlip: '',
    status: 'ACTIVE',
    createdAt: new Date('2025-05-18'),
  },
  {
    _id: 'emp_6506',
    srNo: 6,
    employeeId: 'EMP-1006',
    employeeCode: 'MGD-2941',
    name: 'Tariq Hassan',
    passportNumber: 'P8492018F',
    designation: 'Site Logistics Manager',
    site: 'Ras Al Khaimah Depot',
    basicSalary: 14500,
    payableSalary: 14500,
    payableMonth: 'September 2026',
    accountNumber: 'AE650400000002847192039',
    ifscCode: 'RAKBUAE2DXXX',
    paymentSlip: '',
    status: 'INACTIVE',
    createdAt: new Date('2025-06-20'),
  },
];

let inMemorySalaryHistory: any[] = [
  {
    _id: 'sh_101',
    employeeId: 'EMP-1001',
    month: 9,
    year: 2026,
    payableMonth: 'September 2026',
    basicSalary: 18500,
    payableSalary: 18500,
    accountNumber: 'AE480330000001294857102',
    ifscCode: 'EBILAE2DXXX',
    createdAt: new Date('2026-09-01'),
  },
  {
    _id: 'sh_102',
    employeeId: 'EMP-1001',
    month: 8,
    year: 2026,
    payableMonth: 'August 2026',
    basicSalary: 18500,
    payableSalary: 18500,
    accountNumber: 'AE480330000001294857102',
    ifscCode: 'EBILAE2DXXX',
    createdAt: new Date('2026-08-01'),
  },
  {
    _id: 'sh_103',
    employeeId: 'EMP-1001',
    month: 7,
    year: 2026,
    payableMonth: 'July 2026',
    basicSalary: 18500,
    payableSalary: 18500,
    accountNumber: 'AE480330000001294857102',
    ifscCode: 'EBILAE2DXXX',
    createdAt: new Date('2026-07-01'),
  },
  {
    _id: 'sh_201',
    employeeId: 'EMP-1002',
    month: 9,
    year: 2026,
    payableMonth: 'September 2026',
    basicSalary: 32000,
    payableSalary: 32000,
    accountNumber: 'AE290220000009847361524',
    ifscCode: 'FABIAEADXXX',
    createdAt: new Date('2026-09-01'),
  },
  {
    _id: 'sh_202',
    employeeId: 'EMP-1002',
    month: 8,
    year: 2026,
    payableMonth: 'August 2026',
    basicSalary: 32000,
    payableSalary: 32000,
    accountNumber: 'AE290220000009847361524',
    ifscCode: 'FABIAEADXXX',
    createdAt: new Date('2026-08-01'),
  },
];

const generateIds = async () => {
  let count = 0;
  try {
    count = await Employee.countDocuments();
  } catch (err) {
    count = inMemoryEmployees.length;
  }

  const nextNum = count + 1001;
  const empId = `EMP-${nextNum}`;
  const empCode = `MGD-${Math.floor(1000 + Math.random() * 9000)}`;
  return { empId, empCode, srNo: count + 1 };
};

const upsertSalaryHistory = async (empData: any) => {
  const empId = empData.employeeId || empData._id;
  const monthInfo = parseMonthYear(empData.payableMonth);

  const payload = {
    employeeId: empId,
    month: monthInfo.month,
    year: monthInfo.year,
    payableMonth: monthInfo.formatted,
    basicSalary: Number(empData.basicSalary),
    payableSalary: Number(empData.payableSalary),
    accountNumber: empData.accountNumber,
    ifscCode: empData.ifscCode,
  };

  try {
    await EmployeeSalaryHistory.findOneAndUpdate(
      { employeeId: empId, month: monthInfo.month, year: monthInfo.year },
      payload,
      { upsert: true, new: true }
    );
  } catch (err) {
    const idx = inMemorySalaryHistory.findIndex(
      (h) => h.employeeId === empId && h.month === monthInfo.month && h.year === monthInfo.year
    );
    if (idx !== -1) {
      inMemorySalaryHistory[idx] = { ...inMemorySalaryHistory[idx], ...payload, updatedAt: new Date() };
    } else {
      inMemorySalaryHistory.push({ ...payload, _id: 'sh_' + Date.now(), createdAt: new Date() });
    }
  }
};

const createAutoInvoice = async (employee: any) => {
  const invNumber = `MGD-INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const payload = {
    invoiceNumber: invNumber,
    employeeId: employee.employeeId || employee._id,
    salaryDetails: {
      basicSalary: Number(employee.basicSalary),
      payableSalary: Number(employee.payableSalary),
      payableMonth: employee.payableMonth,
    },
    employeeDetails: {
      employeeCode: employee.employeeCode,
      name: employee.name,
      passportNumber: employee.passportNumber,
      designation: employee.designation,
      site: employee.site,
      accountNumber: employee.accountNumber,
      ifscCode: employee.ifscCode,
    },
    generatedDate: new Date(),
  };

  try {
    return await Invoice.create(payload);
  } catch (err) {
    return payload;
  }
};

export class EmployeeService {
  static async create(data: any) {
    const { empId, empCode, srNo } = await generateIds();

    try {
      const existing = await Employee.findOne({ passportNumber: data.passportNumber.toUpperCase() });
      if (existing) {
        throw new Error(`Employee with passport number ${data.passportNumber} already exists`);
      }

      const statusVal = (data.status ? data.status.toUpperCase() : 'ACTIVE') as EmployeeStatusEnum;

      const newEmp = await Employee.create({
        srNo,
        employeeId: empId,
        employeeCode: empCode,
        name: data.name,
        passportNumber: data.passportNumber.toUpperCase(),
        designation: data.designation,
        site: data.site,
        country: data.country || 'United Arab Emirates',
        state: data.state || 'Dubai',
        city: data.city || 'Dubai',
        phone: data.phone || '',
        basicSalary: Number(data.basicSalary),
        payableSalary: Number(data.payableSalary),
        payableMonth: data.payableMonth,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode.toUpperCase(),
        paymentSlip: data.paymentSlip || '',
        status: statusVal,
      });

      await upsertSalaryHistory(newEmp);
      const invoice = await createAutoInvoice(newEmp);
      return { employee: newEmp, invoice };
    } catch (dbErr: any) {
      if (dbErr.message && dbErr.message.includes('already exists')) throw dbErr;

      const statusVal = (data.status ? data.status.toUpperCase() : 'ACTIVE') as EmployeeStatusEnum;

      const mock = {
        _id: 'emp_' + Date.now(),
        srNo: inMemoryEmployees.length + 1,
        employeeId: empId,
        employeeCode: empCode,
        name: data.name,
        passportNumber: data.passportNumber.toUpperCase(),
        designation: data.designation,
        site: data.site,
        country: data.country || 'United Arab Emirates',
        state: data.state || 'Dubai',
        city: data.city || 'Dubai',
        phone: data.phone || '',
        basicSalary: Number(data.basicSalary),
        payableSalary: Number(data.payableSalary),
        payableMonth: data.payableMonth,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode.toUpperCase(),
        paymentSlip: data.paymentSlip || '',
        status: statusVal,
        createdAt: new Date(),
      };
      inMemoryEmployees.unshift(mock);
      await upsertSalaryHistory(mock);
      const invoice = await createAutoInvoice(mock);
      return { employee: mock, invoice };
    }
  }

  static async getAll(queryParams: any) {
    const {
      search = '',
      status = '',
      site = '',
      designation = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = queryParams;

    try {
      const query: any = {};

      if (status) {
        query.status = status.toUpperCase();
      }
      if (site) {
        query.site = { $regex: site, $options: 'i' };
      }
      if (designation) {
        query.designation = { $regex: designation, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { passportNumber: { $regex: search, $options: 'i' } },
          { employeeCode: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } },
          { site: { $regex: search, $options: 'i' } },
        ];
      }

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (Number(page) - 1) * Number(limit);
      const list = await Employee.find(query).sort(sortOptions).skip(skip).limit(Number(limit));
      const totalCount = await Employee.countDocuments(query);

      const allEmps = await Employee.find();
      const stats = {
        total: allEmps.length,
        active: allEmps.filter((e) => e.status === 'ACTIVE' || (e.status as any) === 'Active').length,
        inactive: allEmps.filter((e) => e.status === 'INACTIVE' || (e.status as any) === 'Inactive').length,
        leave: allEmps.filter((e) => e.status === 'LEAVE' || (e.status as any) === 'Leave').length,
        totalSalary: allEmps.reduce((acc, curr) => acc + (curr.payableSalary || 0), 0),
      };

      return {
        data: list,
        pagination: {
          total: totalCount,
          page: Number(page),
          pages: Math.ceil(totalCount / Number(limit)),
          limit: Number(limit),
        },
        stats,
      };
    } catch (dbErr) {
      let filtered = [...inMemoryEmployees];

      if (status) {
        filtered = filtered.filter((e) => e.status.toUpperCase() === status.toUpperCase());
      }
      if (site) {
        filtered = filtered.filter((e) => e.site.toLowerCase().includes(site.toLowerCase()));
      }
      if (designation) {
        filtered = filtered.filter((e) => e.designation.toLowerCase().includes(designation.toLowerCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.name.toLowerCase().includes(s) ||
            e.passportNumber.toLowerCase().includes(s) ||
            e.employeeCode.toLowerCase().includes(s) ||
            e.employeeId.toLowerCase().includes(s) ||
            e.designation.toLowerCase().includes(s) ||
            e.site.toLowerCase().includes(s)
        );
      }

      const total = filtered.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = filtered.slice(skip, skip + Number(limit));

      const stats = {
        total: inMemoryEmployees.length,
        active: inMemoryEmployees.filter((e) => e.status === 'ACTIVE' || e.status === 'Active').length,
        inactive: inMemoryEmployees.filter((e) => e.status === 'INACTIVE' || e.status === 'Inactive').length,
        leave: inMemoryEmployees.filter((e) => e.status === 'LEAVE' || e.status === 'Leave').length,
        totalSalary: inMemoryEmployees.reduce((acc, curr) => acc + (curr.payableSalary || 0), 0),
      };

      return {
        data: paginated,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
        stats,
      };
    }
  }

  static async getById(id: string) {
    try {
      const emp = await Employee.findOne({
        $or: [{ _id: id }, { employeeId: id }, { employeeCode: id }],
      });
      if (!emp) throw new Error('Employee record not found');
      return emp;
    } catch (err: any) {
      const found = inMemoryEmployees.find(
        (e) => e._id === id || e.employeeId === id || e.employeeCode === id
      );
      if (!found) throw new Error('Employee record not found');
      return found;
    }
  }

  static async update(id: string, updates: any) {
    if (updates.status) {
      updates.status = updates.status.toUpperCase();
    }

    try {
      const emp = await Employee.findOneAndUpdate(
        { $or: [{ _id: id }, { employeeId: id }] },
        updates,
        { new: true, runValidators: true }
      );
      if (!emp) throw new Error('Employee not found');
      await upsertSalaryHistory(emp);
      return emp;
    } catch (err) {
      const idx = inMemoryEmployees.findIndex((e) => e._id === id || e.employeeId === id);
      if (idx === -1) throw new Error('Employee not found');
      inMemoryEmployees[idx] = { ...inMemoryEmployees[idx], ...updates };
      await upsertSalaryHistory(inMemoryEmployees[idx]);
      return inMemoryEmployees[idx];
    }
  }

  static async delete(id: string) {
    try {
      const deleted = await Employee.findOneAndDelete({
        $or: [{ _id: id }, { employeeId: id }],
      });
      if (!deleted) throw new Error('Employee not found');
      return true;
    } catch (err) {
      const idx = inMemoryEmployees.findIndex((e) => e._id === id || e.employeeId === id);
      if (idx === -1) throw new Error('Employee not found');
      inMemoryEmployees.splice(idx, 1);
      return true;
    }
  }

  static async searchByPassport(passportNumber: string) {
    const pStr = passportNumber.toUpperCase();
    try {
      const emp = await Employee.findOne({ passportNumber: pStr });
      if (!emp) throw new Error(`No employee found with passport ${pStr}`);
      return emp;
    } catch (err) {
      const found = inMemoryEmployees.find((e) => e.passportNumber.toUpperCase() === pStr);
      if (!found) throw new Error(`No employee found with passport ${pStr}`);
      return found;
    }
  }

  static async searchByCode(employeeCode: string) {
    const cStr = employeeCode.toUpperCase();
    try {
      const emp = await Employee.findOne({
        $or: [{ employeeCode: cStr }, { employeeId: cStr }],
      });
      if (!emp) throw new Error(`No employee found with code ${cStr}`);
      return emp;
    } catch (err) {
      const found = inMemoryEmployees.find(
        (e) => e.employeeCode.toUpperCase() === cStr || e.employeeId.toUpperCase() === cStr
      );
      if (!found) throw new Error(`No employee found with code ${cStr}`);
      return found;
    }
  }

  static async generateExcelBuffer() {
    let list: any[] = [];
    try {
      list = await Employee.find().sort({ srNo: 1 });
    } catch (err) {
      list = inMemoryEmployees;
    }

    const excelData = list.map((emp, idx) => ({
      'Sr No': emp.srNo || idx + 1,
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

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 15 },
      { wch: 24 },
      { wch: 18 },
      { wch: 25 },
      { wch: 28 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Merald Group Employees');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  // Generate Excel Template Buffer for Admin Download
  static async generateImportTemplateBuffer() {
    const templateData = [
      {
        'Sr No': 1,
        'Employee Code': 'MGD-9101',
        'Employee Name': 'Alexander Wright',
        'Passport Number': 'A8492019X',
        'Designation': 'Senior Mechanical Engineer',
        'Site': 'Dubai Marina Project',
        'Basic Salary': 19500,
        'Payable Salary': 19500,
        'Month of Payable Salary': 'September 2026',
        'Account Number': 'AE100200000001928374651',
        'IFSC Code': 'ENBDUAE2DXXX',
        'Status': 'ACTIVE',
      },
      {
        'Sr No': 2,
        'Employee Code': 'MGD-9102',
        'Employee Name': 'Fatima Al-Zahra',
        'Passport Number': 'B7392018Y',
        'Designation': 'Site Safety Officer',
        'Site': 'Abu Dhabi Industrial Zone',
        'Basic Salary': 16000,
        'Payable Salary': 16000,
        'Month of Payable Salary': 'September 2026',
        'Account Number': 'AE900400000003829104820',
        'IFSC Code': 'FABIAEADXXX',
        'Status': 'ACTIVE',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
      { wch: 28 },
      { wch: 28 },
      { wch: 15 },
      { wch: 15 },
      { wch: 24 },
      { wch: 25 },
      { wch: 16 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Import Template');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  // Step 1: Read & Validate Excel File without saving to DB
  static async previewExcelImport(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('The uploaded Excel file contains no sheets');
    }
    const worksheet = workbook.Sheets[sheetName];
    const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      throw new Error('The uploaded Excel sheet contains no data rows');
    }

    // Fetch existing records for duplicate validation
    let existingEmps: any[] = [];
    try {
      existingEmps = await Employee.find({}, 'employeeCode passportNumber');
    } catch (err) {
      existingEmps = inMemoryEmployees;
    }

    const dbCodes = new Set(existingEmps.map((e) => String(e.employeeCode).trim().toUpperCase()));
    const dbPassports = new Set(existingEmps.map((e) => String(e.passportNumber).trim().toUpperCase()));

    const seenFileCodes = new Set<string>();
    const seenFilePassports = new Set<string>();

    const previewRows: any[] = [];
    let validCount = 0;
    let invalidCount = 0;

    rawRows.forEach((row, index) => {
      const rowNum = index + 1;
      const errors: string[] = [];

      // Flexible column mapping
      const srNo = Number(row['Sr No'] || row['srNo'] || rowNum);
      const employeeCode = String(row['Employee Code'] || row['employeeCode'] || '').trim().toUpperCase();
      const name = String(row['Employee Name'] || row['name'] || row['Name'] || '').trim();
      const passportNumber = String(row['Passport Number'] || row['passportNumber'] || '').trim().toUpperCase();
      const designation = String(row['Designation'] || row['designation'] || '').trim();
      const site = String(row['Site'] || row['site'] || '').trim();
      const basicSalary = Number(row['Basic Salary'] || row['basicSalary'] || 0);
      const payableSalary = Number(row['Payable Salary'] || row['payableSalary'] || 0);
      const payableMonth = String(row['Month of Payable Salary'] || row['Month'] || row['payableMonth'] || 'September 2026').trim();
      const accountNumber = String(row['Account Number'] || row['accountNumber'] || '').trim();
      const ifscCode = String(row['IFSC Code'] || row['IFSC'] || row['ifscCode'] || '').trim().toUpperCase();
      let status = String(row['Status'] || row['status'] || 'ACTIVE').trim().toUpperCase();

      // Normalize status
      if (status === 'ACTIVE' || status === 'ACTIVE') status = 'ACTIVE';
      else if (status === 'INACTIVE' || status === 'INACTIVE') status = 'INACTIVE';
      else if (status === 'LEAVE' || status === 'ON LEAVE' || status === 'LEAVE') status = 'LEAVE';

      // Validation Checks
      if (!employeeCode) {
        errors.push('Employee Code is required');
      } else {
        if (dbCodes.has(employeeCode)) {
          errors.push('Employee Code already exists');
        }
        if (seenFileCodes.has(employeeCode)) {
          errors.push('Duplicate Employee Code in Excel file');
        }
        seenFileCodes.add(employeeCode);
      }

      if (!name) {
        errors.push('Employee Name is required');
      }

      if (!passportNumber) {
        errors.push('Passport Number is required');
      } else {
        if (dbPassports.has(passportNumber)) {
          errors.push('Passport Number already exists');
        }
        if (seenFilePassports.has(passportNumber)) {
          errors.push('Duplicate Passport Number in Excel file');
        }
        seenFilePassports.add(passportNumber);
      }

      if (!designation) {
        errors.push('Designation is required');
      }

      if (!site) {
        errors.push('Site location is required');
      }

      if (isNaN(basicSalary) || basicSalary <= 0) {
        errors.push('Basic Salary must be a positive number');
      }

      if (isNaN(payableSalary) || payableSalary <= 0) {
        errors.push('Payable Salary is invalid');
      }

      if (!['ACTIVE', 'INACTIVE', 'LEAVE'].includes(status)) {
        errors.push('Status must be ACTIVE, INACTIVE or LEAVE');
      }

      if (!accountNumber) {
        errors.push('Account Number is required');
      }

      if (!ifscCode) {
        errors.push('IFSC Code is required');
      }

      const isValid = errors.length === 0;
      if (isValid) validCount++;
      else invalidCount++;

      previewRows.push({
        rowNum,
        srNo,
        employeeCode: employeeCode || `MGD-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        passportNumber,
        designation,
        site,
        basicSalary,
        payableSalary,
        payableMonth,
        accountNumber,
        ifscCode,
        status: isValid ? status : (status || 'ACTIVE'),
        isValid,
        errors,
      });
    });

    return {
      totalRows: rawRows.length,
      validCount,
      invalidCount,
      rows: previewRows,
    };
  }

  // Step 2: Confirm & Save validated Excel rows into MongoDB
  static async confirmExcelImport(rowsToImport: any[]) {
    if (!rowsToImport || rowsToImport.length === 0) {
      throw new Error('No employee rows provided to confirm import');
    }

    const importedEmployees: any[] = [];
    const failedRows: any[] = [];

    for (const row of rowsToImport) {
      try {
        const { empId, empCode, srNo } = await generateIds();
        const statusVal = (row.status ? row.status.toUpperCase() : 'ACTIVE') as EmployeeStatusEnum;

        const payload = {
          srNo: row.srNo || srNo,
          employeeId: empId,
          employeeCode: row.employeeCode || empCode,
          name: row.name,
          passportNumber: row.passportNumber.toUpperCase(),
          designation: row.designation,
          site: row.site,
          basicSalary: Number(row.basicSalary),
          payableSalary: Number(row.payableSalary),
          payableMonth: row.payableMonth || 'September 2026',
          accountNumber: row.accountNumber,
          ifscCode: row.ifscCode.toUpperCase(),
          paymentSlip: '',
          status: statusVal,
        };

        let savedDoc: any = null;
        try {
          savedDoc = await Employee.create(payload);
        } catch (dbErr: any) {
          savedDoc = {
            ...payload,
            _id: 'emp_' + Date.now() + Math.floor(Math.random() * 1000),
            createdAt: new Date(),
          };
          inMemoryEmployees.unshift(savedDoc);
        }

        await upsertSalaryHistory(savedDoc);
        await createAutoInvoice(savedDoc);
        importedEmployees.push(savedDoc);
      } catch (err: any) {
        failedRows.push({
          rowNum: row.rowNum,
          employeeCode: row.employeeCode,
          name: row.name,
          reason: err.message || 'Import failed',
        });
      }
    }

    return {
      success: true,
      totalProcessed: rowsToImport.length,
      importedCount: importedEmployees.length,
      failedCount: failedRows.length,
      importedEmployees,
      failedRows,
    };
  }

  // Salary History list for an employee
  static async getSalaryHistory(employeeId: string) {
    try {
      const emp = await this.getById(employeeId);
      const eId = emp.employeeId || emp._id;
      let historyList = await EmployeeSalaryHistory.find({ employeeId: eId }).sort({ year: -1, month: -1 });

      if (historyList.length === 0) {
        // Build initial salary history record from current employee profile
        await upsertSalaryHistory(emp);
        historyList = await EmployeeSalaryHistory.find({ employeeId: eId }).sort({ year: -1, month: -1 });
      }

      return historyList;
    } catch (err) {
      const emp = await this.getById(employeeId);
      const eId = emp.employeeId || emp._id;
      let historyList = inMemorySalaryHistory.filter((h) => h.employeeId === eId);

      if (historyList.length === 0) {
        await upsertSalaryHistory(emp);
        historyList = inMemorySalaryHistory.filter((h) => h.employeeId === eId);
      }

      return historyList.sort((a, b) => b.year - a.year || b.month - a.month);
    }
  }

  // Dynamic Payment Slip Data (No PDF file storage in DB!)
  static async getPaymentSlipData(employeeId: string, monthParam?: any, yearParam?: any) {
    const emp = await this.getById(employeeId);
    const eId = emp.employeeId || emp._id;

    let targetMonth = Number(monthParam);
    let targetYear = Number(yearParam);

    if (!targetMonth || !targetYear) {
      const parsed = parseMonthYear(emp.payableMonth);
      targetMonth = parsed.month;
      targetYear = parsed.year;
    }

    let historyRecord: any = null;
    try {
      historyRecord = await EmployeeSalaryHistory.findOne({
        employeeId: eId,
        month: targetMonth,
        year: targetYear,
      });
    } catch (err) {
      historyRecord = inMemorySalaryHistory.find(
        (h) => h.employeeId === eId && h.month === targetMonth && h.year === targetYear
      );
    }

    // Check if employee's current payableMonth matches target requested month/year
    const empParsed = parseMonthYear(emp.payableMonth);
    if (!historyRecord && empParsed.month === targetMonth && empParsed.year === targetYear) {
      historyRecord = {
        employeeId: eId,
        month: targetMonth,
        year: targetYear,
        payableMonth: emp.payableMonth,
        basicSalary: emp.basicSalary,
        payableSalary: emp.payableSalary,
        accountNumber: emp.accountNumber,
        ifscCode: emp.ifscCode,
      };
    }

    if (!historyRecord) {
      throw new Error(`No payment data available for ${MONTH_NAMES[targetMonth - 1]?.toUpperCase() || targetMonth} ${targetYear}.`);
    }

    const slipNumber = `MGD-PS-${targetYear}${String(targetMonth).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      paymentSlipNumber: slipNumber,
      employee: {
        id: emp._id,
        employeeId: emp.employeeId,
        employeeCode: emp.employeeCode,
        name: emp.name,
        passportNumber: emp.passportNumber,
        designation: emp.designation,
        site: emp.site,
      },
      salary: {
        basicSalary: historyRecord.basicSalary,
        payableSalary: historyRecord.payableSalary,
        salaryMonth: MONTH_NAMES[targetMonth - 1]?.toUpperCase() || 'SEPTEMBER',
        salaryYear: targetYear,
        payableMonthStr: historyRecord.payableMonth || `${MONTH_NAMES[targetMonth - 1]} ${targetYear}`,
      },
      bank: {
        accountNumber: historyRecord.accountNumber || emp.accountNumber,
        ifscCode: historyRecord.ifscCode || emp.ifscCode,
      },
      paymentInfo: {
        status: 'PAID',
        generatedDate: new Date(),
      },
    };
  }
}
