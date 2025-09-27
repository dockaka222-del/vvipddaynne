import type { CartItem, PaymentData } from '../types';

/**
 * KIẾN TRÚC AN TOÀN CHO PRODUCTION
 *
 * File này mô phỏng việc frontend gọi đến một API endpoint an toàn trên backend.
 * Backend sẽ là nơi chứa các khóa API của PayOS và thực hiện các cuộc gọi an toàn.
 */

/**
 * Gửi yêu cầu đến backend để tạo link thanh toán PayOS.
 * @param items Các sản phẩm trong giỏ hàng.
 * @param amount Tổng số tiền cần thanh toán.
 * @param couponCode (Tùy chọn) Mã giảm giá đã áp dụng.
 * @returns Promise chứa dữ liệu thanh toán (mã QR, mã đơn hàng) hoặc lỗi.
 */
export const createPaymentLinkAPI = async (
  items: CartItem[],
  amount: number,
  couponCode?: string,
): Promise<{ success: boolean; data?: PaymentData; message?: string }> => {
  console.log(
    `[Frontend] Gửi yêu cầu tạo đơn hàng PayOS đến backend...`,
    { amount, itemsCount: items.length, couponCode },
  );

  // Trong ứng dụng thực tế, đây sẽ là một cuộc gọi `fetch` thực sự:
  // const response = await fetch('/api/create-payment-link', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ items, amount, couponCode })
  // });
  // if (!response.ok) { ... }
  // const data = await response.json();
  // return data;

  // --- Mô phỏng API backend ---
  return new Promise((resolve, reject) => {
    // Giả lập kiểm tra server-side
    if (items.length === 0 || amount <= 0) {
      return reject({ success: false, message: 'Dữ liệu đơn hàng không hợp lệ.' });
    }

    setTimeout(() => {
      console.log(
        `[Backend Simulation] Nhận được yêu cầu. Đang xử lý tạo đơn hàng trên PayOS...`,
      );
      // Backend sẽ sử dụng PayOS SDK với các keys bí mật ở đây.
      const orderCode = Date.now();
      const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payos-order-${orderCode}`;

      console.log(
        `[Backend Simulation] Đã tạo đơn hàng thành công. Order Code: ${orderCode}`,
      );

      const paymentData: PaymentData = {
        orderCode,
        qrCode: qrCodeImage,
        amount,
      };

      resolve({ success: true, data: paymentData });
    }, 2000); // Giả lập độ trễ mạng
  });
};
