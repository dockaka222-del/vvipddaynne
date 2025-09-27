
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User, Purchase } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, pass: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  confirmVerification: () => void;
  addPurchaseToHistory: (purchase: Purchase) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dữ liệu mua hàng mẫu cho người dùng user@vipdayne.net
const samplePurchaseHistory: Purchase[] = [
  {
    id: 'ORD-12345',
    date: '2024-05-15T10:30:00Z',
    totalAmount: 99000,
    items: [
      { productId: 1, name: "Gói Tài Khoản VIP 1 Tháng", price: 99000, quantity: 1, image: "https://via.placeholder.com/150/FF7F50/FFFFFF?text=VIP+1M", downloadLink: "#" }
    ],
    appliedCoupon: 'WELCOME10'
  },
  {
    id: 'ORD-67890',
    date: '2024-03-02T15:00:00Z',
    totalAmount: 489000,
    items: [
      { productId: 2, name: "Gói Tài Khoản VIP 6 Tháng", price: 499000, quantity: 1, image: "https://via.placeholder.com/150/228B22/FFFFFF?text=VIP+6M", downloadLink: "#" }
    ],
    appliedCoupon: 'SALE20K'
  }
];


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Giả lập API call để đăng nhập
  const login = async (email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if ((email === 'admin@vipdayne.net' && pass === 'password') || (email === 'user@vipdayne.net' && pass === 'password')) {
          const role = email === 'admin@vipdayne.net' ? 'admin' : 'user';
          const username = email.split('@')[0];
          setUser({ 
            id: Math.random().toString(36).substr(2, 9),
            username, 
            email, 
            role,
            isVerified: email === 'admin@vipdayne.net', // Admin được xác thực, user thì không để test
            purchaseHistory: email === 'user@vipdayne.net' ? samplePurchaseHistory : []
          });
          resolve();
        } else {
          reject(new Error('Email hoặc mật khẩu không chính xác.'));
        }
      }, 1000);
    });
  };
  
  // Giả lập API call để đăng ký
  const register = async (username: string, email: string, pass: string) => {
     return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ 
          id: Math.random().toString(36).substr(2, 9),
          username, 
          email, 
          role: 'user',
          isVerified: false, // Người dùng mới chưa xác thực
          purchaseHistory: []
        });
        resolve();
      }, 1000);
    });
  }

  const logout = () => {
    setUser(null);
  };

  // Mô phỏng gửi email xác thực
  const sendVerificationEmail = async () => {
    return new Promise<void>((resolve) => {
      console.log(`Đang gửi email xác thực tới ${user?.email}...`);
      setTimeout(() => {
        console.log("Email đã được gửi (mô phỏng).");
        resolve();
      }, 1500);
    });
  };

  // Mô phỏng việc người dùng nhấp vào liên kết trong email
  const confirmVerification = () => {
    if (user) {
      setUser({ ...user, isVerified: true });
      console.log("Tài khoản đã được xác thực!");
    }
  };

  const addPurchaseToHistory = (purchase: Purchase) => {
    if (user) {
      setUser({
        ...user,
        purchaseHistory: [purchase, ...user.purchaseHistory],
      });
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, sendVerificationEmail, confirmVerification, addPurchaseToHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong một AuthProvider');
  }
  return context;
};
