import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'apexcart_items_v1';
const COUPON_STORAGE_KEY = 'apexcart_coupon_v1';

// Available valid promotional coupon codes
export const AVAILABLE_COUPONS = {
  SAVE10: { code: 'SAVE10', discountPercent: 10, description: '10% Off Entire Order' },
  WELCOME20: { code: 'WELCOME20', discountPercent: 20, description: '20% Welcome Discount' },
  FREESHIP: { code: 'FREESHIP', discountPercent: 0, freeShipping: true, description: 'Free Express Shipping' }
};

function loadStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function loadStoredCoupon() {
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

const initialState = {
  items: loadStoredCart(), // Array of { id, title, price, image, category, quantity }
  appliedCoupon: loadStoredCoupon(), // { code, discountPercent, description } | null
  couponError: null,
  isCartOpen: false
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const quantityToAdd = action.payload.quantity || 1;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantityToAdd;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: quantityToAdd
        });
      }
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch (e) {}
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch (e) {}
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = Math.min(quantity, 99); // Max 99 per item
        }
      }
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch (e) {}
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.couponError = null;
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(COUPON_STORAGE_KEY);
      } catch (e) {}
    },
    applyCoupon: (state, action) => {
      const code = (action.payload || '').trim().toUpperCase();
      if (!code) {
        state.couponError = 'Please enter a coupon code';
        return;
      }
      if (AVAILABLE_COUPONS[code]) {
        state.appliedCoupon = AVAILABLE_COUPONS[code];
        state.couponError = null;
        try {
          localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(AVAILABLE_COUPONS[code]));
        } catch (e) {}
      } else {
        state.couponError = 'Invalid promo code. Try SAVE10 or WELCOME20';
      }
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponError = null;
      try {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      } catch (e) {}
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
