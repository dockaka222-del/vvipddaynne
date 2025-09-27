import { GoogleGenAI } from '@google/genai';

// QUAN TRỌNG: Việc khởi tạo và sử dụng API Key trực tiếp ở phía client
// là CỰC KỲ NGUY HIỂM và chỉ nên dùng cho mục đích học tập, thử nghiệm.
//
// Trong một ứng dụng thực tế (production):
// 1. TOÀN BỘ logic gọi đến Gemini API PHẢI được thực hiện trên backend (server).
// 2. Frontend sẽ gửi yêu cầu đến một endpoint trên backend của bạn.
// 3. Backend sẽ nhận yêu cầu, bảo mật API Key và thực hiện cuộc gọi đến Gemini.
//
// Việc để lộ API Key trên client có thể dẫn đến lạm dụng, đánh cắp và phát sinh chi phí không mong muốn.

const getApiKey = (): string => {
  // Hàm này mô phỏng việc lấy API key. Trong môi trường client-side thực tế,
  // biến `process.env.API_KEY` sẽ không tồn tại trừ khi được cấu hình đặc biệt
  // bởi một công cụ build (như Vite, Create React App).
  // Ngay cả khi có, nó vẫn sẽ bị lộ trong mã nguồn của trình duyệt.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error(
      'API_KEY không được định nghĩa. Vui lòng thiết lập biến môi trường.',
    );
    // Trả về lỗi để UI có thể hiển thị thông báo phù hợp.
    throw new Error('API Key for Gemini is not configured.');
  }
  return apiKey;
};

// Khởi tạo Gemini AI client.
// NHẮC LẠI: Việc này phải được thực hiện trên backend trong môi trường production.
const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Tạo mô tả sản phẩm hấp dẫn bằng Gemini AI.
 * @param productName Tên của sản phẩm.
 * @param features Một chuỗi các tính năng, mỗi tính năng trên một dòng.
 * @returns Một chuỗi chứa mô tả sản phẩm được tạo ra.
 */
export async function generateProductDescription(
  productName: string,
  features: string,
): Promise<string> {
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    throw new Error(
      'Không thể tạo mô tả sản phẩm. Vui lòng kiểm tra console để biết thêm chi tiết.',
    );
  }
}
