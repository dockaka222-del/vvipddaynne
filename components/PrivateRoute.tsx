import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  role?: 'admin' | 'user';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập.
    return <Navigate to="/dang-nhap" />;
  }

  if (role && user.role !== role) {
    // Nếu có yêu cầu về vai trò nhưng người dùng không đáp ứng,
    // chuyển hướng về trang chủ.
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
