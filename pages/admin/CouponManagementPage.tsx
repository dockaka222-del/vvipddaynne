import React, { useState } from 'react';
import { Coupon } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getStatus = (coupon: Coupon) => {
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { text: 'Hết hạn', color: 'red' };
  }
  if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) {
    return { text: 'Hết lượt', color: 'yellow' };
  }
  return { text: 'Hoạt động', color: 'green' };
};

const CouponManagementPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
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
    {
      id: '5',
      code: 'NOEXPIRE',
      discountType: 'percentage',
      discountValue: 5,
      createdAt: '2024-01-01',
      expiresAt: null,
      maxUses: null,
      uses: 25,
    },
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<
    'amount' | 'percentage'
  >('amount');
  const [newDiscountValue, setNewDiscountValue] = useState<number | ''>('');
  const [newExpiresAt, setNewExpiresAt] = useState('');
  const [newMaxUses, setNewMaxUses] = useState<number | ''>('');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newDiscountValue) {
      alert('Vui lòng điền Mã và Giá trị giảm giá!');
      return;
    }
    const newCoupon: Coupon = {
      id: Math.random().toString(36).substr(2, 9),
      code: newCouponCode.toUpperCase(),
      discountType: newDiscountType,
      discountValue: newDiscountValue as number,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newExpiresAt || null,
      maxUses: newMaxUses ? (newMaxUses as number) : null,
      uses: 0,
    };
    setCoupons([newCoupon, ...coupons]);
    // Reset form
    setNewCouponCode('');
    setNewDiscountType('amount');
    setNewDiscountValue('');
    setNewExpiresAt('');
    setNewMaxUses('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Mã Giảm Giá</h1>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg mb-8 shadow-inner">
        <h2 className="text-xl font-semibold mb-4">Tạo mã mới</h2>
        <form onSubmit={handleAddCoupon} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mã giảm giá
              </label>
              <input
                type="text"
                id="code"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Loại giảm giá
              </label>
              <select
                id="type"
                value={newDiscountType}
                onChange={(e) =>
                  setNewDiscountType(e.target.value as any)
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="amount">Số tiền (VND)</option>
                <option value="percentage">Phần trăm (%)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Giá trị
              </label>
              <input
                type="number"
                id="value"
                value={newDiscountValue}
                onChange={(e) =>
                  setNewDiscountValue(parseInt(e.target.value) || '')
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600"
                required
                min="1"
              />
            </div>
            <div>
              <label
                htmlFor="maxUses"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Số lần sử dụng (bỏ trống nếu không giới hạn)
              </label>
              <input
                type="number"
                id="maxUses"
                value={newMaxUses}
                onChange={(e) =>
                  setNewMaxUses(parseInt(e.target.value) || '')
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600"
                min="1"
              />
            </div>
            <div>
              <label
                htmlFor="expiresAt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ngày hết hạn (bỏ trống nếu không có)
              </label>
              <input
                type="date"
                id="expiresAt"
                value={newExpiresAt}
                onChange={(e) => setNewExpiresAt(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="w-full md:w-auto bg-cosmic-orange text-white font-bold py-2 px-6 rounded-md hover:bg-orange-600 transition duration-300"
            >
              Thêm Mã
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-semibold">Mã</th>
              <th className="text-left p-4 font-semibold">Mức giảm</th>
              <th className="text-left p-4 font-semibold">Đã dùng</th>
              <th className="text-left p-4 font-semibold">Hết hạn</th>
              <th className="text-left p-4 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const status = getStatus(coupon);
              return (
                <tr
                  key={coupon.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="p-4 font-mono text-cosmic-orange">
                    {coupon.code}
                  </td>
                  <td className="p-4 font-semibold">
                    {coupon.discountType === 'amount'
                      ? formatCurrency(coupon.discountValue)
                      : `${coupon.discountValue}%`}
                  </td>
                  <td className="p-4">
                    {coupon.uses} / {coupon.maxUses ?? '∞'}
                  </td>
                  <td className="p-4">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString('vi-VN')
                      : 'Không có'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        status.color === 'green'
                          ? 'bg-green-100 text-green-800'
                          : status.color === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {status.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponManagementPage;
