//** k6 run .\login-scenario.ts --out influxdb=http://localhost:8086/myk6db
import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const VUS = 1000;
const DURATION = '30s';

export const options = {
  vus: VUS,
  duration: DURATION,
};

const area = ['S', 'A', 'B', 'C'];

export function setup() {}

export default function () {
  const url = 'http://localhost:3000/ticket/reserve_seat_hash';
  const url2 = 'http://localhost:3000/ticket/reserve_seat_list_hash';

  const payload = JSON.stringify({
    user_uuid: uuidv4(),
    show_id: randomIntBetween(1, 20),
    ticket_area: area[randomIntBetween(0, 3)],
    ticket_seat: randomIntBetween(1, 200),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const payload2 = JSON.stringify({
    show_id: randomIntBetween(1, 20),
  });

  const params2 = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // http.post(url2, payload2, params2);
  http.post(url, payload, params);
}

export function handleSummary(data) {
  return {
    'k6-summary.html': htmlReport(data),
  };
}
