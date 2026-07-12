import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../api/api";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product, showAddToCart = false, showLike = false, onLikeToggle }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Initialize liked status and count from product likes field
  const [liked, setLiked] = useState(() => {
    return product.likes?.includes(user?.id) || false;
  });
  const [likesCount, setLikesCount] = useState(product.likes?.length || 0);

  const outOfStock = !product.stock || product.stock <= 0;

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle state immediately for responsive feedback
    const originalLiked = liked;
    setLiked(!originalLiked);
    setLikesCount(prev => originalLiked ? Math.max(0, prev - 1) : prev + 1);

    try {
      await apiFetch(`/products/${product._id}/like`, { method: "POST", auth: true });
      if (onLikeToggle) {
        onLikeToggle(product._id, !originalLiked);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err.message);
      // Rollback on error
      setLiked(originalLiked);
      setLikesCount(product.likes?.length || 0);
    }
  };

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;

    setAdding(true);
    try {
      await addToCart(product._id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        {outOfStock && <span className="stock-flag">Out of stock</span>}

        {/* Like Floating Toggle */}
        {showLike && (
          <button
            onClick={handleLikeClick}
            className="card-like-btn"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(16, 35, 26, 0.15)",
              cursor: "pointer",
              transition: "transform 0.2s, background 0.2s",
              color: liked ? "#FF5A3C" : "#8A8578",
              zIndex: 5,
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {liked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          </button>
        )}
      </div>

      {product.brand && <div className="product-brand">{product.brand}</div>}
      <h3 className="product-title" style={{ minHeight: "44px" }}>{product.name}</h3>

      {/* Like count tag under title if there are likes */}
      {showLike && likesCount > 0 && (
        <span style={{ fontSize: "11px", color: "#8A8578", padding: "0 14px 10px", display: "block" }}>
          ❤️ {likesCount} like{likesCount !== 1 ? "s" : ""}
        </span>
      )}

      <div className="product-card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="price-tag">
          <span className="price-tag-currency">₹</span>
          {product.price}
        </span>

        {showAddToCart && (
          <button
            onClick={handleAddToCartClick}
            disabled={outOfStock || adding}
            className="btn-primary"
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "6px",
            }}
          >
            <FaShoppingCart size={12} />
            {added ? "Added!" : adding ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
