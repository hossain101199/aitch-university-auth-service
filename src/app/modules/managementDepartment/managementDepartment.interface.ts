import { Model } from 'mongoose';

export type IManagementDepartment = {
  title: string;
};

export type managementDepartmentModel = Model<IManagementDepartment>;

export type IManagementDepartmentFilters = {
  searchTerm?: string;
};
