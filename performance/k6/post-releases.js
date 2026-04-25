import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, authHeaders } from './common/config.js';
import { ensureProduct, loginAsAdmin } from './common/auth.js';

export const options = {
  scenarios: {
    write_load: {
      executor: 'ramping-vus',
      stages: []
    }
  }
};
