import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/admin/san-pham', text: 'Quản lý Sản phẩm' },
  { to: '/admin/nguoi-dung', text: 'Quản lý Người dùng' },
  { to: '/admin/ma-giam-gia', text: 'Mã Giảm Giá' },
];

const AdminSidebar: React.FC = () => {
  const activeLinkClass = "bg-cosmic-orange text-white";
  const defaultLinkClass = "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <nav className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Bảng Điều Khiển</h2>
      <ul className="space-y-2">
        {navLinks.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) => 
                `block w-full text-left px-4 py-2 rounded-md font-medium transition-colors duration-200 ${isActive ? activeLinkClass : defaultLinkClass}`
              }
            >
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
