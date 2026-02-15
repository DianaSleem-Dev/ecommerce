
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_PRODUCTS, MOCK_ORDERS } from './constants.js';
import Storefront from './pages/Storefront.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AllProducts from './pages/AllProducts.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { ShoppingCart, Menu } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// TEST_USERS and AppProvider logic
const TEST_USERS = [
  { email: 'testuser@example.com', password: 'test123', name: 'Test User', isAdmin: false },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User', isAdmin: true }
];

const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [user, setUser] = useState(null);

  const updateProductStock = (id, newStock) => {
    setProducts(prev => prev.map(p => p.id === id ? {...p, stock: Math.max(0, newStock)} : p));
  };

  const addToCart = (product) => {
    if (!user) {
      toast.error('Please log in to add to cart.');
      return;
    }
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

  const login = (email, password) => {
    const found = TEST_USERS.find(u => u.email === email.trim() && u.password === password.trim());
    if (found) {
      setUser({ email: found.email, name: found.name, isAdmin: found.isAdmin });
      toast.success(`Welcome, ${found.name}!`);
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    toast.info('Logged out');
  };

  return (
    <AppContext.Provider value={{ products, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, orders, addOrder, clearCart, updateProductStock, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};


const Navbar = () => {
  const { cart, user, logout } = useApp();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  // Close menu on route change
  React.useEffect(() => { setMenuOpen(false); setUserDropdownOpen(false); }, [location.pathname]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="brand-font fs-3 fw-bold text-indigo">LUMINA</span>
          <span className="ms-2 text-muted text-uppercase fs-6 tracking-widest d-none d-sm-inline">Luxe</span>
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen(m => !m)}>
          <Menu size={24} />
        </button>
        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {location.pathname !== '/' && (
              <li className="nav-item px-lg-3">
                <Link className="nav-link" to="/">Store</Link>
              </li>
            )}
            <li className="nav-item px-lg-3">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            {user && user.isAdmin && (
              <li className="nav-item px-lg-3">
                <Link className={`nav-link ${isAdminPath ? 'active' : ''}`} to="/admin">Dashboard</Link>
              </li>
            )}
            {user && (
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
            )}
            {user ? (
              <li className="nav-item px-lg-3 position-relative">
                <button 
                  className="btn btn-link nav-link d-flex align-items-center gap-2" 
                  style={{padding:0, textDecoration: 'none', color: 'inherit'}}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="bg-indigo text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px', fontSize: '12px'}}>
                    {getInitials(user.name)}
                  </div>
                  <span className="d-none d-md-inline">{user.name}</span>
                </button>
                {userDropdownOpen && (
                  <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow" style={{minWidth: '150px', zIndex: 1000, top: '100%'}}>
                    <button 
                      className="btn btn-link w-100 text-start px-3 py-2 text-danger"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li className="nav-item px-lg-3">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

function RequireAdmin({ children }) {
  const { user } = useApp();
  if (!user || !user.isAdmin) {
    return <div className="container py-5 text-center"><h2 className="fw-bold">Access Denied</h2><p className="text-muted">Admin only</p></div>;
  }
  return children;
}

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          {/* ...existing code... */}
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
