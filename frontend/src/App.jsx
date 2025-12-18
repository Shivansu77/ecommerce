import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import ProductListing from './pages/ProductListing';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow bg-gray-50">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products" element={<ProductListing />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                    </Routes>
                </main>
                <footer className="bg-[#004f9a] text-white py-8 text-center text-sm">
                    <p>&copy; 2025 GeM Price Comparison. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
