/**
 * API Service - Lớp Giao tiếp với Backend
 *
 * Trong một ứng dụng thực tế, file này sẽ chứa các hàm `fetch`
 * để gọi đến các API endpoint thực sự trên server của bạn.
 *
 * Ở đây, chúng ta mô phỏng một backend với độ trễ và dữ liệu mẫu
 * để xây dựng frontend theo đúng kiến trúc production-ready.
 */
import type { Product, Coupon, User } from '../types';

const MOCK_DELAY = 1000; // 1 giây

// --- KHO DỮ LIỆU MẪU (DATABASE MÔ PHỎNG) ---

let mockProducts: Product[] = [
  {
    id: 1,
    name: 'Gói Tài Khoản VIP 1 Tháng',
    price: 99000,
    features: [
      'Truy cập không giới hạn',
      'Hỗ trợ ưu tiên 24/7',
      'Cập nhật tính năng sớm',
      'Không quảng cáo',
    ],
    popular: true,
    image: 'https://via.placeholder.com/150/FF7F50/FFFFFF?text=VIP+1M',
  },
  {
    id: 2,
    name: 'Gói Tài Khoản VIP 6 Tháng',
    price: 499000,
    features: [
      'Tất cả quyền lợi Gói 1 Tháng',
      'Tiết kiệm 15%',
      'Ưu đãi độc quyền',
      'Quà tặng kèm theo',
    ],
    popular: false,
    image: 'https://via.placeholder.com/150/228B22/FFFFFF?text=VIP+6M',
  },
  {
    id: 3,
    name: 'Gói Doanh Nghiệp (1 Năm)',
    price: 1999000,
    features: [
      'Tất cả quyền lợi Gói 6 Tháng',
      'Hỗ trợ 5 người dùng',
      'Báo cáo thống kê chi tiết',
      'Tích hợp API',
    ],
    popular: false,
    image: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Business',
  },
];

let mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'VIPDAYNE50K',
    discountType: 'amount',
    discountValue: 50000,
    createdAt: '2024-05-20',
    expiresAt: '2024-12-31',
    maxUses: 100,
    uses: 10,
  },
  {
    id: '2',
    code: 'SALE10PT',
    discountType: 'percentage',
    discountValue: 10,
    createdAt: '2024-05-15',
    expiresAt: '2025-01-15',
    maxUses: null,
    uses: 50,
  },
  {
    id: '3',
    code: 'EXPIRED20K',
    discountType: 'amount',
    discountValue: 20000,
    createdAt: '2023-01-01',
    expiresAt: '2024-01-01',
    maxUses: 200,
    uses: 150,
  },
  {
    id: '4',
    code: 'LIMIT10',
    discountType: 'amount',
    discountValue: 10000,
    createdAt: '2024-05-01',
    expiresAt: null,
    maxUses: 10,
    uses: 10,
  },
];

let mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@vipdayne.net',
    role: 'admin',
    isVerified: true,
    purchaseHistory: [],
  },
  {
    id: '2',
    username: 'user',
    email: 'user@vipdayne.net',
    role: 'user',
    isVerified: true,
    purchaseHistory: [], // Lịch sử mua hàng được quản lý trong AuthContext
  },
  {
    id: '3',
    username: 'newuser',
    email: 'new@example.com',
    role: 'user',
    isVerified: false,
    purchaseHistory: [],
  },
];

// --- CÁC HÀM API MÔ PHỎNG ---

export const getProductsAPI = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, MOCK_DELAY);
  });
};

export const getUsersAPI = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, MOCK_DELAY);
  });
};

export const getCouponsAPI = (): Promise<Coupon[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCoupons);
    }, MOCK_DELAY);
  });
};

export const addCouponAPI = (newCouponData: Omit<Coupon, 'id' | 'createdAt' | 'uses'>): Promise<Coupon> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newCoupon: Coupon = {
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString().split('T')[0],
                uses: 0,
                ...newCouponData
            };
            mockCoupons = [newCoupon, ...mockCoupons];
            resolve(newCoupon);
        }, MOCK_DELAY);
    });
};


export const saveProductAPI = (productData: any): Promise<{success: boolean, message?: string}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Backend mô phỏng: Đã lưu sản phẩm", productData);
            resolve({ success: true });
        }, MOCK_DELAY);
    });
}

export const validateCouponAPI = (code: string): Promise<{ success: boolean; coupon?: Coupon; message?: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
            if (!coupon) {
                return resolve({ success: false, message: 'Mã giảm giá không hợp lệ.' });
            }
            if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
                return resolve({ success: false, message: 'Mã giảm giá đã hết hạn.' });
            }
            if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) {
                return resolve({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng.' });
            }
            resolve({ success: true, coupon });
        }, MOCK_DELAY);
    });
};
