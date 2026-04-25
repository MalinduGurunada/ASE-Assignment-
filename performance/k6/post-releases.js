import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, authHeaders } from './common/config.js';
import { ensureProduct, loginAsAdmin } from './common/auth.js';

export const options = {
  scenarios: {
    write_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.K6_POST_STAGE1_DURATION || '30s', target: Number(__ENV.K6_POST_STAGE1_TARGET || 10) },
        { duration: __ENV.K6_POST_STAGE2_DURATION || '1m', target: Number(__ENV.K6_POST_STAGE2_TARGET || 30) },
        { duration: __ENV.K6_POST_STAGE3_DURATION || '30s', target: Number(__ENV.K6_POST_STAGE3_TARGET || 60) },
        { duration: __ENV.K6_POST_STAGE4_DURATION || '30s', target: Number(__ENV.K6_POST_STAGE4_TARGET || 0) }
      ]
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.08'],
    http_req_duration: ['p(95)<800']
  }
};
