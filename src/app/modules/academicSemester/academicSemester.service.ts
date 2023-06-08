import ApiError from '../../../errors/ApiError';
import { academicSemesterTitleCodeMapper } from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createSemesterInDB = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  const { year, title } = payload;

  // Check if the semester already exists in the database
  const existingSemester = await AcademicSemester.findOne({ year, title });

  if (existingSemester) {
    throw new ApiError(
      409,
      'A semester with the same year and title already exists.'
    );
  }

  // Check semester code
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(400, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

export const academicSemesterService = {
  createSemesterInDB,
};
