import { TPagiParams } from "@/types";
import { EventItem } from "@howljs/calendar-kit";

export const UNIT_DIMENSION = 1;
export const UNIT_FONTSIZE = 1;

export enum FORM_STATUS {
  WATING_APPROVE = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELED = 3,
}

export enum FORM_NOTI_TYPE {
  LEAVE_FORM = "leaveForm",
  OVERTIME_FORM = "overtimeForm",
  DUTY_FORM = "dutyForm",
}
export enum FORM_NOTI_ACTION_TYPE {
  APPROVE_FORM = "APPROVE_FORM",
  NEW_FORM = "NEW_FORM",
}

export const FORM_NOTI_NAME = {
  [FORM_NOTI_TYPE.LEAVE_FORM]: "Đơn xin nghỉ",
  [FORM_NOTI_TYPE.OVERTIME_FORM]: "Đơn làm ngoài giờ",
  [FORM_NOTI_TYPE.DUTY_FORM]: "Đơn trực",
};

export const FORM_STATUS_NAME = {
  [FORM_STATUS.WATING_APPROVE]: "Chờ phê duyệt",
  [FORM_STATUS.ACCEPTED]: "Chấp thuận",
  [FORM_STATUS.REJECTED]: "Từ chối",
  [FORM_STATUS.CANCELED]: "Đã hủy",
};

export enum ROLE_CODE {
  DEPARTMENT_DIRECTOR = "DEPARTMENT_DIRECTOR",
  TEAM_DIRECTOR = "TEAM_DIRECTOR",
  ARCHIVIST = "ARCHIVIST",
  ADMIN = "ADMIN",
  SPECIALIST = "SPECIALIST",
}

// FOR TIMESHEET
export enum WORKING_TYPE {
  ALL = 1,
  HALF = 2,
}
export const WORKING_TYPE_COLOR = {
  [WORKING_TYPE.ALL]: "#067D4E",
  [WORKING_TYPE.HALF]: "#FF9C01",
};
export const WORKING_TYPE_NULL_COLOR = "#F31121";

export enum TIMESHEET_FORM_TYPE {
  LEAVE = 1,
  OT = 2,
  DUTY = 3,
}
export const TIMESHEET_FORM_TYPE_COLOR = {
  [TIMESHEET_FORM_TYPE.LEAVE]: "#AF32D0",
  [TIMESHEET_FORM_TYPE.OT]: "#0B67CC",
  [TIMESHEET_FORM_TYPE.DUTY]: "#000000",
};

export enum NOTI_STATUS {
  UNREAD = 0,
  READ = 1,
}

export const DEFAULT_PAGI_PARAMS: TPagiParams = {
  page: 0,
  size: 5,
};

export const DEFAULT_DATE_RANGE_DUTY_CALENDAR = {
  startDate: "2020-01-01",
  endDate: "2030-12-31",
};

export enum EVENT_ITEM_PREFIX {
  CALENDAR = "CALENDAR",
  DUTY_FORM = "DUTY_FORM",
  LEAVE_FORM = "LEAVE_FORM",
}

export const EVENT_COLOR = {
  [EVENT_ITEM_PREFIX.CALENDAR]: "#067D4E",
  [EVENT_ITEM_PREFIX.DUTY_FORM]: "#C60C6E",
  [EVENT_ITEM_PREFIX.LEAVE_FORM]: "#447AC9",
};

export const _mockEvents: EventItem[] = [
  {
    id: "0",
    start: { date: "2024-11-20" },
    end: { date: "2024-11-22" },
    title: "Họp hội nghị VPTW",
    color: "#067D4E",
  },
  {
    id: "1",
    start: { dateTime: "2024-11-23T01:00:00.000Z" },
    end: { dateTime: "2024-11-23T10:00:00.000Z" },
    title: "Trực kĩ thuật cuối tuần t7",
    color: "#C60C6E",
  },
  {
    id: "2",
    start: { dateTime: "2024-11-24T01:00:00.000Z" },
    end: { dateTime: "2024-11-24T10:00:00.000Z" },
    title: "Trực kĩ thuật cuối tuần ngày chủ nhật",
    color: "#447AC9",
  },
  {
    id: "3",
    start: { dateTime: "2024-11-25T01:00:00.000Z" },
    end: { dateTime: "2024-11-25T05:00:00.000Z" },
    title: "Họp giao ban sáng",
    color: "#067D4E",
  },
  {
    id: "4",
    start: { date: "2024-11-25" },
    end: { date: "2024-11-28" },
    title: "Đồng chí Đặng Xuân Tiến đi công tác",
    color: "#447AC9",
  },
];

