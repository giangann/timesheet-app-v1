import { FORM_NOTI_TYPE, FORM_STATUS, NOTI_STATUS } from "@/constants/Misc";

export type TNoti = {
  id: number;
  message: string;
  obj: {
    approveDate: string | null;
    attachFileId: number;
    createdAt: string;
    endDate: string;
    id: number;
    isDeleted: boolean;
    leaveFormTypeId: number;
    note: string;
    reason: string | null;
    startDate: string;
    status: FORM_STATUS;
    updatedAt: string;
    userApproveId: number;
    userId: number;
  };
  status: NOTI_STATUS;
  timestamp: string | number | null;
  title: string;
  type: FORM_NOTI_TYPE;
};
