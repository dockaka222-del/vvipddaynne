import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminPage from './pages/AdminPage';
import CouponManagementPage from './pages/admin/CouponManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboardPage from './pages/UserDashboardPage';

const GuidePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Hướng Dẫn - Vipdayne.net';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Hướng dẫn chi tiết cách sử dụng và mua hàng trên Vipdayne.net, giúp bạn có trải nghiệm tốt nhất.',
      );
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Trang Hướng Dẫn</h1>
      <p className="mt-4">
        Nội dung hướng dẫn sử dụng sẽ được cập nhật tại đây.
      </p>
    </div>
  );
};
const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Liên Hệ - Vipdayne.net';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Liên hệ với bộ phận hỗ trợ của Vipdayne.net để được giải đáp mọi thắc mắc và nhận được sự trợ giúp nhanh chóng.',
      );
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Trang Liên Hệ</h1>
      <p className="mt-4">Thông tin liên hệ: support@vipdayne.net</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/huong-dan" element={<GuidePage />} />
                <Route path="/lien-he" element={<ContactPage />} />
                <Route path="/dang-nhap" element={<LoginPage />} />
                <Route path="/dang-ky" element={<RegisterPage />} />
                <Route
                  path="/thanh-toan"
                  element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tai-khoan"
                  element={
                    <PrivateRoute>
                      <UserDashboardPage />
                    </PrivateRoute>
                  }
                />

                {/* Admin Dashboard Routes */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute role="admin">
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<AdminPage />} />{' '}
                  {/* Trang mặc định của admin */}
                  <Route path="san-pham" element={<AdminPage />} />
                  <Route path="nguoi-dung" element={<UserManagementPage />} />
                  <Route
                    path="ma-giam-gia"
                    element={<CouponManagementPage />}
                  />
                </Route>
              </Routes>
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
              <p>&copy; 2024-2025 Vipdayne.net. Mọi quyền được bảo lưu.</p>
            </footer>
          </div>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
