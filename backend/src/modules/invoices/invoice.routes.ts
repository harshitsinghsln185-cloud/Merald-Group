import { Router } from 'express';
import { generate, getByEmployeeId } from './invoice.controller';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.use(protectAdmin);

router.post('/generate/:employeeId', generate);
router.get('/:employeeId', getByEmployeeId);

export default router;
