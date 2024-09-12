import { ROLE_CODE } from "@/constants/Misc";

export function hasNullishValue(obj: Record<string, any>): boolean {
  return Object.values(obj).some((value) => value === null || value === undefined);
}

export function marginByRole(role: ROLE_CODE | undefined): number {
  let marginHorizontal: number = 40;
  switch (role) {
    case ROLE_CODE.ADMIN:
      marginHorizontal = 40;
      break;
    case ROLE_CODE.DEPARTMENT_DIRECTOR:
      marginHorizontal = 60;
      break;
    case ROLE_CODE.TEAM_DIRECTOR:
      marginHorizontal = 60;
      break;
    case ROLE_CODE.ARCHIVIST:
      marginHorizontal = 40;
      break;
    case ROLE_CODE.SPECIALIST:
      marginHorizontal = 80;
      break;
    default:
      marginHorizontal = 40;
      break;
  }

  return marginHorizontal;
}
