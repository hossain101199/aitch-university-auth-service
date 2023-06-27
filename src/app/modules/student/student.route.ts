import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentController } from './student.controller';
import { studentValidation } from './student.validation';

const router = express.Router();

router.get('/:id', studentController.getSingleStudent);

router.patch(
  '/:id',
  validateRequest(studentValidation.updateStudentZodSchema),
  studentController.updateStudent
);

router.delete('/:id', studentController.deleteStudent);

router.get('/', studentController.getAllStudent);

export const studentRoutes = router;
