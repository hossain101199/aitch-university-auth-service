import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IStudent } from './student.interface';
import { Student } from './student.model';

const getSingleStudentFromDB = async (
  payload: string
): Promise<IStudent | null> => {
  const result = await Student.findOne({ id: payload })
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    });

  return result;
};

const deleteStudentFromDB = async (
  payload: string
): Promise<IStudent | null> => {
  const isStudentExist = await Student.findOne({ id: payload });

  if (!isStudentExist) {
    throw new ApiError(
      404,
      `Error: Student with ID ${payload} is not found. Please verify the provided ID and try again`
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await Student.findOneAndDelete({ id: payload }, { session })
      .populate('academicSemester')
      .populate({
        path: 'academicDepartment',
        populate: [
          {
            path: 'academicFaculty',
          },
        ],
      });

    if (!result) {
      throw new ApiError(404, 'Failed to delete student');
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

export const studentService = {
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
