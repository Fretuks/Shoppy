import { mockProducts } from '../data/mockProducts';
import { calculateProductRating } from './ratingService';

export async function findAlternatives(product, preferences, productCache = {}) {
  const candidates = [...mockProducts, ...Object.values(productCache)]
    .filter((candidate) => candidate.id !== product.id)
    .filter((candidate) => candidate.category === product.category || candidate.price <= (product.price || 999));

  return Array.from(new Map(candidates.map((candidate) => [candidate.id, candidate])).values())
    .map((candidate) => ({
      product: candidate,
      rating: calculateProductRating(candidate, preferences),
      reason: buildReason(candidate, preferences)
    }))
    .sort((left, right) => right.rating.overallScore - left.rating.overallScore)
    .slice(0, 3);
}

function buildReason(product, preferences) {
  if (preferences.preferBio && product.sustainability?.isBio) {
    return 'Bio-Alternative mit besserem Nachhaltigkeitsprofil.';
  }

  if (preferences.preferredDiet === 'lowSugar' && (product.nutrition?.sugarPer100g || 0) <= 6) {
    return 'Weniger Zucker und dadurch besser passend zu deinem Ziel.';
  }

  if ((product.allergens || []).length === 0) {
    return 'Keine bekannten Allergene im Beispieldatensatz.';
  }

  return 'Bessere Gesamtbewertung nach deinen Präferenzen.';
}
