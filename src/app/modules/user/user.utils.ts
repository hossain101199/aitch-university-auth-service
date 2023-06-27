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
): Promise<string> => {
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

// Function to find the ID of the last faculty in the database
export const findLastFacultyId = async (): Promise<string | undefined> => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 }) // Find the last faculty with the role 'faculty'
    .sort({ createdAt: -1 }) // Sort the results based on the 'createdAt' field in descending order
    .lean(); // Convert the result to a plain JavaScript object

  // Return the ID of the last faculty (if exists), or undefined if no faculty found
  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// Function to generate a new faculty ID.
export const generateFacultyId = async (): Promise<string> => {
  // Get the current ID by finding the last faculty ID or using '00000' if no previous faculty exists
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, '0');

  // Generate the incremented ID by combining F- and the current ID
  const incrementedId = `F-${(parseInt(currentId) + 1)
    .toString()
    .padStart(5, '0')}`;

  // Return the generated faculty ID
  return incrementedId;
};

// Function to find the ID of the last admin in the database
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 }) // Find the last admin with the role 'admin'
    .sort({ createdAt: -1 }) // Sort the results based on the 'createdAt' field in descending order
    .lean(); // Convert the result to a plain JavaScript object

  // Return the ID of the last admin (if exists), or undefined if no admin found
  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

// Function to generate a new admin ID.
export const generateAdminId = async (): Promise<string> => {
  // Get the current ID by finding the last admin ID or using '00000' if no previous admin exists
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, '0');

  // Generate the incremented ID by combining F- and the current ID
  const incrementedId = `A-${(parseInt(currentId) + 1)
    .toString()
    .padStart(5, '0')}`;

  // Return the generated admin ID
  return incrementedId;
};
