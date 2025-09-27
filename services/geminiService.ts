/**
 * KIẾN TRÚC AN TOÀN CHO PRODUCTION
 *
 * File này mô phỏng việc frontend gọi đến một API endpoint an toàn trên backend.
 * Backend sẽ là nơi chứa API Key và thực hiện cuộc gọi đến Google Gemini.
 * Điều này đảm bảo API Key không bao giờ bị lộ ra trình duyệt của người dùng.
 */

/**
 * Gửi yêu cầu đến backend để tạo mô tả sản phẩm bằng AI.
 * @param productName Tên của sản phẩm.
 * @param features Một chuỗi các tính năng, mỗi tính năng trên một dòng.
 * @returns Promise chứa mô tả sản phẩm hoặc thông báo lỗi.
 */
export async function generateProductDescriptionAPI(
  productName: string,
  features: string,
): Promise<{ success: boolean; description?: string; message?: string }> {
  console.log(
    '[Frontend] Gửi yêu cầu tạo mô tả cho backend...',
    { productName, features },
  );

  // Trong một ứng dụng thực tế, đây sẽ là một cuộc gọi `fetch` thực sự:
  // const response = await fetch('/api/generate-description', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ productName, features })
  // });
  // if (!response.ok) { ... }
  // const data = await response.json();
  // return data;

  // --- Mô phỏng API backend ---
  return new Promise((resolve) => {
    setTimeout(() => {
      // Logic backend mô phỏng: nhận yêu cầu và tạo prompt
      const prompt = `
        Với vai trò là một chuyên gia marketing và copywriter, hãy viết một mô tả sản phẩm thật hấp dẫn, thuyết phục cho một sản phẩm số có tên là "${productName}".

        Sản phẩm này có các tính năng chính sau:
        ${features}

        Yêu cầu:
        1. Viết bằng tiếng Việt, giọng văn trẻ trung, năng động và chuyên nghiệp.
        2. Tập trung vào lợi ích mà khách hàng nhận được, không chỉ liệt kê tính năng.
        3. Độ dài khoảng 3-4 đoạn văn ngắn.
        4. Có một tiêu đề chính hấp dẫn.
        5. Kết thúc bằng một lời kêu gọi hành động (Call To Action) mạnh mẽ để khuyến khích khách hàng mua ngay.
        6. Không sử dụng markdown, chỉ trả về văn bản thuần túy.
      `;

      console.log('[Backend Simulation] Đã nhận yêu cầu và đang gọi Gemini...');
      // console.log('[Backend Simulation] Prompt:', prompt);
      // Ở đây, backend sẽ thực sự gọi:
      // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      // const description = response.text;

      // Mô phỏng kết quả trả về từ Gemini
      const mockDescription = `### Khám Phá ${productName} - Quyền Năng Giải Trí Vượt Trội!\n\nBạn đã sẵn sàng nâng tầm trải nghiệm số của mình chưa? Với ${productName}, mọi giới hạn đều bị phá vỡ. Tận hưởng thế giới nội dung đỉnh cao, sắc nét và hoàn toàn không bị làm phiền.\n\n${features
        .split('\n')
        .map((f) => f.replace('-', '').trim())
        .join(
          ', ',
        )} là những gì chúng tôi cam kết mang lại. Hãy quên đi những phút giây chờ đợi và quảng cáo khó chịu. Thay vào đó, hãy đắm chìm vào những bộ phim bom tấn, những bản nhạc độc quyền và những tính năng chỉ dành riêng cho bạn.\n\nĐừng chần chừ! Nâng cấp ngay hôm nay để trở thành người dẫn đầu xu hướng. Nhấn "Mua Ngay" và bắt đầu hành trình chinh phục thế giới số của riêng bạn!`;

      resolve({ success: true, description: mockDescription });
    }, 2000); // Giả lập độ trễ mạng
  });
}
