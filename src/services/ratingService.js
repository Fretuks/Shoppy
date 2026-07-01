const nutrientLevelLabels = {
  fat: 'Fett',
  saturatedFat: 'gesättigte Fettsäuren',
  sugars: 'Zucker',
  salt: 'Salz'
};

const nutriScoreValues = {
  A: 100,
  B: 86,
  C: 65,
  D: 35,
  E: 15
};

const ecoScoreValues = {
  A: 100,
  B: 86,
  C: 65,
  D: 35,
  E: 15
};

function statusFromScore(score) {
  if (score >= 78) return 'good';
  if (score >= 48) return 'medium';
  return 'critical';
}

function severityFromStatus(status) {
  if (status === 'critical') return 'critical';
  if (status === 'medium') return 'warning';
  return 'info';
}

export function calculateProductRating(product, preferences) {
  const categoryScores = {
    allergies: rateAllergies(product, preferences),
    budget: rateBudget(product, preferences),
    nutrition: rateNutrition(product, preferences),
    sustainability: rateSustainability(product, preferences)
  };

  const weights = ratingWeights(preferences);
  const overallScore = Math.round(
    Object.entries(categoryScores).reduce((sum, [category, value]) => (
      sum + value.score * weights[category]
    ), 0)
  );
  const overallStatus = statusFromScore(overallScore);

  const reasons = Object.entries(categoryScores).map(([category, value]) => ({
    category,
    message: value.message,
    severity: severityFromStatus(value.status)
  }));

  return {
    productId: product.id,
    overallStatus,
    overallScore,
    reasons,
    categoryScores
  };
}

function ratingWeights() {
  return {
    allergies: 0.1,
    budget: 0.25,
    nutrition: 0.4,
    sustainability: 0.25
  };
}

function rateAllergies(product, preferences) {
  const avoidAllergens = preferences.avoidAllergens || [];
  const matchingAllergens = (product.allergens || []).filter((allergen) =>
    avoidAllergens.some((blockedAllergen) => blockedAllergen.toLowerCase() === allergen.toLowerCase())
  );
  const completeness = product.dataCompleteness || {};
  const missingData = missingMessages([
    [completeness.allergens === false, 'Allergenangaben fehlen in Open Food Facts.']
  ]);

  if (matchingAllergens.length > 0) {
    return withScore(0, `Enthält: ${matchingAllergens.join(', ')}.`, missingData);
  }

  return withScore(completeness.allergens === false ? 70 : 100, 'Keine hinterlegten Allergene gefunden.', missingData);
}

function rateNutrition(product, preferences) {
  const nutrition = product.nutrition || {};
  const nutrientLevels = nutrition.nutrientLevels || {};
  const highLevels = nutrientLevelEntries(nutrientLevels, 'high');
  const moderateLevels = nutrientLevelEntries(nutrientLevels, 'moderate');
  const missingData = missingMessages([
    [!nutrition.nutriScore, 'Nutri-Score fehlt in Open Food Facts.'],
    [Object.keys(nutrientLevels).length === 0 || !Object.values(nutrientLevels).some(Boolean), 'Nährwert-Level fehlen in Open Food Facts.'],
    [preferences.preferredDiet === 'lowSugar' && typeof nutrition.sugarPer100g !== 'number', 'Zuckerwert pro 100 g fehlt.'],
    [preferences.preferredDiet === 'highProtein' && !isBeverage(product) && typeof nutrition.proteinPer100g !== 'number', 'Proteinwert pro 100 g fehlt.']
  ]);
  const nutrientLevelStatus = statusFromNutrientLevels(highLevels, moderateLevels);
  const nutrientLevelMessage = messageFromNutrientLevels(highLevels, moderateLevels);
  const baseScore = nutritionScoreFromData(product, nutrition, nutrientLevels);

  if (preferences.preferredDiet === 'lowSugar') {
    const score = Math.min(baseScore, sugarScore(nutrition.sugarPer100g, nutrientLevels.sugars));
    if (score < 48) {
      return withScore(score, nutrientLevelMessage || 'Sehr hoher Zuckergehalt für dein Ziel.', missingData);
    }

    if (score < 78) {
      return withScore(score, nutrientLevelMessage || 'Zuckergehalt prüfen, liegt über deinem Ziel.', missingData);
    }

    return withScore(score, nutrientLevelMessage || 'Zuckergehalt passt gut zu deinem Ziel.', missingData);
  }

  if (preferences.preferredDiet === 'highProtein') {
    if (isBeverage(product)) {
      return withScore(baseScore, nutrientLevelMessage || 'Getränk: Protein wird für diese Kategorie nicht abgewertet.', missingData);
    }

    const score = Math.min(baseScore, proteinScore(nutrition.proteinPer100g));
    if (score < 78) {
      return withScore(score, nutrientLevelMessage || 'Proteinanteil ist eher niedrig.', missingData);
    }

    return withScore(score, 'Passt gut zu deinem Protein-Ziel.', missingData);
  }

  if (preferences.preferredDiet === 'vegan' && (product.allergens || []).includes('Milch')) {
    return withScore(Math.min(baseScore, 5), 'Enthält Milch und passt nicht zu vegan.', missingData);
  }

  if (nutrientLevelStatus !== 'good') {
    return withScore(baseScore, nutrientLevelMessage, missingData);
  }

  if (['A', 'B'].includes(nutrition.nutriScore)) {
    return withScore(baseScore, `Nutri-Score ${nutrition.nutriScore} ist positiv.`, missingData);
  }

  if (nutrition.nutriScore === 'C') {
    return withScore(baseScore, 'Nutri-Score C: in Ordnung, aber nicht optimal.', missingData);
  }

  return withScore(baseScore, `Nutri-Score ${nutrition.nutriScore || 'unbekannt'} ist kritisch.`, missingData);
}

