import { Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { IAdmin } from '../admin/admin.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IStudent } from '../student/student.interface';

export type IUserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type IUser = {
  id: string;
  role: ENUM_USER_ROLE;
  password: string;
  needsPasswordChange: true | false;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

// export type userModel = {
//   isUserExist(
//     id: string
//   ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;
//   isPasswordMatched(
//     givenPassword: string,
//     savedPassword: string
//   ): Promise<boolean>;
// } & Model<IUser>;
