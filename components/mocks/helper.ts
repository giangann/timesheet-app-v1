export const isEmpty = (value: any) => {
  if (value == null) {
    // Checks for null and undefined
    return true;
  }

  if (typeof value === "object") {
    // If it's an object, check if it has any own enumerable properties
    return Object.keys(value).length === 0;
  }

  if (typeof value === "string" || Array.isArray(value)) {
    // If it's a string or an array, check the length
    return value.length === 0;
  }

  // For all other data types (like numbers, booleans), return true (they're "empty")
  return true;
};
