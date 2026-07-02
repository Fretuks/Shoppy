import { searchProducts } from './productApi';
import { calculateProductRating } from './ratingService';

const MIN_SCORE_IMPROVEMENT = 5;
const INTERNAL_ALTERNATIVE_LIMIT = 8;

const improvementLabels = {
  allergies: 'Besser passend bei Allergien',
  ingredients: 'Bessere Zutaten',
  budget: 'Günstiger fürs Budget',
  nutrition: 'Bessere Ernährung',
  sustainability: 'Nachhaltiger'
};

const categoryGroups = [
  {
    label: 'Getränke',
    terms: ['beverage', 'beverages', 'drink', 'drinks', 'getränk', 'getränke', 'soda', 'cola', 'juice', 'water', 'waters', 'non alcoholic', 'sodas']
  },
  {
    label: 'Snacks',
    terms: ['snack', 'snacks', 'bar', 'riegel', 'chocolate', 'chips', 'crisps']
  },
  {
    label: 'Milchprodukte',
    terms: ['dairy', 'milk', 'yogurt', 'joghurt', 'milch', 'milchprodukte', 'cheese']
  },
  {
    label: 'Fertiggerichte',
    terms: ['meal', 'meals', 'ready meal', 'bowl', 'fertiggericht', 'prepared']
  }
];

export async function findAlternatives(product, preferences, productCache = {}) {
  const productRating = calculateProductRating(product, preferences);
  const categoryTerms = categoryTermsForProduct(product);
  const remoteCandidates = await loadRemoteCandidates(categoryTerms, productCache, preferences.offlineModeEnabled);
  const candidates = uniqueProducts([
    ...remoteCandidates,
    ...Object.values(productCache)
  ])
    .filter((candidate) => candidate.id !== product.id && candidate.barcode !== product.barcode)
    .filter((candidate) => isSimilarCategory(product, candidate, categoryTerms))
    .filter((candidate) => !hasAvoidedAllergen(candidate, preferences));

  return candidates
    .map((candidate) => ({
      product: candidate,
      rating: calculateProductRating(candidate, preferences),
      dataQualityScore: knownDataScore(candidate)
    }))
    .filter((item) => item.rating.overallScore >= productRating.overallScore + MIN_SCORE_IMPROVEMENT)
    .map((item) => ({
      ...item,
      reason: buildReason(item.rating, productRating, categoryTerms)
    }))
    .sort((left, right) => {
      if (right.rating.overallScore !== left.rating.overallScore) {
        return right.rating.overallScore - left.rating.overallScore;
      }

      const priceDiff = priceForSort(left.product) - priceForSort(right.product);
      if (priceDiff !== 0) {
        return priceDiff;
      }

      return right.dataQualityScore - left.dataQualityScore;
    })
    .filter(uniqueByProductName)
    .slice(0, INTERNAL_ALTERNATIVE_LIMIT);
}

async function loadRemoteCandidates(categoryTerms, productCache, offlineModeEnabled) {
  const queries = categoryTerms.slice(0, 3);
  const results = await Promise.all(
    queries.map((query) => searchProducts(query, productCache, offlineModeEnabled).catch(() => []))
  );

  return results.flat();
}

function categoryTermsForProduct(product) {
  const rawTerms = [
    product.category,
    ...(product.categoryTags || [])
  ]
    .map(normalizeTerm)
    .filter(Boolean);
  const matchingGroup = categoryGroups.find((group) =>
    rawTerms.some((term) => group.terms.some((groupTerm) => term.includes(groupTerm)))
  );

  return uniqueStrings([
    ...(matchingGroup?.terms || []),
    ...rawTerms
  ]);
}

function isSimilarCategory(sourceProduct, candidate, categoryTerms) {
  const sourceTerms = productTerms(sourceProduct);
  const candidateTerms = productTerms(candidate);

  if (candidateTerms.some((term) => sourceTerms.includes(term))) {
    return true;
  }

  return candidateTerms.some((term) =>
    categoryTerms.some((categoryTerm) => term.includes(categoryTerm) || categoryTerm.includes(term))
  );
}

