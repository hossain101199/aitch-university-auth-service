import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { adminController } from './admin.controller';
import { adminValidation } from './admin.validation';

const router = express.Router();

router.get('/:id', adminController.getSingleAdmin);

router.patch(
  '/:id',
  validateRequest(adminValidation.updateAdminZodSchema),
  adminController.updateAdmin
);

router.delete('/:id', adminController.deleteAdmin);

router.get('/', adminController.getAllAdmins);

export const adminRoutes = router;
