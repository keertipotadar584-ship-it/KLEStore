import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF, FaInstagram, FaTwitter, FaYoutube,
  FaShieldAlt, FaTruck, FaUndo, FaHeadset,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Trust strip — the little row of promises every big e-comm site has */}
      <div className="footer-trust">
        <div className="footer-trust-inner">
          <div className="trust-item">
            <FaTruck />
            <div>
              <p className="trust-title">Free Delivery</p>
              <p className="trust-sub">On every order, every time</p>
            </div>
          </div>
          <div className="trust-item">
            <FaUndo />
            <div>
              <p className="trust-title">Easy Returns</p>
              <p className="trust-sub">Hassle-free return window</p>
            </div>
          </div>
          <div className="trust-item">
            <FaShieldAlt />
            <div>
              <p className="trust-title">Secure Payments</p>
              <p className="trust-sub">Your data stays protected</p>
            </div>
          </div>
          <div className="trust-item">
            <FaHeadset />
            <div>
              <p className="trust-title">24/7 Support</p>
              <p className="trust-sub">We're always here to help</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-main-inner">
          <div className="footer-col footer-brand-col">
            <div className="footer-brand">
              <span className="footer-brand-mark">KLE</span>
              <span className="footer-brand-word">Store</span>
            </div>
            <p className="footer-tagline">
              Discover unique, quality products listed by a community of sellers —
              all in one place.
            </p>
            <div className="footer-socials">
              <span className="footer-social-icon" title="Facebook"><FaFacebookF /></span>
              <span className="footer-social-icon" title="Instagram"><FaInstagram /></span>
              <span className="footer-social-icon" title="Twitter"><FaTwitter /></span>
              <span className="footer-social-icon" title="YouTube"><FaYoutube /></span>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <Link to="/" className="footer-link">All Products</Link>
            <Link to="/wishlist" className="footer-link">Wishlist</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <Link to="/home" className="footer-link">My Products</Link>
            <Link to="/login" className="footer-link">Sign in</Link>
            <Link to="/register" className="footer-link">Create account</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Get in touch</h4>
            <p className="footer-text">Bengaluru, Karnataka, India</p>
            <p className="footer-text">support@klestore.example</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} KLE Store. All rights reserved.</p>
        <p className="footer-bottom-note">Made with care for a great shopping experience.</p>
      </div>
    </footer>
  );
};

export default Footer;
