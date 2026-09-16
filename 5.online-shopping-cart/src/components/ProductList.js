import React from "react";
import products from "../data/products";
import ProductCard from "./ProductCard";

function ProductList() {
  return (
    <section>
      <h2 className="section-title">Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;