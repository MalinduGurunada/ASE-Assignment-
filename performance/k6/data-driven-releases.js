import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { ensureProduct, loginAsAdmin } from './common/auth.js';

const releasePayloads = new SharedArray('releasePayloads', function () {
  return [
    { version: '1.0.0', name: 'Core Authentication Module', environment: 'staging' },
    { version: '1.1.0', name: 'Dashboard Analytics Feature', environment: 'staging' }
  ];
});
