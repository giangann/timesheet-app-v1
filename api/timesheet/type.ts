export type MonthTimesheet = {
  date: string; // (YYYY-MM-DD)
  workingTypeId: number | null; // 1 || 2 || null
  leaveFormId: number | null; // one of those: 1706:1702:1703:1708:1707:1705:1704:1803:1804:1802:1952:1953:1954 or null
  overtimeFormId: number | null; // one of those: 2:102 or null
  dutyFormId: number | null; // one of those: 254:304:352:353 or null
};
export type MonthTimesheetList = MonthTimesheet[];

export type TMonthTimesheetListParams = {
  userIdentifyCard: string;
  month: string | number;
  year: string | number;
};
