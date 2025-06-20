import React, { useState, useEffect } from 'react';
import { useSearchProducts } from '../../hooks/useProducts';

const ProductSearch = ({ onSearchResults, onClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search products - only search if query is at least 3 characters
  const shouldSearch = debouncedQuery && debouncedQuery.length >= 3;
  const { data: searchResults, isLoading, error } = useSearchProducts(
    shouldSearch ? debouncedQuery : '', 
    100, // Get more results for better filtering/sorting
    0
  );

  // Update parent with search results
  useEffect(() => {
    if (shouldSearch && searchResults) {
      const products = searchResults.data?.products || [];
      onSearchResults(products);
    } else if (!shouldSearch) {
      onClearSearch();
    }
  }, [searchResults, shouldSearch, onSearchResults, onClearSearch]);

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    onClearSearch();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If input is cleared, immediately clear search
    if (!value.trim()) {
      setDebouncedQuery('');
    }
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Пошук товарів... (мінімум 3 символи)"
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isLoading && shouldSearch && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        {searchQuery && (
          <button
            onClick={handleClear}
            className="px-4 py-3 bg-red-400 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Очистити
          </button>
        )}
      </div>

      {/* при помилці */}
      {error && (
        <div className="mt-2 text-red-600 text-sm flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Помилка під час пошуку товарів. Спробуйте ще раз.
        </div>
      )}

      {/* результати пошуку */}
      {shouldSearch && searchResults && !isLoading && (
        <div className="mt-2 text-sm text-gray-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Знайдено {searchResults.data?.total || 0} товарів за запитом "{debouncedQuery}"
        </div>
      )}

      {/* нема результатів */}
      {shouldSearch && searchResults && searchResults.data?.total === 0 && !isLoading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Товарів не знайдено. Спробуйте інший запит.
        </div>
      )}

      {/* мінімум символів для початку query = 3 */}
      {searchQuery && searchQuery.length < 3 && (
        <div className="mt-2 text-sm text-gray-500">
          Введіть мінімум 3 символи для пошуку товарів.
        </div>
      )}
    </div>
  );
};

export default ProductSearch;