import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const emptyForm = { name: "", brand: "", price: "", stock: "", image: "", description: "" };

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Form state
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);   // null = Add mode, string = Edit mode
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // Fetch only the logged-in user's products
  const loadMyProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/products/my", { auth: true });
      setProducts(data.products || []);
    } catch (err) {
      setError("Could not load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name:        product.name        || "",
      brand:       product.brand       || "",
      price:       product.price       || "",
      stock:       product.stock       || "",
      image:       product.image       || "",
      description: product.description || "",
    });
    setFormError("");
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.price) {
      setFormError("Name and Price are required.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name:        form.name.trim(),
        brand:       form.brand.trim(),
        price:       Number(form.price),
        stock:       Number(form.stock) || 0,
        image:       form.image.trim(),
        description: form.description.trim(),
      };

      if (editId) {
        // UPDATE product
        await apiFetch(`/products/${editId}`, { method: "PATCH", auth: true, body });
        showSuccess("Product updated successfully!");
      } else {
        // CREATE product
        await apiFetch("/products", { method: "POST", auth: true, body });
        showSuccess("Product added successfully!");
      }

      resetForm();
      loadMyProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/products/${deleteId}`, { method: "DELETE", auth: true });
      setDeleteId(null);
      showSuccess("Product deleted successfully.");
      loadMyProducts();
    } catch (err) {
      setFormError(err.message);
      setDeleteId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* Page header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">My Store Inventory</h1>
            <p className="admin-sub">Manage, list, edit, or remove your personal products.</p>
          </div>
          <div className="admin-count">{products.length} product{products.length !== 1 ? "s" : ""} listed</div>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Form: Add or Edit */}
        <div className="admin-card" id="product-form">
          <h2 className="admin-card-title">
            {editId ? "✏️  Edit Product Details" : "➕  List a New Product"}
          </h2>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name <span className="required">*</span></label>
                <input className="form-input" name="name" placeholder="e.g. Mechanical Keyboard"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" name="brand" placeholder="e.g. Keychron"
                  value={form.brand} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₹) <span className="required">*</span></label>
                <input className="form-input" name="price" type="number" min="0" placeholder="4999"
                  value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Units</label>
                <input className="form-input" name="stock" type="number" min="0" placeholder="15"
                  value={form.stock} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Image URL</label>
              <input className="form-input" name="image" type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={form.image} onChange={handleChange} />
            </div>

            {form.image && (
              <div className="image-preview-wrap">
                <img src={form.image} alt="preview" className="image-preview"
                  onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Product Description</label>
              <textarea className="form-input form-textarea" name="description"
                placeholder="Describe key features, specs, condition..."
                value={form.description} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update Product" : "List Product"}
              </button>
              {editId && (
                <button className="btn-secondary" type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product Table */}
        <div className="admin-card">
          <h2 className="admin-card-title">📦 My Listed Products</h2>

          {loading ? (
            <div className="page-state"><div className="spinner" /><p>Loading products…</p></div>
          ) : products.length === 0 ? (
            <div className="page-state" style={{ minHeight: "20vh" }}>
              <p>You haven't listed any products yet. List one above!</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className={editId === p._id ? "row-editing" : ""}>
                      <td>
                        <div className="table-img-wrap">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="table-img" />
                          ) : (
                            <span className="table-img-placeholder">📦</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="table-name">{p.name}</span>
                        {p.description && (
                          <span className="table-desc">{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</span>
                        )}
                      </td>
                      <td>{p.brand || <span className="text-muted">—</span>}</td>
                      <td><span className="table-price">₹{p.price}</span></td>
                      <td>
                        <span className={`stock-badge ${p.stock > 0 ? "in-stock" : "out-stock"}`}>
                          {p.stock > 0 ? p.stock : "Out of stock"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(p)}>
                            ✏️ Edit
                          </button>
                          <button className="action-btn delete-btn" onClick={() => setDeleteId(p._id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title">Delete Listing?</h3>
            <p className="modal-sub">This will permanently remove your product listing.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
