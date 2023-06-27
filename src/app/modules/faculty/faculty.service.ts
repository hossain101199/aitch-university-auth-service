import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../user/user.model';
import { facultySearchableFields } from './faculty.constant';
import { IFaculty, IFacultyFilters } from './faculty.interface';
import { Faculty } from './faculty.model';

const getSingleFacultyFromDB = async (
  payload: string
): Promise<IFaculty | null> => {
  const result = await Faculty.findOne({ id: payload }).populate({
    path: 'academicDepartment',
    populate: [
      {
        path: 'academicFaculty',
      },
    ],
  });

  return result;
};

const updateFacultyFromDB = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const isFacultyExist = await Faculty.findOne({ id });

  if (!isFacultyExist) {
    throw new ApiError(
      404,
      `Error: Faculty with ID ${id} is not found. Please verify the provided ID and try again`
    );
  }
  const { name, ...facultyData } = payload;

  const updatedFacultyData: Partial<IFaculty> = { ...facultyData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>; // `name.fisrtName`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
    new: true,
  }).populate({
    path: 'academicDepartment',
    populate: [
      {
        path: 'academicFaculty',
      },
    ],
  });

  return result;
};

const deleteFacultyFromDB = async (
  payload: string
): Promise<IFaculty | null> => {
  const isFacultyExist = await Faculty.findOne({ id: payload });

  if (!isFacultyExist) {
    throw new ApiError(
      404,
      `Error: Faculty with ID ${payload} is not found. Please verify the provided ID and try again`
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await Faculty.findOneAndDelete(
      { id: payload },
      { session }
    ).populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    });

    if (!result) {
      throw new ApiError(404, 'Failed to delete Faculty');
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

const getAllFacultiesFromDB = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: facultySearchableFields.map(field => ({
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

  const result = await Faculty.find(whereConditions)
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

  const total = await Faculty.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const facultyService = {
  getSingleFacultyFromDB,
  updateFacultyFromDB,
  deleteFacultyFromDB,
  getAllFacultiesFromDB,
};
