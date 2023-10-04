import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const VUS = 40;
const DURATION = '10s';

export const options = {
  vus: VUS,
  duration: DURATION,
};
export default function () {
  http.get('http://localhost:3000/user');
}

export function handleSummary(data) {
  return {
    'k6-summary.html': htmlReport(data),
  };
}
