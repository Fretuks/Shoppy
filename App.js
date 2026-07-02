import { useEffect, useMemo, useState } from 'react';
import { BackHandler, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import BottomTabBar from './src/components/layout/BottomTabBar';
import AlternativesScreen from './src/screens/AlternativesScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RatingCriteriaDetailScreen from './src/screens/RatingCriteriaDetailScreen';
import ScanScreen from './src/screens/ScanScreen';
import ShoppingListScreen from './src/screens/ShoppingListScreen';
import { lookupProductByBarcode } from './src/services/productApi';
import { storageService } from './src/services/storageService';
import { colors, defaultPreferences } from './src/utils/constants';

const initialShoppingList = {
  id: 'active-list',
  title: 'Aktueller Einkauf',
  items: [],
  estimatedTotal: 0,
  currency: 'CHF',
  status: 'active',
  createdAt: new Date().toISOString()
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [route, setRoute] = useState({ name: 'tabs' });
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const [productCache, setProductCache] = useState({});
  const [manualPrices, setManualPrices] = useState({});
  const [recentProducts, setRecentProducts] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const [
        storedPreferences,
        storedShoppingList,
        storedProductCache,
        storedManualPrices,
        storedRecentProducts
      ] = await Promise.all([
        storageService.loadPreferences(defaultPreferences),
        storageService.loadShoppingList(initialShoppingList),
        storageService.loadProductCache(),
        storageService.loadManualPrices(),
        storageService.loadRecentProducts()
      ]);

      if (isMounted) {
        setPreferences(storedPreferences);
        setShoppingList(storedShoppingList);
        setProductCache(storedProductCache);
        setManualPrices(storedManualPrices);
        setRecentProducts(storedRecentProducts);
        setIsHydrated(true);
      }
    }

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isHydrated) storageService.savePreferences(preferences);
  }, [isHydrated, preferences]);

  useEffect(() => {
    if (isHydrated) storageService.saveShoppingList(shoppingList);
  }, [isHydrated, shoppingList]);

  useEffect(() => {
    if (isHydrated) storageService.saveProductCache(productCache);
  }, [isHydrated, productCache]);

  useEffect(() => {
    if (isHydrated) storageService.saveManualPrices(manualPrices);
  }, [isHydrated, manualPrices]);

  useEffect(() => {
    if (isHydrated) storageService.saveRecentProducts(recentProducts);
  }, [isHydrated, recentProducts]);

  const routeProduct = route.product;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', goBackFromRoute);

    return () => subscription.remove();
  }, [route]);

  const tabScreen = useMemo(() => {
    if (activeTab === 'scan') {
      return (
        <ScanScreen
          onOpenProduct={openProduct}
          onScanBarcode={scanProductByBarcode}
          preferences={preferences}
          productCache={productCache}
        />
      );
    }

    if (activeTab === 'list') {
      return (
        <ShoppingListScreen
          onCompleteList={completeShoppingList}
          onDeleteItem={deleteListItem}
          onStartScan={() => setActiveTab('scan')}
          onToggleItem={toggleListItem}
          onUpdateItemPrice={updateListItemPrice}
          preferences={preferences}
          shoppingList={shoppingList}
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <ProfileScreen
          onChangePreferences={setPreferences}
          preferences={preferences}
        />
      );
    }

    return (
      <HomeScreen
        onOpenProduct={openProduct}
        onStartScan={() => setActiveTab('scan')}
        preferences={preferences}
        recentProducts={recentProducts}
      />
    );
  }, [activeTab, manualPrices, preferences, productCache, recentProducts, shoppingList]);

  async function scanProductByBarcode(barcode) {
    const result = await lookupProductByBarcode(
      barcode,
      productCache,
      preferences.offlineModeEnabled
    );

    if (result.status === 'found') {
      const pricedProduct = applyManualPrice(result.product);
      openProduct(pricedProduct);
    }

    return result;
  }

  function openProduct(product) {
    const pricedProduct = applyManualPrice(product);
    addProductToCache(pricedProduct);
    addRecentProduct(pricedProduct);
    setRoute({ name: 'productDetail', product: pricedProduct });
  }

  function showAlternatives(product) {
    setRoute({ name: 'alternatives', product });
  }

  function showRatingCriteria(product, category) {
    setRoute({ name: 'ratingCriteria', product, category });
  }

  function addProductToCache(product) {
    setProductCache((current) => ({
      ...current,
      [product.barcode]: product
    }));
  }

  function addRecentProduct(product) {
    setRecentProducts((current) => {
      const withoutDuplicate = current.filter((item) => item.id !== product.id);
      const previous = current.find((item) => item.id === product.id);
      const scanCount = (previous?.scanCount || 0) + 1;
      return [{ ...product, scanCount, lastScannedAt: new Date().toISOString() }, ...withoutDuplicate].slice(0, 8);
    });
  }

  function applyManualPrice(product) {
    const manualPrice = manualPrices[priceKey(product)];

    if (typeof manualPrice !== 'number') {
      return product;
    }

    return {
      ...product,
      currency: product.currency || preferences.currency,
      price: manualPrice
    };
  }

  function saveManualPriceForProduct(product, price) {
    const key = priceKey(product);

    setManualPrices((current) => ({
      ...current,
      [key]: price
    }));
    setProductCache((current) => {
      const cachedProduct = current[product.barcode];

      if (!cachedProduct) {
        return current;
      }

      return {
        ...current,
        [product.barcode]: {
          ...cachedProduct,
          currency: product.currency || preferences.currency,
          price,
          updatedAt: new Date().toISOString()
        }
      };
    });
    setRecentProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, currency: product.currency || preferences.currency, price }
          : item
      )
    );
  }

  function addProductToShoppingList(product) {
    setShoppingList((current) => {
      const existingItem = current.items.find((item) => item.productId === product.id);
      const items = existingItem
        ? current.items.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  packageQuantityGrams: item.packageQuantityGrams ?? product.packageQuantityGrams,
                  packageQuantityLabel: item.packageQuantityLabel ?? product.packageQuantityLabel,
                  servingQuantityGrams: item.servingQuantityGrams ?? product.servingQuantityGrams,
                  nutrition: item.nutrition ?? product.nutrition
                }
              : item
          )
        : [
            ...current.items,
            {
              id: `item-${Date.now()}`,
              productId: product.id,
              productName: product.name,
              quantity: 1,
              estimatedPrice: product.price,
              currency: product.currency || current.currency,
              barcode: product.barcode,
              packageQuantityGrams: product.packageQuantityGrams,
              packageQuantityLabel: product.packageQuantityLabel,
              servingQuantityGrams: product.servingQuantityGrams,
              nutrition: product.nutrition,
              checked: false,
              addedAt: new Date().toISOString()
            }
          ];

      return {
        ...current,
        currency: product.currency || current.currency,
        estimatedTotal: calculateEstimatedTotal(items),
        items
      };
    });
  }

  function updateListItemPrice(itemId, price) {
    const itemToUpdate = shoppingList.items.find((item) => item.id === itemId);

    if (itemToUpdate) {
      saveManualPriceForProduct({
        id: itemToUpdate.productId,
        barcode: itemToUpdate.barcode,
        currency: itemToUpdate.currency || shoppingList.currency
      }, price);
    }

    setShoppingList((current) => {
      const items = current.items.map((item) =>
        item.id === itemId ? { ...item, estimatedPrice: price } : item
      );

      return {
        ...current,
        estimatedTotal: calculateEstimatedTotal(items),
        items
      };
    });
  }

  function toggleListItem(itemId) {
    setShoppingList((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  }

  function deleteListItem(itemId) {
    setShoppingList((current) => {
      const items = current.items.filter((item) => item.id !== itemId);
      return {
        ...current,
        estimatedTotal: calculateEstimatedTotal(items),
        items
      };
    });
  }

  function completeShoppingList() {
    setShoppingList({
      ...initialShoppingList,
      createdAt: new Date().toISOString()
    });
  }

  function goBackToTabs() {
    setRoute({ name: 'tabs' });
  }

  function goBackFromRoute() {
    if (route.name === 'ratingCriteria' && routeProduct) {
      setRoute({ name: 'productDetail', product: routeProduct });
      return true;
    }

    if (route.name === 'alternatives' && routeProduct) {
      setRoute({ name: 'productDetail', product: routeProduct });
      return true;
    }

    if (route.name === 'productDetail' && routeProduct) {
      setRoute({ name: 'tabs' });
      return true;
    }

    return false;
  }

  function renderRoute() {
    if (!isHydrated) {
      return (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Shoppy wird geladen...</Text>
        </View>
      );
    }

    if (route.name === 'productDetail' && routeProduct) {
      return (
        <ProductDetailScreen
          onAddToList={addProductToShoppingList}
          onBack={goBackToTabs}
          onSaveManualPrice={saveManualPriceForProduct}
          onShowRatingCriteria={showRatingCriteria}
          onShowAlternatives={showAlternatives}
          preferences={preferences}
          product={routeProduct}
        />
      );
    }

    if (route.name === 'ratingCriteria' && routeProduct) {
      return (
        <RatingCriteriaDetailScreen
          category={route.category}
          onBack={goBackFromRoute}
          preferences={preferences}
          product={routeProduct}
        />
      );
    }

    if (route.name === 'alternatives' && routeProduct) {
      return (
        <AlternativesScreen
          onBack={goBackFromRoute}
          onChoose={(product) => {
            addProductToShoppingList(product);
            setActiveTab('list');
            setRoute({ name: 'tabs' });
          }}
          onOpenProduct={openProduct}
          preferences={preferences}
          product={routeProduct}
          productCache={productCache}
        />
      );
    }

    return tabScreen;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {renderRoute()}
      {route.name === 'tabs' && isHydrated ? (
        <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
      ) : null}
    </SafeAreaView>
  );
}

function calculateEstimatedTotal(items) {
  return items.reduce((sum, item) => {
    const price = typeof item.estimatedPrice === 'number' ? item.estimatedPrice : 0;
    return sum + price * item.quantity;
  }, 0);
}

function priceKey(product) {
  return product.barcode || product.id;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  loadingText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700'
  }
});
