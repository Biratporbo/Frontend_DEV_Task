import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTotalCartItems } from '../../features/cart/cartSelectors';
import { setCartOpen } from '../../features/cart/cartSlice';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  openAuthModal,
  logout
} from '../../features/auth/authSlice';
import { setHistoryOpen } from '../../features/orders/ordersSlice';
import {
  selectSearchQuery,
  setSearchQuery,
  selectSelectedCategory,
  setSelectedCategory
} from '../../features/products/productsSlice';
import { selectCategories } from '../../features/products/productSelectors';
import {
  IconCart,
  IconSearch,
  IconUser,
  IconPackage,
  IconClose
} from './Icons';

export function Navbar() {
  const dispatch = useAppDispatch();
  const totalCartItems = useAppSelector(selectTotalCartItems);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const categories = useAppSelector(selectCategories);

  const handleOpenOrders = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ reason: 'Please sign in to view your past orders' }));
    } else {
      dispatch(setHistoryOpen(true));
    }
  };

  const formatCategoryName = (cat) => {
    if (cat === 'all') return 'All Products';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-top-bar">
        <div className="nav-container">
          {/* Brand Logo */}
          <div
            className="navbar-brand"
            onClick={() => {
              dispatch(setSelectedCategory('all'));
              dispatch(setSearchQuery(''));
            }}
            role="button"
            tabIndex={0}
          >
            <div className="brand-badge-icon">
              <IconCart size={20} />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">Apex<span className="brand-accent">Cart</span></span>
              <span className="brand-sub">Redux Store</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="nav-search-wrapper">
            <span className="nav-search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search products, clothing, electronics, jewelry..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => dispatch(setSearchQuery(''))}
                title="Clear search"
              >
                <IconClose size={14} />
              </button>
            )}
          </div>

          {/* Action buttons (Orders, Auth, Cart) */}
          <div className="nav-actions">
            {/* Order History */}
            <button
              type="button"
              className="nav-action-btn orders-btn"
              onClick={handleOpenOrders}
              title="View Order History"
            >
              <IconPackage size={18} />
              <span className="action-btn-label">Orders</span>
            </button>

            {/* Auth / Account */}
            {isAuthenticated ? (
              <div className="nav-user-menu">
                <button
                  type="button"
                  className="nav-user-btn"
                  title={`Signed in as ${currentUser?.name}`}
                  onClick={() => dispatch(logout())}
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="nav-user-avatar"
                  />
                  <span className="user-name-label">{currentUser?.name?.split(' ')[0]}</span>
                  <span className="logout-badge">Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="nav-action-btn login-btn"
                onClick={() => dispatch(openAuthModal())}
              >
                <IconUser size={18} />
                <span className="action-btn-label">Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              className="nav-cart-btn"
              onClick={() => dispatch(setCartOpen(true))}
              aria-label={`Shopping cart with ${totalCartItems} items`}
            >
              <IconCart size={20} />
              <span className="cart-btn-label">Cart</span>
              {totalCartItems > 0 && (
                <span className="cart-badge-count">{totalCartItems}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <nav className="navbar-category-bar" aria-label="Product categories">
        <div className="nav-container category-scroll-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {formatCategoryName(cat)}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
