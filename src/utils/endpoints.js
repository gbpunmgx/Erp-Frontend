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

  PAYROLL: {
    GET_ALL: "payrolls/all",
    GET_BY_ID: "payrolls/",
    CREATE: "payrolls/",
    UPDATE: "payrolls/",
    DELETE: "payrolls/",
  },
};
