import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './App';
import productsReducer, {
  productsAdapter,
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
  setSortBy
} from './features/products/productsSlice';
import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon,
  clearCart
} from './features/cart/cartSlice';
import authReducer, {
  loginWithDemo,
  logout
} from './features/auth/authSlice';
import ordersReducer, {
  processCheckout
} from './features/orders/ordersSlice';

import {
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTax,
  selectCartShipping,
  selectCartFinalPrice
} from './features/cart/cartSelectors';
import {
  selectCategories,
  selectFilteredProducts
} from './features/products/productSelectors';

describe('Redux Reducers & Slices', () => {
  test('cartSlice handles addToCart, updateQuantity, and removeFromCart', () => {
    const initialState = {
      items: [],
      appliedCoupon: null,
      couponError: null,
      isCartOpen: false
    };

    const mockItem = {
      id: 101,
      title: 'Wireless Headphones',
      price: 50.0,
      image: 'https://example.com/headphones.jpg',
      category: 'electronics'
    };

    // 1. Add to cart
    let state = cartReducer(initialState, addToCart(mockItem));
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe(101);
    expect(state.items[0].quantity).toBe(1);

    // 2. Add same item increments quantity
    state = cartReducer(state, addToCart(mockItem));
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(2);

    // 3. Update quantity directly
    state = cartReducer(state, updateQuantity({ id: 101, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);

    // 4. Remove from cart
    state = cartReducer(state, removeFromCart(101));
    expect(state.items.length).toBe(0);
  });

  test('cartSlice handles coupons and discount validation', () => {
    const initialState = {
      items: [],
      appliedCoupon: null,
      couponError: null,
      isCartOpen: false
    };

    // Valid SAVE10 coupon
    let state = cartReducer(initialState, applyCoupon('SAVE10'));
    expect(state.appliedCoupon).toBeDefined();
    expect(state.appliedCoupon.code).toBe('SAVE10');
    expect(state.appliedCoupon.discountPercent).toBe(10);
    expect(state.couponError).toBeNull();

    // Invalid coupon
    state = cartReducer(state, applyCoupon('INVALIDCODE'));
    expect(state.couponError).toMatch(/invalid promo code/i);
  });

  test('authSlice handles demo login and logout', () => {
    const initialState = {
      isAuthenticated: false,
      user: null,
      token: null,
      isAuthModalOpen: false,
      redirectReason: null
    };

    const loggedInState = authReducer(initialState, loginWithDemo());
    expect(loggedInState.isAuthenticated).toBe(true);
    expect(loggedInState.user).toBeDefined();
    expect(loggedInState.user.name).toBe('Alex Turner');

    const loggedOutState = authReducer(loggedInState, logout());
    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.user).toBeNull();
  });

  test('productsSlice handles fetchProducts.fulfilled and entity adapter normalization', () => {
    const initialState = productsAdapter.getInitialState({
      status: 'loading',
      error: null,
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'featured',
      selectedProductId: null
    });

    const mockPayload = [
      { id: 1, title: 'Item 1', price: 20, category: 'electronics' },
      { id: 2, title: 'Item 2', price: 40, category: 'jewelery' }
    ];

    const state = productsReducer(
      initialState,
      fetchProducts.fulfilled(mockPayload, 'requestId')
    );

    expect(state.status).toBe('succeeded');
    expect(state.ids).toEqual([1, 2]);
    expect(state.entities[1].title).toBe('Item 1');
  });
});

describe('Memoized Selectors', () => {
  const mockRootState = {
    cart: {
      items: [
        { id: 1, title: 'Item 1', price: 100, quantity: 1, category: 'men' },
        { id: 2, title: 'Item 2', price: 50, quantity: 2, category: 'women' }
      ],
      appliedCoupon: { code: 'SAVE10', discountPercent: 10, description: '10% Off' },
      couponError: null,
      isCartOpen: false
    },
    products: {
      ids: [1, 2, 3],
      entities: {
        1: { id: 1, title: 'Alpha Smartphone', price: 800, category: 'electronics', rating: { rate: 4.8, count: 120 } },
        2: { id: 2, title: 'Silver Chain Necklace', price: 90, category: 'jewelery', rating: { rate: 4.2, count: 55 } },
        3: { id: 3, title: 'Classic Denim Jacket', price: 65, category: "men's clothing", rating: { rate: 4.5, count: 80 } }
      },
      status: 'succeeded',
      error: null,
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'featured',
      selectedProductId: null
    }
  };

  test('computes cart subtotal, discount, tax, shipping, and final price accurately', () => {
    // subtotal = 100*1 + 50*2 = 200
    const subtotal = selectCartSubtotal(mockRootState);
    expect(subtotal).toBe(200);

    // discount 10% = 20
    const discount = selectCartDiscount(mockRootState);
    expect(discount).toBe(20);

    // discountedSubtotal = 180, tax 8% = 14.4
    const tax = selectCartTax(mockRootState);
    expect(tax).toBeCloseTo(14.4, 2);

    // discountedSubtotal 180 > 50 -> shipping = 0
    const shipping = selectCartShipping(mockRootState);
    expect(shipping).toBe(0);

    // final price = 180 + 14.4 + 0 = 194.4
    const finalPrice = selectCartFinalPrice(mockRootState);
    expect(finalPrice).toBeCloseTo(194.4, 2);
  });

  test('filters and sorts products by category, search term, and price', () => {
    const categories = selectCategories(mockRootState);
    expect(categories).toContain('all');
    expect(categories).toContain('electronics');
    expect(categories).toContain('jewelery');

    // Filter by category
    const stateFilteredCategory = {
      ...mockRootState,
      products: {
        ...mockRootState.products,
        selectedCategory: 'electronics'
      }
    };
    const electronics = selectFilteredProducts(stateFilteredCategory);
    expect(electronics.length).toBe(1);
    expect(electronics[0].title).toBe('Alpha Smartphone');

    // Filter by search query
    const stateFilteredSearch = {
      ...mockRootState,
      products: {
        ...mockRootState.products,
        searchQuery: 'jacket'
      }
    };
    const searchResults = selectFilteredProducts(stateFilteredSearch);
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].title).toBe('Classic Denim Jacket');

    // Sort by price: low to high
    const stateSortedPrice = {
      ...mockRootState,
      products: {
        ...mockRootState.products,
        sortBy: 'price-low'
      }
    };
    const sorted = selectFilteredProducts(stateSortedPrice);
    expect(sorted[0].price).toBe(65);
    expect(sorted[1].price).toBe(90);
    expect(sorted[2].price).toBe(800);
  });
});