function productTerms(product) {
  return [
    product.category,
    ...(product.categoryTags || [])
  ]
    .map(normalizeTerm)
    .filter(Boolean);
}

function buildReason(rating, sourceRating, categoryTerms) {
  const strongestImprovement = strongestCategoryImprovement(rating, sourceRating);
  const scoreText = `besserer Bewertung (${rating.overallScore} statt ${sourceRating.overallScore})`;
  const categoryLabel = categoryLabelForTerms(categoryTerms);
  const improvementText = strongestImprovement
    ? improvementLabels[strongestImprovement.category] || 'Bessere Bewertung'
    : 'Bessere Bewertung';

  if (categoryLabel) {
    return `${improvementText}: ähnliches Produkt aus ${categoryLabel} mit ${scoreText}.`;
  }

  return `${improvementText}: ähnliches Produkt mit ${scoreText}.`;
}

function categoryLabelForTerms(terms) {
  const matchingGroup = categoryGroups.find((group) =>
    terms.some((term) => group.terms.some((groupTerm) => term.includes(groupTerm)))
  );

  return matchingGroup?.label;
}

function knownDataScore(product) {
  const nutrition = product.nutrition || {};
  const sustainability = product.sustainability || {};
  const completeness = product.dataCompleteness || {};

  return [
    [hasKnownAllergens(product), 3],
    [completeness.allergens !== false, 2],
    [completeness.ingredients !== false, 2],
    [completeness.additives !== false, 1],
    [Boolean(nutrition.nutriScore), 2],
    [hasNutrientLevels(nutrition), 2],
    [completeness.nutrition !== false, 1],
    [Boolean(sustainability.ecoScore), 2],
    [completeness.ecoScore !== false, 1],
    [Boolean(sustainability.originCountry), 1],
    [Boolean(sustainability.packaging), 1],
    [typeof product.price === 'number', 1],
    [Boolean(product.imageUrl), 1]
  ].reduce((score, [isKnown, weight]) => score + (isKnown ? weight : 0), 0);
}

function hasAvoidedAllergen(product, preferences) {
  const avoidAllergens = (preferences.avoidAllergens || []).map(normalizeAllergen);
  if (avoidAllergens.length === 0) {
    return false;
  }

  const productAllergens = (product.allergens || []).map(normalizeAllergen);
  return productAllergens.some((allergen) => avoidAllergens.includes(allergen));
}

function strongestCategoryImprovement(rating, sourceRating) {
  return Object.keys(rating.categoryScores || {})
    .map((category) => ({
      category,
      improvement: categoryScore(rating, category) - categoryScore(sourceRating, category)
    }))
    .filter((item) => item.improvement > 0)
    .sort((left, right) => right.improvement - left.improvement)[0];
}

function categoryScore(rating, category) {
  return rating.categoryScores?.[category]?.score || 0;
}

function priceForSort(product) {
  return typeof product.price === 'number' ? product.price : Infinity;
}

function hasKnownAllergens(product) {
  return Array.isArray(product.allergens) && product.dataCompleteness?.allergens !== false;
}

function hasNutrientLevels(nutrition) {
  const nutrientLevels = nutrition.nutrientLevels || {};
  return Object.values(nutrientLevels).some(Boolean);
}

function uniqueProducts(products) {
  return Array.from(new Map(products.map((product) => [product.barcode || product.id, product])).values());
}

function uniqueByProductName(item, index, items) {
  const normalizedName = normalizeProductName(item.product.name);
  if (!normalizedName) {
    return true;
  }

  return items.findIndex((candidate) => normalizeProductName(candidate.product.name) === normalizedName) === index;
}

function uniqueStrings(values) {
  return Array.from(new Set(values));
}

function normalizeProductName(value) {
  return normalizeTerm(value)
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTerm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^[a-z]{2}:/, '')
    .replace(/-/g, ' ')
    .trim();
}

function normalizeAllergen(value) {
  return normalizeTerm(value);
}
