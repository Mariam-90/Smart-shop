const { test } = require('node:test');
const assert = require('node:assert/strict');
const compare = require('../utils/compareBaskets');
const product = (ItemName, ItemPrice) => ({ ItemName, ItemPrice });

test('incomplete cheaper subtotal cannot beat a complete basket', () => {
  const result = compare([' Milk ', 'bread'], [
    { name: 'partial', products: [product('milk', 1)] },
    { name: 'complete', products: [product('milk', 3), product('bread', 4)] },
  ]);
  assert.equal(result.cheapestSource, 'complete');
  assert.equal(result.cheapestPrice, 7);
  assert.deepEqual(result.sourcesMissingProducts.partial, ['bread']);
  assert.equal(result.sourcesPrices.partial, 1);
});

test('no complete basket has no winner, including empty stores', () => {
  const result = compare(['milk', 'bread'], [{ name: 'empty', products: [] }]);
  assert.equal(result.cheapestSource, null);
  assert.equal(result.cheapestPrice, null);
  assert.deepEqual(result.sourcesMissingProducts.empty, ['milk', 'bread']);
  assert.equal(compare(['milk'], []).cheapestSource, null);
});

test('selects cheapest valid price, preserves repeated items and rounds totals', () => {
  const result = compare(['milk', 'milk'], [{ name: 'store', products: [
    product('milk', ''), product('milk', 'bad'), product('milk', -1),
    product('milk', '₪ 2.30'), product('milk', 0.1),
  ] }]);
  assert.equal(result.cheapestPrice, 0.2);
  assert.equal(result.sourcesProducts.store.length, 2);
});
