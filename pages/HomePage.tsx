import React, { useEffect } from 'react';
import PricingCard from '../components/PricingCard';
import type { Product } from '../types';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Gói Tài Khoản VIP 1 Tháng",
    price: 99000,
    features: [
      "Truy cập không giới hạn",
      "Hỗ trợ ưu tiên 24/7",
      "Cập nhật tính năng sớm",
      "Không quảng cáo",
    ],
    popular: true,
    image: "https://via.placeholder.com/150/FF7F50/FFFFFF?text=VIP+1M",
  },
  {
    id: 2,
    name: "Gói Tài Khoản VIP 6 Tháng",
    price: 499000,
    features: [
      "Tất cả quyền lợi Gói 1 Tháng",
      "Tiết kiệm 15%",
      "Ưu đãi độc quyền",
      "Quà tặng kèm theo",
    ],
    popular: false,
    image: "https://via.placeholder.com/150/228B22/FFFFFF?text=VIP+6M",
  },
  {
    id: 3,
    name: "Gói Doanh Nghiệp (1 Năm)",
    price: 1999000,
    features: [
      "Tất cả quyền lợi Gói 6 Tháng",
      "Hỗ trợ 5 người dùng",
      "Báo cáo thống kê chi tiết",
      "Tích hợp API",
    ],
    popular: false,
    image: "https://via.placeholder.com/150/4682B4/FFFFFF?text=Business",
  },
];

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Trang Chủ - Vipdayne.net | Chợ Sản Phẩm Số';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Nền tảng cung cấp sản phẩm số và tài khoản chất lượng cao, uy tín hàng đầu Việt Nam. Mua sắm an toàn, tiện lợi và nhanh chóng.');
  }, []);
  
  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
          Chào mừng đến với <span className="text-cosmic-orange">Vipdayne.net</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Nền tảng cung cấp sản phẩm số và tài khoản chất lượng cao, uy tín hàng đầu Việt Nam.
        </p>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Bảng Giá Dịch Vụ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.map((product) => (
            <PricingCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
