import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { adminFilterableFields } from './admin.constant';
import { IAdmin } from './admin.interface';
import { adminService } from './admin.service';

const getSingleAdmin: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await adminService.getSingleAdminFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Admin with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IAdmin>(res, {
      statusCode: 200,
      success: true,
      message: 'Admin retrieved successfully',
      data: result,
    });
  }
});

const updateAdmin: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedAdminData = req.body;

  const result = await adminService.updateAdminFromDB(id, updatedAdminData);

  sendResponse<IAdmin>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin updated successfully',
    data: result,
  });
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await adminService.deleteAdminFromDB(id);

  sendResponse<IAdmin>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});

const getAllAdmins: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await adminService.getAllAdminFromDB(
    filters,
    paginationOptions
  );

  sendResponse<IAdmin[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Admins retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const adminController = {
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
};
