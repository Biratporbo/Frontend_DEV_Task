import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';
import { setSelectedProductId } from '../../features/products/productsSlice';
import StarRating from '../common/StarRating';
import { IconCart, IconCheck } from '../common/Icons';

export function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleOpenDetail = () => {
    dispatch(setSelectedProductId(product.id));
  };

  return (
    <article
      className="product-card"
      onClick={handleOpenDetail}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenDetail();
        }
      }}
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-img"
          loading="lazy"
        />
        <span className="product-card-category">{product.category}</span>
      </div>

      <div className="product-card-body">
        <div className="product-card-rating">
          <StarRating rate={product.rating?.rate} count={product.rating?.count} />
        </div>

        <h3 className="product-card-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-card-footer">
          <div className="product-price-wrap">
            <span className="price-currency">$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={`add-to-cart-btn ${addedAnimation ? 'added' : ''}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            {addedAnimation ? (
              <>
                <IconCheck size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <IconCart size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
