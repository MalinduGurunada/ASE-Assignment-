export const BASE_URL = process.env.PW_API_BASE_URL ?? 'http://localhost:8080';

export const ADMIN_USER = {
  username: process.env.PW_ADMIN_USERNAME ?? 'admin',
  password: process.env.PW_ADMIN_PASSWORD ?? 'password'
};
