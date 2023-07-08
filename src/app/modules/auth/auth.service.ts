import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const isUserExist = await User.findOne(
    { id },
    { id: 1, role: 1, password: 1, needsPasswordChange: 1 }
  );
  // const isUserExist = await User.isUserExist(id);

  if (isUserExist) {
    // if (await User.isPasswordMatched(password, isUserExist.password)) {
    if (await bcrypt.compare(password, isUserExist.password)) {
      const { id, role, needsPasswordChange } = isUserExist;
      const accessToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.secret as Secret,
        { expiresIn: config.jwt.expires_in }
      );
      const refreshToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.refresh_secret as Secret,
        { expiresIn: config.jwt.refresh_expires_in }
      );

      return {
        accessToken,
        refreshToken,
        needsPasswordChange,
      };
    } else {
      throw new ApiError(401, 'Password is incorrect');
    }
  } else {
    throw new ApiError(404, 'User does not exist');
  }
};

const refreshToken = async (
  payload: string
): Promise<IRefreshTokenResponse> => {
  // invalid token - synchronous
  let verifiedToken = null;

  try {
    verifiedToken = jwt.verify(
      payload,
      config.jwt.refresh_secret as Secret
    ) as JwtPayload;
  } catch (err) {
    throw new ApiError(403, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  const isUserExist = await User.findOne(
    { id },
    { id: 1, role: 1, password: 1, needsPasswordChange: 1 }
  );
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  const newAccessToken = jwt.sign(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expires_in }
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ id: user?.id }).select('+password');

  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await bcrypt.compare(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(401, 'Old Password is incorrect');
  }

  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = false;

  // updating using save()
  isUserExist.save();
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
};
