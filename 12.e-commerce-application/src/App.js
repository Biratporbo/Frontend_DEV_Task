import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchProducts,
  selectProductsStatus,
  selectProductsError
} from './features/products/productsSlice';
import { selectFilteredProducts } from './features/products/productSelectors';
import { applyCoupon, setCartOpen } from './features/cart/cartSlice';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProductFilters from './components/products/ProductFilters';
import ProductList from './components/products/ProductList';
import ProductDetailModal from './components/products/ProductDetailModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import OrderConfirmation from './components/checkout/OrderConfirmation';
import AuthModal from './components/auth/AuthModal';
import OrderHistoryModal from './components/orders/OrderHistoryModal';
import { IconTag } from './components/common/Icons';

function App() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchProducts());
  };

  const handleQuickCoupon = (code) => {
    dispatch(applyCoupon(code));
    dispatch(setCartOpen(true));
  };

  return (
    <div className="store-layout">
      {/* Navigation Header */}
      <Navbar />

      {/* Promotional Storefront Hero Banner */}
      <section className="hero-banner">
        <div className="nav-container hero-inner">
          <div className="hero-content">
            <span className="hero-tag">Season Collection 2026</span>
            <h1 className="hero-title">
              Curated Essentials for Every Lifestyle.
            </h1>
            <p className="hero-subtitle">
              Browse top-tier electronics, fine jewelry, and contemporary fashion fetched live
              via the Fake Store API. Experience seamless cart calculations and simulated checkout.
            </p>
            <div className="hero-actions">
              <a href="#catalog" className="hero-primary-btn">
                Shop Catalog
              </a>
              <div className="hero-promo-badge">
                <IconTag size={16} />
                <span>Use code <strong>SAVE10</strong> for 10% off</span>
                <button
                  type="button"
                  className="hero-copy-code-btn"
                  onClick={() => handleQuickCoupon('SAVE10')}
                >
                  Apply to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main id="catalog" className="main-content nav-container">
        <ProductFilters totalCount={products.length} />
        <ProductList
          products={products}
          status={status}
          error={error}
          onRetry={handleRetry}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmation />
      <AuthModal />
      <OrderHistoryModal />
    </div>
  );
}

export default App;
