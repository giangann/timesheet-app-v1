export type TWeekCalendarCreateFormFields = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  title: string | undefined;
  description: string | undefined;
  isAllDay: boolean;
  users: TWeekCalendarCreateFormFieldsUser[];
};
export type TWeekCalendarCreateFormFieldsUser = {
  id: number;
  identifyCard: string;
  name: string;
};
