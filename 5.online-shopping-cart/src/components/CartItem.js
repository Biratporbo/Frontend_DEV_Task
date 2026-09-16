import React from "react";
import { useCart } from "../context/CartContext";
import "./CartItem.css";

function CartItem({ item }) {
  const { dispatch } = useCart();

  function updateQuantity(quantity) {
    dispatch({
      type: "UPDATE_QUANTITY",
      id: item.id,
      quantity
    });
  }

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>₹{item.price.toLocaleString("en-IN")}</p>

        <div className="quantity-row">
          <button onClick={() => updateQuantity(item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.quantity + 1)}>+</button>
          <button
            className="remove-button"
            onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: item.id })}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;