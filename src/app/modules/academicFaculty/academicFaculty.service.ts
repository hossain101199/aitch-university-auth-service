import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicFacultySearchableFields } from './academicFaculty.constant';
import {
  IAcademicFaculty,
  IAcademicFacultyFilters,
} from './academicFaculty.interface';
import { academicFaculty } from './academicFaculty.model';

const createAcademicFacultyInDB = async (
  payload: IAcademicFaculty
): Promise<IAcademicFaculty> => {
  const result = await academicFaculty.create(payload);
  return result;
};

const getSingleAcademicFacultyFromDB = async (
  id: string
): Promise<IAcademicFaculty | null> => {
  const result = await academicFaculty.findById(id);
  return result;
};

const updateAcademicFacultyInDB = async (
  id: string,
  payload: IAcademicFaculty
): Promise<IAcademicFaculty | null> => {
  const result = await academicFaculty.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteAcademicFacultyFromDB = async (
  id: string
): Promise<IAcademicFaculty | null> => {
  const result = await academicFaculty.findByIdAndDelete(id);
  return result;
};

const getAllFacultiesFromDB = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicFacultySearchableFields.map(field => ({
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

  const result = await academicFaculty
    .find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await academicFaculty.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const academicFacultyService = {
  createAcademicFacultyInDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyInDB,
  deleteAcademicFacultyFromDB,
  getAllFacultiesFromDB,
};
