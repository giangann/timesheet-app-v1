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

export type TDutyCalendar = {
  dutyFormId: number;
  date: string; // YYYY-MM-DD
  dutyType: string;
  dayOfWeek: string;
};
export type TDutyCalendarFilterParams = {
  startDate: string;
  endDate: string;
};
export type TDutyCalendarDetail = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  dutyType: {
    id: number;
    name: string;
  };
  salaryCoefficientType: {
    id: number;
    name: string;
    coefficient: number;
  };
};
