import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { ensureProduct, loginAsAdmin } from './common/auth.js';

const releasePayloads = new SharedArray('releasePayloads', function () {
  return [
    { version: '1.0.0', name: 'Core Authentication Module', environment: 'staging' },
    { version: '1.1.0', name: 'Dashboard Analytics Feature', environment: 'staging' },
    { version: '1.2.0', name: 'CSV Export Enhancement', environment: 'production' },
    { version: '2.0.0', name: 'Role-Based Access Control Upgrade', environment: 'staging' },
    { version: '2.1.0', name: 'Audit Log Streaming', environment: 'production' },
    { version: '2.2.0', name: 'State Machine Refactor', environment: 'staging' },
    { version: '3.0.0', name: 'Multi-Environment Deployment Support', environment: 'production' },
    { version: '3.1.0', name: 'Changelog Diff Viewer', environment: 'staging' },
    { version: '3.2.0', name: 'Webhook Notification Integration', environment: 'production' },
    { version: '4.0.0', name: 'Performance Monitoring Dashboard', environment: 'staging' }
  ];
});
