import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import EmailVerificationPrompt from '../components/EmailVerificationPrompt';
import { createPaymentLinkAPI } from '../services/paymentService';
import type { PaymentData, Purchase } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

type CheckoutStep = 'VERIFICATION' | 'CART_SUMMARY' | 'PAYMENT' | 'SUCCESS';

const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    totalPrice,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    couponError,
    discountAmount,
    finalPrice,
    clearCart,
  } = useCart();
  const { user, addPurchaseToHistory } = useAuth();

  const [step, setStep] = useState<CheckoutStep>('CART_SUMMARY');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    document.title = 'Thanh Toán - Vipdayne.net';
    if (user && !user.isVerified) {
      setStep('VERIFICATION');
    } else if (cartItems.length > 0) {
      setStep('CART_SUMMARY');
    }
  }, [user, user?.isVerified, cartItems.length]);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    }
  };

  const handleProceedToPayment = async () => {
    setIsLoading(true);
    const result = await createPaymentLinkAPI(cartItems, finalPrice);
    if (result.success && result.data) {
      setPaymentData(result.data);
      setStep('PAYMENT');
    } else {
      alert(result.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
    setIsLoading(false);
  };

  const handleSimulatePaymentSuccess = () => {
    // This simulates receiving a webhook from PayOS on your backend

    // Create a purchase record
    const newPurchase: Purchase = {
      id: `ORD-${paymentData?.orderCode || Date.now()}`,
      date: new Date().toISOString(),
      totalAmount: finalPrice,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        downloadLink: `#download/product/${item.product.id}/${Math.random()
          .toString(36)
          .substr(2, 16)}`, // Giả lập link tải duy nhất
      })),
      appliedCoupon: appliedCoupon?.code,
    };

    // Add to user's history
    addPurchaseToHistory(newPurchase);

    // Clear the cart
    clearCart();
    setStep('SUCCESS');
  };

  if (step === 'VERIFICATION') {
    return <EmailVerificationPrompt />;
  }

  if (step === 'SUCCESS') {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-leaf-green">
        <h1 className="text-3xl font-bold mb-4 text-leaf-green">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Cảm ơn bạn đã mua hàng. Bạn có thể xem lại sản phẩm và tải xuống tại
          trang tài khoản.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/tai-khoan"
            className="bg-leaf-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Xem Lịch Sử Mua Hàng
          </Link>
          <Link
            to="/"
            className="bg-cosmic-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'PAYMENT' && paymentData) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-2">Quét mã để thanh toán</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sử dụng ứng dụng ngân hàng hoặc ví điện tử của bạn.
        </p>
        <img
          src={paymentData.qrCode}
          alt="Mã QR thanh toán"
          className="mx-auto my-4 border-4 border-leaf-green p-2 rounded-lg"
        />
        <div className="space-y-2 text-left">
          <p>
            Mã đơn hàng:{' '}
            <span className="font-bold font-mono">{paymentData.orderCode}</span>
          </p>
          <p>
            Số tiền:{' '}
            <span className="font-bold text-cosmic-orange text-xl">
              {formatCurrency(paymentData.amount)}
            </span>
          </p>
        </div>
        <button
          onClick={handleSimulatePaymentSuccess}
          className="w-full mt-6 bg-leaf-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
        >
          (Mô phỏng) Đã thanh toán xong
        </button>
        <p className="text-xs text-gray-500 mt-2">
          (Nút này giả lập backend nhận được webhook từ PayOS)
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hãy quay lại trang chủ để lựa chọn sản phẩm nhé.
        </p>
        <Link
          to="/"
          className="bg-cosmic-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Về Trang Chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Giỏ Hàng Của Bạn</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p className="text-cosmic-orange font-semibold">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="ml-6 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-28">
            <h2 className="text-xl font-bold border-b pb-4 mb-4">
              Tóm tắt đơn hàng
            </h2>
            <div className="mb-4">
              <label
                htmlFor="coupon"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mã giảm giá
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã ở đây"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-cosmic-orange focus:border-cosmic-orange sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  disabled={!!appliedCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!!appliedCoupon}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
                >
                  Áp dụng
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-sm text-red-500">{couponError}</p>
              )}
              {!couponError && appliedCoupon && (
                <p className="mt-2 text-sm text-green-600">
                  Đã áp dụng mã thành công!
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tổng tiền hàng
                </span>
                <span className="font-semibold">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center font-semibold">
                    Giảm giá ({appliedCoupon.code})
                    <button
                      onClick={removeCoupon}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                    >
                      [Gỡ]
                    </button>
                  </span>
                  <span className="font-semibold">
                    - {formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
              <span>Tổng cộng</span>
              <span>{formatCurrency(finalPrice)}</span>
            </div>
            <button
              onClick={handleProceedToPayment}
              disabled={isLoading}
              className="w-full mt-6 bg-cosmic-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Thanh toán qua PayOS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
