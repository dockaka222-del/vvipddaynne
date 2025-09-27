import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Purchase } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Tài Khoản Của Tôi - Vipdayne.net';
  }, []);

  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">
        Tài Khoản Của Tôi
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Thông Tin Cá Nhân</h2>
        <div className="space-y-2">
          <p>
            <strong>Tên người dùng:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Lịch Sử Giao Dịch</h2>
        {user.purchaseHistory.length === 0 ? (
          <p className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center text-gray-500">
            Bạn chưa có giao dịch nào.
          </p>
        ) : (
          <div className="space-y-6">
            {user.purchaseHistory.map((purchase: Purchase) => (
              <div
                key={purchase.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-cosmic-orange">
                      {purchase.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ngày mua:{' '}
                      {new Date(purchase.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">
                      {formatCurrency(purchase.totalAmount)}
                    </p>
                    {purchase.appliedCoupon && (
                      <p className="text-xs text-green-600">
                        Đã dùng mã: {purchase.appliedCoupon}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="font-semibold mb-3">Các sản phẩm đã mua:</h4>
                <div className="space-y-3">
                  {purchase.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md mr-4"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <a
                        href={item.downloadLink}
                        download
                        onClick={(e) => {
                          // Trong thực tế, bạn có thể cần gọi API để lấy link tải tạm thời.
                          // Ở đây chúng ta chỉ mô phỏng.
                          if (item.downloadLink === '#') {
                            e.preventDefault();
                            alert('Đang tạo link tải an toàn cho bạn...');
                            // Giả lập API call
                            setTimeout(() => {
                              alert('Link tải đã sẵn sàng (mô phỏng)!');
                            }, 1000);
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-leaf-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Tải xuống
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
