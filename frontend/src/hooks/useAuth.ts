import { useState } from 'react';
import { authService } from '../services/auth.service';
import type { Admin } from '../types';

export const useAuth = () => {
  const [admin, setAdmin] = useState<Admin | null>(() => authService.getCurrentAdmin());

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    if (res.success && res.data?.admin) {
      setAdmin(res.data.admin);
    }
    return res;
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    if (res.success && res.data?.admin) {
      setAdmin(res.data.admin);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
  };

  return {
    admin,
    isAuthenticated: Boolean(admin),
    login,
    register,
    logout,
  };
};
