import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentController } from './academicDepartment.controller';
import { academicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post(
  '/create-department',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentZodSchema
  ),
  academicDepartmentController.createAcademicDepartment
);

router.get('/:id', academicDepartmentController.getSingleAcademicDepartment);

router.patch(
  '/:id',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentZodSchema
  ),
  academicDepartmentController.updateAcademicDepartment
);

router.delete('/:id', academicDepartmentController.deleteAcademicDepartment);

router.get('/', academicDepartmentController.getAllAcademicDepartments);

export const academicDepartmentRoutes = router;
