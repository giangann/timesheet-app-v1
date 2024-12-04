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

export type TWeekCalendar = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  isAllDay: boolean;
};

export type TWeekCalendarCreate = {
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  isAllDay: boolean;
  userIds: number[];
};

export type TWeekCalendarUpdate = {
  startDate?: string;
  endDate?: string;
  title?: string;
  description?: string;
  isAllDay?: boolean;
  userIds?: number[];
};

export type TWeekCalendarDetail = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  isAllDay: boolean;
  users: TWeekCalendarUser[];
};

export type TWeekCalendarUser = {
  id: number;
  name: string;
  email: string | null;
  address: string | null;
  phone: string | null;
  identifyCard: string;
  roleName: string;
  roleCode: string;
  isActive: boolean | null;
  team: {
    id: number;
    name: string;
    code: string | null;
    hotline: string | null;
  };
};
