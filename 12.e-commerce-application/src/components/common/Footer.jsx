import React from 'react';
import { IconTruck, IconShield, IconRefresh } from './Icons';

export function Footer() {
  return (
    <footer className="store-footer">
      <div className="footer-perks-row">
        <div className="nav-container perks-grid">
          <div className="perk-item">
            <div className="perk-icon-wrap">
              <IconTruck size={22} />
            </div>
            <div className="perk-info">
              <h4 className="perk-title">Free Express Shipping</h4>
              <p className="perk-desc">Complimentary shipping on orders over $50</p>
            </div>
          </div>

          <div className="perk-item">
            <div className="perk-icon-wrap">
              <IconShield size={22} />
            </div>
            <div className="perk-info">
              <h4 className="perk-title">Secure Checkout</h4>
              <p className="perk-desc">Simulated 256-bit encrypted transactions</p>
            </div>
          </div>

          <div className="perk-item">
            <div className="perk-icon-wrap">
              <IconRefresh size={22} />
            </div>
            <div className="perk-info">
              <h4 className="perk-title">30-Day Hassle-Free Returns</h4>
              <p className="perk-desc">Easy exchanges and full money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="nav-container footer-bottom-inner">
          <p>© {new Date().getFullYear()} ApexCart &mdash; E-Commerce Store powered by Redux Toolkit &amp; Fake Store API.</p>
          <p className="footer-subtext">Built with normalized entity state, memoized selectors &amp; persistent cart.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
