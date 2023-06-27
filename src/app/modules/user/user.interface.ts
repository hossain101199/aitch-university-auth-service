import { Model, Types } from 'mongoose';
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
  role: string;
  password?: string;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

export type userModel = Model<IUser>;
