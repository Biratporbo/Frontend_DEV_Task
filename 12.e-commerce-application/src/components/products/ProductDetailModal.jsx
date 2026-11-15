import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveProduct } from '../../features/products/productSelectors';
import { setSelectedProductId } from '../../features/products/productsSlice';
import { addToCart } from '../../features/cart/cartSlice';
import StarRating from '../common/StarRating';
import { IconClose, IconCart, IconPlus, IconMinus, IconCheck, IconTruck } from '../common/Icons';

export function ProductDetailModal() {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectActiveProduct);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [product?.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dispatch(setSelectedProductId(null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  if (!product) return null;

  const handleClose = () => {
    dispatch(setSelectedProductId(null));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <IconClose size={20} />
        </button>

        <div className="detail-modal-layout">
          <div className="detail-image-pane">
            <img
              src={product.image}
              alt={product.title}
              className="detail-large-img"
            />
          </div>

          <div className="detail-info-pane">
            <span className="detail-category-tag">{product.category}</span>
            <h2 className="detail-product-title">{product.title}</h2>

            <div className="detail-rating-row">
              <StarRating rate={product.rating?.rate} count={product.rating?.count} />
              <span className="stock-status-pill in-stock">In Stock &amp; Ready to Ship</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price-amount">${product.price.toFixed(2)}</span>
              <span className="detail-tax-note">Sales tax and discounts calculated at checkout</span>
            </div>

            <div className="detail-desc-block">
              <h4 className="detail-desc-heading">Product Overview</h4>
              <p className="detail-desc-text">{product.description}</p>
            </div>

            <div className="detail-perk-snippet">
              <IconTruck size={18} />
              <span>Eligible for Free Standard Delivery on orders over $50</span>
            </div>

            <div className="detail-purchase-row">
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <IconMinus size={14} />
                </button>
                <span className="stepper-value">{quantity}</span>
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <IconPlus size={14} />
                </button>
              </div>

              <button
                type="button"
                className={`detail-add-cart-btn ${justAdded ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {justAdded ? (
                  <>
                    <IconCheck size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <IconCart size={18} />
                    <span>Add to Cart &bull; ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
