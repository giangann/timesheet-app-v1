import moment from "moment";

/**
 * Sorts an array of objects by a `date` field in either ascending or descending order.
 *
 * @template T - The type of the objects in the array, which must include a `date` field of type string.
 * @param listWithDateField - An array of objects to be sorted, where each object must contain a `date` field in the format YYYY-MM-DD.
 * @param sort - The order in which to sort the dates. Defaults to "ASC" (ascending).
 *               - "ASC" for ascending order (oldest to newest).
 *               - "DESC" for descending order (newest to oldest).
 * @returns A new array of objects sorted by the `date` field.
 *
 * @example
 * ```typescript
 * const data = [
 *   { id: 1, date: "2024-08-29", name: "Item 1" },
 *   { id: 2, date: "2023-08-29", name: "Item 2" },
 *   { id: 3, date: "2025-08-29", name: "Item 3" }
 * ];
 *
 * const sortedDataAsc = sortByDate(data, "ASC");
 * console.log(sortedDataAsc);
 * // Output: [
 * //   { id: 2, date: "2023-08-29", name: "Item 2" },
 * //   { id: 1, date: "2024-08-29", name: "Item 1" },
 * //   { id: 3, date: "2025-08-29", name: "Item 3" }
 * // ]
 *
 * const sortedDataDesc = sortByDate(data, "DESC");
 * console.log(sortedDataDesc);
 * // Output: [
 * //   { id: 3, date: "2025-08-29", name: "Item 3" },
 * //   { id: 1, date: "2024-08-29", name: "Item 1" },
 * //   { id: 2, date: "2023-08-29", name: "Item 2" }
 * // ]
 * ```
 *
 * @throws Will throw an error if the `date` field is not in the format YYYY-MM-DD.
 */
export function sortByDate<T extends Record<string, unknown> & { date: string }>(listWithDateField: T[], sort: "ASC" | "DESC" = "ASC"): T[] {
  return listWithDateField.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Ensure the date is valid by checking if it is "Invalid Date".
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      throw new Error("Invalid date format. Expected format is YYYY-MM-DD.");
    }

    if (sort === "ASC") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
}

/**
 * Extracts the day from a date string in the format YYYY-MM-DD.
 *
 * @param date - The date string in the format YYYY-MM-DD.
 * @returns The day as a string. If the date is invalid, an error is thrown.
 *
 * @example
 * ```typescript
 * const day = dayFromDate("2024-07-30");
 * console.log(day); // Output: "30"
 * ```
 *
 * @throws Will throw an error if the date string is not in the format YYYY-MM-DD.
 */
export function dayFromDate(date: string): string {
  // Validate the date string format using a regular expression.
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    throw new Error("Invalid date format. Expected format is YYYY-MM-DD.");
  }

  // Split the date string and return the day part.
  return date.split("-")[2];
}

/**
 * Trả về tên ngày trong tuần theo định dạng tiếng Việt.
 *
 * @param date - Chuỗi ngày theo định dạng YYYY-MM-DD.
 * @returns Tên ngày trong tuần (ví dụ: "Thứ Hai").
 *
 * @example
 * ```typescript
 * const dayName = getDayOfWeekNameInVietnamese("2024-07-30");
 * console.log(dayName); // Output: "Thứ Ba"
 * ```
 *
 * @throws Sẽ ném lỗi nếu chuỗi ngày không theo định dạng YYYY-MM-DD.
 */
export function getDayOfWeekNameInVietnamese(date: string): string {
  // Validate the date string format using a regular expression.
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    throw new Error("Định dạng ngày không hợp lệ. Định dạng mong đợi là YYYY-MM-DD.");
  }

  // Create a new Date object from the date string.
  const dateObj = new Date(date);

  // Array of day names in Vietnamese.
  const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  // Return the name of the day of the week in Vietnamese.
  return dayNames[dateObj.getDay()];
}

