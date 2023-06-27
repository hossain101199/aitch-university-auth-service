import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { userValidaion } from './user.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(userValidaion.createStudentZodSchema),
  userController.createStudent
);
router.post(
  '/create-faculty',
  validateRequest(userValidaion.createFacultyZodSchema),
  userController.createFaculty
);

export const userRoutes = router;
