import { createSelector } from '@reduxjs/toolkit';

export const selectCartItems = (state) => state.cart.items;
export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectCouponError = (state) => state.cart.couponError;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;

/**
 * Memoized selector: Total number of individual items in cart
 */
export const selectTotalCartItems = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

/**
 * Memoized selector: Cart subtotal before discounts and taxes
 */
export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => {
    const raw = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.round(raw * 100) / 100;
  }
);

/**
 * Memoized selector: Discount amount based on applied promo coupon
 */
export const selectCartDiscount = createSelector(
  [selectCartSubtotal, selectAppliedCoupon],
  (subtotal, coupon) => {
    if (!coupon || !coupon.discountPercent || subtotal <= 0) return 0;
    const discount = (subtotal * coupon.discountPercent) / 100;
    return Math.round(discount * 100) / 100;
  }
);

/**
 * Memoized selector: Shipping fee calculation ($0 if order > $50 or coupon applies free shipping)
 */
export const selectCartShipping = createSelector(
  [selectCartSubtotal, selectAppliedCoupon],
  (subtotal, coupon) => {
    if (subtotal <= 0) return 0;
    if (coupon?.freeShipping || subtotal >= 50) return 0;
    return 5.99;
  }
);

/**
 * Memoized selector: Sales tax (8% on discounted subtotal)
 */
export const selectCartTax = createSelector(
  [selectCartSubtotal, selectCartDiscount],
  (subtotal, discount) => {
    const taxableAmount = Math.max(0, subtotal - discount);
    if (taxableAmount <= 0) return 0;
    const tax = taxableAmount * 0.08;
    return Math.round(tax * 100) / 100;
  }
);

/**
 * Memoized selector: Final total price
 */
export const selectCartFinalPrice = createSelector(
  [selectCartSubtotal, selectCartDiscount, selectCartTax, selectCartShipping],
  (subtotal, discount, tax, shipping) => {
    if (subtotal <= 0) return 0;
    const total = subtotal - discount + tax + shipping;
    return Math.round(total * 100) / 100;
  }
);

/**
 * Memoized selector: Complete financial breakdown bundle
 */
export const selectCartFinancialSummary = createSelector(
  [
    selectTotalCartItems,
    selectCartSubtotal,
    selectCartDiscount,
    selectCartTax,
    selectCartShipping,
    selectCartFinalPrice,
    selectAppliedCoupon
  ],
  (totalItems, subtotal, discount, tax, shipping, finalPrice, coupon) => ({
    totalItems,
    subtotal,
    discount,
    tax,
    shipping,
    finalPrice,
    coupon
  })
);
