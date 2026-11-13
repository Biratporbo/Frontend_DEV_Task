import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCartItems,
  selectCartFinancialSummary
} from '../../features/cart/cartSelectors';
import {
  selectIsCheckoutOpen,
  selectCheckoutStatus,
  selectCheckoutError,
  setCheckoutOpen,
  processCheckout
} from '../../features/orders/ordersSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { IconClose, IconCheck, IconShield } from '../common/Icons';

export function CheckoutModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCheckoutOpen);
  const cartItems = useAppSelector(selectCartItems);
  const financials = useAppSelector(selectCartFinancialSummary);
  const checkoutStatus = useAppSelector(selectCheckoutStatus);
  const checkoutError = useAppSelector(selectCheckoutError);
  const currentUser = useAppSelector(selectCurrentUser);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shippingForm, setShippingForm] = useState({
    fullName: currentUser?.address?.fullName || currentUser?.name || 'Alex Turner',
    street: currentUser?.address?.street || '742 Evergreen Terrace',
    city: currentUser?.address?.city || 'Springfield',
    state: currentUser?.address?.state || 'OR',
    zipCode: currentUser?.address?.zipCode || '97477',
    country: currentUser?.address?.country || 'United States'
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (ending in 4242)');

  if (!isOpen) return null;

  const handleClose = () => {
    if (checkoutStatus !== 'loading') {
      dispatch(setCheckoutOpen(false));
    }
  };

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    dispatch(
      processCheckout({
        cartItems,
        financials,
        shippingAddress: shippingForm,
        paymentMethod,
        user: currentUser
      })
    );
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="checkout-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <div className="checkout-title-group">
            <h3 className="checkout-modal-title">Secure Checkout</h3>
            <span className="checkout-badge-secure">
              <IconShield size={14} />
              Encrypted
            </span>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={handleClose}
            disabled={checkoutStatus === 'loading'}
            aria-label="Close checkout"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Stepper progress */}
        <div className="checkout-steps-bar">
          <div className={`step-node ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-name">Shipping</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-name">Payment</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-node ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-name">Review</span>
          </div>
        </div>

        {checkoutError && (
          <div className="checkout-error-banner" role="alert">
            {checkoutError}
          </div>
        )}

        <div className="checkout-modal-body">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="checkout-step-content">
              <h4 className="step-section-heading">Delivery Address</h4>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    value={shippingForm.fullName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    className="form-input"
                    value={shippingForm.street}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    className="form-input"
                    value={shippingForm.state}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal / ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    className="form-input"
                    value={shippingForm.zipCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-input"
                    value={shippingForm.country}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="checkout-step-content">
              <h4 className="step-section-heading">Select Payment Method</h4>
              <div className="payment-options-list">
                <label className={`payment-option-card ${paymentMethod.includes('Credit Card') ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card (ending in 4242)"
                    checked={paymentMethod.includes('Credit Card')}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-info">
                    <span className="payment-name">Credit / Debit Card</span>
                    <span className="payment-sub">Visa ending in 4242 (Simulated)</span>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod.includes('PayPal') ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal Express Checkout"
                    checked={paymentMethod.includes('PayPal')}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-info">
                    <span className="payment-name">PayPal</span>
                    <span className="payment-sub">Safe one-click checkout</span>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod.includes('UPI') ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI / Instant Bank Transfer"
                    checked={paymentMethod.includes('UPI')}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-info">
                    <span className="payment-name">UPI / Instant Transfer</span>
                    <span className="payment-sub">Zero transaction fee</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Order Review */}
          {step === 3 && (
            <div className="checkout-step-content">
              <h4 className="step-section-heading">Review &amp; Confirm Order</h4>

              <div className="review-summary-box">
                <div className="review-block">
                  <span className="review-label">Shipping To:</span>
                  <p className="review-value">
                    {shippingForm.fullName}, {shippingForm.street}, {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}
                  </p>
                </div>

                <div className="review-block">
                  <span className="review-label">Payment Method:</span>
                  <p className="review-value">{paymentMethod}</p>
                </div>

                <div className="review-block">
                  <span className="review-label">Items ({cartItems.length}):</span>
                  <div className="review-items-mini-list">
                    {cartItems.map((item) => (
                      <div key={item.id} className="review-item-row">
                        <img src={item.image} alt={item.title} className="review-thumb" />
                        <span className="review-item-title">{item.title}</span>
                        <span className="review-item-qty">&times;{item.quantity}</span>
                        <span className="review-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-totals-table">
                  <div className="rev-row">
                    <span>Subtotal:</span>
                    <span>${financials.subtotal.toFixed(2)}</span>
                  </div>
                  {financials.discount > 0 && (
                    <div className="rev-row discount">
                      <span>Discount ({financials.coupon?.code}):</span>
                      <span>-${financials.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="rev-row">
                    <span>Tax (8%):</span>
                    <span>${financials.tax.toFixed(2)}</span>
                  </div>
                  <div className="rev-row">
                    <span>Shipping:</span>
                    <span>{financials.shipping === 0 ? 'FREE' : `$${financials.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="rev-row total">
                    <span>Grand Total:</span>
                    <span>${financials.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal footer navigation */}
        <div className="checkout-modal-footer">
          {step > 1 && (
            <button
              type="button"
              className="checkout-back-btn"
              onClick={() => setStep((s) => s - 1)}
              disabled={checkoutStatus === 'loading'}
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="checkout-next-btn"
              onClick={() => setStep((s) => s + 1)}
            >
              Continue to {step === 1 ? 'Payment' : 'Review'}
            </button>
          ) : (
            <button
              type="button"
              className="checkout-submit-btn"
              onClick={handlePlaceOrder}
              disabled={checkoutStatus === 'loading'}
            >
              {checkoutStatus === 'loading' ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <IconCheck size={18} />
                  <span>Place Order &bull; ${financials.finalPrice.toFixed(2)}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
