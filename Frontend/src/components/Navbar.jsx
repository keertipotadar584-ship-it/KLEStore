import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaUser, FaBoxOpen, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Purely visual: toggles a "scrolled" class so the navbar can pick up
  // a glassy blur + shadow once the page scrolls. No app logic involved.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-container">

        {/* Brand */}
        <Link to="/" className="nav-brand">
          <span className="nav-brand-mark">KLE</span>
          <span className="nav-brand-word">Store</span>
        </Link>

        {/* Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              {/* My Products link — visible to logged-in users */}
              <Link to="/home" className="nav-btn nav-btn-admin">
                <FaBoxOpen size={14} />
                <span className="nav-btn-label">My Products</span>
              </Link>

              <span className="nav-greeting">Hi, {user.name.split(" ")[0]}</span>

              <button className="nav-btn" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-btn">
              <FaUser size={14} />
              Sign in
            </Link>
          )}

          {/* Wishlist */}
          {user && (
            <Link to="/wishlist" className="nav-btn nav-wishlist" style={{ color: "#FF5A3C", background: "rgba(255, 90, 60, 0.08)", borderColor: "rgba(255, 90, 60, 0.15)" }}>
              <FaHeart size={13} style={{ marginRight: "2px" }} />
              Wishlist
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="nav-btn nav-cart">
            <span className="cart-icon">
              <FaShoppingBag size={16} />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </span>
            Cart
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
