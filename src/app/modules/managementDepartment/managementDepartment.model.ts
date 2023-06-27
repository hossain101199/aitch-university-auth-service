import { Schema, model } from 'mongoose';
import { IManagementDepartment } from './managementDepartment.interface';

const managementDepartmentSchema = new Schema<IManagementDepartment>(
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

export const ManagementDepartment = model<IManagementDepartment>(
  'managementDepartment',
  managementDepartmentSchema
);
