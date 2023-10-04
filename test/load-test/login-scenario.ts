//** k6 run .\login-scenario.ts --out influxdb=http://localhost:8086/myk6db
import http from 'k6/http';
import { check } from 'k6';

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const VUS = 1000;
const DURATION = '30s';

export const options = {
  vus: VUS,
  duration: DURATION,
};

export function setup() {}

export default function () {
  const url = 'http://localhost:3000/auth/login';

  const payload = JSON.stringify({
    auth_id: 'bb1',
    auth_password: 'b123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  const token = JSON.parse(res.body).access_token;

  const re_val = http.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  check(re_val, {
    '[auth/login] status is 200': (res) => res.status === 200,
  });
}

export function handleSummary(data) {
  return {
    'k6-summary.html': htmlReport(data),
  };
}
