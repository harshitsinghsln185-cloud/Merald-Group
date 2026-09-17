import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';
import { sendResponse } from '../../utils/apiResponse';

export const create = async (req: Request, res: Response) => {
  try {
    const result = await EmployeeService.create(req.body);
    return sendResponse(res, 201, true, 'Employee record created successfully', result);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Failed to create employee record');
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await EmployeeService.getAll(req.query);
    return sendResponse(
      res,
      200,
      true,
      'Employee directory retrieved',
      result.data,
      result.pagination,
      result.stats
    );
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message || 'Failed to retrieve employees');
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const employee = await EmployeeService.getById(req.params.id);
    return sendResponse(res, 200, true, 'Employee profile retrieved', employee);
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message || 'Employee not found');
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await EmployeeService.update(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Employee record updated successfully', updated);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Error updating employee record');
  }
};

export const deleteEmp = async (req: Request, res: Response) => {
  try {
    await EmployeeService.delete(req.params.id);
    return sendResponse(res, 200, true, 'Employee record deleted successfully');
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message || 'Error deleting employee record');
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { passportNumber, employeeCode } = req.query;

    if (passportNumber) {
      const result = await EmployeeService.searchByPassport(String(passportNumber));
      return sendResponse(res, 200, true, 'Employee search result', result);
    }

    if (employeeCode) {
      const result = await EmployeeService.searchByCode(String(employeeCode));
      return sendResponse(res, 200, true, 'Employee search result', result);
    }

    return sendResponse(res, 400, false, 'Please specify passportNumber or employeeCode search query param');
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message || 'No matching employee found');
  }
};

export const exportExcel = async (req: Request, res: Response) => {
  try {
    const buffer = await EmployeeService.generateExcelBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Merald_Group_Employees_Report_${Date.now()}.xlsx`
    );
    return res.send(buffer);
  } catch (error: any) {
    return sendResponse(res, 500, false, 'Failed to generate Excel export file');
  }
};

export const downloadImportTemplate = async (req: Request, res: Response) => {
  try {
    const buffer = await EmployeeService.generateImportTemplateBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Merald_Group_Employee_Import_Template.xlsx'
    );
    return res.send(buffer);
  } catch (error: any) {
    return sendResponse(res, 500, false, 'Failed to generate Excel import template');
  }
};

export const previewImport = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return sendResponse(res, 400, false, 'Please upload a valid Excel file (.xlsx, .xls, .csv)');
    }
    const previewData = await EmployeeService.previewExcelImport(req.file.buffer);
    return sendResponse(res, 200, true, 'Excel import validation completed', previewData);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Error parsing Excel file');
  }
};

export const confirmImport = async (req: Request, res: Response) => {
  try {
    const { rows } = req.body;
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return sendResponse(res, 400, false, 'No valid employee rows supplied for import confirmation');
    }
    const result = await EmployeeService.confirmExcelImport(rows);
    return sendResponse(res, 200, true, `Successfully imported ${result.importedCount} employees`, result);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Failed to save imported employee records');
  }
};

export const getSalaryHistory = async (req: Request, res: Response) => {
  try {
    const history = await EmployeeService.getSalaryHistory(req.params.id);
    return sendResponse(res, 200, true, 'Salary history retrieved', history);
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message || 'Salary history not found');
  }
};

export const getPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const slipData = await EmployeeService.getPaymentSlipData(req.params.id, month, year);
    return sendResponse(res, 200, true, 'Payment slip generated dynamically', slipData);
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message || 'No payment data available for this month.');
  }
};
