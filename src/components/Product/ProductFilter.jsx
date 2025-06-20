import React from 'react';
import { useCategories } from '../../hooks/useProducts';

const ProductFilter = ({ selectedCategory, onCategoryChange, disabled = false }) => {
  const { data: categoriesResponse, isLoading, error } = useCategories();
  const categories = categoriesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Фільтр за категорією:</h3>
        <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Фільтр за категорією:</h3>
        <div className="text-red-600 text-sm">
          Помилка завантаження категорій: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Фільтр за категорією:
        {disabled && <span className="text-xs text-gray-500 ml-2">(недоступно під час пошуку)</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => !disabled && onCategoryChange('')}
          disabled={disabled}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Усі категорії
        </button>
        
        {/* Написав Claude */}
        {categories.map((category) => {
          const categoryValue = typeof category === 'string' ? category : category.name || category.id;
          const categoryDisplay = typeof category === 'string' 
            ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
            : (category.name || category.id || '').charAt(0).toUpperCase() + (category.name || category.id || '').slice(1).replace(/-/g, ' ');
          
          return (
            <button
              key={categoryValue}
              onClick={() => !disabled && onCategoryChange(categoryValue)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === categoryValue
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {categoryDisplay}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFilter;