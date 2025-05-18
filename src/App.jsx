import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/Signuppage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage'; // Import MyOrdersPage

import {
  loginUser, signupUser, fetchUserProfileAPI, fetchProductsAPI, createOrderAPI
  // cancelOrderAPI is called from MyOrdersPage, not directly from App state
} from './services/api';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const fetchedProducts = await fetchProductsAPI();
      setProducts(fetchedProducts || []);
    } catch (error) {
      console.error("Failed to load products:", error.message);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
     localStorage.removeItem('token');
     localStorage.removeItem('cartItems'); 
     setToken(null);
     setIsLoggedIn(false);
     setCurrentUser(null);
     setCartItems([]);
     navigate('/');
   }, [navigate]);


  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      setAuthLoading(true);
      await loadProducts();
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        if (!token) setToken(storedToken); // Sync state
        try {
          const profileData = await fetchUserProfileAPI(storedToken);
          if (profileData && profileData.user) {
            setIsLoggedIn(true);
            setCurrentUser(profileData.user);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Token validation/profile fetch error:", error);
          if (error.status === 401 || error.status === 403) handleLogout();
        }
      }
      setAuthLoading(false);
    };
    checkAuthAndLoadData();
  }, [loadProducts, handleLogout, token]); // Added token to re-check if it changes externally (less likely)

  const handleLogin = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true); 
        setCartItems([]); 
        navigate('/products');
      }
    } catch (error) {
      console.error('Login error in App.jsx:', error);
      throw error; 
    }
  };

  const handleSignup = async (userData) => {
    try {
      const data = await signupUser(userData);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setCartItems([]);
        navigate('/products');
      }
    } catch (error) {
      console.error('Signup error in App.jsx:', error);
      throw error;
    }
  };

  const handleAddToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      const maxQuantity = product.inventory || Infinity;
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) }
            : item
        );
      }
      return [...prevItems, { ...product, product_id: product.id, quantity: Math.min(quantity, maxQuantity) }];
    });
    console.log(`${quantity} of ${product.name} added/updated locally.`);
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      const productInCart = prevItems.find(item => item.id === productId);
      if (!productInCart) return prevItems;
      const maxQuantity = productInCart.inventory || Infinity;
      const actualNewQuantity = Math.min(newQuantity, maxQuantity);
      if (actualNewQuantity < 1) return prevItems.filter(item => item.id !== productId);
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: actualNewQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    console.log(`Item ${productId} removed locally.`);
  };

  const handleOrderPlaced = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  if (authLoading) { return <div className="flex justify-center items-center min-h-screen text-xl">Initializing Application...</div>; }

  return (
    <div className="App flex flex-col min-h-screen bg-gray-50">
      <Header
        cartItemCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={currentUser?.name}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productsLoading && !authLoading &&
          <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50">
            Loading Products...
          </div>
        }
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/products" replace /> : <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/products" replace /> : <SignupPage onSignup={handleSignup} isLoggedIn={isLoggedIn} />} />
          <Route
            path="/products"
            element={<ProductsPage products={products} isLoading={productsLoading} onAddToCartRequest={handleAddToCart} />}
          />
          <Route
            path="/cart"
            element={<CartPage cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} />}
          />
          <Route
            path="/checkout"
            element={isLoggedIn ? <CheckoutPage cartItems={cartItems} token={token} currentUser={currentUser} onOrderPlaced={handleOrderPlaced} /> : <Navigate to="/login" replace />}
          />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route 
            path="/my-orders" 
            element={isLoggedIn ? <MyOrdersPage token={token} /> : <Navigate to="/login" replace />} 
          />
          <Route path="*" element={
            <div className="text-center py-10">
              <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
              <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
              <Link to="/" className="mt-6 inline-block text-green-600 hover:text-green-700">
                Go to Homepage
              </Link>
            </div>
          } />
        </Routes>
      </main>
      <footer className="bg-green-600 text-white text-center py-6">
        © {new Date().getFullYear()} FreshGrocer. All rights reserved.
      </footer>
    </div>
  );
}
export default App;