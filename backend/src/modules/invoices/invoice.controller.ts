import { Request, Response } from 'express';
import { InvoiceService } from './invoice.service';
import { sendResponse } from '../../utils/apiResponse';

export const generate = async (req: Request, res: Response) => {
  try {
    const invoice = await InvoiceService.generateInvoice(req.params.employeeId);
    return sendResponse(res, 201, true, 'Invoice generated successfully', invoice);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Failed to generate invoice');
  }
};

export const getByEmployeeId = async (req: Request, res: Response) => {
  try {
    const invoice = await InvoiceService.getByEmployeeId(req.params.employeeId);
    return sendResponse(res, 200, true, 'Invoice retrieved successfully', invoice);
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message || 'Invoice not found');
  }
};
