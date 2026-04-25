import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { loginAsAdmin } from './common/auth.js';

export const options = {
  scenarios: {
    steady_release_reads: {
      executor: 'constant-vus',
      vus: 75,
      duration: '2m'
    }
  }
};
