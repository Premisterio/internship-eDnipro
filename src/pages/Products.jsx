import React, { useState, useCallback } from 'react';
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

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const itemsPerPage = 20;
  const skip = (currentPage - 1) * itemsPerPage;
  const productsByCategory = useProductsByCategory(selectedCategory, itemsPerPage, skip);
  const allProducts = useProducts(itemsPerPage, skip, sortBy, order);
  const productsData = selectedCategory ? productsByCategory : allProducts;
  const isLoading = selectedCategory ? productsByCategory.isLoading : allProducts.isLoading;
  const error = selectedCategory ? productsByCategory.error : allProducts.error;
  const deleteProductMutation = useDeleteProduct();

  // 
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
    setIsSearchActive(true);
    setCurrentPage(1);
  }, []);

  // очистити пошук
  const handleClearSearch = useCallback(() => {
    setSearchResults(null);
    setIsSearchActive(false);
    setCurrentPage(1);
  }, []);

  // сортування
  const handleSortChange = useCallback((newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1);
  }, []);

  // не працює
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    handleClearSearch();
  }, [handleClearSearch]);

  // пагінація
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // видалити продукт
  const handleDeleteProduct = useCallback(async (productId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей продукт?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        alert('Продукт успішно видалено!');
      } catch (error) {
        alert(`Помилка при видаленні продукту. Спробуйте ще раз: ${error.message}`);
      }
    }
  }, [deleteProductMutation]);

  // placeholder
  const handleEditProduct = useCallback((product) => {
    console.log('Редагувати товар:', product);
    alert('Не імплементовано.');
  }, []);

  const displayProducts = isSearchActive ? searchResults : productsData?.data?.products;
  const totalProducts = isSearchActive ? searchResults?.length || 0 : productsData?.data?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Всі товари</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Сталась помилка при завантаженні товарів. Спробуйте пізніше: {error.message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Всі товари</h1>
          <p className="text-gray-600">
            Ознайомтеся з нашим широким асортиментом товарів з розширеним пошуком та фільтрами (які не працюють)
          </p>
        </div>

        {/* Пошук */}
        <ProductSearch
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
        />

        {/* Фільтри та сортування (не працює) */}
        <div className="mb-8 space-y-6">
          <ProductFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {!isSearchActive && (
            <ProductSort
              sortBy={sortBy}
              order={order}
              onSortChange={handleSortChange}
            />
          )}
        </div>

        <ProductGrid
          products={displayProducts}
          isLoading={isLoading}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
        />

        {!isSearchActive && (
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