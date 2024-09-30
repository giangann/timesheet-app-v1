export type THoliday = {
  id: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  date: string; // YYYY-MM-DD
  salaryCoefficientTypeId: number;
  activeOutsideWorkingTime: boolean;
};
export type THolidayFilterParams = {
  year: number;
};

export type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};
