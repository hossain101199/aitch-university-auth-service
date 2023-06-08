import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicSemester } from './academicSemester.interface';
import { academicSemesterService } from './academicSemester.service';

const createSemester: RequestHandler = catchAsync(async (req, res, next) => {
  const { ...academicSemesterData } = req.body;
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

export const academicSemesterController = {
  createSemester,
};
