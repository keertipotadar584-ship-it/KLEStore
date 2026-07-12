import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const fetchWishlist = async () => {
    try {
      const data = await apiFetch("/products/wishlist", { auth: true });
      setProducts(data.products || []);
    } catch (err) {
      setError("Could not load your wishlist. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleLikeToggle = (productId, isLiked) => {
    if (!isLiked) {
      // If unliked, remove it from the wishlist array instantly
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  if (loading) return (
    <div className="page-state">
      <div className="spinner" />
      <p>Loading your wishlist…</p>
    </div>
  );

  if (error) return (
    <div className="page-state page-error">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="listing-page">
      {/* Hero Section */}
      <div className="listing-hero" style={{ background: "linear-gradient(135deg, var(--pine) 0%, #173b2a 100%)", padding: "50px 24px" }}>
        <h1 className="listing-hero-title">My Wishlist</h1>
        <p className="listing-hero-sub">Your curated selection of liked products.</p>
      </div>

      {/* Main Grid */}
      <div className="listing-content">
        {products.length === 0 ? (
          <div className="page-state" style={{ minHeight: "30vh" }}>
            <span style={{ fontSize: "48px" }}>❤️</span>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, color: "var(--pine)", marginTop: "12px" }}>Your wishlist is empty</h2>
            <p style={{ color: "var(--stone)", maxWidth: "400px", margin: "8px auto 0" }}>
              Explore products on the Dashboard and tap the heart icon to save listings here.
            </p>
          </div>
        ) : (
          <>
            <p className="listing-count">{products.length} product{products.length !== 1 ? "s" : ""} saved</p>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  showAddToCart={true} 
                  showLike={true}
                  onLikeToggle={handleLikeToggle}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
