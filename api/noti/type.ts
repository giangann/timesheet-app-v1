import { FORM_NOTI_ACTION_TYPE, FORM_NOTI_TYPE, FORM_STATUS, NOTI_STATUS, ROLE_CODE } from "@/constants/Misc";

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
  //
  actionType: FORM_NOTI_ACTION_TYPE;
  createdAt: string;
  senderName: string;
  senderRoleId: number;
  senderRoleName: string;
  senderRoleCode: ROLE_CODE;
  senderTeamName: string | null;
};
