import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { managementDepartmentController } from './managementDepartment.controller';
import { managementDepartmentValidation } from './managementDepartment.validation';

const router = express.Router();

router.post(
  '/create-department',
  validateRequest(
    managementDepartmentValidation.createManagementDepartmentZodSchema
  ),
  managementDepartmentController.createManagementDepartment
);

router.get(
  '/:id',
  managementDepartmentController.getSingleManagementDepartment
);

router.patch(
  '/:id',
  validateRequest(
    managementDepartmentValidation.updateManagementDepartmentZodSchema
  ),
  managementDepartmentController.updateManagementDepartment
);

router.delete(
  '/:id',
  managementDepartmentController.deleteManagementDepartment
);

router.get('/', managementDepartmentController.getAllManagementDepartments);

export const managementDepartmentRoutes = router;
