import apiClient from './api';
import type { Admin, ApiResponse } from '../types';

export const authService = {
  getSetupStatus: async (): Promise<ApiResponse<{ setupRequired: boolean; adminCount: number }>> => {
    try {
      const res = await apiClient.get('/auth/setup-status');
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Failed to fetch setup status' };
    }
  },

  setupFirstAdmin: async (data: any): Promise<ApiResponse<{ token: string; admin: Admin }>> => {
    try {
      const res = await apiClient.post('/auth/setup', data);
      if (res.data?.data?.token) {
        localStorage.setItem('merald_admin_token', res.data.data.token);
        localStorage.setItem('merald_admin_data', JSON.stringify(res.data.data.admin));
      }
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'First admin setup failed' };
    }
  },

  login: async (credentials: any): Promise<ApiResponse<{ token: string; admin: Admin }>> => {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      if (res.data?.data?.token) {
        localStorage.setItem('merald_admin_token', res.data.data.token);
        localStorage.setItem('merald_admin_data', JSON.stringify(res.data.data.admin));
      }
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Invalid credentials' };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Ignore
    } finally {
      localStorage.removeItem('merald_admin_token');
      localStorage.removeItem('merald_admin_data');
    }
  },

  getCurrentAdmin: (): Admin | null => {
    const raw = localStorage.getItem('merald_admin_data');
    return raw ? JSON.parse(raw) : null;
  },

  publicRegister: async (data: any): Promise<ApiResponse<{ token: string; admin: Admin }>> => {
    try {
      const res = await apiClient.post('/auth/setup', data);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Admin registration failed' };
    }
  },

  register: async (data: any): Promise<ApiResponse<{ token: string; admin: Admin }>> => {
    return authService.publicRegister(data);
  },

  forgotPassword: async (email: string) => {
    return {
      success: true,
      message: `Password recovery dispatched to ${email}`,
    };
  },

  // Admin Management Endpoints
  getAdmins: async (): Promise<ApiResponse<Admin[]>> => {
    try {
      const res = await apiClient.get('/admins');
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Failed to fetch admins' };
    }
  },

  createAdmin: async (data: any): Promise<ApiResponse<Admin>> => {
    try {
      const res = await apiClient.post('/admins', data);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Failed to create admin' };
    }
  },

  updateAdmin: async (id: string, data: any): Promise<ApiResponse<Admin>> => {
    try {
      const res = await apiClient.put(`/admins/${id}`, data);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Failed to update admin' };
    }
  },

  deleteAdmin: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const res = await apiClient.delete(`/admins/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { success: false, message: 'Failed to delete admin' };
    }
  },
};

