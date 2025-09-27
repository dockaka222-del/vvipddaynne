
import React, { useState } from 'react';
import { generateProductDescription } from '../services/geminiService';
import QuillEditor from '../components/QuillEditor';

const AdminPage: React.FC = () => {
  // States for all product fields
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [productFeatures, setProductFeatures] = useState('');
  const [productDescription, setProductDescription] = useState('');
  
  // States for UI control
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleGenerateDescription = async () => {
    if (!productName || !productFeatures) {
      setError('Vui lòng nhập Tên sản phẩm và Các tính năng chính.');
      return;
    }
    setError('');
    setIsLoading(true);
    setProductDescription('');

    try {
      const description = await generateProductDescription(productName, productFeatures);
      setProductDescription(description.replace(/\n/g, '<p><br/></p>'));
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo mô tả. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
      setProductName('');
      setProductPrice('');
      setProductImageUrl('');
      setIsPopular(false);
      setProductFeatures('');
      setProductDescription('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!productName || productPrice === '' || !productDescription) {
        setError('Vui lòng điền đầy đủ Tên, Giá và Mô tả sản phẩm.');
        return;
    }

    const newProduct = {
        name: productName,
        price: productPrice,
        imageUrl: productImageUrl,
        isPopular: isPopular,
        features: productFeatures.split('\n').filter(f => f.trim() !== ''),
        description: productDescription,
    };

    // --- Mô phỏng gửi dữ liệu đến backend ---
    console.log("Dữ liệu sản phẩm sẽ được gửi đến backend:", JSON.stringify(newProduct, null, 2));
    
    // Hiển thị thông báo thành công và reset form
    setSuccessMessage(`Sản phẩm "${productName}" đã được lưu thành công!`);
    resetForm();

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-800 dark:text-white">Trang Quản Trị - Tạo/Sửa Sản Phẩm</h1>
      
      <form onSubmit={handleSaveProduct} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sản phẩm</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ví dụ: Gói VIP xem phim HD"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Price */}
            <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá sản phẩm (VND)</label>
                <input
                    type="number"
                    id="productPrice"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ví dụ: 99000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    required
                    min="0"
                />
            </div>
            {/* Product Image URL */}
            <div>
                <label htmlFor="productImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Hình ảnh</label>
                <input
                    type="text"
                    id="productImageUrl"
                    value={productImageUrl}
                    onChange={(e) => setProductImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
            </div>
        </div>

        {/* Is Popular Checkbox */}
        <div className="flex items-center">
            <input
                id="isPopular"
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-cosmic-orange focus:ring-cosmic-orange"
            />
            <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Đánh dấu là sản phẩm phổ biến
            </label>
        </div>

        {/* Product Features */}
        <div>
          <label htmlFor="productFeatures" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Các tính năng chính (mỗi tính năng một dòng)</label>
          <textarea
            id="productFeatures"
            rows={4}
            value={productFeatures}
            onChange={(e) => setProductFeatures(e.target.value)}
            placeholder="Ví dụ:\n- Không quảng cáo\n- Chất lượng Full HD\n- Xem trên 5 thiết bị"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cosmic-orange focus:border-cosmic-orange dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>

        {/* AI Description Generator */}
        <div className="text-center">
            <button
                type="button" // Important: change type to not submit the form
                onClick={handleGenerateDescription}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cosmic-orange to-orange-500 hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Tạo Mô Tả Bằng AI
                    </>
                )}
            </button>
        </div>

        {/* Product Description Editor */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả sản phẩm</label>
             <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-600">
                <QuillEditor 
                    value={productDescription} 
                    onChange={setProductDescription} 
                />
             </div>
             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Chỉnh sửa nội dung do AI tạo ra và định dạng tại đây.</p>
        </div>
        
        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center font-semibold">{successMessage}</p>}

        {/* Save Button */}
        <div className="border-t pt-6 text-right">
             <button
                type="submit"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-leaf-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Lưu Sản Phẩm
            </button>
        </div>

      </form>
    </div>
  );
};

export default AdminPage;
