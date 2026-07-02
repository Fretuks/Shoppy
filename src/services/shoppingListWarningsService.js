const dailyLimitRules = [
  {
    key: 'caffeine',
    label: 'Koffein',
    limit: 200,
    unit: 'mg',
    nutritionKey: 'caffeineMgPer100g',
    severity: 'critical',
    message: 'Mehr Koffein als der Tagesrichtwert in Shoppy. Auf mehrere Tage aufteilen.'
  },
  {
    key: 'sugar',
    label: 'Zucker',
    limit: 50,
    unit: 'g',
    nutritionKey: 'sugarPer100g',
    severity: 'warning',
    message: 'Mehr Zucker als der Tagesrichtwert in Shoppy. Auf mehrere Tage aufteilen.'
  },
  {
    key: 'salt',
    label: 'Salz',
    limit: 5,
    unit: 'g',
    nutritionKey: 'saltPer100g',
    severity: 'warning',
    message: 'Mehr Salz als der Tagesrichtwert in Shoppy. Auf mehrere Tage aufteilen.'
  }
];

export function calculateShoppingListWarnings(shoppingList) {
  return dailyLimitRules
    .map((rule) => {
      const total = totalNutrientAmount(shoppingList.items || [], rule);

      return {
        ...rule,
        total,
        percentage: Math.round((total / rule.limit) * 100)
      };
    })
    .filter((warning) => warning.total > warning.limit);
}

function totalNutrientAmount(items, rule) {
  return items.reduce((sum, item) => {
    const per100g = item.nutrition?.[rule.nutritionKey];
    const quantityGrams = itemQuantityGrams(item);

    if (typeof per100g !== 'number' || typeof quantityGrams !== 'number') {
      return sum;
    }

    return sum + (per100g * quantityGrams * item.quantity) / 100;
  }, 0);
}

function itemQuantityGrams(item) {
  if (typeof item.packageQuantityGrams === 'number' && item.packageQuantityGrams > 0) {
    return item.packageQuantityGrams;
  }

  if (typeof item.servingQuantityGrams === 'number' && item.servingQuantityGrams > 0) {
    return item.servingQuantityGrams;
  }

  return 100;
}