function rateSustainability(product, preferences) {
  const sustainability = product.sustainability || {};
  const missingData = missingMessages([
    [!sustainability.ecoScore, 'Eco-Score fehlt in Open Food Facts.'],
    [!sustainability.originCountry, 'Herkunftsland fehlt in Open Food Facts.'],
    [!sustainability.packaging, 'Verpackungsangabe fehlt in Open Food Facts.']
  ]);
  const score = sustainabilityScore(product, preferences);

  if (bioPreferenceApplies(product, preferences) && !sustainability.isBio) {
    return withScore(score, 'Nicht Bio, obwohl Bio bevorzugt wird.', missingData);
  }

  if (['A', 'B'].includes(sustainability.ecoScore)) {
    return withScore(score, `Eco-Score ${sustainability.ecoScore} ist stark.`, missingData);
  }

  if (sustainability.ecoScore === 'C') {
    return withScore(score, 'Eco-Score C: akzeptabel, aber verbesserbar.', missingData);
  }

  return withScore(score, `Eco-Score ${sustainability.ecoScore || 'unbekannt'} ist schwach.`, missingData);
}

function rateBudget(product, preferences) {
  const missingData = missingMessages([
    [typeof product.price !== 'number', 'Produktpreis fehlt.'],
    [typeof preferences.maxBudgetPerShoppingTrip !== 'number', 'Budgetlimit fehlt im Profil.']
  ]);

  if (typeof product.price !== 'number' || typeof preferences.maxBudgetPerShoppingTrip !== 'number') {
    return withScore(55, 'Preis oder Budget fehlt für eine genaue Prüfung.', missingData);
  }

  const share = product.price / preferences.maxBudgetPerShoppingTrip;
  const periodLabel = budgetPeriodLabel(preferences.budgetPeriod);
  const score = budgetScore(share);

  if (share <= 0.08) {
    return withScore(score, `Preis passt gut zu deinem Budget pro ${periodLabel}.`, missingData);
  }

  if (share <= 0.18) {
    return withScore(score, `Preis ist für dein Budget pro ${periodLabel} spürbar, aber noch im Rahmen.`, missingData);
  }

  return withScore(score, `Preis belastet dein Budget pro ${periodLabel} stark.`, missingData);
}

function nutritionScoreFromData(product, nutrition, nutrientLevels) {
  if (isWaterLike(product) && hasNoCriticalNutrients(nutrition, nutrientLevels)) {
    return 98;
  }

  if (isBeverage(product) && !nutrition.nutriScore && hasNoCriticalNutrients(nutrition, nutrientLevels)) {
    return 86;
  }

  const nutriScore = nutriScoreValues[nutrition.nutriScore] ?? 50;
  const nutrientPenalty = Object.values(nutrientLevels || {}).reduce((penalty, level) => {
    if (level === 'high') return penalty + 18;
    if (level === 'moderate') return penalty + 8;
    return penalty;
  }, 0);

  return clampScore(nutriScore - nutrientPenalty);
}

function sugarScore(sugarPer100g, sugarLevel) {
  if (sugarLevel === 'high') {
    return 25;
  }

  if (sugarLevel === 'moderate') {
    return 62;
  }

  if (typeof sugarPer100g !== 'number') {
    return 55;
  }

  if (sugarPer100g <= 5) return 100;
  if (sugarPer100g <= 8) return interpolate(sugarPer100g, 5, 8, 100, 78);
  if (sugarPer100g <= 22) return interpolate(sugarPer100g, 8, 22, 78, 35);
  return clampScore(interpolate(Math.min(sugarPer100g, 45), 22, 45, 35, 5));
}

