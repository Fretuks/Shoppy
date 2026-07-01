import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import BottomTabBar from './src/components/layout/BottomTabBar';
import AlternativesScreen from './src/screens/AlternativesScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
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
  const [recentProducts, setRecentProducts] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const [
        storedPreferences,
        storedShoppingList,
        storedProductCache,
        storedRecentProducts
      ] = await Promise.all([
        storageService.loadPreferences(defaultPreferences),
        storageService.loadShoppingList(initialShoppingList),
        storageService.loadProductCache(),
        storageService.loadRecentProducts()
      ]);

      if (isMounted) {
        setPreferences(storedPreferences);
        setShoppingList(storedShoppingList);
        setProductCache(storedProductCache);
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
    if (isHydrated) storageService.saveRecentProducts(recentProducts);
  }, [isHydrated, recentProducts]);

  const routeProduct = route.product;

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
  }, [activeTab, preferences, productCache, recentProducts, shoppingList]);

  async function scanProductByBarcode(barcode) {
    const result = await lookupProductByBarcode(
      barcode,
      productCache,
      preferences.offlineModeEnabled
    );

    if (result.status === 'found') {
      openProduct(result.product);
      addProductToCache(result.product);
      addRecentProduct(result.product);
    }

    return result;
  }

  function openProduct(product) {
    addProductToCache(product);
    addRecentProduct(product);
    setRoute({ name: 'productDetail', product });
  }

  function showAlternatives(product) {
    setRoute({ name: 'alternatives', product });
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
      return [product, ...withoutDuplicate].slice(0, 5);
    });
  }

  function addProductToShoppingList(product) {
    setShoppingList((current) => {
      const existingItem = current.items.find((item) => item.productId === product.id);
      const items = existingItem
        ? current.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
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
          onShowAlternatives={showAlternatives}
          preferences={preferences}
          product={routeProduct}
        />
      );
    }

    if (route.name === 'alternatives' && routeProduct) {
      return (
        <AlternativesScreen
          onBack={() => setRoute({ name: 'productDetail', product: routeProduct })}
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
