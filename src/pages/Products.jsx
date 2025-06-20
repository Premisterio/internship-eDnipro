import React, { useState, useCallback, useMemo } from 'react';
import { 
  useProducts, 
  useProductsByCategory, 
  useDeleteProduct 
} from '../hooks/useProducts';
import ProductGrid from '../components/Product/ProductGrid';
import ProductSearch from '../components/Product/ProductSearch';
import ProductSort from '../components/Product/ProductSort';
import ProductFilter from '../components/Product/ProductFilter';
import Pagination from '../components/Product/Pagination';

// Written by Claude AI
const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const itemsPerPage = 20;
  const skip = (currentPage - 1) * itemsPerPage;

  // Fetch data based on current filters
  const allProductsQuery = useProducts(itemsPerPage, skip, sortBy, order);
  const categoryProductsQuery = useProductsByCategory(selectedCategory, itemsPerPage, skip);
  const deleteProductMutation = useDeleteProduct();

  // Choose the right query based on current state
  const activeQuery = selectedCategory ? categoryProductsQuery : allProductsQuery;
  const { data: productsData, isLoading, error } = activeQuery;

  // Handle search results
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
    setIsSearchActive(true);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchResults(null);
    setIsSearchActive(false);
    setCurrentPage(1); // Reset to first page when clearing search
  }, []);

  // Handle sorting - only works when not searching
  const handleSortChange = useCallback((newSortBy, newOrder) => {
    if (!isSearchActive) {
      setSortBy(newSortBy);
      setOrder(newOrder);
      setCurrentPage(1); // Reset to first page when sorting
    }
  }, [isSearchActive]);

  // Handle category filtering
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
    handleClearSearch(); // Clear any active search
  }, [handleClearSearch]);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Delete product
  const handleDeleteProduct = useCallback(async (productId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей продукт?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        alert('Продукт успішно видалено!');
      } catch (error) {
        console.error('Delete error:', error);
        alert(`Помилка при видаленні продукту: ${error.message}`);
      }
    }
  }, [deleteProductMutation]);

  // Edit product placeholder
  const handleEditProduct = useCallback((product) => {
    console.log('Редагувати товар:', product);
    alert('Функція редагування буде додана пізніше.');
  }, []);

  // Client-side sorting for search results
  const sortedSearchResults = useMemo(() => {
    if (!searchResults || !sortBy) return searchResults;
    
    const sorted = [...searchResults].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle string sorting
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  }, [searchResults, sortBy, order]);

  // Paginate search results
  const paginatedSearchResults = useMemo(() => {
    if (!sortedSearchResults) return null;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedSearchResults.slice(startIndex, endIndex);
  }, [sortedSearchResults, currentPage, itemsPerPage]);

  // Determine what to display
  const displayProducts = isSearchActive ? paginatedSearchResults : productsData?.data?.products;
  const totalProducts = isSearchActive 
    ? (sortedSearchResults?.length || 0) 
    : (productsData?.data?.total || 0);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Всі товари</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Сталась помилка при завантаженні товарів: {error.message}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Спробувати знову
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Всі товари</h1>
          <p className="text-gray-600">
            Ознайомтеся з нашим широким асортиментом товарів
          </p>
          {isSearchActive && (
            <div className="mt-2 text-sm text-blue-600">
              Показані результати пошуку ({totalProducts} товарів)
            </div>
          )}
        </div>

        {/* Search */}
        <ProductSearch
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
        />

        {/* Filters and Sorting */}
        <div className="mb-8 space-y-6">
          <ProductFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            disabled={isSearchActive}
          />
          
          <ProductSort
            sortBy={sortBy}
            order={order}
            onSortChange={handleSortChange}
            disabled={false} // Allow sorting even during search
          />
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={displayProducts}
          isLoading={isLoading}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProducts}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Products;