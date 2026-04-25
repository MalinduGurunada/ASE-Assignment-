import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { loginAsAdmin } from './common/auth.js';

export const options = {
  scenarios: {
    steady_release_reads: {
      executor: 'constant-vus',
      vus: Number(__ENV.K6_LOAD_VUS || 75),
      duration: __ENV.K6_LOAD_DURATION || '2m'
    }
  },
  thresholds: {
    ...SHARED_THRESHOLDS
  }
};
