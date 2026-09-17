import { Router } from 'express';
import multer from 'multer';
import {
  create,
  getAll,
  getById,
  update,
  deleteEmp,
  search,
  exportExcel,
  downloadImportTemplate,
  previewImport,
  confirmImport,
  getSalaryHistory,
  getPaymentSlip,
} from './employee.controller';
import { validate } from '../../middleware/validation.middleware';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.validation';
import { protectAdmin } from '../../middleware/auth.middleware';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.use(protectAdmin);

router.get('/search', search);
router.get('/export/excel', exportExcel);
router.get('/template/excel', downloadImportTemplate);

router.post('/import/preview', upload.single('file'), previewImport);
router.post('/import/confirm', confirmImport);

router.get('/:id/salary-history', getSalaryHistory);
router.get('/:id/payment-slip', getPaymentSlip);

router.post('/', validate(createEmployeeSchema), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validate(updateEmployeeSchema), update);
router.delete('/:id', deleteEmp);

export default router;
