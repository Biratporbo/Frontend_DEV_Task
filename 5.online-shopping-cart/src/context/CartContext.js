import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  cartItems: [],
  coupon: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cartItems.find((item) => item.id === action.product.id);

      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.product, quantity: 1 }]
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.id)
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item.id === action.id
              ? { ...item, quantity: action.quantity }
              : item
          )
          .filter((item) => item.quantity > 0)
      };

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.coupon
      };

    case "CLEAR_COUPON":
      return {
        ...state,
        coupon: null
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}