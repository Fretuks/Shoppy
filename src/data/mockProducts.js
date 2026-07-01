export const mockProducts = [
  {
    id: 'p-001',
    barcode: '7610200336707',
    name: 'Bio Haferdrink',
    brand: 'Shoppy Natur',
    category: 'Getränke',
    price: 2.8,
    currency: 'CHF',
    ingredients: ['Hafer', 'Wasser', 'Sonnenblumenöl', 'Meersalz'],
    allergens: ['Hafer'],
    nutrition: {
      caloriesPer100g: 46,
      sugarPer100g: 3.2,
      fatPer100g: 1.5,
      proteinPer100g: 1.1,
      saltPer100g: 0.1,
      nutriScore: 'B'
    },
    sustainability: {
      ecoScore: 'A',
      isBio: true,
      originCountry: 'Schweiz',
      packaging: 'Tetra Pak'
    },
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z'
  },
  {
    id: 'p-002',
    barcode: '7612345001112',
    name: 'Erdnuss Schoko-Riegel',
    brand: 'SnackFit',
    category: 'Snacks',
    price: 1.9,
    currency: 'CHF',
    ingredients: ['Erdnüsse', 'Zucker', 'Kakao', 'Milchpulver', 'Palmöl'],
    allergens: ['Erdnüsse', 'Milch'],
    nutrition: {
      caloriesPer100g: 520,
      sugarPer100g: 36,
      fatPer100g: 31,
      proteinPer100g: 14,
      saltPer100g: 0.4,
      nutriScore: 'D'
    },
    sustainability: {
      ecoScore: 'D',
      isBio: false,
      originCountry: 'Deutschland',
      packaging: 'Kunststoff'
    },
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z'
  },
  {
    id: 'p-003',
    barcode: '7612345002225',
    name: 'Protein Joghurt Beeren',
    brand: 'Alpina',
    category: 'Milchprodukte',
    price: 2.4,
    currency: 'CHF',
    ingredients: ['Joghurt', 'Beeren', 'Milchprotein', 'Süßungsmittel'],
    allergens: ['Milch'],
    nutrition: {
      caloriesPer100g: 82,
      sugarPer100g: 5.1,
      fatPer100g: 0.5,
      proteinPer100g: 10.5,
      saltPer100g: 0.12,
      nutriScore: 'A'
    },
    sustainability: {
      ecoScore: 'B',
      isBio: false,
      originCountry: 'Schweiz',
      packaging: 'Becher'
    },
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z'
  },
  {
    id: 'p-004',
    barcode: '7612345003338',
    name: 'Vegane Linsen-Bowl',
    brand: 'GreenMeal',
    category: 'Fertiggericht',
    price: 6.5,
    currency: 'CHF',
    ingredients: ['Linsen', 'Reis', 'Karotten', 'Spinat', 'Rapsöl'],
    allergens: [],
    nutrition: {
      caloriesPer100g: 148,
      sugarPer100g: 2.4,
      fatPer100g: 4.2,
      proteinPer100g: 7.8,
      saltPer100g: 0.7,
      nutriScore: 'A'
    },
    sustainability: {
      ecoScore: 'A',
      isBio: true,
      originCountry: 'Schweiz',
      packaging: 'Recycling-Schale'
    },
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z'
  }
];
