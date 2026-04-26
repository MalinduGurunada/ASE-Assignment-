import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { loginAsAdmin } from './common/auth.js';

export const options = {
  stages: [
    // Baseline: establish normal load before the burst
    { duration: '20s', target: 10 },
    // Spike: sudden burst to simulate viral/flash-crowd traffic
    { duration: '20s', target: 250 }
  ]
};
