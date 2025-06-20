import React from 'react';

const ProductSort = ({ sortBy, order, onSortChange }) => {
  const sortOptions = [
    { value: '', label: 'За замовчуванням' },
    { value: 'title', label: 'Назва' },
    { value: 'price', label: 'Ціна' },
    { value: 'rating', label: 'Рейтинг' },
    { value: 'discountPercentage', label: 'Знижка' },
  ];

  // Debug function to see what's being passed
  const handleSortChange = (newSortBy, newOrder) => {
    console.log('Sort change:', { newSortBy, newOrder, currentSortBy: sortBy, currentOrder: order });
    onSortChange(newSortBy, newOrder);
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <span className="text-sm font-medium text-gray-700">Сортувати за:</span>
      
      <select
        value={sortBy || ''}
        onChange={(e) => handleSortChange(e.target.value, order || 'asc')}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {sortBy && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleSortChange(sortBy, 'asc')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              order === 'asc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Зростання ↑
          </button>
          <button
            onClick={() => handleSortChange(sortBy, 'desc')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              order === 'desc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Спадання ↓
          </button>
        </div>
      )}
    
    </div>
  );
};

export default ProductSort;