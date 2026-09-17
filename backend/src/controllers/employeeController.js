const Employee = require('../models/Employee');
const Invoice = require('../models/Invoice');
const XLSX = require('xlsx');

// Sample initial seed employees for fallback/demo
let inMemoryEmployees = [
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
    status: 'Active',
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
    status: 'Active',
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
    status: 'Active',
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
    status: 'Leave',
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
    status: 'Active',
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
    status: 'Inactive',
    createdAt: new Date('2025-06-20'),
  }
];

// Helper to auto generate IDs
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

// Helper to auto create invoice
const createAutoInvoice = async (employee) => {
  const invNumber = `MGD-INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceData = {
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
    return await Invoice.create(invoiceData);
  } catch (err) {
    return invoiceData;
  }
};

// @desc    Create Employee
// @route   POST /api/employees/create
// @access  Private
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      passportNumber,
      designation,
      site,
      basicSalary,
      payableSalary,
      payableMonth,
      accountNumber,
      ifscCode,
      paymentSlip,
      status,
    } = req.body;

    if (
      !name ||
      !passportNumber ||
      !designation ||
      !site ||
      basicSalary === undefined ||
      payableSalary === undefined ||
      !payableMonth ||
      !accountNumber ||
      !ifscCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required employee fields. Please complete all form inputs.',
      });
    }

    const { empId, empCode, srNo } = await generateIds();

    try {
      // Check existing passport in DB
      const existing = await Employee.findOne({ passportNumber: passportNumber.toUpperCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `An employee with passport number ${passportNumber} already exists.`,
        });
      }

      const newEmp = await Employee.create({
        srNo,
        employeeId: empId,
        employeeCode: empCode,
        name,
        passportNumber: passportNumber.toUpperCase(),
        designation,
        site,
        basicSalary: Number(basicSalary),
        payableSalary: Number(payableSalary),
        payableMonth,
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        paymentSlip: paymentSlip || '',
        status: status || 'Active',
      });

      // Auto generate invoice
      const invoice = await createAutoInvoice(newEmp);

      return res.status(201).json({
        success: true,
        message: 'Employee created and invoice generated successfully.',
        employee: newEmp,
        invoice,
      });
    } catch (dbErr) {
      // Fallback in-memory
      const newEmp = {
        _id: 'emp_' + Date.now(),
        srNo: inMemoryEmployees.length + 1,
        employeeId: empId,
        employeeCode: empCode,
        name,
        passportNumber: passportNumber.toUpperCase(),
        designation,
        site,
        basicSalary: Number(basicSalary),
        payableSalary: Number(payableSalary),
        payableMonth,
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        paymentSlip: paymentSlip || '',
        status: status || 'Active',
        createdAt: new Date(),
      };
      inMemoryEmployees.unshift(newEmp);
      const invoice = await createAutoInvoice(newEmp);

      return res.status(201).json({
        success: true,
        message: 'Employee created and invoice generated successfully (Demo Mode)',
        employee: newEmp,
        invoice,
      });
    }
  } catch (error) {
    console.error('Create Employee error:', error);
    res.status(500).json({ success: false, message: 'Failed to create employee record' });
  }
};

// @desc    Get All Employees (With Search, Filter, Sort, Pagination, Analytics Stats)
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
  try {
    const {
      search = '',
      status = '',
      site = '',
      designation = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    let employeesList = [];
    let totalCount = 0;

    try {
      const query = {};

      if (status) {
        query.status = status;
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

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (Number(page) - 1) * Number(limit);

      employeesList = await Employee.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      totalCount = await Employee.countDocuments(query);

      // Aggregate Stats
      const allEmps = await Employee.find();
      const stats = {
        total: allEmps.length,
        active: allEmps.filter((e) => e.status === 'Active').length,
        inactive: allEmps.filter((e) => e.status === 'Inactive').length,
        leave: allEmps.filter((e) => e.status === 'Leave').length,
        totalSalary: allEmps.reduce((acc, curr) => acc + (curr.payableSalary || 0), 0),
      };

      return res.json({
        success: true,
        data: employeesList,
        pagination: {
          total: totalCount,
          page: Number(page),
          pages: Math.ceil(totalCount / Number(limit)),
          limit: Number(limit),
        },
        stats,
      });
    } catch (dbErr) {
      // In-memory filter logic
      let filtered = [...inMemoryEmployees];

      if (status) {
        filtered = filtered.filter((e) => e.status.toLowerCase() === status.toLowerCase());
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

      // Sort
      filtered.sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        }
        return valA < valB ? 1 : -1;
      });

      const total = filtered.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = filtered.slice(skip, skip + Number(limit));

      const stats = {
        total: inMemoryEmployees.length,
        active: inMemoryEmployees.filter((e) => e.status === 'Active').length,
        inactive: inMemoryEmployees.filter((e) => e.status === 'Inactive').length,
        leave: inMemoryEmployees.filter((e) => e.status === 'Leave').length,
        totalSalary: inMemoryEmployees.reduce((acc, curr) => acc + (curr.payableSalary || 0), 0),
      };

      return res.json({
        success: true,
        data: paginated,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
        stats,
      });
    }
  } catch (error) {
    console.error('Get Employees error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve employee records' });
  }
};

// @desc    Get Single Employee Details
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const employee = await Employee.findOne({
        $or: [{ _id: id }, { employeeId: id }, { employeeCode: id }],
      });

      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      return res.json({ success: true, employee });
    } catch (dbErr) {
      const found = inMemoryEmployees.find(
        (e) => e._id === id || e.employeeId === id || e.employeeCode === id
      );
      if (!found) {
        return res.status(404).json({ success: false, message: 'Employee record not found' });
      }
      return res.json({ success: true, employee: found });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving employee' });
  }
};

// @desc    Update Employee Details
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    try {
      const employee = await Employee.findOneAndUpdate(
        { $or: [{ _id: id }, { employeeId: id }] },
        updates,
        { new: true, runValidators: true }
      );

      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      return res.json({
        success: true,
        message: 'Employee updated successfully',
        employee,
      });
    } catch (dbErr) {
      const idx = inMemoryEmployees.findIndex((e) => e._id === id || e.employeeId === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      inMemoryEmployees[idx] = { ...inMemoryEmployees[idx], ...updates };
      return res.json({
        success: true,
        message: 'Employee updated successfully (Demo Mode)',
        employee: inMemoryEmployees[idx],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating employee record' });
  }
};

// @desc    Delete Employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const deleted = await Employee.findOneAndDelete({
        $or: [{ _id: id }, { employeeId: id }],
      });

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      return res.json({ success: true, message: 'Employee record deleted successfully' });
    } catch (dbErr) {
      const idx = inMemoryEmployees.findIndex((e) => e._id === id || e.employeeId === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      inMemoryEmployees.splice(idx, 1);
      return res.json({ success: true, message: 'Employee record deleted successfully (Demo Mode)' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting employee' });
  }
};

// @desc    Search Employee by Passport Number
// @route   GET /api/employees/search/passport/:passportNumber
// @access  Private
const searchByPassport = async (req, res) => {
  try {
    const { passportNumber } = req.params;
    const queryStr = passportNumber.toUpperCase();

    try {
      const employee = await Employee.findOne({ passportNumber: queryStr });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: `No employee found matching passport number: ${queryStr}`,
        });
      }
      return res.json({ success: true, employee });
    } catch (dbErr) {
      const found = inMemoryEmployees.find(
        (e) => e.passportNumber.toUpperCase() === queryStr
      );
      if (!found) {
        return res.status(404).json({
          success: false,
          message: `No employee found matching passport number: ${queryStr}`,
        });
      }
      return res.json({ success: true, employee: found });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching by passport number' });
  }
};

// @desc    Search Employee by Employee Code
// @route   GET /api/employees/search/code/:employeeCode
// @access  Private
const searchByCode = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const codeStr = employeeCode.toUpperCase();

    try {
      const employee = await Employee.findOne({
        $or: [{ employeeCode: codeStr }, { employeeId: codeStr }],
      });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: `No employee found matching code: ${codeStr}`,
        });
      }
      return res.json({ success: true, employee });
    } catch (dbErr) {
      const found = inMemoryEmployees.find(
        (e) =>
          e.employeeCode.toUpperCase() === codeStr ||
          e.employeeId.toUpperCase() === codeStr
      );
      if (!found) {
        return res.status(404).json({
          success: false,
          message: `No employee found matching code: ${codeStr}`,
        });
      }
      return res.json({ success: true, employee: found });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching by employee code' });
  }
};

// @desc    Export All Employees to Excel
// @route   GET /api/employees/export
// @access  Private
const exportEmployeesExcel = async (req, res) => {
  try {
    let list = [];
    try {
      list = await Employee.find().sort({ srNo: 1 });
    } catch (dbErr) {
      list = inMemoryEmployees;
    }

    // Transform exact columns required:
    // Sr No, Employee Code, Employee Name, Passport Number, Designation, Site, Basic Salary, Payable Salary, Month, Account Number, IFSC Code, Status
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

    // Set column widths
    worksheet['!cols'] = [
      { wch: 8 },  // Sr No
      { wch: 15 }, // Code
      { wch: 24 }, // Name
      { wch: 18 }, // Passport
      { wch: 25 }, // Designation
      { wch: 28 }, // Site
      { wch: 15 }, // Basic Salary
      { wch: 15 }, // Payable Salary
      { wch: 18 }, // Month
      { wch: 25 }, // Account
      { wch: 15 }, // IFSC
      { wch: 12 }, // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Merald Group Employees');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Merald_Group_Employees_Report_${Date.now()}.xlsx`
    );

    return res.send(buffer);
  } catch (error) {
    console.error('Export Excel error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Excel export file' });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchByPassport,
  searchByCode,
  exportEmployeesExcel,
  inMemoryEmployees,
};
