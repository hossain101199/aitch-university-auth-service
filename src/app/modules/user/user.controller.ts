import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const userController = {
  createStudent,
};
