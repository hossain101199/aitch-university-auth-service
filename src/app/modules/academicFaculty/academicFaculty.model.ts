import { Schema, model } from 'mongoose';

import { IAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema<IAcademicFaculty>(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const academicFaculty = model<IAcademicFaculty>(
  'academicFaculty',
  academicFacultySchema
);
