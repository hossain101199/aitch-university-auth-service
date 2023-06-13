import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import {
  IAcademicSemester,
  IAcademicSemesterFilters,
} from './academicSemester.interface';
import { academicSemester } from './academicSemester.model';

const createSemesterInDB = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  const { year, title } = payload;

  // Check if the semester already exists in the database
  const existingSemester = await academicSemester.findOne({ year, title });

  if (existingSemester) {
    throw new ApiError(
      409,
      'A semester with the same year and title already exists.'
    );
  }

  // Check semester code
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(400, 'Invalid Semester Code');
  }

  const result = await academicSemester.create(payload);
  return result;
};

const getSingleSemesterFromDB = async (
  payload: string
): Promise<IAcademicSemester | null> => {
  const result = await academicSemester.findById(payload);
  return result;
};

const updateSemesterInDB = async (
  id: string,
  payload: IAcademicSemester
): Promise<IAcademicSemester | null> => {
  // Check semester code
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(400, 'Invalid Semester Code');
  }

  const result = await academicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteSemesterFromDB = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await academicSemester.findByIdAndDelete(id);
  return result;
};

const getAllSemestersFromDB = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicSemesterSearchableFields.map(field => ({
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

  const result = await academicSemester
    .find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await academicSemester.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const academicSemesterService = {
  createSemesterInDB,
  getSingleSemesterFromDB,
  updateSemesterInDB,
  deleteSemesterFromDB,
  getAllSemestersFromDB,
};
