import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCartItems,
  selectCartFinancialSummary,
  selectCouponError,
  selectIsCartOpen
} from '../../features/cart/cartSelectors';
import {
  setCartOpen,
  clearCart,
  applyCoupon,
  removeCoupon
} from '../../features/cart/cartSlice';
import { selectIsAuthenticated, openAuthModal } from '../../features/auth/authSlice';
import { setCheckoutOpen } from '../../features/orders/ordersSlice';
import CartItemRow from './CartItemRow';
import { IconCart, IconClose, IconTrash, IconTag } from '../common/Icons';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const financials = useAppSelector(selectCartFinancialSummary);
  const couponError = useAppSelector(selectCouponError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [couponInput, setCouponInput] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      dispatch(applyCoupon(couponInput));
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ reason: 'Sign in required to proceed to secure checkout' }));
    } else {
      dispatch(setCartOpen(false));
      dispatch(setCheckoutOpen(true));
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <IconCart size={22} />
            <h3 className="cart-drawer-title">Shopping Cart</h3>
            <span className="cart-items-pill">
              {financials.totalItems} {financials.totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={handleClose}
            aria-label="Close cart"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <IconCart size={40} />
              </div>
              <h4 className="cart-empty-title">Your Cart is Empty</h4>
              <p className="cart-empty-desc">
                Looks like you haven't added anything yet. Explore our curated products and find something you love!
              </p>
              <button
                type="button"
                className="cart-explore-btn"
                onClick={handleClose}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Financial Summary */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Form */}
            <div className="coupon-box">
              {financials.coupon ? (
                <div className="applied-coupon-pill">
                  <div className="applied-coupon-info">
                    <IconTag size={15} />
                    <span>
                      <strong>{financials.coupon.code}</strong> applied ({financials.coupon.description})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove-coupon-btn"
                    onClick={() => dispatch(removeCoupon())}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form className="coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Promo code (try SAVE10 or WELCOME20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" className="coupon-apply-btn">
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="coupon-error-text">{couponError}</p>}
            </div>

            {/* Financial Calculations Table */}
            <div className="cart-financial-breakdown">
              <div className="calc-row">
                <span className="calc-label">Subtotal:</span>
                <span className="calc-value">${financials.subtotal.toFixed(2)}</span>
              </div>

              {financials.discount > 0 && (
                <div className="calc-row discount-row">
                  <span className="calc-label">Discount ({financials.coupon?.code}):</span>
                  <span className="calc-value">-${financials.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="calc-row">
                <span className="calc-label">Estimated Tax (8%):</span>
                <span className="calc-value">${financials.tax.toFixed(2)}</span>
              </div>

              <div className="calc-row">
                <span className="calc-label">Shipping:</span>
                <span className="calc-value">
                  {financials.shipping === 0 ? (
                    <strong className="free-shipping-text">FREE</strong>
                  ) : (
                    `$${financials.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="calc-row final-total-row">
                <span className="calc-label">Final Price:</span>
                <span className="calc-value">${financials.finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cart-bottom-actions">
              <button
                type="button"
                className="checkout-proceed-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout &bull; ${financials.finalPrice.toFixed(2)}
              </button>

              <button
                type="button"
                className="clear-cart-text-btn"
                onClick={() => dispatch(clearCart())}
              >
                <IconTrash size={14} />
                <span>Clear Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
