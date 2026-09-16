import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import "./Cart.css";

const COUPONS = {
  SAVE10: 10,
  SAVE20: 20,
  SHOP15: 15
};

function Cart() {
  const { state, dispatch } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");

  const subtotal = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount = state.coupon
    ? (subtotal * state.coupon.percent) / 100
    : 0;

  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * 0.18;
  const grandTotal = afterDiscount + gst;

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setMessage("Enter a coupon code.");
      return;
    }

    if (COUPONS[code]) {
      dispatch({
        type: "APPLY_COUPON",
        coupon: { code, percent: COUPONS[code] }
      });
      setMessage(`${code} applied successfully.`);
    } else {
      dispatch({ type: "CLEAR_COUPON" });
      setMessage("Invalid coupon code.");
    }
  }

  return (
    <aside className="cart">
      <h2 className="section-title">Your Cart</h2>

      {state.cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is empty.</div>
      ) : (
        <>
          <div className="cart-items">
            {state.cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="coupon">
            <label htmlFor="coupon">Coupon Code</label>
            <div className="coupon-row">
              <input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="SAVE10"
              />
              <button className="apply-button" onClick={applyCoupon}>
                Apply
              </button>
            </div>
            <p className="coupon-hint">Try SAVE10, SAVE20 or SHOP15</p>
            {message && <p className="coupon-message">{message}</p>}
          </div>

          <div className="summary">
            <div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></div>
            <div><span>Discount</span><strong>- ₹{discount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></div>
            <div><span>GST (18%)</span><strong>₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></div>
            <div className="grand-total"><span>Grand Total</span><strong>₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></div>
          </div>
        </>
      )}
    </aside>
  );
}

export default Cart;