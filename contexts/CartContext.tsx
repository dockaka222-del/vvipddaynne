import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import type { Product, CartItem, Coupon } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalPrice: number; // Tổng tiền hàng (chưa giảm giá)
  totalItems: number;
  
  // Coupon related state and functions
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  discountAmount: number;
  finalPrice: number; // Tổng tiền cuối cùng (đã giảm giá)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Dữ liệu coupon mẫu để mô phỏng, trong thực tế sẽ lấy từ API/database
const availableCoupons: Coupon[] = [
    { id: '1', code: 'VIPDAYNE50K', discountType: 'amount', discountValue: 50000, createdAt: '2024-05-20', expiresAt: '2024-12-31', maxUses: 100, uses: 10 },
    { id: '2', code: 'SALE10PT', discountType: 'percentage', discountValue: 10, createdAt: '2024-05-15', expiresAt: '2025-01-15', maxUses: null, uses: 50 },
    { id: '3', code: 'EXPIRED20K', discountType: 'amount', discountValue: 20000, createdAt: '2023-01-01', expiresAt: '2024-01-01', maxUses: 200, uses: 150 },
    { id: '4', code: 'LIMIT10', discountType: 'amount', discountValue: 10000, createdAt: '2024-05-01', expiresAt: null, maxUses: 10, uses: 10 },
    { id: '5', code: 'NOEXPIRE', discountType: 'percentage', discountValue: 5, createdAt: '2024-01-01', expiresAt: null, maxUses: null, uses: 25 },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };
  
  const applyCoupon = (code: string) => {
    setCouponError(null);
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      setCouponError("Mã giảm giá không hợp lệ.");
      setAppliedCoupon(null);
      return;
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      setCouponError("Mã giảm giá đã hết hạn.");
      setAppliedCoupon(null);
      return;
    }

    if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) {
      setCouponError("Mã giảm giá đã hết lượt sử dụng.");
      setAppliedCoupon(null);
      return;
    }
    
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const { discountAmount, finalPrice } = useMemo(() => {
    if (appliedCoupon) {
      let discount = 0;
      if (appliedCoupon.discountType === 'amount') {
        discount = appliedCoupon.discountValue;
      } else if (appliedCoupon.discountType === 'percentage') {
        discount = totalPrice * (appliedCoupon.discountValue / 100);
      }

      // Đảm bảo số tiền giảm không vượt quá tổng tiền hàng
      if (discount > totalPrice) {
        discount = totalPrice;
      }
      return { discountAmount: discount, finalPrice: totalPrice - discount };
    }
    return { discountAmount: 0, finalPrice: totalPrice };
  }, [totalPrice, appliedCoupon]);

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart, 
        totalPrice, 
        totalItems,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        couponError,
        discountAmount,
        finalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart phải được sử dụng trong một CartProvider');
  }
  return context;
};
