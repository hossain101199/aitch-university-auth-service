import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyController } from './academicFaculty.controller';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(academicFacultyValidation.createAcademicFacultyZodSchema),
  academicFacultyController.createAcademicFaculty
);

router.get('/:id', academicFacultyController.getSingleAcademicFaculty);

router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyZodSchema),
  academicFacultyController.updateAcademicFaculty
);

router.delete('/:id', academicFacultyController.deleteAcademicFaculty);

router.get('/', academicFacultyController.getAllFaculties);

export const academicFacultyRoutes = router;
