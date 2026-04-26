import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { loginAsAdmin } from './common/auth.js';

export const options = {
  scenarios: {
    stress_releases: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.K6_STRESS_S1_DURATION || '30s', target: Number(__ENV.K6_STRESS_S1_TARGET || 25) },
        { duration: __ENV.K6_STRESS_S2_DURATION || '1m', target: Number(__ENV.K6_STRESS_S2_TARGET || 50) },
        { duration: __ENV.K6_STRESS_S3_DURATION || '1m', target: Number(__ENV.K6_STRESS_S3_TARGET || 100) }
      ]
    }
  }
};
