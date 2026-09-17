import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const getSetupStatus = async (req: Request, res: Response) => {
  try {
    const status = await AuthService.getSetupStatus();
    return sendResponse(res, 200, true, 'System admin setup status retrieved', status);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message || 'Failed to check admin setup status');
  }
};

export const setupFirstAdmin = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.setupFirstAdmin(req.body);
    return sendResponse(res, 201, true, 'Admin account created successfully', result);
  } catch (error: any) {
    const isDuplicate = error.message && error.message.includes('already exists');
    const status = isDuplicate ? 400 : 400;
    return sendResponse(res, status, false, error.message || 'Admin account creation failed');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, false, 'Email address and password are required');
    }
    const result = await AuthService.loginAdmin(email, password);
    return sendResponse(res, 200, true, 'Admin authenticated successfully', result);
  } catch (error: any) {
    return sendResponse(res, 401, false, error.message || 'Authentication failed');
  }
};

export const logout = async (req: Request, res: Response) => {
  return sendResponse(res, 200, true, 'Admin logged out successfully');
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  return sendResponse(res, 200, true, 'Admin profile retrieved', req.admin);
};

export const getAllAdmins = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await AuthService.getAllAdmins();
    return sendResponse(res, 200, true, 'Admins list retrieved', list);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message || 'Failed to retrieve admins');
  }
};

export const createAdminByAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newAdmin = await AuthService.createAdminByAdmin(req.body);
    return sendResponse(res, 201, true, 'New Admin account created successfully', newAdmin);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Failed to create admin account');
  }
};

export const updateAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await AuthService.updateAdmin(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Admin profile updated successfully', updated);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Failed to update admin account');
  }
};

export const deleteAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await AuthService.deleteAdmin(req.params.id, req.admin?.id);
    return sendResponse(res, 200, true, 'Admin account removed successfully');
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message || 'Failed to remove admin account');
  }
};
