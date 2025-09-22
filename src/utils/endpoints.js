export const ENDPOINTS = {
  AUTH: {
    LOGIN: `auth/login/web`,
    REFRESH: `auth/refresh`,
    LOGOUT: `auth/logout`,
  },
  USERS: {
    LIST: `users/all`,
    DETAIL: (id) => `users/${id}`,
  },
  PRODUCTS: {
    LIST: `products/list`,
  },
  CUSTOMERS: {
    LIST: `customers/all`,
  },

  EMPLOYEE: {
    GET_ALL: "employees/all",
    GET_BY_ID: "employees/",
    CREATE: "employees/",
    UPDATE: "employees/",
    DELETE: "employees/",
  },

  FEATURE_ACTION: {
    GET_ALL: "featureActions/all",
    GET_BY_ID: "featureActions/",
    CREATE: "featureActions/",
    UPDATE: "featureActions/",
    DELETE: "featureActions/",
  },

  ROLE: {
    GET_ALL: "roles/all",
    GET_BY_ID: "roles/",
    CREATE: "roles/",
    UPDATE: "roles/",
    DELETE: "roles/",
  },

  PAYROLL: {
    GET_ALL: "payrolls/all",
    GET_BY_ID: "payrolls/",
    CREATE: "payrolls/",
    UPDATE: "payrolls/",
    DELETE: "payrolls/",
  },
};
