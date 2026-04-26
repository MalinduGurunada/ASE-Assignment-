import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, authHeaders } from './config.js';
