const crud = (base, allSuffix = "all") => ({
  GET_ALL: `${base}/${allSuffix}`,
  GET_BY_ID: `${base}/`,
  CREATE: `${base}/`,
  UPDATE: `${base}/`,
  DELETE: `${base}/`,
});

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "auth/login/web",
    REFRESH: "auth/refresh",
    LOGOUT: "auth/logout",
  },

  USER: crud("users"),
  PRODUCTS: {
    LIST: "products/list",
  },
  CUSTOMERS: {
    LIST: "customers/all",
  },
  EMPLOYEE: crud("employees"),
  FEATURE_ACTION: crud("featureActions"),
  ROLE: crud("roles"),
  PAYROLL: crud("payrolls"),
  ATTENDANCE: crud("attendances"),
  FISCAL_YEAR: crud("fiscalYears"),
  DEPARTMENT: crud("departments"),
};
