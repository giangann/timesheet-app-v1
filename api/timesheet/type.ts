export type MonthTimesheet = {
  date: string; // (YYYY-MM-DD)
  workingTypeId: number | null; // 1 || 2 || null
  leaveFormId: number | null;
  overtimeFormId: number | null;
  dutyFormId: number | null;
};

export type MonthTimesheetList = MonthTimesheet[];

export type TMonthTimesheetListParams = {
  userIdentifyCard: string;
  month: string | number;
  year: string | number;
};
