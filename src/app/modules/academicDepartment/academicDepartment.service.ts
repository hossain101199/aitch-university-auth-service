import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import {
  IAcademicDepartment,
  IAcademicDepartmentFilters,
} from './academicDepartment.interface';
import { academicDepartment } from './academicDepartment.model';

const createAcademicDepartmentInDB = async (
  payload: IAcademicDepartment
): Promise<IAcademicDepartment> => {
  const result = (await academicDepartment.create(payload)).populate(
    'academicFaculty'
  );
  return result;
};

const getSingleAcademicDepartmentFromDB = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  const result = await academicDepartment
    .findById(id)
    .populate('academicFaculty');
  return result;
};

const updateAcademicDepartmentInDB = async (
  id: string,
  payload: IAcademicDepartment
): Promise<IAcademicDepartment | null> => {
  const result = await academicDepartment
    .findByIdAndUpdate(id, payload, {
      new: true,
    })
    .populate('academicFaculty');
  return result;
};

const deleteAcademicDepartmentFromDB = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  const result = await academicDepartment
    .findByIdAndDelete(id)
    .populate('academicFaculty');
  return result;
};

const getAllAcademicDepartmentsFromDB = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicDepartment[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicDepartmentSearchableFields.map(field => ({
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

  const result = await academicDepartment
    .find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('academicFaculty');

  const total = await academicDepartment.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const academicDepartmentService = {
  createAcademicDepartmentInDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentInDB,
  deleteAcademicDepartmentFromDB,
  getAllAcademicDepartmentsFromDB,
};
