export const ENDPOINTS = {
  AUTH: {
    LOGIN: `auth/login`,
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
};
