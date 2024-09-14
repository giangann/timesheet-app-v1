export type TOvertimeFormDetail = {
  id: number;
  userIdentifyCard: string;
  userName: string;
  note: string;
  attachFilePath: string;
  status: number;
  userRole: {
    id: number;
    code: string;
    name: string;
  };
  userTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string;
  };
  reason: string | null;
  userApproveRole: {
    id: number;
    code: string;
    name: string;
  };
  userApproveIdentifyCard: string;
  userApproveName: string;
  approveDate: string | null;

  date: string;
  startTime: string;
  endTime: string;
  typeOfWorking: string | null;
  salaryCoefficientType: {
    id: number;
    name: string;
    coefficient: number;
  };
};
