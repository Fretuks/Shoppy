const scoreMap = {
  good: 25,
  medium: 14,
  critical: 0
};

function priorityWeight(priority) {
  if (priority === 'high') return 1.2;
  if (priority === 'low') return 0.8;
  return 1;
}

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
  const avoidAllergens = preferences.avoidAllergens || [];
  const matchingAllergens = (product.allergens || []).filter((allergen) =>
    avoidAllergens.some((blockedAllergen) => blockedAllergen.toLowerCase() === allergen.toLowerCase())
  );

  const allergies = matchingAllergens.length > 0
    ? {
        status: 'critical',
        message: `Enthält: ${matchingAllergens.join(', ')}.`
      }
    : {
        status: 'good',
        message: 'Keine hinterlegten Allergene gefunden.'
      };

  const nutrition = rateNutrition(product, preferences);
  const sustainability = rateSustainability(product, preferences);
  const budget = rateBudget(product, preferences);

  const categoryScores = {
    allergies,
    budget,
    nutrition,
    sustainability
  };

  const weightedScores = [
    scoreMap[allergies.status] * 1.35,
    scoreMap[budget.status] * 1,
    scoreMap[nutrition.status] * priorityWeight(preferences.nutritionPriority),
    scoreMap[sustainability.status] * priorityWeight(preferences.sustainabilityPriority)
  ];
  const maxScore = 25 * (1.35 + 1 + priorityWeight(preferences.nutritionPriority) + priorityWeight(preferences.sustainabilityPriority));
  const overallScore = Math.round((weightedScores.reduce((sum, value) => sum + value, 0) / maxScore) * 100);
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

function rateNutrition(product, preferences) {
  const nutrition = product.nutrition || {};

  if (preferences.preferredDiet === 'lowSugar') {
    if ((nutrition.sugarPer100g || 0) > 22) {
      return { status: 'critical', message: 'Sehr hoher Zuckergehalt für dein Ziel.' };
    }

    if ((nutrition.sugarPer100g || 0) > 8) {
      return { status: 'medium', message: 'Zuckergehalt prüfen, liegt über deinem Ziel.' };
    }
  }

  if (preferences.preferredDiet === 'highProtein') {
    if ((nutrition.proteinPer100g || 0) >= 10) {
      return { status: 'good', message: 'Passt gut zu deinem Protein-Ziel.' };
    }

    return { status: 'medium', message: 'Proteinanteil ist eher niedrig.' };
  }

  if (preferences.preferredDiet === 'vegan' && (product.allergens || []).includes('Milch')) {
    return { status: 'critical', message: 'Enthält Milch und passt nicht zu vegan.' };
  }

  if (['A', 'B'].includes(nutrition.nutriScore)) {
    return { status: 'good', message: `Nutri-Score ${nutrition.nutriScore} ist positiv.` };
  }

  if (nutrition.nutriScore === 'C') {
    return { status: 'medium', message: 'Nutri-Score C: in Ordnung, aber nicht optimal.' };
  }

  return { status: 'critical', message: `Nutri-Score ${nutrition.nutriScore || 'unbekannt'} ist kritisch.` };
}

function rateSustainability(product, preferences) {
  const sustainability = product.sustainability || {};

  if (preferences.preferBio && !sustainability.isBio) {
    return { status: 'medium', message: 'Nicht Bio, obwohl Bio bevorzugt wird.' };
  }

  if (['A', 'B'].includes(sustainability.ecoScore)) {
    return { status: 'good', message: `Eco-Score ${sustainability.ecoScore} ist stark.` };
  }

  if (sustainability.ecoScore === 'C') {
    return { status: 'medium', message: 'Eco-Score C: akzeptabel, aber verbesserbar.' };
  }

  return { status: 'critical', message: `Eco-Score ${sustainability.ecoScore || 'unbekannt'} ist schwach.` };
}

function rateBudget(product, preferences) {
  if (typeof product.price !== 'number' || typeof preferences.maxBudgetPerShoppingTrip !== 'number') {
    return { status: 'medium', message: 'Preis oder Budget fehlt für eine genaue Prüfung.' };
  }

  const share = product.price / preferences.maxBudgetPerShoppingTrip;
  const periodLabel = budgetPeriodLabel(preferences.budgetPeriod);

  if (share <= 0.08) {
    return { status: 'good', message: `Preis passt gut zu deinem Budget pro ${periodLabel}.` };
  }

  if (share <= 0.18) {
    return { status: 'medium', message: `Preis ist für dein Budget pro ${periodLabel} spürbar, aber noch im Rahmen.` };
  }

  return { status: 'critical', message: `Preis belastet dein Budget pro ${periodLabel} stark.` };
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
