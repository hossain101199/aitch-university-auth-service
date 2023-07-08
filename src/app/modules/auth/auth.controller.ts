import { RequestHandler } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { authService } from './auth.service';

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const loginDAta = req.body;
  const result = await authService.loginUser(loginDAta);
  const { refreshToken, ...accessToken } = result;

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logging successfully!',
    data: accessToken,
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Token has been refreshed',
    data: result,
  });
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const user = req.verifiedUser;
  const passwordData = req.body;
  console.log(user);

  await authService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
  });
});

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
};
