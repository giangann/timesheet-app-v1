export type THomeData = {
  numberOfFormNeedApprove: number; // số đơn lãnh đạo chưa phê duyệt
  numberOfCurrentMonthTimeKeeping: number; // số ngày đã chám công trong tháng, chấp nhận 0.5 (vd: 19.5)
  haveTimeKeepingForTeamToday: boolean; // Văn thư hôm nay đã chấm công cho team hay chưa
  numberOfTeamMember: number; // số lượng thành viên của team.
  numberOfUnreadFormNotify: number; // số thông báo kiểu form chưa đọc
  haveTimeKeepingToday: boolean; // hôm nay người dùng đã được Văn thư chấm công hay chưa
  workingDayStartTime: string; // giờ bắt đầu làm việc của Phòng ban trong ngày làm việc
  workingDayEndTime: string; // giờ kết thúc làm việc của Phòng ban trong ngày làm việc
};

export type TUserProfile = {
  // team info
  numberOfTeamMember: number; // số thành viên trong team
  teamName: string;
  teamHotline: string;
  // salary info
  salaryCoefficient: number; // hệ số lương
  positionBonusCoefficient: number; // phụ cấp chức vụ
  otherBonusCoefficient: number; // phu cap khac
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
