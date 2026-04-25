import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL, SHARED_THRESHOLDS, authHeaders } from './common/config.js';
import { ensureProduct, loginAsAdmin } from './common/auth.js';

/*
A regular JS array is copied into every VU memory space at startup.
SharedArray allocates the dataset once and maps it read-only to all VUs.
This is critical at high VU counts to prevent out-of-memory failures.
*/
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

export const options = {
  scenarios: {
    data_driven_writes: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.K6_DD_STAGE1_DURATION || '20s', target: Number(__ENV.K6_DD_STAGE1_TARGET || 10) },
        { duration: __ENV.K6_DD_STAGE2_DURATION || '1m', target: Number(__ENV.K6_DD_STAGE2_TARGET || 25) },
        { duration: __ENV.K6_DD_STAGE3_DURATION || '20s', target: Number(__ENV.K6_DD_STAGE3_TARGET || 0) }
      ]
    }
  },
  thresholds: {
    ...SHARED_THRESHOLDS,
    http_req_duration: ['p(95)<600'],
    checks: ['rate>0.95']
  }
};

export function setup() {
  const token = loginAsAdmin();
  const productId = ensureProduct(token);
  return { token, productId };
}

export default function (data) {
  const template = releasePayloads[(__VU + __ITER) % releasePayloads.length];
  const suffix = `${__VU}-${__ITER}`;
  const payload = JSON.stringify({
    productId: data.productId,
    version: `${template.version}-${suffix}`,
    name: `[${template.environment.toUpperCase()}] ${template.name} ${suffix}`
  });

  const createRes = http.post(`${BASE_URL}/api/releases`, payload, authHeaders(data.token));
  const created = check(createRes, {
    'POST status 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response contains release id': (r) => {
      try {
        return !!r.json('id');
      } catch {
        return false;
      }
    },
    'release name matches template': (r) => {
      try {
        return r.json('name').includes(template.name);
      } catch {
        return false;
      }
    }
  });

  if (created) {
    const id = createRes.json('id');
    if (id) {
      const readRes = http.get(`${BASE_URL}/api/releases/${id}`, authHeaders(data.token));
      check(readRes, {
        'GET by id returns 200': (r) => r.status === 200,
        'GET version matches posted version': (r) => {
          try {
            return r.json('version').startsWith(template.version);
          } catch {
            return false;
          }
        }
      });
    }
  }
}