const allDayEvents: EventItem[] = [
  {
    id: "event_0",
    start: {
      date: "2024-09-14",
    },
    end: {
      date: "2024-09-24",
    },
    title: "Event 0",
    color: "#5428F2",
  },
  {
    id: "event_0x",
    start: {
      dateTime: "2024-09-16T22:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-22T23:00:00.000+07:00",
    },
    title: "Event 0x",
    color: "#5428F2",
  },
  {
    id: "event_1",
    start: {
      dateTime: "2024-09-16T22:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-18T22:00:00.000+07:00",
    },
    title: "Event 1",
    color: "#5428F2",
  },
  {
    id: "event_1x",
    start: {
      dateTime: "2024-09-16T00:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-19T00:00:00.000+07:00",
    },
    title: "Event 1x",
    color: "#5428F2",
  },
  {
    id: "event_2",
    start: {
      dateTime: "2024-09-21T00:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-22T00:00:00.000+07:00",
    },
    title: "Event 2",
    color: "#8EBB85",
  },
  {
    id: "event_2x",
    start: {
      date: "2024-09-18",
    },
    end: {
      date: "2024-09-21",
    },
    title: "Event 2x",
    color: "#5428F2",
  },
  {
    id: "event_3c",
    start: {
      date: "2024-09-16",
    },
    end: {
      date: "2024-09-16",
    },
    title: "Event 3",
    color: "#B70100",
  },
  {
    id: "event_3xx",
    start: {
      dateTime: "2024-09-16T22:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-17T22:00:00.000+07:00",
    },
    title: "Event 3xx",
    color: "#5428F2",
  },
  {
    id: "event_3x",
    start: {
      dateTime: "2024-09-16T15:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-17T23:00:00.000+07:00",
    },
    title: "Event 3x",
    color: "#5428F2",
  },
  {
    id: "event_4",
    start: {
      dateTime: "2024-09-20T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-21T17:00:00.000Z",
    },
    title: "Event 4",
    color: "#B70100",
  },
  {
    id: "event_5",
    start: {
      dateTime: "2024-09-19T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-21T17:00:00.000Z",
    },
    title: "Event 5",
    color: "#EAAB7E",
  },
  {
    id: "event_6",
    start: {
      dateTime: "2024-09-17T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-18T17:00:00.000Z",
    },
    title: "Event 6x",
    color: "#AC2A57",
  },
  {
    id: "event_7",
    start: {
      dateTime: "2024-09-20T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-21T17:00:00.000Z",
    },
    title: "Event 7",
    color: "#DC1F98",
  },
  {
    id: "event_8",
    start: {
      dateTime: "2024-09-19T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-21T17:00:00.000Z",
    },
    title: "Event 8",
    color: "#6E911C",
  },
  {
    id: "event_9",
    start: {
      dateTime: "2024-09-20T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-22T17:00:00.000Z",
    },
    title: "Event 9",
    color: "#BE1459",
  },
  {
    id: "event_10",
    start: {
      dateTime: "2024-09-19T17:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-21T17:00:00.000Z",
    },
    title: "Event 10",
    color: "#BA3D9D",
  },
  {
    id: "event_11",
    start: {
      dateTime: "2024-09-20T00:00:00.000+07:00",
    },
    end: {
      dateTime: "2024-09-26T00:00:00.000+07:00",
    },
    title: "Event 11",
    color: "#BA3D9D",
  },
  {
    id: "event_2xx3",
    start: {
      date: "2024-09-16",
    },
    end: {
      date: "2024-09-17",
    },
    title: "All day Recurring",
    color: "#BA3D9D",
    recurrence: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,TH,FR",
    excludeDates: ["2024-09-16", "2024-09-22"],
  },
  {
    id: "event_26",
    start: {
      dateTime: "2024-09-16T05:00:00.000Z",
    },
    end: {
      dateTime: "2024-09-16T07:00:00.000Z",
    },
    title: "Event Recurring",
    color: "#BA3D9D",
    recurrence: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,TH,FR",
    excludeDates: ["2024-09-16T05:00:00.000Z", "2024-09-22T05:00:00.000Z", "2024-10-11T05:00:00.000Z"],
  },
];

const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 4, new Date().getDate());
const TOTAL_RESOURCES = 3;

const generateEvents = () => {
  return new Array(500)
    .fill(0)
    .map((_, index) => {
      const randomDateByIndex = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate() + Math.floor(index / 2),
        Math.floor(Math.random() * 24),
        Math.round((Math.random() * 60) / 15) * 15
      );
      const duration = (Math.floor(Math.random() * 15) + 1) * 15 * 60 * 1000;
      const endDate = new Date(randomDateByIndex.getTime() + duration);

      return {
        id: `event_${index + 1}`,
        start: {
          dateTime: randomDateByIndex.toISOString(),
        },
        end: {
          dateTime: endDate.toISOString(),
        },
        title: `Event ${index + 1}`,
        color: randomColor(),
        resourceId: `resource_${Math.floor(Math.random() * TOTAL_RESOURCES) + 1}`,
      } as EventItem;
    })
    .concat(allDayEvents);
};
