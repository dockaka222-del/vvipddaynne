/**
 * Mô phỏng việc gọi API backend để gửi email xác thực.
 * Trong ứng dụng thực tế, service này sẽ gửi request đến backend của bạn,
 * và backend sẽ sử dụng Brevo SDK/API để gửi email một cách an toàn.
 * @param email Địa chỉ email của người nhận.
 * @returns Promise giải quyết khi email được "gửi" thành công.
 */
export const sendVerificationEmailAPI = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  console.log(
    `[Backend Simulation] Nhận được yêu cầu gửi email xác thực đến: ${email}`,
  );

  // Giả lập đọc API key từ biến môi trường trên server.
  const BREVO_API_KEY = 'simulated_brevo_api_key_from_env';
  if (!BREVO_API_KEY) {
    console.error(
      '[Backend Simulation] Lỗi: BREVO_API_KEY chưa được cấu hình trên server.',
    );
    return { success: false, message: 'Lỗi cấu hình phía máy chủ.' };
  }

  // Giả lập quá trình gọi API Brevo.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `[Backend Simulation] Đã sử dụng API Key để gửi email qua Brevo tới ${email}.`,
      );
      resolve({
        success: true,
        message: 'Email xác thực đã được gửi thành công!',
      });
    }, 1500); // Giả lập độ trễ mạng
  });
};
