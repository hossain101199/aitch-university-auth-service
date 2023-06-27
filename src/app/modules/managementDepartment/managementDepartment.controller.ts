import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { managementDepartmentFilterableFields } from './managementDepartment.constant';
import { IManagementDepartment } from './managementDepartment.interface';
import { managementDepartmentService } from './managementDepartment.service';

const createManagementDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const managementDepartmentTitle = req.body;

    const result =
      await managementDepartmentService.createManagementDepartmentInDB(
        managementDepartmentTitle
      );

    sendResponse<IManagementDepartment>(res, {
      statusCode: 200,
      success: true,
      message: 'Management department is created successfully',
      data: result,
    });
  }
);

const getSingleManagementDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await managementDepartmentService.getSingleManagementDepartmentFromDB(id);

    if (result === null) {
      throw new ApiError(
        404,
        `Error: Management department with ID ${id} is not found. Please verify the provided ID and try again`
      );
    } else {
      sendResponse<IManagementDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Management department retrieved successfully',
        data: result,
      });
    }
  }
);

const updateManagementDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const result =
      await managementDepartmentService.updateManagementDepartmentInDB(
        id,
        updatedData
      );

    if (result === null) {
      throw new ApiError(
        404,
        `Error: Management department with ID ${id} is not found. Please verify the provided ID and try again`
      );
    } else {
      sendResponse<IManagementDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Management department updated successfully',
        data: result,
      });
    }
  }
);

const deleteManagementDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await managementDepartmentService.deleteManagementDepartmentFromDB(id);

    if (result === null) {
      throw new ApiError(
        404,
        `Error: Management department with ID ${id} is not found. Please verify the provided ID and try again`
      );
    } else {
      sendResponse<IManagementDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Management department deleted successfully',
        data: result,
      });
    }
  }
);

const getAllManagementDepartments: RequestHandler = catchAsync(
  async (req, res) => {
    const filters = pick(req.query, managementDepartmentFilterableFields);

    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await managementDepartmentService.getAllManagementDepartmentsFromDB(
        filters,
        paginationOptions
      );

    sendResponse<IManagementDepartment[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Management department retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const managementDepartmentController = {
  createManagementDepartment,
  getSingleManagementDepartment,
  updateManagementDepartment,
  deleteManagementDepartment,
  getAllManagementDepartments,
};
