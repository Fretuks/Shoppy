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

const additiveRiskGroups = [
  {
    id: 'nitrite-nitrate-curing-salts',
    label: 'Nitrit-/Nitratpökelsalze',
    codes: [[249, 252]],
    examples: 'Wurst, Schinken, Speck, Trockenfleisch, gepökeltes Fleisch',
    reason: 'Können zur Bildung von Nitrosaminen beitragen; nitrit-/nitrathaltige Wurstwaren werden mit erhöhtem Darmkrebsrisiko in Verbindung gebracht. Die EU hat die Grenzwerte 2023 reduziert, um die Bildung krebserregender Nitrosamine zu senken.'
  },
  {
    id: 'artificial-colors-child-attention',
    label: 'Bestimmte künstliche Farbstoffe',
    codes: [102, 104, 110, 122, 124, 129],
    examples: 'Süssigkeiten, Softdrinks, Backwaren, Desserts',
    reason: 'In der EU müssen Produkte mit diesen Farbstoffen den Hinweis tragen, dass sie Aktivität und Aufmerksamkeit von Kindern beeinträchtigen können. EFSA sah nur begrenzte, aber ernstzunehmende Hinweise auf kleine Effekte bei manchen Kindern.'
  },
  {
    id: 'sulfites',
    label: 'Sulfite',
    codes: [[220, 228]],
    examples: 'Wein, Trockenfrüchte, Kartoffelprodukte, Meerrettich, Fertigprodukte',
    reason: 'Können bei empfindlichen Personen Asthma- oder Unverträglichkeitsreaktionen auslösen. EFSA zog 2022 die temporäre akzeptable Tagesdosis zurück und sah bei geschätzter Exposition Sicherheitsbedenken, weil die Datenlage unvollständig ist.'
  },
  {
    id: 'phosphates',
    label: 'Phosphate',
    codes: [[338, 341], 343, [450, 452]],
    examples: 'Schmelzkäse, Cola, Fleischwaren, Backwaren, Fertiggerichte',
    reason: 'Phosphate sind nicht per se giftig, aber die Gesamtaufnahme kann zu hoch werden. EFSA schätzte 2019, dass die Aufnahme aus Lebensmitteln den sicheren Wert überschreiten kann, besonders bei Kindern und bei Nahrungsergänzungsmitteln.'
  },
  {
    id: 'bha-bht',
    label: 'BHA / BHT',
    codes: [320, 321],
    examples: 'Fetthaltige Snacks, Cerealien, Kaugummi, Backwaren, Fleisch- und Fertigprodukte',
    reason: 'BHA ist wegen Tierstudien als möglicherweise krebserregend eingestuft worden; die FDA überprüft BHA 2026 erneut, obwohl es in den USA seit Jahrzehnten zugelassen ist. EFSA hält BHA/BHT innerhalb der ADI-Grenzen für verwendbar, daher ist das eher ein Vorsorge-Thema als ein akutes Giftproblem.'
  },
  {
    id: 'benzoates',
    label: 'Natriumbenzoat / Benzoate',
    codes: [[210, 213]],
    terms: ['benzoat', 'benzoate', 'benzoic acid', 'benzoesäure'],
    examples: 'Softdrinks, Saucen, Konserven, saure Lebensmittel',
    reason: 'Für sich genommen von EFSA nicht als krebserregend bewertet; kritisch sind Kombinationen mit bestimmten Farbstoffen bei Kindern und in Getränken mit Vitamin C, wo unter bestimmten Bedingungen Benzol entstehen kann. Die FDA fand in den meisten getesteten Getränken keine oder sehr niedrige Benzolwerte, aber der Mechanismus ist bekannt.'
  },
  {
    id: 'aspartame',
    label: 'Aspartam',
    codes: [951],
    terms: ['aspartam', 'aspartame'],
    examples: 'Light-Getränke, zuckerfreie Kaugummis, Desserts, Protein- und Diätprodukte',
    reason: 'IARC stufte Aspartam 2023 als möglicherweise krebserregend ein; JECFA bestätigte gleichzeitig die akzeptable Tagesdosis von 40 mg/kg Körpergewicht. Praktisch heisst das: nicht automatisch gefährlich, aber bei hohem Konsum ein Stoff, den viele vorsorglich reduzieren.'
  },
  {
    id: 'carrageenan-emulsifiers',
    label: 'Carrageen / ausgewählte Emulgatoren',
    codes: [407, 433, 466],
    terms: ['carrageen', 'carrageenan', 'polysorbat 80', 'polysorbate 80', 'carboxymethylcellulose', 'cmc'],
    examples: 'Pflanzendrinks, Sahne-/Milchprodukte, Eiscreme, Saucen, Fertigprodukte',
    reason: 'Die Evidenz ist weniger eindeutig als bei Nitriten: Tier-, Zell- und erste Humanstudien deuten auf mögliche Effekte auf Darmbarriere, Mikrobiom und Entzündung hin. EFSA hat Carrageen und CMC weiterhin bewertet, fordert aber teils zusätzliche Daten, vor allem für empfindliche Gruppen.'
  },
  {
    id: 'titanium-dioxide',
    label: 'Titandioxid / TiO2',
    codes: [171],
    terms: ['titandioxid', 'titanium dioxide', 'tio2', 'tio 2'],
    examples: 'Früher: weisse Überzüge, Kaugummi, Süsswaren; ausserhalb EU/Schweiz auch Nahrungsergänzungsmittel und Süsswaren',
    reason: 'In der Schweiz und EU seit 2022 als Lebensmittelzusatzstoff verboten, weil EFSA Genotoxizitätsbedenken nicht ausschliessen konnte. In den USA ist Titandioxid in Lebensmitteln bis 1 Prozent nach FDA-Regeln weiterhin erlaubt.'
  },
  {
    id: 'red-3-erythrosine',
    label: 'Red No. 3 / Erythrosin',
    codes: [127],
    terms: ['erythrosin', 'erythrosine', 'red no 3', 'red 3'],
    examples: 'Vor allem US-Süsswaren, Dekore, einzelne Arznei- und Lebensmittelprodukte',
    reason: 'Die FDA hat 2025 die Zulassung für Lebensmittel und oral eingenommene Arzneimittel widerrufen; Hersteller haben in den USA Übergangsfristen, Lebensmittel bis Januar 2027.'
  }
];

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
    ingredients: rateIngredients(product, preferences),
    nutrition: rateNutrition(product, preferences),
    sustainability: rateSustainability(product, preferences)
  };

  const weights = ratingWeights(preferences);
  const hasBlockedAllergen = categoryScores.allergies.score === 0;
  const criticalAdditiveCount = categoryScores.ingredients.criticalAdditiveCount || 0;
  const overallScore = hasBlockedAllergen
    ? 0
    : capOverallScoreForCriticalAdditives(weightedCategoryScore(categoryScores, weights), criticalAdditiveCount);
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
    budget: 0.2,
    ingredients: 0.15,
    nutrition: 0.35,
    sustainability: 0.2
  };
}

