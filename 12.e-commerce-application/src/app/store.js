import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';
import actionLoggerMiddleware from '../middleware/actionLoggerMiddleware';
import analyticsMiddleware from '../middleware/analyticsMiddleware';

/**
 * configureStore(): Configures Redux store with normalized slices,
 * async thunk integration, and custom diagnostic/analytics middleware.
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(actionLoggerMiddleware, analyticsMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
