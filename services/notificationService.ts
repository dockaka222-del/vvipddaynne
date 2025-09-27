/**
 * KIẾN TRÚC AN TOÀN CHO PRODUCTION
 *
 * File này mô phỏng việc frontend gọi đến một API endpoint an toàn trên backend.
 * Backend sẽ là nơi chứa API Key của Brevo và thực hiện việc gửi email.
 */

/**
 * Gửi yêu cầu đến backend để gửi email xác thực.
 * @param email Địa chỉ email của người nhận.
 * @returns Promise giải quyết khi email được "gửi" thành công.
 */
export const sendVerificationEmailAPI = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  console.log(`[Frontend] Gửi yêu cầu gửi email xác thực đến backend...`);

  // Trong ứng dụng thực tế, đây sẽ là một cuộc gọi `fetch` thực sự:
  // const response = await fetch('/api/send-verification-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email })
  // });
  // const data = await response.json();
  // return data;

  // --- Mô phỏng API backend ---
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `[Backend Simulation] Nhận được yêu cầu. Đang gửi email qua Brevo tới ${email}...`,
      );
      // Backend sẽ sử dụng Brevo SDK/API với key bí mật tại đây.
      resolve({
        success: true,
        message: 'Email xác thực đã được gửi thành công!',
      });
    }, 1500); // Giả lập độ trễ mạng
  });
};
