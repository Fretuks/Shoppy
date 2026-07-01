import { mockProducts } from '../data/mockProducts';

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function lookupProductByBarcode(barcode, productCache = {}, offlineModeEnabled = false) {
  await delay();

  const cachedProduct = productCache[barcode];
  if (cachedProduct) {
    return { status: 'found', product: cachedProduct, source: 'cache' };
  }

  if (offlineModeEnabled) {
    return {
      status: 'error',
      errorMessage: 'Offline-Modus aktiv: Dieses Produkt ist noch nicht im lokalen Cache.'
    };
  }

  const product = mockProducts.find((item) => item.barcode === barcode);
  if (!product) {
    return { status: 'notFound', errorMessage: 'Kein Produkt zu diesem Barcode gefunden.' };
  }

  return { status: 'found', product, source: 'mock-api' };
}

export async function searchProducts(query, productCache = {}, offlineModeEnabled = false) {
  await delay();

  const normalizedQuery = query.trim().toLowerCase();
  const cachedProducts = Object.values(productCache);
  const sourceProducts = offlineModeEnabled ? cachedProducts : [...mockProducts, ...cachedProducts];
  const uniqueProducts = Array.from(new Map(sourceProducts.map((product) => [product.id, product])).values());

  if (!normalizedQuery) {
    return [];
  }

  return uniqueProducts.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.category,
      product.barcode
    ].filter(Boolean).join(' ').toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
