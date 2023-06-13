import express from 'express';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { userRoutes } from '../modules/user/user.route';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: academicFacultyRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;
