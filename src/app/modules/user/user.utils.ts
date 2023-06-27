import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

// Function to find the ID of the last student in the database
export const findLastStudentId = async (): Promise<string | undefined> => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 }) // Find the last student with the role 'student'
    .sort({ createdAt: -1 }) // Sort the results based on the 'createdAt' field in descending order
    .lean(); // Convert the result to a plain JavaScript object

  // Return the ID of the last student (if exists), or undefined if no student found
  return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
};

// Function to generate a new student ID based on the academic semester
export const generateStudentId = async (
  academicSemester: IAcademicSemester
) => {
  // Get the current ID by finding the last student ID or using '00000' if no previous student exists
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, '0');

  // Generate the incremented ID by combining the academic semester details and the current ID
  const incrementedId = `${academicSemester.year.substring(2)}${
    academicSemester.code
  }${(parseInt(currentId) + 1).toString().padStart(5, '0')}`;

  // Return the generated student ID
  return incrementedId;
};
