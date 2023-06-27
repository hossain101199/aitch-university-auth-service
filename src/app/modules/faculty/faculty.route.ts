import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyController } from './faculty.controller';
import { facultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/:id', facultyController.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(facultyValidation.updateFacultyZodSchema),
  facultyController.updateFaculty
);

router.delete('/:id', facultyController.deleteFaculty);

router.get('/', facultyController.getAllFaculties);

export const facultyRoutes = router;
