import React, { useState, useEffect } from 'react';
import { useSearchProducts } from '../../hooks/useProducts';

const ProductSearch = ({ onSearchResults, onClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search products
  const { data: searchResults, isLoading, error } = useSearchProducts(debouncedQuery);

  // Update parent with search results
  useEffect(() => {
    if (debouncedQuery && searchResults) {
      onSearchResults(searchResults.data.products);
    } else if (!debouncedQuery) {
      onClearSearch();
    }
  }, [searchResults, debouncedQuery, onSearchResults, onClearSearch]);

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    onClearSearch();
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Пошук товарів... (наприклад, iPhone, Samsung)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isLoading && debouncedQuery && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        {searchQuery && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Очистити
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm">
          Помилка під час пошуку товарів. Спробуйте ще раз.
        </div>
      )}

      {debouncedQuery && searchResults && (
        <div className="mt-2 text-sm text-gray-600">
          Знайдено {searchResults.data.total} товарів за запитом "{debouncedQuery}"
        </div>
      )}
    </div>
  );
};

export default ProductSearch;