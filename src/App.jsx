
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_PRODUCTS, MOCK_ORDERS } from './constants.js';
import Storefront from './pages/Storefront.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import { ShoppingCart, Menu } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const updateProductStock = (id, newStock) => {
    setProducts(prev => prev.map(p => p.id === id ? {...p, stock: Math.max(0, newStock)} : p));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQuantity = existing ? existing.quantity : 0;
      if (product.stock <= currentQuantity) {
        toast.error('Not enough stock!');
        return prev;
      }
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{ products, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, orders, addOrder, clearCart, updateProductStock }}>
      {children}
    </AppContext.Provider>
  );
};

const Navbar = () => {
  const { cart } = useApp();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="brand-font fs-3 fw-bold text-indigo">LUMINA</span>
          <span className="ms-2 text-muted text-uppercase fs-6 tracking-widest d-none d-sm-inline">Luxe</span>
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <Menu size={24} />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item px-lg-3">
              <Link className={`nav-link ${!isAdminPath ? 'active' : ''}`} to="/">Store</Link>
            </li>
            <li className="nav-item px-lg-3">
              <Link className={`nav-link ${isAdminPath ? 'active' : ''}`} to="/admin">Dashboard</Link>
            </li>
            <li className="nav-item px-lg-3">
              <Link className="nav-link position-relative d-inline-block" to="/cart">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
            </Routes>
          </main>
          <footer className="bg-white border-top py-5 mt-auto">
            <div className="container text-center">
              <div className="brand-font fs-4 fw-bold text-dark mb-2">LUMINA LUXE</div>
              <p className="text-muted small mb-0">© 2023 Lumina Luxe Premium Retailers. All rights reserved.</p>
            </div>
          </footer>
          <ToastContainer />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
