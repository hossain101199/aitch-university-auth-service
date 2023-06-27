import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { IFaculty } from './faculty.interface';
import { facultyService } from './faculty.service';

const getSingleFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await facultyService.getSingleFacultyFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Faculty with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IFaculty>(res, {
      statusCode: 200,
      success: true,
      message: 'Faculty retrieved successfully',
      data: result,
    });
  }
});

const updateFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedFacultyData = req.body;

  const result = await facultyService.updateFacultyFromDB(
    id,
    updatedFacultyData
  );

  sendResponse<IFaculty>(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty updated successfully',
    data: result,
  });
});

const deleteFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await facultyService.deleteFacultyFromDB(id);

  sendResponse<IFaculty>(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty deleted successfully',
    data: result,
  });
});

const getAllFaculties: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, facultyFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await facultyService.getAllFacultiesFromDB(
    filters,
    paginationOptions
  );

  sendResponse<IFaculty[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const facultyController = {
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  getAllFaculties,
};
