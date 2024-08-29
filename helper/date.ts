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


