import React from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { dispatch } = useCart();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-content">
        <h3>{product.name}</h3>
        <div className="product-bottom">
          <span>₹{product.price.toLocaleString("en-IN")}</span>
          <button
            onClick={() => dispatch({ type: "ADD_TO_CART", product })}
            className="add-button"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;