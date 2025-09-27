import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import type { Product, CartItem, Coupon } from '../types';
import { validateCouponAPI } from '../services/apiService';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalPrice: number; // Tổng tiền hàng (chưa giảm giá)
  totalItems: number;

  // Coupon related state and functions
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isApplyingCoupon: boolean;
  discountAmount: number;
  finalPrice: number; // Tổng tiền cuối cùng (đã giảm giá)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === productId,
      );
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = async (code: string) => {
    setCouponError(null);
    setIsApplyingCoupon(true);
    try {
      const result = await validateCouponAPI(code);
      if (result.success && result.coupon) {
        setAppliedCoupon(result.coupon);
      } else {
        setCouponError(result.message || 'Mã không hợp lệ.');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('Lỗi kết nối khi kiểm tra mã.');
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
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

      const effectiveDiscount = Math.min(discount, totalPrice);

      return {
        discountAmount: effectiveDiscount,
        finalPrice: totalPrice - effectiveDiscount,
      };
    }
    return { discountAmount: 0, finalPrice: totalPrice };
  }, [totalPrice, appliedCoupon]);

  return (
    <CartContext.Provider
      value={{
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
        isApplyingCoupon,
        discountAmount,
        finalPrice,
      }}
    >
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