/**
 * Trả về tên viết tắt của ngày trong tuần theo định dạng tiếng Việt.
 *
 * @param date - Chuỗi ngày theo định dạng YYYY-MM-DD.
 * @returns Tên ngày viết tắt trong tuần (ví dụ: "T2").
 *
 * @example
 * ```typescript
 * const dayShortName = getDayOfWeekShortNameInVietnamese("2024-07-30");
 * console.log(dayShortName); // Output: "T3"
 * ```
 *
 * @throws Sẽ ném lỗi nếu chuỗi ngày không theo định dạng YYYY-MM-DD.
 */
export function getDayOfWeekShortNameInVietnamese(date: string): string {
  // Validate the date string format using a regular expression.
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    throw new Error("Định dạng ngày không hợp lệ. Định dạng mong đợi là YYYY-MM-DD.");
  }

  // Create a new Date object from the date string.
  const dateObj = new Date(date);

  // Array of day short names in Vietnamese.
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Return the short name of the day of the week in Vietnamese.
  return dayNames[dateObj.getDay()];
}

/**
 * Trả về tên tháng trong năm theo định dạng tiếng Việt.
 *
 * @param date - Chuỗi ngày theo định dạng YYYY-MM-DD.
 * @returns Tên tháng trong năm (ví dụ: "Tháng 7").
 *
 * @example
 * ```typescript
 * const monthName = getMonthNameInVietnamese("2024-07-30");
 * console.log(monthName); // Output: "Tháng 7"
 * ```
 *
 * @throws Sẽ ném lỗi nếu chuỗi ngày không theo định dạng YYYY-MM-DD.
 */
export function getMonthNameInVietnamese(date: string): string {
  // Validate the date string format using a regular expression.
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    throw new Error("Định dạng ngày không hợp lệ. Định dạng mong đợi là YYYY-MM-DD.");
  }

  // Create a new Date object from the date string.
  const dateObj = new Date(date);

  // Return the name of the month in Vietnamese.
  return `Tháng ${dateObj.getMonth() + 1}`;
}

/**
 * Converts a time string from HH:mm:ss format to HH:mm format.
 * Validates the input to ensure it is in the correct HH:mm:ss format.
 * @param time - The input time string in HH:mm:ss format.
 * @returns The time string in HH:mm format or an error message if input is invalid.
 */
export function convertTimeToHHMM(time: string | undefined): string | undefined {
  if (!time) return time;
  // Regular expression to match the HH:mm:ss format
  const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  // Validate the input format
  if (!timeFormatRegex.test(time)) {
    return "Invalid time";
  }

  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export const formatRelativeTime = (dateString: string) => {
  const now = moment();
  const date = moment(dateString);
  const diffInMinutes = now.diff(date, "minutes");
  const diffInHours = now.diff(date, "hours");
  const diffInDays = now.diff(date, "days");

  if (diffInMinutes < 60) {
    // Less than an hour ago
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    // Less than a day ago
    return `Hôm nay ${date.format("HH:mm")}`;
  } else if (diffInDays === 1) {
    // Yesterday
    return `Hôm qua ${date.format("HH:mm")}`;
  } else {
    // More than a day ago
    return date.format("DD/MM/YYYY HH:mm");
  }
};

export const formatRelativeTimeWithLongText = (dateString: string) => {
  const now = moment();
  const date = moment(dateString);
  const diffInMinutes = now.diff(date, "minutes");
  const diffInHours = now.diff(date, "hours");
  const diffInDays = now.diff(date, "days");

  if (diffInMinutes < 60) {
    // Less than an hour ago
    return `Được tạo lúc ${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    // Less than a day ago
    return `Được tạo vào Hôm nay lúc ${date.format("HH:mm")}`;
  } else if (diffInDays === 1) {
    // Yesterday
    return `Được tạo vào Hôm qua ${date.format("HH:mm")}`;
  } else {
    // More than a day ago
    return `Được tạo ngày ${date.format("DD/MM/YYYY")} lúc ${date.format("HH:mm")}`;
  }
};

export function formatDateToLocalString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are zero-based
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
