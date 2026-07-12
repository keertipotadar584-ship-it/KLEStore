import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/api";
import ProductCard from "../components/ProductCard";
import PromoCarousel from "../components/PromoCarousel";
import { FaSortAmountDown, FaFire } from "react-icons/fa";

const Dashboard = () => {
  const [products, setProducts]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  // Client-side only UI state — purely presentational, no new API calls.
  const [activeBrand, setActiveBrand] = useState("All");
  const [sortBy, setSortBy]           = useState("default");

  const fetchProducts = async () => {
    try {
      // Products are public, but we can pass token if available to see user's likes
      const data = await apiFetch("/products", { auth: true });
      setProducts(data.products || []);
      setFiltered(data.products || []);
    } catch (err) {
      setError("Could not load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Live search filter
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      )
    );
  }, [search, products]);

  // Distinct brands derived from whatever products we already fetched —
  // powers the "Shop by Brand" chip row, Myntra/Flipkart-style.
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const handleBrandClick = (brand) => {
    setActiveBrand(brand);
    setSearch(brand === "All" ? "" : brand);
  };

  // Client-side sort applied on top of the existing search-filtered list.
  const sortedProducts = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "likes-desc") list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    return list;
  }, [filtered, sortBy]);

  // "Trending Now" strip — top liked products from what's already loaded.
  const trending = useMemo(() => {
    return [...products]
      .filter((p) => (p.likes?.length || 0) > 0)
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 8);
  }, [products]);

  const scrollToGrid = () => {
    document.getElementById("product-grid-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return (
    <div className="page-state">
      <div className="spinner" />
      <p>Loading products…</p>
    </div>
  );

  if (error) return (
    <div className="page-state page-error">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="listing-page store-home">

      {/* Promo carousel — Myntra/Flipkart-style rotating banners */}
      <div className="promo-wrap">
        <PromoCarousel onCta={scrollToGrid} />
      </div>

      {/* Sticky filter bar: search + brand chips + sort */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <input
            className="search-bar search-bar-light"
            type="text"
            placeholder="Search products or brands…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveBrand("All");
            }}
          />

          <div className="brand-chip-row">
            {brands.map((brand) => (
              <button
                key={brand}
                className={`brand-chip ${activeBrand === brand ? "active" : ""}`}
                onClick={() => handleBrandClick(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="sort-control">
            <FaSortAmountDown size={13} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="likes-desc">Most Liked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trending Now — horizontal scroll strip of most-liked products */}
      {trending.length > 0 && (
        <div className="trending-section">
          <div className="section-heading">
            <FaFire className="section-heading-icon" />
            <h2>Trending Now</h2>
          </div>
          <div className="trending-scroll">
            {trending.map((product) => (
              <div className="trending-item" key={product._id}>
                <ProductCard product={product} showAddToCart={true} showLike={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="listing-content" id="product-grid-section">
        {sortedProducts.length === 0 ? (
          <div className="page-state">
            <p>No products match "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <>
            <div className="section-heading section-heading-plain">
              <h2>All Products</h2>
              <p className="listing-count">{sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""} available</p>
            </div>
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showAddToCart={true}
                  showLike={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