function proteinScore(proteinPer100g) {
  if (typeof proteinPer100g !== 'number') {
    return 55;
  }

  if (proteinPer100g >= 20) return 100;
  if (proteinPer100g >= 10) return interpolate(proteinPer100g, 10, 20, 78, 100);
  if (proteinPer100g >= 4) return interpolate(proteinPer100g, 4, 10, 45, 78);
  return interpolate(Math.max(proteinPer100g, 0), 0, 4, 20, 45);
}

function sustainabilityScore(product, preferences) {
  const sustainability = product.sustainability || {};
  let score = ecoScoreValues[sustainability.ecoScore] ?? 50;

  if (bioPreferenceApplies(product, preferences) && !sustainability.isBio) {
    score -= 18;
  }

  if (!sustainability.originCountry) {
    score -= 6;
  }

  if (!sustainability.packaging) {
    score -= 6;
  }

  return clampScore(score);
}

function budgetScore(share) {
  if (share <= 0.08) {
    return interpolate(share, 0, 0.08, 100, 86);
  }

  if (share <= 0.18) {
    return interpolate(share, 0.08, 0.18, 86, 55);
  }

  return clampScore(interpolate(Math.min(share, 0.4), 0.18, 0.4, 55, 0));
}

function statusFromNutrientLevels(highLevels, moderateLevels) {
  if (highLevels.length >= 2 || highLevels.includes('sugars') || highLevels.includes('salt')) {
    return 'critical';
  }

  if (highLevels.length > 0 || moderateLevels.length >= 2) {
    return 'medium';
  }

  return 'good';
}

function messageFromNutrientLevels(highLevels, moderateLevels) {
  if (highLevels.length > 0) {
    return `Hohe Nährwert-Level: ${formatNutrientLevelList(highLevels)}.`;
  }

  if (moderateLevels.length >= 2) {
    return `Mehrere mittlere Nährwert-Level: ${formatNutrientLevelList(moderateLevels)}.`;
  }

  if (moderateLevels.length === 1) {
    return `Mittleres Nährwert-Level bei ${formatNutrientLevelList(moderateLevels)}.`;
  }

  return '';
}

function nutrientLevelEntries(levels, expectedLevel) {
  return Object.entries(levels)
    .filter(([, level]) => level === expectedLevel)
    .map(([key]) => key);
}

function formatNutrientLevelList(keys) {
  return keys.map((key) => nutrientLevelLabels[key] || key).join(', ');
}

function budgetPeriodLabel(period) {
  const labels = {
    day: 'Tag',
    week: 'Woche',
    month: 'Monat',
    shoppingTrip: 'Einkauf'
  };

  return labels[period] || labels.week;
}

function withScore(score, message, missingData = []) {
  const roundedScore = Math.round(clampScore(score));
  return {
    status: statusFromScore(roundedScore),
    score: roundedScore,
    message,
    missingData
  };
}

function interpolate(value, inputMin, inputMax, outputMin, outputMax) {
  if (inputMax === inputMin) {
    return outputMax;
  }

  const ratio = (value - inputMin) / (inputMax - inputMin);
  return outputMin + ratio * (outputMax - outputMin);
}

function clampScore(score) {
  return Math.max(0, Math.min(100, score));
}

function bioPreferenceApplies(product, preferences) {
  return preferences.preferBio && !isBeverage(product);
}

function isWaterLike(product) {
  const terms = productTerms(product);
  return terms.some((term) =>
    ['water', 'waters', 'wasser', 'mineral water', 'sparkling water', 'still water', 'eau'].includes(term)
      || term.includes('mineralwasser')
  );
}

function isBeverage(product) {
  const terms = productTerms(product);
  return terms.some((term) =>
    ['beverage', 'beverages', 'drink', 'drinks', 'getränk', 'getränke', 'water', 'waters', 'wasser', 'juice', 'soda', 'cola', 'tea', 'coffee'].includes(term)
      || term.includes('beverage')
      || term.includes('drink')
      || term.includes('getränk')
  );
}

function hasNoCriticalNutrients(nutrition, nutrientLevels) {
  const sugar = nutrition.sugarPer100g;
  const salt = nutrition.saltPer100g;

  return nutrientLevels.sugars !== 'high'
    && nutrientLevels.salt !== 'high'
    && nutrientLevels.fat !== 'high'
    && nutrientLevels.saturatedFat !== 'high'
    && (typeof sugar !== 'number' || sugar <= 5)
    && (typeof salt !== 'number' || salt <= 0.3);
}

function productTerms(product) {
  return [
    product.category,
    ...(product.categoryTags || []),
    product.name
  ]
    .map(normalizeTerm)
    .filter(Boolean);
}

function normalizeTerm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^[a-z]{2}:/, '')
    .replace(/-/g, ' ')
    .trim();
}

function missingMessages(entries) {
  return entries
    .filter(([isMissing]) => isMissing)
    .map(([, message]) => message);
}
