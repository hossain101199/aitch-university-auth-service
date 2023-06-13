import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';

import { academicDepartmentFilterableFields } from './academicDepartment.constant';
import { IAcademicDepartment } from './academicDepartment.interface';
import { academicDepartmentService } from './academicDepartment.service';

const createAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const academicDepartmentData = req.body;

    const result = await academicDepartmentService.createAcademicDepartmentInDB(
      academicDepartmentData
    );

    sendResponse<IAcademicDepartment>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department is created successfully',
      data: result,
    });
  }
);

const getSingleAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await academicDepartmentService.getSingleAcademicDepartmentFromDB(id);

    if (result === null) {
      sendResponse<IAcademicDepartment>(res, {
        statusCode: 404,
        success: false,
        message: `Error: Academic department with ID ${id} is not found. Please verify the provided ID and try again`,
        data: result,
      });
    } else {
      sendResponse<IAcademicDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic department retrieved successfully',
        data: result,
      });
    }
  }
);

const updateAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const result = await academicDepartmentService.updateAcademicDepartmentInDB(
      id,
      updatedData
    );

    if (result === null) {
      sendResponse<IAcademicDepartment>(res, {
        statusCode: 404,
        success: false,
        message: `Error: Academic department with ID ${id} is not found. Please verify the provided ID and try again`,
        data: result,
      });
    } else {
      sendResponse<IAcademicDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic department updated successfully',
        data: result,
      });
    }
  }
);

const deleteAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await academicDepartmentService.deleteAcademicDepartmentFromDB(id);

    if (result === null) {
      sendResponse<IAcademicDepartment>(res, {
        statusCode: 404,
        success: false,
        message: `Error: Academic department with ID ${id} is not found. Please verify the provided ID and try again`,
        data: result,
      });
    } else {
      sendResponse<IAcademicDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic department deleted successfully',
        data: result,
      });
    }
  }
);

const getAllAcademicDepartments: RequestHandler = catchAsync(
  async (req, res) => {
    const filters = pick(req.query, academicDepartmentFilterableFields);

    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await academicDepartmentService.getAllAcademicDepartmentsFromDB(
        filters,
        paginationOptions
      );

    sendResponse<IAcademicDepartment[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const academicDepartmentController = {
  createAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment,
  getAllAcademicDepartments,
};
