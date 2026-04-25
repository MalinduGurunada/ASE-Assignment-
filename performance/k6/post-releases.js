import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, authHeaders } from './common/config.js';
import { ensureProduct, loginAsAdmin } from './common/auth.js';

export const options = {
  scenarios: {
    write_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 30 },
        { duration: '30s', target: 60 },
        { duration: '30s', target: 0 }
      ]
    }
  }
};
