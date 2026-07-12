import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import Navbar            from "./components/Navbar";
import Footer             from "./components/Footer";
import ProtectedRoute    from "./components/ProtectedRoute";
import Dashboard         from "./pages/Dashboard";
import ProductDetails    from "./pages/ProductDetails";
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import Cart              from "./pages/Cart";
import Home              from "./pages/Home";
import Wishlist          from "./pages/Wishlist";

// "My Products" (route /home) already has its own footer being added there,
// so we skip rendering the shared site footer on that page only.
const AppShell = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/home";

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"                element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/product/:id"     element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/cart"            element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/home"            element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/wishlist"        element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
