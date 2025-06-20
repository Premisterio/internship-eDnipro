import React from 'react';

const ProductSort = ({ sortBy, order, onSortChange, disabled = false }) => {
  const sortOptions = [
    { value: '', label: 'За замовчуванням' },
    { value: 'title', label: 'Назва' },
    { value: 'price', label: 'Ціна' },
    { value: 'rating', label: 'Рейтинг' },
    { value: 'discountPercentage', label: 'Знижка' },
  ];

  const handleSortChange = (newSortBy, newOrder) => {
    if (!disabled) {
      console.log('Sort change:', { newSortBy, newOrder, currentSortBy: sortBy, currentOrder: order });
      onSortChange(newSortBy, newOrder);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Сортувати за:
        </span>
        
        <select
          value={sortBy || ''}
          onChange={(e) => handleSortChange(e.target.value, order || 'asc')}
          disabled={disabled}
          className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
          }`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {sortBy && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleSortChange(sortBy, 'asc')}
            disabled={disabled}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              order === 'asc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Зростання ↑
          </button>
          <button
            onClick={() => handleSortChange(sortBy, 'desc')}
            disabled={disabled}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              order === 'desc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Спадання ↓
          </button>
        </div>
      )}

      {disabled && (
        <div className="text-xs text-gray-500">
          Сортування працює для результатів пошуку
        </div>
      )}
    </div>
  );
};

export default ProductSort;