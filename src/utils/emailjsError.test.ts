import test from 'node:test';
import assert from 'node:assert/strict';
import { getEmailJsFailureMessage, summarizeEmailJsError } from './emailjsError';

const email = 'contact@example.com';

test('classifies likely EmailJS errors without claiming root cause', () => {
  assert.deepEqual(summarizeEmailJsError({ status: 400, text: 'wrong service' }), { status: 400, issue: 'request' });
  assert.deepEqual(summarizeEmailJsError({ status: 403 }), { status: 403, issue: 'permission' });
  assert.deepEqual(summarizeEmailJsError({ status: 429 }), { status: 429, issue: 'rate-limit' });
  assert.deepEqual(summarizeEmailJsError({ status: 503 }), { status: 503, issue: 'service' });
  assert.deepEqual(summarizeEmailJsError(new TypeError('Failed to fetch')), { status: null, issue: 'network' });
  assert.deepEqual(summarizeEmailJsError({ status: '403' }), { status: null, issue: 'unknown' });
  assert.deepEqual(summarizeEmailJsError(null), { status: null, issue: 'unknown' });
});

test('user-facing messages preserve a direct email fallback and never expose raw API details', () => {
  const raw = { status: 403, text: 'provider details containing restricted values' };
  for (const language of ['en', 'id'] as const) {
    const message = getEmailJsFailureMessage(raw, language, email);
    assert.ok(message.includes(email));
    assert.ok(!message.includes(raw.text));
    assert.ok(!message.includes('403'));
  }
});

test('rate-limiting and network failures receive specific helpful language', () => {
  assert.match(getEmailJsFailureMessage({ status: 429 }, 'en', email), /try later/i);
  assert.match(getEmailJsFailureMessage(new TypeError('Offline'), 'id', email), /koneksi/i);
});
