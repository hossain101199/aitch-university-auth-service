import mongoose from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { academicSemester } from '../academicSemester/academicSemester.model';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { IStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { IUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';

const createStudentInDB = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }

  // set role
  user.role = ENUM_USER_ROLE.STUDENT;

  const chsenAcademicSemester = await academicSemester
    .findById(student.academicSemester)
    .lean();

  // generate student user id
  const id = await generateStudentId(
    chsenAcademicSemester as IAcademicSemester
  );

  user.id = id;
  student.id = id;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //array
    const newStudent = await Student.create([student], { session });

    if (!newStudent.length) {
      throw new ApiError(400, 'Failed to create student');
    }

    //set student -->  _id into user.student
    user.student = newStudent[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(400, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0].populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester',
        },
        {
          path: 'academicDepartment',
          populate: {
            path: 'academicFaculty',
          },
        },
      ],
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const createFacultyInDB = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_faculty_pass as string;
  }

  // set role
  user.role = ENUM_USER_ROLE.FACULTY;

  // generate student user id
  const id = await generateFacultyId();

  user.id = id;
  faculty.id = id;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //array
    const newFaculty = await Faculty.create([faculty], { session });

    if (!newFaculty.length) {
      throw new ApiError(400, 'Failed to create faculty');
    }

    //set faculty -->  _id into user.faculty
    user.faculty = newFaculty[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(400, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0].populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicDepartment',
          populate: {
            path: 'academicFaculty',
          },
        },
      ],
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const createAdminInDB = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }

  // set role
  user.role = ENUM_USER_ROLE.ADMIN;

  // generate student user id
  const id = await generateAdminId();

  user.id = id;
  admin.id = id;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //array
    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(400, 'Failed to create admin');
    }

    //set admin -->  _id into user.admin
    user.admin = newAdmin[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(400, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0].populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const userService = {
  createStudentInDB,
  createFacultyInDB,
  createAdminInDB,
};
