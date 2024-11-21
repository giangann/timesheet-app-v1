import { TTeamUserSort } from "@/api/setting/type";
import { ROLE_CODE } from "@/constants/Misc";

export function hasNullishValue(obj: Record<string, any>): boolean {
  return Object.values(obj).some((value) => value === null || value === undefined);
}
export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
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

/**
 * Formats a number by adding a leading zero for integers in the range [0, 9].
 * If the number is 10 or greater, it returns "9+".
 * For negative numbers, it returns the number as a string.
 * If the number is a float within the range [0, 9], it returns the number without adding a leading zero.
 * @param num - The input number.
 * @returns A formatted string based on the input number.
 */
export function formatNumberWithLeadingZeroOrCap(num: number | null | undefined): string | null | undefined {
  if (num === undefined || num === null) return num;

  // Check if number is a float within the range [0, 9]
  if (num >= 0 && num < 10 && !Number.isInteger(num)) {
    return num.toFixed(1); // Return the float as a string without leading zero
  }

  // For integers in the range [0, 9], add a leading zero
  if (num >= 0 && num < 10 && Number.isInteger(num)) {
    return `0${num}`;
  }

  // // For numbers 10 or greater, return "9+"
  // if (num >= 10) {
  //   return "9+";
  // }

  // For numbers 10 or greater, return number
  if (num >= 10 && Number.isInteger(num)) {
    return num.toString();
  }
  if (num >= 10 && !Number.isInteger(num)) {
    return num.toFixed(1);
  }

  // For negative numbers, return the number as a string
  return num.toFixed(1);
}

export function formatNumberAddLeadingZero(num: number | null | undefined): string | null | undefined {
  if (num === undefined || num === null) return num;

  // Check if number is a float within the range [0, 9]
  if (num >= 0 && num < 10 && !Number.isInteger(num)) {
    return num.toFixed(1); // Return the float as a string without leading zero
  }

  // For integers in the range [0, 9], add a leading zero
  if (num >= 0 && num < 10 && Number.isInteger(num)) {
    return `0${num}`;
  }

  // For numbers 10 or greater, return number
  if (num >= 10 && Number.isInteger(num)) {
    return num.toString();
  }
  if (num >= 10 && !Number.isInteger(num)) {
    return num.toFixed(1);
  }

  // For negative numbers, return the number as a string
  return num.toFixed(1);
}

export function fakeDelay(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export function pickProperties<T extends Record<string, any>>(object: T, selectedKeys: (keyof T)[]): Partial<T> {
  const filteredObject: Partial<T> = {};
  for (const key in object) {
    if (selectedKeys.includes(key)) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
}

export function omitProperties<T extends Record<string, any>>(object: T, excludedKeys: (keyof T)[]): Partial<T> {
  const filteredObject: Partial<T> = {};
  for (const key in object) {
    if (!excludedKeys.includes(key)) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
}

export function omitNullishValues<T extends Record<string, any>>(object: T): Partial<T> {
  const filteredObject: Partial<T> = {};
  for (const key in object) {
    if (object[key] !== null && object[key] !== undefined) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
}
export function paramsObjectToQueryString(paramsObject: Record<string, string | number | null | undefined> | null | undefined): string {
  let prefix = "?";
  let paramsChain = "";
  let atLeastOneParams = false;

  // handle special values
  if (paramsObject === null || paramsObject === undefined) return "";
  if (Object.keys(paramsObject).length === 0) return "";

  //
  Object.entries(paramsObject).forEach(([k, v]) => {
    if (v !== null && v !== undefined) {
      if (typeof v === "number") {
        paramsChain += `${k}=${v.toString()}`;
      } else if (typeof v === "string") {
        paramsChain += `${k}=${v}`;
      }
      paramsChain += "&";
      atLeastOneParams = true;
    }
  });

  // remove last & symbol in paramsChain
  paramsChain = paramsChain.slice(0, -1);

  const queryString = prefix + paramsChain;
  return queryString;
}

/**
 * Generates a summary string for a list of team users.
 *
 * @param {TTeamUserSort[]} users - The array of team users to summarize.
 * @returns {string} A formatted string displaying the first two user names followed by the count of remaining users.
 *                   If the list is empty, returns "No users available".
 *
 * @example
 * const users: TTeamUserSort[] = [
 *   { name: "Hoàng Phương Nhung", ... },
 *   { name: "Trần Thị Hiền", ... },
 *   { name: "Nguyễn Văn An", ... },
 *   { name: "Phạm Quốc Bảo", ... },
 *   { name: "Lê Thị Hoa", ... }
 * ];
 * getUserSummaryString(users);
 * // Returns: "Hoàng Phương Nhung, Trần Thị Hiền và 3 người khác"
 */
export function getUserSummaryString(users: TTeamUserSort[]): string {
  if (users.length === 0) {
    return "No users available";
  }

  const displayedUsers = users
    .slice(0, 2)
    .map((user) => user.name)
    .filter(Boolean);
  const remainingCount = users.length - displayedUsers.length;

  if (remainingCount > 0) {
    return `${displayedUsers.join(", ")} và ${remainingCount} người khác`;
  } else {
    return displayedUsers.join(", ");
  }
}

export function arrayStringToString(arrayOfString: string[]): string {
  return arrayOfString.join(", ");
}
