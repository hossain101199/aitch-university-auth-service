import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IFaculty } from '../faculty/faculty.interface';
import { IUser } from './user.interface';
import { userService } from './user.service';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { student, ...userData } = req.body;
  const result = await userService.createStudentInDB(student, userData);

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const { faculty, ...userData } = req.body;
  const result = await userService.createFacultyInDB(faculty, userData);

  sendResponse<IFaculty>(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

export const userController = {
  createStudent,
  createFaculty,
};
