// A subtotal only competes for cheapest basket when every requested item is found.
function priceOf(product) {
  const raw = String(product.ItemPrice ?? '').trim().replace(/[₪,\s]/g, '');
  const price = raw ? Number(raw) : NaN;
  return Number.isFinite(price) && price >= 0 ? price : null;
}

module.exports = function compareBaskets(queries, stores) {
  const sourcesProducts = {};
  const sourcesPrices = {};
  const sourcesMissingProducts = {};
  let cheapestSource = null;
  let cheapestPrice = null;

  for (const store of stores) {
    const selected = [];
    const missing = [];
    for (const query of queries) {
      const normalized = query.trim().toLowerCase();
      let best = null;
      for (const product of store.products) {
        if (typeof product.ItemName !== 'string' || !product.ItemName.toLowerCase().includes(normalized)) continue;
        const price = priceOf(product);
        if (price !== null && (!best || price < priceOf(best))) best = product;
      }
      if (best) selected.push(best);
      else missing.push(query);
    }
    const total = Math.round(selected.reduce((sum, product) => sum + priceOf(product), 0) * 100) / 100;
    sourcesProducts[store.name] = selected;
    sourcesPrices[store.name] = total;
    sourcesMissingProducts[store.name] = missing;
    if (queries.length && !missing.length && (cheapestPrice === null || total < cheapestPrice)) {
      cheapestSource = store.name;
      cheapestPrice = total;
    }
  }
  return { sourcesProducts, sourcesPrices, sourcesMissingProducts, cheapestSource, cheapestPrice };
};
