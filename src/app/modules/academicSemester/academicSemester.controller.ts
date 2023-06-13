import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterFilterableFields } from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';
import { academicSemesterService } from './academicSemester.service';

const createSemester: RequestHandler = catchAsync(async (req, res) => {
  const academicSemesterData = req.body;

  const result = await academicSemesterService.createSemesterInDB(
    academicSemesterData
  );

  sendResponse<IAcademicSemester>(res, {
    statusCode: 200,
    success: true,
    message: 'Academic semester is created successfully',
    data: result,
  });
});

const getSingleSemester: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await academicSemesterService.getSingleSemesterFromDB(id);

  if (result === null) {
    sendResponse<IAcademicSemester>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Academic semester with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<IAcademicSemester>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic semesters retrieved successfully',
      data: result,
    });
  }
});

const updateSemester: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateAcademicSemesterData = req.body;

  const result = await academicSemesterService.updateSemesterInDB(
    id,
    updateAcademicSemesterData
  );
  if (result === null) {
    sendResponse<IAcademicSemester>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Academic semester with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<IAcademicSemester>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic semester updated successfully',
      data: result,
    });
  }
});

const deleteSemester: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await academicSemesterService.deleteSemesterFromDB(id);

  if (result === null) {
    sendResponse<IAcademicSemester>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Academic semester with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<IAcademicSemester>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic semester deleted successfully',
      data: result,
    });
  }
});

const getAllSemesters: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, academicSemesterFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await academicSemesterService.getAllSemestersFromDB(
    filters,
    paginationOptions
  );

  sendResponse<IAcademicSemester[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Semesters retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const academicSemesterController = {
  createSemester,
  getSingleSemester,
  updateSemester,
  deleteSemester,
  getAllSemesters,
};
