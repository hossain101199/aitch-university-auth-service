import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../user/user.model';
import { studentSearchableFields } from './student.constant';
import { IStudent, IStudentFilters } from './student.interface';
import { Student } from './student.model';

const getSingleStudentFromDB = async (
  payload: string
): Promise<IStudent | null> => {
  const result = await Student.findOne({ id: payload })
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    });

  return result;
};

const updateStudentFromDB = async (
  id: string,
  payload: Partial<IStudent>
): Promise<IStudent | null> => {
  const isStudentExist = await Student.findOne({ id });

  if (!isStudentExist) {
    throw new ApiError(
      404,
      `Error: Student with ID ${id} is not found. Please verify the provided ID and try again`
    );
  }
  const { name, guardian, localGuardian, ...studentData } = payload;

  const updatedStudentData: Partial<IStudent> = { ...studentData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>; // `name.fisrtName`
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const guardianKey = `guardian.${key}` as keyof Partial<IStudent>; // `guardian.fisrtguardian`
      (updatedStudentData as any)[guardianKey] =
        guardian[key as keyof typeof guardian];
    });
  }
  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const localGuradianKey =
        `localGuardian.${key}` as keyof Partial<IStudent>; // `localGuardian.fisrtName`
      (updatedStudentData as any)[localGuradianKey] =
        localGuardian[key as keyof typeof localGuardian];
    });
  }

  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, {
    new: true,
  })
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    });

  return result;
};

const deleteStudentFromDB = async (
  payload: string
): Promise<IStudent | null> => {
  const isStudentExist = await Student.findOne({ id: payload });

  if (!isStudentExist) {
    throw new ApiError(
      404,
      `Error: Student with ID ${payload} is not found. Please verify the provided ID and try again`
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await Student.findOneAndDelete({ id: payload }, { session })
      .populate('academicSemester')
      .populate({
        path: 'academicDepartment',
        populate: [
          {
            path: 'academicFaculty',
          },
        ],
      });

    if (!result) {
      throw new ApiError(404, 'Failed to delete student');
    }

    //delete user
    await User.deleteOne({ id: payload }, { session });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getAllStudentFromDB = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: studentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Student.find(whereConditions)
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Student.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
export const studentService = {
  getSingleStudentFromDB,
  updateStudentFromDB,
  deleteStudentFromDB,
  getAllStudentFromDB,
};