describe('Asynchronous Flows & Orders', () => {
  test('processCheckout.fulfilled records an order and sets latest order', () => {
    const initialState = {
      orders: [],
      latestOrder: null,
      checkoutStatus: 'loading',
      checkoutError: null,
      isCheckoutOpen: true,
      isHistoryOpen: false
    };

    const mockOrderPayload = {
      id: 'ORD-98765-ABC',
      createdAt: '2026-11-13T14:30:00.000Z',
      items: [{ id: 1, title: 'Item 1', price: 100, quantity: 1 }],
      financials: { subtotal: 100, discount: 0, tax: 8, shipping: 0, finalPrice: 108 },
      shippingAddress: { fullName: 'Alex Turner' },
      paymentMethod: 'credit-card',
      status: 'Confirmed'
    };

    const state = ordersReducer(
      initialState,
      processCheckout.fulfilled(mockOrderPayload, 'requestId', {})
    );

    expect(state.checkoutStatus).toBe('succeeded');
    expect(state.isCheckoutOpen).toBe(false);
    expect(state.latestOrder).toEqual(mockOrderPayload);
    expect(state.orders).toContainEqual(mockOrderPayload);
  });
});

describe('ApexCart Application Integration', () => {
  test('renders navigation header with brand and promo banner', () => {
    const testStore = configureStore({
      reducer: {
        products: productsReducer,
        cart: cartReducer,
        auth: authReducer,
        orders: ordersReducer
      }
    });

    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );

    // Verify brand logo is present
    expect(screen.getAllByText(/Apex/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cart/i).length).toBeGreaterThan(0);

    // Verify hero banner promo
    expect(screen.getByText(/Curated Essentials for Every Lifestyle/i)).toBeInTheDocument();
  });
});
