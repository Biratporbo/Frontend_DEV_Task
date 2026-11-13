import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { updateQuantity, removeFromCart } from '../../features/cart/cartSlice';
import { IconPlus, IconMinus, IconTrash } from '../common/Icons';

export function CartItemRow({ item }) {
  const dispatch = useAppDispatch();

  return (
    <div className="cart-item-row">
      <div className="cart-item-thumb-box">
        <img src={item.image} alt={item.title} className="cart-item-img" />
      </div>

      <div className="cart-item-info">
        <h4 className="cart-item-title" title={item.title}>
          {item.title}
        </h4>
        <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>

        <div className="cart-item-actions-row">
          <div className="cart-item-stepper">
            <button
              type="button"
              className="cart-step-btn"
              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
              aria-label="Decrease quantity"
            >
              <IconMinus size={12} />
            </button>
            <span className="cart-step-count">{item.quantity}</span>
            <button
              type="button"
              className="cart-step-btn"
              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
              aria-label="Increase quantity"
            >
              <IconPlus size={12} />
            </button>
          </div>

          <button
            type="button"
            className="cart-item-remove-btn"
            onClick={() => dispatch(removeFromCart(item.id))}
            title="Remove item"
            aria-label="Remove item"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>

      <div className="cart-item-total-col">
        <span className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartItemRow;
