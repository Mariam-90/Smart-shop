const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../index');

test('search rejects missing, empty and structured query parameters', async () => {
  for (const query of ['', '?q=', '?q=%20', '?q[]=milk']) {
    const response = await request(app).get(`/api/search${query}`);
    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'A search query is required');
  }
});

test('basket search rejects malformed products before reading datasets', async () => {
  for (const products of [undefined, [], 'milk', [null], [12], [' '], [{}]]) {
    const response = await request(app).post('/api/productsList').send({ products });
    assert.equal(response.status, 400);
  }
});
