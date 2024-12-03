export type TWeekCalendarCreateFormFields = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  title: string | undefined;
  description: string | undefined;
  isAllDay: boolean;
  users: TWeekCalendarCreateFormFieldsUser[];
};
export type TWeekCalendarCreateFormFieldsUser = {
  userId: number;
  name: string;
  roleName: string;
  teamName: string;
};
