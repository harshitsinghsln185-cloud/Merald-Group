import { Router } from 'express';
import {
  getSetupStatus,
  setupFirstAdmin,
  login,
  logout,
  getMe,
  getAllAdmins,
  createAdminByAdmin,
  updateAdmin,
  deleteAdmin,
} from './auth.controller';
import { validate } from '../../middleware/validation.middleware';
import { registerAdminSchema, loginAdminSchema } from './auth.validation';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Public Authentication & First Admin Setup routes
router.get('/setup-status', getSetupStatus);
router.post('/setup', validate(registerAdminSchema), setupFirstAdmin);
router.post('/login', validate(loginAdminSchema), login);
router.post('/logout', logout);

// Protected Auth Profile route
router.get('/me', protectAdmin, getMe);

// Protected Admin Management routes (supports both /api/v1/admins and /api/v1/auth/admins)
router.get('/', protectAdmin, getAllAdmins);
router.post('/', protectAdmin, validate(registerAdminSchema), createAdminByAdmin);
router.put('/:id', protectAdmin, updateAdmin);
router.delete('/:id', protectAdmin, deleteAdmin);

router.get('/admins', protectAdmin, getAllAdmins);
router.post('/admins', protectAdmin, validate(registerAdminSchema), createAdminByAdmin);
router.put('/admins/:id', protectAdmin, updateAdmin);
router.delete('/admins/:id', protectAdmin, deleteAdmin);

export default router;
