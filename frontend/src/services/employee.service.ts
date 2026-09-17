import apiClient from './api';
import type { Employee, ApiResponse } from '../types';

let localEmployees: Employee[] = [
  {
    _id: 'emp_1',
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
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    _id: 'emp_2',
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
    createdAt: '2025-02-10T08:00:00.000Z',
  },
  {
    _id: 'emp_3',
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
    status: 'ACTIVE',
    createdAt: '2025-03-01T08:00:00.000Z',
  },
  {
    _id: 'emp_4',
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
    status: 'LEAVE',
    createdAt: '2025-04-12T08:00:00.000Z',
  },
  {
    _id: 'emp_5',
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
    status: 'ACTIVE',
    createdAt: '2025-05-18T08:00:00.000Z',
  },
  {
    _id: 'emp_6',
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
    status: 'INACTIVE',
    createdAt: '2025-06-20T08:00:00.000Z',
  },
];

export const employeeService = {
  getEmployees: async (params: any = {}): Promise<ApiResponse<Employee[]>> => {
    try {
      const res = await apiClient.get('/employees', { params });
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: 'Failed to fetch employee list' };
      }
      let list = [...localEmployees];
      if (params.status) {
        list = list.filter((e) => e.status.toUpperCase() === params.status.toUpperCase());
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.name.toLowerCase().includes(s) ||
            e.passportNumber.toLowerCase().includes(s) ||
            e.employeeCode.toLowerCase().includes(s) ||
            e.employeeId.toLowerCase().includes(s) ||
            e.designation.toLowerCase().includes(s) ||
            e.site.toLowerCase().includes(s)
        );
      }

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 10;
      const paginated = list.slice((page - 1) * limit, page * limit);
      const total = list.length;

      const active = localEmployees.filter((e) => e.status === 'ACTIVE' || e.status === 'Active').length;
      const inactive = localEmployees.filter((e) => e.status === 'INACTIVE' || e.status === 'Inactive').length;
      const leave = localEmployees.filter((e) => e.status === 'LEAVE' || e.status === 'Leave').length;
      const totalSalary = localEmployees.reduce((acc, curr) => acc + (curr.payableSalary || 0), 0);

      return {
        success: true,
        message: 'Retrieved employees',
        data: paginated,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
        stats: { total: localEmployees.length, active, inactive, leave, totalSalary },
      };
    }
  },

  getEmployeeById: async (id: string): Promise<ApiResponse<Employee>> => {
    try {
      const res = await apiClient.get(`/employees/${id}`);
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: 'Employee not found' };
      }
      const found = localEmployees.find((e) => e._id === id || e.employeeId === id || e.employeeCode === id);
      if (!found) throw { success: false, message: 'Employee not found' };
      return { success: true, message: 'Retrieved employee', data: found };
    }
  },

  createEmployee: async (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    try {
      const res = await apiClient.post('/employees', data);
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: 'Failed to create employee' };
      }
      const nextId = `EMP-${1000 + localEmployees.length + 1}`;
      const nextCode = `MGD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newEmp: Employee = {
        _id: 'emp_' + Date.now(),
        srNo: localEmployees.length + 1,
        employeeId: nextId,
        employeeCode: nextCode,
        name: data.name!,
        passportNumber: data.passportNumber!.toUpperCase(),
        designation: data.designation!,
        site: data.site!,
        basicSalary: Number(data.basicSalary),
        payableSalary: Number(data.payableSalary),
        payableMonth: data.payableMonth!,
        accountNumber: data.accountNumber!,
        ifscCode: data.ifscCode!.toUpperCase(),
        paymentSlip: data.paymentSlip || '',
        status: (data.status ? data.status.toUpperCase() : 'ACTIVE') as any,
        createdAt: new Date().toISOString(),
      };
      localEmployees.unshift(newEmp);
      return { success: true, message: 'Employee created successfully', data: newEmp };
    }
  },

  updateEmployee: async (id: string, updates: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    try {
      const res = await apiClient.put(`/employees/${id}`, updates);
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: 'Failed to update employee' };
      }
      const idx = localEmployees.findIndex((e) => e._id === id || e.employeeId === id);
      if (idx !== -1) {
        localEmployees[idx] = { ...localEmployees[idx], ...updates };
        return { success: true, message: 'Employee updated successfully', data: localEmployees[idx] };
      }
      throw { success: false, message: 'Employee not found' };
    }
  },

  deleteEmployee: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.delete(`/employees/${id}`);
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: 'Failed to delete employee' };
      }
      localEmployees = localEmployees.filter((e) => e._id !== id && e.employeeId !== id);
      return { success: true, message: 'Employee record deleted successfully' };
    }
  },

  searchByPassport: async (passportNumber: string): Promise<ApiResponse<Employee>> => {
    try {
      const res = await apiClient.get(`/employees/search`, { params: { passportNumber } });
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: `No employee found with passport ${passportNumber}` };
      }
      const found = localEmployees.find((e) => e.passportNumber.toUpperCase() === passportNumber.toUpperCase());
      if (!found) throw { success: false, message: `No employee found with passport ${passportNumber}` };
      return { success: true, message: 'Search result', data: found };
    }
  },

  searchByCode: async (employeeCode: string): Promise<ApiResponse<Employee>> => {
    try {
      const res = await apiClient.get(`/employees/search`, { params: { employeeCode } });
      return res.data;
    } catch (err: any) {
      if (import.meta.env.PROD) {
        throw err.response?.data || { success: false, message: `No employee found with code ${employeeCode}` };
      }
      const found = localEmployees.find(
        (e) => e.employeeCode.toUpperCase() === employeeCode.toUpperCase() || e.employeeId.toUpperCase() === employeeCode.toUpperCase()
      );
      if (!found) throw { success: false, message: `No employee found with code ${employeeCode}` };
      return { success: true, message: 'Search result', data: found };
    }
  },

  exportExcel: async (): Promise<boolean> => {
    try {
      const res = await apiClient.get('/employees/export/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Merald_Group_Employees_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (err) {
      return false;
    }
  },

  downloadImportTemplate: async (): Promise<boolean> => {
    try {
      const res = await apiClient.get('/employees/template/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Merald_Group_Employee_Import_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (err) {
      return false;
    }
  },

  previewImport: async (file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/employees/import/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  confirmImport: async (rows: any[]): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/employees/import/confirm', { rows });
    return res.data;
  },

  getSalaryHistory: async (employeeId: string): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get(`/employees/${employeeId}/salary-history`);
    return res.data;
  },

  getPaymentSlip: async (employeeId: string, month?: number, year?: number): Promise<ApiResponse<any>> => {
    const res = await apiClient.get(`/employees/${employeeId}/payment-slip`, {
      params: { month, year },
    });
    return res.data;
  },
};
