import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const navLinks = useMemo(
    () => [
      { to: '/', text: 'Trang Chủ' },
      { to: '/huong-dan', text: 'Hướng Dẫn' },
      { to: '/lien-he', text: 'Liên Hệ' },
      // Link Quản trị chỉ hiển thị khi người dùng là admin
      ...(user?.role === 'admin' ? [{ to: '/admin', text: 'Quản Trị' }] : []),
    ],
    [user],
  );

  return (
    <header className="bg-cosmic-orange shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-white">
            <Link to="/">Vipdayne.net</Link>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-gray-200 transition duration-300 font-medium"
              >
                {link.text}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/tai-khoan"
                  className="text-white font-medium hover:underline"
                >
                  Chào, {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="bg-white text-cosmic-orange font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition duration-300"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/dang-ky"
                  className="text-white font-bold py-2 px-4 rounded-full hover:bg-white/20 transition duration-300"
                >
                  Đăng Ký
                </Link>
                <Link
                  to="/dang-nhap"
                  className="bg-white text-cosmic-orange font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition duration-300"
                >
                  Đăng Nhập
                </Link>
              </>
            )}
            <Link
              to="/thanh-toan"
              className="relative text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.103-.844l1.302-5.206c.14-.559-.26-1.116-.842-1.116H4.874M16.5 21a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-cosmic-orange text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-cosmic-orange/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-200 transition duration-300 font-medium text-lg"
              >
                {link.text}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col items-center w-full">
                <Link
                  to="/tai-khoan"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white font-medium hover:underline py-2"
                >
                  Chào, {user.username}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-white text-cosmic-orange font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300 mt-2 w-40"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/dang-ky"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white font-bold py-2 px-6 rounded-full hover:bg-white/20 transition duration-300 mt-4"
                >
                  Đăng Ký
                </Link>
                <Link
                  to="/dang-nhap"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-white text-cosmic-orange font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300"
                >
                  Đăng Nhập
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
