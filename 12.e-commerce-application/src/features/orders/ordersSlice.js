import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from '../cart/cartSlice';

const ORDERS_STORAGE_KEY = 'apexcart_orders_v1';

// Preloaded realistic sample order so order history is immediately inspectable
const SAMPLE_ORDER = {
  id: 'ORD-8921-X',
  trackingId: 'TRK-US-991204',
  date: '2026-11-10T14:22:00.000Z',
  items: [
    {
      id: 1,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      quantity: 1,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
    },
    {
      id: 2,
      title: 'Mens Casual Premium Slim Fit T-Shirts',
      price: 22.3,
      quantity: 2,
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
    }
  ],
  financials: {
    subtotal: 154.55,
    discount: 15.46,
    tax: 11.13,
    shipping: 0,
    finalPrice: 150.22,
    couponCode: 'SAVE10'
  },
  shippingAddress: {
    fullName: 'Alex Turner',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    country: 'United States'
  },
  paymentMethod: 'Credit Card (ending in 4242)',
  status: 'Delivered'
};

function loadStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [SAMPLE_ORDER];
}

/**
 * createAsyncThunk: Simulates asynchronous payment gateway checkout roundtrip
 */
export const processCheckout = createAsyncThunk(
  'orders/processCheckout',
  async ({ cartItems, financials, shippingAddress, paymentMethod, user }, { dispatch, rejectWithValue }) => {
    try {
      // Simulate 1.5s asynchronous payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
        trackingId: `TRK-US-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({ ...item })),
        financials: { ...financials },
        shippingAddress: { ...shippingAddress },
        paymentMethod: paymentMethod || 'Credit Card (ending in 4242)',
        customerEmail: user?.email || 'shopper@example.com',
        status: 'Confirmed'
      };

      // Automatically clear cart upon successful order placement
      dispatch(clearCart());

      return newOrder;
    } catch (err) {
      return rejectWithValue(err.message || 'Payment processing failed. Please try again.');
    }
  }
);

const initialState = {
  orders: loadStoredOrders(),
  checkoutStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  checkoutError: null,
  latestOrder: null,
  isCheckoutOpen: false,
  isHistoryOpen: false
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCheckoutOpen: (state, action) => {
      state.isCheckoutOpen = action.payload;
      if (!action.payload) {
        state.checkoutError = null;
      }
    },
    setHistoryOpen: (state, action) => {
      state.isHistoryOpen = action.payload;
    },
    clearLatestOrder: (state) => {
      state.latestOrder = null;
      state.checkoutStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processCheckout.pending, (state) => {
        state.checkoutStatus = 'loading';
        state.checkoutError = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.checkoutStatus = 'succeeded';
        state.latestOrder = action.payload;
        state.orders.unshift(action.payload);
        state.isCheckoutOpen = false;

        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(state.orders));
        } catch (e) {}
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.checkoutStatus = 'failed';
        state.checkoutError = action.payload || 'Checkout processing failed';
      });
  }
});

export const {
  setCheckoutOpen,
  setHistoryOpen,
  clearLatestOrder
} = ordersSlice.actions;

export const selectOrdersList = (state) => state.orders.orders;
export const selectCheckoutStatus = (state) => state.orders.checkoutStatus;
export const selectCheckoutError = (state) => state.orders.checkoutError;
export const selectLatestOrder = (state) => state.orders.latestOrder;
export const selectIsCheckoutOpen = (state) => state.orders.isCheckoutOpen;
export const selectIsHistoryOpen = (state) => state.orders.isHistoryOpen;

export default ordersSlice.reducer;
