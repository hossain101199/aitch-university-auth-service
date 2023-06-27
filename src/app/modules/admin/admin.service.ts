import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../user/user.model';
import { adminSearchableFields } from './admin.constant';
import { IAdmin, IAdminFilters } from './admin.interface';
import { Admin } from './admin.model';

const getSingleAdminFromDB = async (
  payload: string
): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ id: payload }).populate(
    'managementDepartment'
  );

  return result;
};

const updateAdminFromDB = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isAdminExist = await Admin.findOne({ id });

  if (!isAdminExist) {
    throw new ApiError(
      404,
      `Error: Admin with ID ${id} is not found. Please verify the provided ID and try again`
    );
  }
  const { name, ...adminData } = payload;

  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.fisrtName`
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  }).populate('managementDepartment');

  return result;
};

const deleteAdminFromDB = async (payload: string): Promise<IAdmin | null> => {
  const isAdminExist = await Admin.findOne({ id: payload });

  if (!isAdminExist) {
    throw new ApiError(
      404,
      `Error: Admin with ID ${payload} is not found. Please verify the provided ID and try again`
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await Admin.findOneAndDelete(
      { id: payload },
      { session }
    ).populate('managementDepartment');

    if (!result) {
      throw new ApiError(404, 'Failed to delete admin');
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

const getAllAdminFromDB = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
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

  const result = await Admin.find(whereConditions)
    .populate('managementDepartment')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
export const adminService = {
  getSingleAdminFromDB,
  updateAdminFromDB,
  deleteAdminFromDB,
  getAllAdminFromDB,
};
