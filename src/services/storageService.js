import AsyncStorage from '@react-native-async-storage/async-storage';

const keys = {
  preferences: 'shoppy.preferences',
  shoppingList: 'shoppy.shoppingList',
  productCache: 'shoppy.productCache',
  manualPrices: 'shoppy.manualPrices',
  recentProducts: 'shoppy.recentProducts'
};

async function readJson(key, fallbackValue) {
  const rawValue = await AsyncStorage.getItem(key);
  return rawValue ? JSON.parse(rawValue) : fallbackValue;
}

async function writeJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storageService = {
  loadPreferences: (fallbackValue) => readJson(keys.preferences, fallbackValue),
  savePreferences: (preferences) => writeJson(keys.preferences, preferences),
  loadShoppingList: (fallbackValue) => readJson(keys.shoppingList, fallbackValue),
  saveShoppingList: (shoppingList) => writeJson(keys.shoppingList, shoppingList),
  loadProductCache: () => readJson(keys.productCache, {}),
  saveProductCache: (cache) => writeJson(keys.productCache, cache),
  loadManualPrices: () => readJson(keys.manualPrices, {}),
  saveManualPrices: (prices) => writeJson(keys.manualPrices, prices),
  loadRecentProducts: () => readJson(keys.recentProducts, []),
  saveRecentProducts: (products) => writeJson(keys.recentProducts, products)
};
