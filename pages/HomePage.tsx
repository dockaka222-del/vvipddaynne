import React, { useEffect, useState } from 'react';
import PricingCard from '../components/PricingCard';
import type { Product } from '../types';
import { getProductsAPI } from '../services/apiService';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Trang Chủ - Vipdayne.net | Chợ Sản Phẩm Số';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Nền tảng cung cấp sản phẩm số và tài khoản chất lượng cao, uy tín hàng đầu Việt Nam. Mua sắm an toàn, tiện lợi và nhanh chóng.',
      );

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductsAPI();
        setProducts(data);
      } catch (err: any) {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
          Chào mừng đến với{' '}
          <span className="text-cosmic-orange">Vipdayne.net</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Nền tảng cung cấp sản phẩm số và tài khoản chất lượng cao, uy tín hàng
          đầu Việt Nam.
        </p>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Bảng Giá Dịch Vụ</h2>
        {isLoading && (
          <div className="text-center">
            <p>Đang tải sản phẩm...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <PricingCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
