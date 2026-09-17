export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'LEAVE' | 'Active' | 'Inactive' | 'Leave';

export interface Admin {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  country: string;
  state?: string;
  city: string;
  officeAddress: string;
  phone?: string;
  status?: 'ACTIVE' | 'DISABLED';
  createdAt?: string;
  token?: string;
}

export interface Employee {
  _id?: string;
  srNo?: number;
  employeeId: string;
  employeeCode: string;
  name: string;
  passportNumber: string;
  designation: string;
  site: string;
  country?: string;
  state?: string;
  city?: string;
  phone?: string;
  basicSalary: number;
  payableSalary: number;
  payableMonth: string;
  accountNumber: string;
  ifscCode: string;
  paymentSlip?: string;
  status: EmployeeStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  employeeId: string;
  salaryDetails: {
    basicSalary: number;
    payableSalary: number;
    payableMonth: string;
  };
  employeeDetails: {
    employeeCode: string;
    name: string;
    passportNumber: string;
    designation: string;
    site: string;
    accountNumber: string;
    ifscCode: string;
  };
  generatedDate: string | Date;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  leave: number;
  totalSalary: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  stats?: DashboardStats;
}
