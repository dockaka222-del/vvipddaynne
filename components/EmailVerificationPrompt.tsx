
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendVerificationEmailAPI } from '../services/notificationService';

const EmailVerificationPrompt: React.FC = () => {
  const { user, confirmVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendEmail = async () => {
    if (!user) return;
    setIsLoading(true);
    setMessage('');
    setError('');
    const result = await sendVerificationEmailAPI(user.email);
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };
  
  return (
    <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-yellow-400">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">Xác thực tài khoản của bạn</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Để tiếp tục thanh toán, bạn cần xác thực địa chỉ email. Vui lòng kiểm tra hộp thư đến tại <span className="font-bold">{user?.email}</span>.
      </p>
      
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button 
          onClick={handleSendEmail}
          disabled={isLoading}
          className="bg-cosmic-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Đang gửi...' : 'Gửi lại email xác thực'}
        </button>
        <button 
          onClick={confirmVerification}
          className="bg-leaf-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
        >
          (Mô phỏng) Tôi đã xác thực
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">(Trong thực tế, bạn sẽ cần nhấp vào liên kết trong email của mình để xác thực)</p>
    </div>
  );
};

export default EmailVerificationPrompt;
