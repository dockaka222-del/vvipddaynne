import type { CartItem, PaymentData } from '../types';

/**
 * Mô phỏng việc gọi API backend để tạo link thanh toán PayOS.
 * Quy trình này đảm bảo các khóa API nhạy cảm được giữ an toàn trên server.
 * @param items Các sản phẩm trong giỏ hàng.
 * @param amount Tổng số tiền cần thanh toán.
 * @returns Promise chứa dữ liệu thanh toán (mã QR, mã đơn hàng) hoặc lỗi.
 */
export const createPaymentLinkAPI = async (
  items: CartItem[],
  amount: number,
): Promise<{ success: boolean; data?: PaymentData; message?: string }> => {
  console.log(
    `[Backend Simulation] Nhận được yêu cầu tạo đơn hàng PayOS với tổng tiền: ${amount}`,
  );

  // Giả lập đọc các keys từ biến môi trường trên server.
  // Trong ứng dụng thực tế, đây là những biến môi trường của server Node.js, etc.
  const PAYOS_CLIENT_ID = 'simulated_payos_client_id_from_env';
  const PAYOS_API_KEY = 'simulated_payos_api_key_from_env';
  const PAYOS_CHECKSUM_KEY = 'simulated_payos_checksum_key_from_env';

  if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
    console.error(
      '[Backend Simulation] Lỗi: Cấu hình PayOS bị thiếu trên server.',
    );
    return {
      success: false,
      message: 'Lỗi cấu hình thanh toán phía máy chủ.',
    };
  }

  // Giả lập quá trình gọi API PayOS và tạo đơn hàng.
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderCode = Date.now();
      const description = `Thanh toan don hang ${orderCode}`;
      const returnUrl = `https://your-frontend-url.com/payment-success`; // Thay bằng URL của bạn
      const cancelUrl = `https://your-frontend-url.com/payment-cancel`; // Thay bằng URL của bạn

      // Dữ liệu để tạo QR code theo chuẩn VietQR.
      // Trong thực tế, PayOS SDK sẽ trả về link này.
      const qrCodeData = `https://my.payos.vn/web/v2/charge?data=${btoa(
        JSON.stringify({
          orderCode,
          amount,
          description,
          returnUrl,
          cancelUrl,
        }),
      )}`;
      // Sử dụng một dịch vụ bên ngoài để tạo ảnh QR từ dữ liệu.
      const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        qrCodeData,
      )}`;

      console.log(
        `[Backend Simulation] Đã tạo đơn hàng thành công trên PayOS. Order Code: ${orderCode}`,
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
