export interface Product {
  id: number;
  name: string;
  price: number; // Chuyển sang dạng số để tính toán
  features: string[];
  popular: boolean;
  image: string; // Thêm ảnh cho sản phẩm
}

export interface PurchasedItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  downloadLink: string;
}

export interface Purchase {
  id: string;
  date: string;
  totalAmount: number;
  items: PurchasedItem[];
  appliedCoupon?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  purchaseHistory: Purchase[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'amount' | 'percentage'; // Loại giảm giá
  discountValue: number; // Giá trị giảm (số tiền hoặc %)
  createdAt: string;
  expiresAt: string | null; // Có thể không có ngày hết hạn
  maxUses: number | null; // Số lần sử dụng tối đa, null là không giới hạn
  uses: number; // Số lần đã sử dụng
}

export interface PaymentData {
  orderCode: number;
  qrCode: string;
  amount: number;
}
