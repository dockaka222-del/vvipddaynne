
import { GoogleGenAI } from "@google/genai";

// QUAN TRỌNG: Khóa API này chỉ dành cho mục đích minh họa phía client.
// Trong một ứng dụng sản xuất thực tế, bạn PHẢI di chuyển logic này sang
// backend (ví dụ: Node.js/Express) để bảo vệ khóa API của bạn.
// Biến môi trường process.env.API_KEY sẽ được thiết lập trên server đó.
// Việc lộ khóa API trên client có thể dẫn đến lạm dụng và phát sinh chi phí.

const getApiKey = () => {
  // Trong môi trường sản xuất, bạn sẽ không có dòng này.
  // Thay vào đó, bạn sẽ gọi một API endpoint trên backend của mình,
  // và backend sẽ thực hiện cuộc gọi đến Gemini.
  // Ví dụ: return fetch('/api/generate-description', { method: 'POST', ... })
  
  // Đây là một placeholder. Thay thế bằng khóa API của bạn để thử nghiệm.
  // Hãy nhớ KHÔNG commit khóa này vào git.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY không được định nghĩa. Vui lòng thiết lập biến môi trường.");
    // Trả về lỗi để UI có thể hiển thị thông báo phù hợp
    throw new Error("API Key for Gemini is not configured.");
  }
  return apiKey;
};


// Khởi tạo Gemini AI client
// Một lần nữa, việc này nên được thực hiện trên backend.
const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Tạo mô tả sản phẩm hấp dẫn bằng Gemini AI.
 * @param productName Tên của sản phẩm.
 *- @param features Một chuỗi các tính năng, mỗi tính năng trên một dòng.
 * @returns Một chuỗi chứa mô tả sản phẩm được tạo ra.
 */
export async function generateProductDescription(productName: string, features: string): Promise<string> {
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
    console.error("Lỗi khi gọi Gemini API:", error);
    throw new Error("Không thể tạo mô tả sản phẩm. Vui lòng kiểm tra console để biết thêm chi tiết.");
  }
}
