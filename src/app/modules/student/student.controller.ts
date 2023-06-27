import { RequestHandler } from 'express';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IStudent } from './student.interface';
import { studentService } from './student.service';

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await studentService.getSingleStudentFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Student with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IStudent>(res, {
      statusCode: 200,
      success: true,
      message: 'Student retrieved successfully',
      data: result,
    });
  }
});

const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await studentService.deleteStudentFromDB(id);

  sendResponse<IStudent>(res, {
    statusCode: 200,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

export const studentController = {
  getSingleStudent,
  deleteStudent,
};
