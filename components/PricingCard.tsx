import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface PricingCardProps {
  product: Product;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const PricingCard: React.FC<PricingCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset button state after 2 seconds
  };

  return (
    <div className={`relative border-4 border-leaf-green rounded-2xl p-6 flex flex-col transition-transform transform hover:scale-105 duration-300 shadow-xl ${product.popular ? 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800/80' : 'bg-white dark:bg-gray-800'}`}>
      {product.popular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cosmic-orange text-white text-sm font-bold px-4 py-1 rounded-full">
          Phổ biến
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{product.name}</h3>
        <p className="text-4xl font-extrabold text-cosmic-orange mt-4">{formatCurrency(product.price)}</p>
        <span className="text-sm text-gray-500 dark:text-gray-400">/ gói</span>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg flex-grow mb-6 shadow-inner">
        <ul className="space-y-3">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-leaf-green mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 mt-auto ${
          added
            ? 'bg-leaf-green cursor-not-allowed'
            : 'bg-cosmic-orange hover:bg-orange-600'
        }`}
      >
        {added ? 'Đã thêm!' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
};

export default PricingCard;
