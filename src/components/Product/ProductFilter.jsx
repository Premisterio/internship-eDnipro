import React from 'react';
import { useCategories } from '../../hooks/useProducts';

const ProductFilter = ({ selectedCategory, onCategoryChange }) => {
  const { data: categoriesResponse, isLoading, error } = useCategories();
  const categories = categoriesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 text-red-600 text-sm">
        Помилка завантаження категорій
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Фільтр за категорією:</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Усі категорії
        </button>
        {categories.map((category) => {
          // Handle both string and object categories
          const categoryValue = typeof category === 'string' ? category : category.name || category.id;
          const categoryDisplay = typeof category === 'string' 
            ? category.replace(/-/g, ' ') 
            : (category.name || category.id || '').replace(/-/g, ' ');
          
          return (
            <button
              key={categoryValue}
              onClick={() => onCategoryChange(categoryValue)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === categoryValue
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
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