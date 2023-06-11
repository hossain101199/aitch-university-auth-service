import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { userService } from './user.service';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await userService.createUserInDB(user);

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const userController = {
  createUser,
};
