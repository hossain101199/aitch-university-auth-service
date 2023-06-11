import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterFilterableFields } from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';
import { academicSemesterService } from './academicSemester.service';

const createSemester: RequestHandler = catchAsync(async (req, res, next) => {
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
  next();
});

const getAllSemesters: RequestHandler = catchAsync(async (req, res, next) => {
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
  next();
});

export const academicSemesterController = {
  createSemester,
  getAllSemesters,
};
