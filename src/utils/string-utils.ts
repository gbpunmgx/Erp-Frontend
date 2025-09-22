export const capitalizeFeatureName = (str: string) => {
  const spaceSeparated = str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .toLowerCase();
  return spaceSeparated
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const capitalizePermissionName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
