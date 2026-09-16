import React from "react";
import { useCart } from "../context/CartContext";
import "./Header.css";

function Header() {
  const { state } = useCart();
  const itemCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">Simple Shop</div>
        <div className="cart-badge">Cart: {itemCount}</div>
      </div>
    </header>
  );
}

export default Header;