function weightedCategoryScore(categoryScores, weights) {
  const knownEntries = Object.entries(categoryScores).filter(([, value]) => value.hasKnownFacts !== false);
  const totalWeight = knownEntries.reduce((sum, [category]) => sum + weights[category], 0);

  if (totalWeight === 0) {
    return 50;
  }

  return Math.round(
    knownEntries.reduce((sum, [category, value]) => (
      sum + value.score * weights[category]
    ), 0) / totalWeight
  );
}

function capOverallScoreForCriticalAdditives(score, criticalAdditiveCount) {
  if (criticalAdditiveCount >= 3) {
    return Math.min(score, 35);
  }

  if (criticalAdditiveCount === 2) {
    return Math.min(score, 42);
  }

  if (criticalAdditiveCount === 1) {
    return Math.min(score, 47);
  }

  return score;
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

function rateIngredients(product, preferences) {
  const analysis = product.ingredientAnalysis || {};
  const ingredients = ingredientTerms(product);
  const additives = analysis.additives || [];
  const harmfulAdditives = harmfulAdditiveMatches(additives, ingredients);
  const completeness = product.dataCompleteness || {};
  const hasIngredientText = ingredients.length > 0;
  const palmOil = ingredientFlag(
    analysis.palmOil,
    ingredients.some((ingredient) => palmOilTerms().some((term) => ingredient.includes(term)))
  );
  const vegan = ingredientFlag(analysis.vegan, hasIngredientText ? !hasAnimalIngredient(ingredients, true) : undefined);
  const vegetarian = ingredientFlag(analysis.vegetarian, hasIngredientText ? !hasAnimalIngredient(ingredients, false) : undefined);
  const components = [
    scoreComponent(palmOil === true ? 22 : palmOil === false ? 92 : null, 2),
    scoreComponent(additiveScore(additives, completeness.additives, harmfulAdditives), harmfulAdditives.length > 0 ? 3 : 1)
  ];
  const missingData = missingMessages([
    [!hasIngredientText, 'Zutatenliste fehlt in Open Food Facts.'],
    [palmOil === undefined, 'Palmöl-Analyse fehlt in Open Food Facts.'],
    [preferences.preferredDiet === 'vegan' && vegan === undefined, 'Vegan-Analyse fehlt in Open Food Facts.'],
    [preferences.preferredDiet === 'vegetarian' && vegetarian === undefined, 'Vegetarisch-Analyse fehlt in Open Food Facts.'],
    [completeness.additives === false, 'Zusatzstoffangaben fehlen in Open Food Facts.']
  ]);
  const scoreDetails = ingredientScoreDetails({
    additives,
    harmfulAdditives,
    palmOil,
    preferences,
    vegan,
    vegetarian
  });

  if (preferences.preferredDiet === 'vegan') {
    components.push(scoreComponent(vegan === true ? 100 : vegan === false ? 0 : null, 3));

    if (vegan === false) {
      return withScore(cappedHarmfulAdditiveScore(weightedKnownScore(components, 50), harmfulAdditives), 'Nicht vegan laut Zutatenanalyse.', missingData, { hasKnownFacts: hasKnownComponents(components), criticalAdditiveCount: harmfulAdditives.length, details: scoreDetails });
    }
  }

  if (preferences.preferredDiet === 'vegetarian') {
    components.push(scoreComponent(vegetarian === true ? 100 : vegetarian === false ? 0 : null, 3));

    if (vegetarian === false) {
      return withScore(cappedHarmfulAdditiveScore(weightedKnownScore(components, 50), harmfulAdditives), 'Nicht vegetarisch laut Zutatenanalyse.', missingData, { hasKnownFacts: hasKnownComponents(components), criticalAdditiveCount: harmfulAdditives.length, details: scoreDetails });
    }
  }

  const score = cappedHarmfulAdditiveScore(weightedKnownScore(components, 50), harmfulAdditives);
  const hasKnownFacts = hasKnownComponents(components);
  const ingredientOptions = { hasKnownFacts, criticalAdditiveCount: harmfulAdditives.length, details: scoreDetails };

  if (palmOil === true) {
    return withScore(score, 'Enthält Palmöl.', missingData, ingredientOptions);
  }

  if (harmfulAdditives.length > 0) {
    return withScore(score, `Kritische Zusatzstoffe: ${formatAdditiveList(harmfulAdditives)}.`, missingData, ingredientOptions);
  }

  if (additives.length > 0) {
    return withScore(score, `Enthält Zusatzstoffe: ${additives.slice(0, 3).join(', ')}.`, missingData, ingredientOptions);
  }

  if (preferences.preferredDiet === 'vegan' && vegan === true) {
    return withScore(score, 'Vegan laut Zutatenanalyse.', missingData, ingredientOptions);
  }

  if (preferences.preferredDiet === 'vegetarian' && vegetarian === true) {
    return withScore(score, 'Vegetarisch laut Zutatenanalyse.', missingData, ingredientOptions);
  }

  return withScore(score, 'Keine kritischen Zutatenhinweise gefunden.', missingData, ingredientOptions);
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
  const details = nutritionScoreDetails(product, preferences, nutrition, nutrientLevels, baseScore);
  const options = { details };

  if (preferences.preferredDiet === 'lowSugar') {
    const score = Math.min(baseScore, sugarScore(nutrition.sugarPer100g, nutrientLevels.sugars));
    if (score < 48) {
      return withScore(score, nutrientLevelMessage || 'Sehr hoher Zuckergehalt für dein Ziel.', missingData, options);
    }

    if (score < 78) {
      return withScore(score, nutrientLevelMessage || 'Zuckergehalt prüfen, liegt über deinem Ziel.', missingData, options);
    }

    return withScore(score, nutrientLevelMessage || 'Zuckergehalt passt gut zu deinem Ziel.', missingData, options);
  }

  if (preferences.preferredDiet === 'highProtein') {
    if (isBeverage(product)) {
      return withScore(baseScore, nutrientLevelMessage || 'Getränk: Protein wird für diese Kategorie nicht abgewertet.', missingData, options);
    }

    const score = Math.min(baseScore, proteinScore(nutrition.proteinPer100g));
    if (score < 78) {
      return withScore(score, nutrientLevelMessage || 'Proteinanteil ist eher niedrig.', missingData, options);
    }

    return withScore(score, 'Passt gut zu deinem Protein-Ziel.', missingData, options);
  }

  if (nutrientLevelStatus !== 'good') {
    return withScore(baseScore, nutrientLevelMessage, missingData, options);
  }

  if (['A', 'B'].includes(nutrition.nutriScore)) {
    return withScore(baseScore, `Nutri-Score ${nutrition.nutriScore} ist positiv.`, missingData, options);
  }

  if (nutrition.nutriScore === 'C') {
    return withScore(baseScore, 'Nutri-Score C: in Ordnung, aber nicht optimal.', missingData, options);
  }

  return withScore(baseScore, `Nutri-Score ${nutrition.nutriScore || 'unbekannt'} ist kritisch.`, missingData, options);
}

function rateSustainability(product, preferences) {
  const sustainability = product.sustainability || {};
  const carbonFootprint = carbonFootprintValue(sustainability);
  const missingData = missingMessages([
    [!sustainability.ecoScore, 'Eco-Score fehlt in Open Food Facts.'],
    [typeof carbonFootprint !== 'number', 'CO2-Fussabdruck fehlt in Open Food Facts.'],
    [!sustainability.originCountry, 'Herkunftsland fehlt in Open Food Facts.'],
    [!sustainability.packaging, 'Verpackungsangabe fehlt in Open Food Facts.']
  ]);
  const components = sustainabilityScoreComponents(product, preferences);
  const score = weightedKnownScore(components, 50);
  const options = { hasKnownFacts: hasKnownComponents(components) };

  if (bioPreferenceApplies(product, preferences) && !sustainability.isBio) {
    return withScore(score, 'Nicht Bio, obwohl Bio bevorzugt wird.', missingData, options);
  }

  if (['A', 'B'].includes(sustainability.ecoScore)) {
    return withScore(score, `Eco-Score ${sustainability.ecoScore} ist stark.`, missingData, options);
  }

  if (sustainability.ecoScore === 'C') {
    return withScore(score, 'Eco-Score C: akzeptabel, aber verbesserbar.', missingData, options);
  }

  return withScore(score, `Eco-Score ${sustainability.ecoScore || 'unbekannt'} ist schwach.`, missingData, options);
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

function nutritionScoreDetails(product, preferences, nutrition, nutrientLevels, baseScore) {
  const details = [];

  if (nutrition.nutriScore) {
    const nutriScoreValue = nutriScoreValues[nutrition.nutriScore] ?? 50;
    details.push({
      type: nutriScoreValue >= 78 ? 'positive' : 'penalty',
      title: `Nutri-Score ${nutrition.nutriScore}`,
      body: nutriScoreValue >= 78
        ? 'Der Nutri-Score ist gut und erhöht die Ernährungswertung.'
        : nutriScoreValue >= 48
          ? 'Der Nutri-Score ist mittelmässig und begrenzt die Ernährungswertung.'
          : 'Der Nutri-Score ist schwach und reduziert die Ernährungswertung deutlich.',
      meta: `Basiswert: ${nutriScoreValue} von 100`
    });
  }

  nutritionNutrientDetails(nutrition, nutrientLevels).forEach((detail) => details.push(detail));

  if (preferences.preferredDiet === 'lowSugar') {
    details.push(sugarGoalDetail(nutrition.sugarPer100g, nutrientLevels.sugars));
  }

  if (preferences.preferredDiet === 'highProtein' && !isBeverage(product)) {
    details.push(proteinGoalDetail(nutrition.proteinPer100g));
  }

  if (isWaterLike(product) && hasNoCriticalNutrients(nutrition, nutrientLevels)) {
    details.push({
      type: 'positive',
      title: 'Wasserähnliches Produkt',
      body: 'Wasserähnliche Produkte ohne kritische Nährwerte bekommen eine sehr gute Ernährungswertung.',
      meta: 'Keine hohe Zucker-, Salz-, Fett- oder gesättigte-Fettsäuren-Markierung erkannt.'
    });
  } else if (isBeverage(product) && !nutrition.nutriScore && hasNoCriticalNutrients(nutrition, nutrientLevels)) {
    details.push({
      type: 'positive',
      title: 'Getränk ohne kritische Nährwerte',
      body: 'Bei Getränken ohne Nutri-Score wird nicht automatisch abgewertet, wenn keine kritischen Nährwerte vorliegen.',
      meta: 'Ersatzwert: 86 von 100'
    });
  }

  details.push({
    type: baseScore >= 78 ? 'positive' : 'penalty',
    title: 'Ernährungsbasis',
    body: 'Die Basiswertung kombiniert Nutri-Score und Nährwert-Level. Hohe Level werden stärker abgezogen als mittlere Level.',
    meta: `Aktueller Basiswert: ${Math.round(baseScore)} von 100`
  });

  return details;
}

function nutritionNutrientDetails(nutrition, nutrientLevels) {
  const entries = [
    {
      key: 'sugars',
      label: 'Zucker',
      value: nutrition.sugarPer100g,
      unit: 'g pro 100 g',
      highText: 'Hoher Zuckerwert reduziert die Bewertung deutlich, besonders bei Low-Sugar-Ziel.',
      moderateText: 'Mittlerer Zuckerwert reduziert die Bewertung leicht bis moderat.',
      lowText: 'Niedriger Zuckerwert verbessert die Bewertung.'
    },
    {
      key: 'fat',
      label: 'Fett',
      value: nutrition.fatPer100g,
      unit: 'g pro 100 g',
      highText: 'Hoher Fettwert reduziert die Bewertung.',
      moderateText: 'Mittlerer Fettwert reduziert die Bewertung leicht.',
      lowText: 'Niedriger Fettwert ist positiv.'
    },
    {
      key: 'saturatedFat',
      label: 'Gesättigte Fettsäuren',
      value: nutrition.saturatedFatPer100g,
      unit: 'g pro 100 g',
      highText: 'Hohe gesättigte Fettsäuren reduzieren die Bewertung deutlich.',
      moderateText: 'Mittlere gesättigte Fettsäuren reduzieren die Bewertung.',
      lowText: 'Niedrige gesättigte Fettsäuren sind positiv.'
    },
    {
      key: 'salt',
      label: 'Salz',
      value: nutrition.saltPer100g,
      unit: 'g pro 100 g',
      highText: 'Hoher Salzgehalt reduziert die Bewertung deutlich.',
      moderateText: 'Mittlerer Salzgehalt reduziert die Bewertung.',
      lowText: 'Niedriger Salzgehalt ist positiv.'
    }
  ];

  return entries
    .filter((entry) => nutrientLevels[entry.key] || typeof entry.value === 'number')
    .map((entry) => nutrientDetail(entry, nutrientLevels[entry.key]));
}

function nutrientDetail(entry, level) {
  const type = level === 'high' || level === 'moderate' ? 'penalty' : 'positive';
  const body = level === 'high'
    ? entry.highText
    : level === 'moderate'
      ? entry.moderateText
      : entry.lowText;
  const metaParts = [];

  if (level) {
    metaParts.push(`Level: ${nutrientLevelLabel(level)}`);
  }

  if (typeof entry.value === 'number') {
    metaParts.push(`Wert: ${formatNutritionValue(entry.value)} ${entry.unit}`);
  }

  return {
    type,
    title: entry.label,
    body,
    meta: metaParts.join(' · ')
  };
}

function sugarGoalDetail(sugarPer100g, sugarLevel) {
  const score = sugarScore(sugarPer100g, sugarLevel);

  return {
    type: score >= 78 ? 'positive' : 'penalty',
    title: 'Low-Sugar-Ziel',
    body: score >= 78
      ? 'Der Zuckerwert passt zu deinem Low-Sugar-Ziel.'
      : score >= 48
        ? 'Der Zuckerwert liegt über dem idealen Bereich für dein Low-Sugar-Ziel.'
        : 'Der Zuckerwert ist für dein Low-Sugar-Ziel klar zu hoch.',
    meta: typeof sugarPer100g === 'number'
      ? `Zucker: ${formatNutritionValue(sugarPer100g)} g pro 100 g`
      : 'Zuckerwert fehlt.'
  };
}

function proteinGoalDetail(proteinPer100g) {
  const score = proteinScore(proteinPer100g);

  return {
    type: score >= 78 ? 'positive' : 'penalty',
    title: 'Protein-Ziel',
    body: score >= 78
      ? 'Der Proteinanteil passt gut zu deinem High-Protein-Ziel.'
      : 'Der Proteinanteil ist für dein High-Protein-Ziel eher niedrig.',
    meta: typeof proteinPer100g === 'number'
      ? `Protein: ${formatNutritionValue(proteinPer100g)} g pro 100 g`
      : 'Proteinwert fehlt.'
  };
}

function nutrientLevelLabel(level) {
  const labels = {
    low: 'niedrig',
    moderate: 'mittel',
    high: 'hoch'
  };

  return labels[level] || level;
}

function formatNutritionValue(value) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
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

function additiveScore(additives, additivesKnown, harmfulAdditives = []) {
  if (!additivesKnown) {
    return null;
  }

  if (harmfulAdditives.length >= 3) {
    return 0;
  }

  if (harmfulAdditives.length === 2) {
    return 8;
  }

  if (harmfulAdditives.length === 1) {
    return 18;
  }

  if (additives.length === 0) {
    return 95;
  }

  if (additives.length <= 2) {
    return 72;
  }

  if (additives.length <= 5) {
    return 45;
  }

  return 22;
}

function cappedHarmfulAdditiveScore(score, harmfulAdditives) {
  if (harmfulAdditives.length >= 3) {
    return Math.min(score, 8);
  }

  if (harmfulAdditives.length === 2) {
    return Math.min(score, 14);
  }

  if (harmfulAdditives.length === 1) {
    return Math.min(score, 24);
  }

  return score;
}

function ingredientScoreDetails({ additives, harmfulAdditives, palmOil, preferences, vegan, vegetarian }) {
  const details = harmfulAdditives.map((additive) => ({
    type: 'penalty',
    title: `Harter Abzug: ${additive.label}`,
    body: additive.reason,
    meta: `Typische Produkte: ${additive.examples}`
  }));

  if (harmfulAdditives.length > 0) {
    details.push({
      type: 'penalty',
      title: 'Deckel für Gesamtbewertung',
      body: 'Kritische Zusatzstoffe begrenzen nicht nur die Zutatenwertung, sondern auch den Gesamtscore, damit gute Werte in anderen Kategorien diese Stoffe nicht überdecken.',
      meta: harmfulAdditives.length >= 3 ? 'Maximaler Gesamtscore: 35' : harmfulAdditives.length === 2 ? 'Maximaler Gesamtscore: 42' : 'Maximaler Gesamtscore: 47'
    });
  }

  if (palmOil === true) {
    details.push({
      type: 'penalty',
      title: 'Palmöl erkannt',
      body: 'Palmöl belastet die Zutatenwertung, weil es häufig mit Entwaldung, Biodiversitätsverlust und problematischen Lieferketten verbunden ist.',
      meta: 'Zutatenwertung wird deutlich reduziert.'
    });
  } else if (palmOil === false) {
    details.push({
      type: 'positive',
      title: 'Kein Palmöl erkannt',
      body: 'Die Zutatenanalyse oder Zutatenliste enthält keinen Hinweis auf Palmöl.',
      meta: 'Erhöht die Zutatenwertung.'
    });
  }

  if (additives.length > 0 && harmfulAdditives.length === 0) {
    details.push({
      type: 'penalty',
      title: 'Zusatzstoffe vorhanden',
      body: 'Zusatzstoffe ohne kritische Markierung werden nach Anzahl moderat abgewertet.',
      meta: `${additives.length} Zusatzstoff${additives.length === 1 ? '' : 'e'} erkannt.`
    });
  }

  if (preferences.preferredDiet === 'vegan') {
    details.push({
      type: vegan === true ? 'positive' : 'penalty',
      title: vegan === true ? 'Vegan kompatibel' : 'Nicht vegan oder unklar',
      body: vegan === true
        ? 'Die Zutatenanalyse passt zum veganen Ziel.'
        : 'Tierische Bestandteile oder eine fehlende Vegan-Bestätigung belasten die Zutatenwertung für dein Profil.',
      meta: 'Relevant wegen deinem Profilziel: Vegan.'
    });
  }

  if (preferences.preferredDiet === 'vegetarian') {
    details.push({
      type: vegetarian === true ? 'positive' : 'penalty',
      title: vegetarian === true ? 'Vegetarisch kompatibel' : 'Nicht vegetarisch oder unklar',
      body: vegetarian === true
        ? 'Die Zutatenanalyse passt zum vegetarischen Ziel.'
        : 'Fleisch-/Fischbestandteile oder eine fehlende Bestätigung belasten die Zutatenwertung für dein Profil.',
      meta: 'Relevant wegen deinem Profilziel: Vegetarisch.'
    });
  }

  return details;
}

function sustainabilityScore(product, preferences) {
  return weightedKnownScore(sustainabilityScoreComponents(product, preferences), 50);
}

function sustainabilityScoreComponents(product, preferences) {
  const sustainability = product.sustainability || {};
  const components = [
    scoreComponent(ecoScoreValues[sustainability.ecoScore], 3),
    scoreComponent(carbonFootprintScore(carbonFootprintValue(sustainability)), 2),
    scoreComponent(originScore(sustainability.originCountry), 1),
    scoreComponent(packagingScore(sustainability.packaging), 1)
  ];

  if (bioPreferenceApplies(product, preferences)) {
    components.push(scoreComponent(sustainability.isBio ? 92 : 32, 1));
  }

  return components;
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

function withScore(score, message, missingData = [], options = {}) {
  const roundedScore = Math.round(clampScore(score));
  return {
    status: statusFromScore(roundedScore),
    score: roundedScore,
    message,
    missingData,
    ...options
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

function scoreComponent(score, weight) {
  if (typeof score !== 'number') {
    return null;
  }

  return { score, weight };
}

function weightedKnownScore(components, fallbackScore) {
  const knownComponents = components.filter(Boolean);
  const totalWeight = knownComponents.reduce((sum, component) => sum + component.weight, 0);

  if (totalWeight === 0) {
    return fallbackScore;
  }

  const weightedScore = knownComponents.reduce(
    (sum, component) => sum + component.score * component.weight,
    0
  );

  return clampScore(weightedScore / totalWeight);
}

function hasKnownComponents(components) {
  return components.some(Boolean);
}

function carbonFootprintValue(sustainability) {
  if (typeof sustainability.carbonFootprintKgCo2ePerKg === 'number') {
    return sustainability.carbonFootprintKgCo2ePerKg;
  }

  if (typeof sustainability.carbonFootprintKgCo2ePer100g === 'number') {
    return sustainability.carbonFootprintKgCo2ePer100g * 10;
  }

  if (typeof sustainability.carbonFootprintGCo2ePerKg === 'number') {
    return sustainability.carbonFootprintGCo2ePerKg / 1000;
  }

  if (typeof sustainability.carbonFootprintGCo2ePer100g === 'number') {
    return sustainability.carbonFootprintGCo2ePer100g / 100;
  }

  if (typeof sustainability.carbonFootprint === 'number') {
    return sustainability.carbonFootprint;
  }

  return undefined;
}

function carbonFootprintScore(carbonFootprint) {
  if (typeof carbonFootprint !== 'number') {
    return null;
  }

  if (carbonFootprint <= 0.5) return 100;
  if (carbonFootprint <= 1.5) return interpolate(carbonFootprint, 0.5, 1.5, 100, 78);
  if (carbonFootprint <= 4) return interpolate(carbonFootprint, 1.5, 4, 78, 35);
  return clampScore(interpolate(Math.min(carbonFootprint, 10), 4, 10, 35, 5));
}

function originScore(originCountry) {
  const origin = normalizeTerm(originCountry);
  if (!origin) {
    return null;
  }

  if (['schweiz', 'switzerland', 'suisse', 'svizzera'].some((term) => origin.includes(term))) {
    return 92;
  }

  if (['deutschland', 'germany', 'france', 'frankreich', 'italy', 'italien', 'austria', 'österreich'].some((term) => origin.includes(term))) {
    return 78;
  }

  if (['european union', 'eu', 'europa', 'europe'].some((term) => origin.includes(term))) {
    return 68;
  }

  return 35;
}

function packagingScore(packaging) {
  const value = normalizeTerm(packaging);
  if (!value) {
    return null;
  }

  if (['recycling', 'recycled', 'recyclable', 'mehrweg', 'returnable', 'pfand', 'glass', 'glas', 'paper', 'papier', 'cardboard', 'karton'].some((term) => value.includes(term))) {
    return 88;
  }

  if (['pet', 'tetra pak', 'carton', 'becher'].some((term) => value.includes(term))) {
    return 58;
  }

  if (['plastic', 'plastik', 'kunststoff', 'aluminium', 'aluminum', 'alu', 'dose', 'can'].some((term) => value.includes(term))) {
    return 25;
  }

  return 55;
}

function harmfulAdditiveMatches(additives, ingredients) {
  const additiveTexts = [
    ...additives,
    ...ingredients
  ];
  const matches = additiveTexts.flatMap((text) => harmfulAdditivesInText(text));
  const uniqueByGroup = new Map(matches.map((match) => [match.id, match]));

  return Array.from(uniqueByGroup.values());
}

function harmfulAdditivesInText(text) {
  const normalizedText = normalizeTerm(text);
  const matches = [];
  const codeMatches = normalizedText.matchAll(/\be\s*[- ]?(\d{3,4})([a-z]*)\b/g);

  for (const match of codeMatches) {
    const code = Number(match[1]);
    const additiveCode = `E${match[1]}${match[2] || ''}`.toUpperCase();
    const riskGroup = additiveRiskGroupForCode(code);

    if (riskGroup) {
      matches.push(additiveRiskMatch(riskGroup, additiveCode));
    }
  }

  additiveRiskGroups.forEach((riskGroup) => {
    const hasMatchingTerm = (riskGroup.terms || []).some((term) => normalizedText.includes(term));

    if (hasMatchingTerm) {
      matches.push(additiveRiskMatch(riskGroup, additiveCodeLabel(riskGroup)));
    }
  });

  return matches;
}

function additiveRiskGroupForCode(code) {
  return additiveRiskGroups.find((riskGroup) =>
    riskGroup.codes.some((entry) => (
      Array.isArray(entry)
        ? code >= entry[0] && code <= entry[1]
        : code === entry
    ))
  );
}

function additiveRiskMatch(riskGroup, matchedCode) {
  return {
    id: riskGroup.id,
    label: `${matchedCode} ${riskGroup.label}`,
    matchedCode,
    group: riskGroup.label,
    examples: riskGroup.examples,
    reason: riskGroup.reason
  };
}

function additiveCodeLabel(riskGroup) {
  return riskGroup.codes
    .map((entry) => (Array.isArray(entry) ? `E${entry[0]}-E${entry[1]}` : `E${entry}`))
    .join(', ');
}

function formatAdditiveList(additives) {
  const visibleAdditives = additives
    .map((additive) => additive.label)
    .slice(0, 5)
    .join(', ');
  const remainingCount = additives.length - 5;

  return remainingCount > 0
    ? `${visibleAdditives} und ${remainingCount} weitere`
    : visibleAdditives;
}

function ingredientFlag(tagValue, fallbackValue) {
  if (typeof tagValue === 'boolean') {
    return tagValue;
  }

  if (typeof fallbackValue === 'boolean') {
    return fallbackValue;
  }

  return undefined;
}

function ingredientTerms(product) {
  return (product.ingredients || [])
    .map(normalizeTerm)
    .filter(Boolean);
}

function palmOilTerms() {
  return [
    'palm oil',
    'palmöl',
    'palmol',
    'palmfett',
    'palmkern',
    'palm kernel',
    'huile de palme',
    'olio di palma'
  ];
}

function hasAnimalIngredient(ingredients, includeDairyAndEggs) {
  const alwaysAnimalTerms = [
    'beef',
    'pork',
    'chicken',
    'fish',
    'meat',
    'gelatine',
    'gelatin',
    'schwein',
    'rind',
    'huhn',
    'fisch',
    'fleisch',
    'gelatine'
  ];
  const veganOnlyTerms = [
    'milk',
    'milch',
    'butter',
    'cream',
    'sahne',
    'cheese',
    'käse',
    'kase',
    'egg',
    'eggs',
    'ei',
    'eier',
    'honey',
    'honig',
    'lactose',
    'laktose',
    'whey',
    'molke'
  ];
  const blockedTerms = includeDairyAndEggs
    ? [...alwaysAnimalTerms, ...veganOnlyTerms]
    : alwaysAnimalTerms;

  return ingredients.some((ingredient) =>
    blockedTerms.some((term) => ingredient.includes(term))
  );
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
