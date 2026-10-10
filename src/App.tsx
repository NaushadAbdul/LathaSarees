/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar, Footer } from './components/Navbar';
import { Overlays } from './components/Overlays';
import { Home } from './pages/Home';
import { CatalogPage, ProductDetailsPage } from './pages/ShopPages';
import {
  CartPage,
  WishlistPage,
  CheckoutPage,
  AccountPage,
  AboutPage,
  ContactPage,
  FaqAndLegalPage,
} from './pages/CheckoutAndAccount';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFound';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F7F0E6] text-[#33221C]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<CatalogPage />} />
              <Route path="/sarees" element={<CatalogPage fixedCategory="Sarees" />} />
              <Route path="/jewelry" element={<CatalogPage fixedCategory="Jewelry" />} />
              <Route path="/collections/:slug" element={<CatalogPage />} />
              <Route path="/product/:slug" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<AccountPage />} />
              <Route path="/register" element={<AccountPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/orders" element={<AccountPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqAndLegalPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminDashboard initialTab="products" />} />
              <Route path="/admin/add-product" element={<AdminDashboard initialTab="add-product" />} />
              <Route path="/admin/hero" element={<AdminDashboard initialTab="hero" />} />
              <Route path="/admin/orders" element={<AdminDashboard initialTab="orders" />} />
              <Route path="/admin/story" element={<AdminDashboard initialTab="story" />} />
              <Route path="/admin/settings" element={<AdminDashboard initialTab="settings" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <Overlays />
        </div>
      </StoreProvider>
    </BrowserRouter>
  );
}
