import { mockProducts } from '../data/mockProducts';

const openFoodFactsBaseUrl = 'https://world.openfoodfacts.org';
const productFields = [
  'code',
  'product_name',
  'product_name_de',
  'product_name_en',
  'brands',
  'categories',
  'categories_tags',
  'image_url',
  'ingredients_text',
  'ingredients_text_de',
  'ingredients_text_en',
  'allergens_tags',
  'nutriments',
  'nutriscore_grade',
  'ecoscore_grade',
  'labels_tags',
  'origins',
  'origins_tags',
  'countries_tags',
  'packaging'
].join(',');

export async function lookupProductByBarcode(barcode, productCache = {}, offlineModeEnabled = false) {
  const normalizedBarcode = normalizeBarcode(barcode);
  const cachedProduct = productCache[normalizedBarcode] || productCache[barcode];

  if (cachedProduct) {
    return { status: 'found', product: cachedProduct, source: 'cache' };
  }

  if (offlineModeEnabled) {
    return {
      status: 'error',
      errorMessage: 'Offline-Modus aktiv: Dieses Produkt ist noch nicht im lokalen Cache.'
    };
  }

  try {
    const response = await fetch(
      `${openFoodFactsBaseUrl}/api/v2/product/${encodeURIComponent(normalizedBarcode)}.json?fields=${productFields}`
    );

    if (!response.ok) {
      return {
        status: 'error',
        errorMessage: 'Open Food Facts konnte gerade nicht erreicht werden.'
      };
    }

    const payload = await response.json();
    if (payload.status !== 1 || !payload.product) {
      return {
        status: 'notFound',
        errorMessage: 'Kein Produkt zu diesem Barcode in Open Food Facts gefunden.'
      };
    }

    return {
      status: 'found',
      product: mapOpenFoodFactsProduct(payload.product, normalizedBarcode),
      source: 'open-food-facts'
    };
  } catch (error) {
    return {
      status: 'error',
      errorMessage: 'Netzwerkfehler beim Laden von Open Food Facts.'
    };
  }
}

export async function searchProducts(query, productCache = {}, offlineModeEnabled = false) {
  const normalizedQuery = query.trim().toLowerCase();
  const cachedProducts = Object.values(productCache);

  if (!normalizedQuery) {
    return [];
  }

  if (offlineModeEnabled) {
    return filterProducts(cachedProducts, normalizedQuery);
  }

  try {
    const response = await fetch(
      `${openFoodFactsBaseUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=${productFields}`
    );

    if (!response.ok) {
      return filterProducts([...cachedProducts, ...mockProducts], normalizedQuery);
    }

    const payload = await response.json();
    const apiProducts = (payload.products || [])
      .filter((product) => product.code)
      .map((product) => mapOpenFoodFactsProduct(product, product.code));
    const products = [...apiProducts, ...cachedProducts, ...mockProducts];

    return uniqueProducts(filterProducts(products, normalizedQuery));
  } catch (error) {
    return filterProducts([...cachedProducts, ...mockProducts], normalizedQuery);
  }
}

function mapOpenFoodFactsProduct(product, fallbackBarcode) {
  const barcode = normalizeBarcode(product.code || fallbackBarcode);
  const nutriments = product.nutriments || {};
  const now = new Date().toISOString();

  return {
    id: `off-${barcode}`,
    barcode,
    name: product.product_name_de || product.product_name || product.product_name_en || `Produkt ${barcode}`,
    brand: firstTextValue(product.brands),
    category: firstCategory(product.categories, product.categories_tags),
    imageUrl: product.image_url,
    price: undefined,
    currency: 'CHF',
    ingredients: parseIngredients(product.ingredients_text_de || product.ingredients_text || product.ingredients_text_en),
    allergens: normalizeAllergens(product.allergens_tags || []),
    nutrition: {
      caloriesPer100g: numberOrUndefined(nutriments['energy-kcal_100g']),
      sugarPer100g: numberOrUndefined(nutriments.sugars_100g),
      fatPer100g: numberOrUndefined(nutriments.fat_100g),
      proteinPer100g: numberOrUndefined(nutriments.proteins_100g),
      saltPer100g: numberOrUndefined(nutriments.salt_100g),
      nutriScore: normalizeGrade(product.nutriscore_grade)
    },
    sustainability: {
      ecoScore: normalizeGrade(product.ecoscore_grade),
      isBio: hasOrganicLabel(product.labels_tags || []),
      originCountry: firstOrigin(product.origins, product.origins_tags, product.countries_tags),
      packaging: firstTextValue(product.packaging)
    },
    createdAt: now,
    updatedAt: now
  };
}

function normalizeBarcode(barcode) {
  return String(barcode || '').replace(/[^\d]/g, '');
}

function filterProducts(products, normalizedQuery) {
  return uniqueProducts(products).filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.category,
      product.barcode
    ].filter(Boolean).join(' ').toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

function uniqueProducts(products) {
  return Array.from(new Map(products.map((product) => [product.id, product])).values());
}

function firstTextValue(value) {
  if (!value) return undefined;
  return String(value).split(',').map((item) => item.trim()).filter(Boolean)[0];
}

function firstCategory(categories, categoryTags = []) {
  const category = firstTextValue(categories);
  if (category) return category;

  const tag = categoryTags.find(Boolean);
  return tag ? cleanTag(tag) : undefined;
}

function firstOrigin(origins, originTags = [], countryTags = []) {
  return firstTextValue(origins)
    || cleanTag(originTags.find(Boolean))
    || cleanTag(countryTags.find(Boolean));
}

function parseIngredients(ingredientsText) {
  if (!ingredientsText) return [];
  return ingredientsText
    .split(/[,;.]/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
    .slice(0, 16);
}

function normalizeAllergens(allergenTags) {
  const allergenMap = {
    'en:peanuts': 'Erdnüsse',
    'de:erdnusse': 'Erdnüsse',
    'de:erdnüsse': 'Erdnüsse',
    'en:milk': 'Milch',
    'de:milch': 'Milch',
    'en:gluten': 'Gluten',
    'de:gluten': 'Gluten',
    'en:oats': 'Hafer',
    'de:hafer': 'Hafer',
    'en:soybeans': 'Soja',
    'de:soja': 'Soja',
    'en:nuts': 'Nüsse',
    'de:nusse': 'Nüsse',
    'de:nüsse': 'Nüsse',
    'en:eggs': 'Eier',
    'de:eier': 'Eier'
  };

  return allergenTags
    .map((tag) => allergenMap[tag] || cleanTag(tag))
    .filter(Boolean);
}

function normalizeGrade(value) {
  const grade = String(value || '').trim().toUpperCase();
  return ['A', 'B', 'C', 'D', 'E'].includes(grade) ? grade : undefined;
}

function hasOrganicLabel(labelTags) {
  return labelTags.some((tag) => {
    const normalizedTag = String(tag).toLowerCase();
    return normalizedTag.includes('organic') || normalizedTag.includes('bio');
  });
}

function numberOrUndefined(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function cleanTag(tag) {
  if (!tag) return undefined;
  const withoutLanguage = String(tag).replace(/^[a-z]{2}:/, '');
  return withoutLanguage
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
