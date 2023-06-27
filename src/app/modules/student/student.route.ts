import express from 'express';
import { studentController } from './student.controller';

const router = express.Router();

router.get('/:id', studentController.getSingleStudent);

router.patch('/:id');

router.delete('/:id', studentController.deleteStudent);

router.get('/');

export const studentRoutes = router;
