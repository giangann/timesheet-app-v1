export const UNIT_DIMENSION = 1;
export const UNIT_FONTSIZE = 1;

export enum FORM_STATUS {
  WATING_APPROVE = 0,
  ACCEPTED = 1,
  REJECTED = 2,
}

export const FORM_STATUS_NAME = {
  [FORM_STATUS.WATING_APPROVE]: "Chờ phê duyệt",
  [FORM_STATUS.ACCEPTED]: "Chấp thuận",
  [FORM_STATUS.REJECTED]: "Từ chối",
};
