import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../services/api';

// Створено з Claude

// Query keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  SEARCH: 'search',
  FILTERED_PRODUCTS: 'filtered_products',
};

// Get products with pagination and sorting
export const useProducts = (limit = 20, skip = 0, sortBy = '', order = 'asc') => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, limit, skip, sortBy, order],
    queryFn: () => productAPI.getProducts(limit, skip, sortBy, order),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true, // For pagination
  });
};

// Get filtered products (новий хук для фільтрації)
export const useFilteredProducts = (filters = {}, limit = 20, skip = 0, sortBy = '', order = 'asc') => {
  // Створюємо унікальний ключ на основі всіх параметрів
  const filterKey = JSON.stringify(filters);
  
  return useQuery({
    queryKey: [QUERY_KEYS.FILTERED_PRODUCTS, filterKey, limit, skip, sortBy, order],
    queryFn: () => {
      // Якщо є фільтри, використовуємо відповідний API ендпоінт
      if (filters.category) {
        return productAPI.getProductsByCategory(filters.category, limit, skip);
      }
      if (filters.minPrice || filters.maxPrice) {
        return productAPI.getProductsByPriceRange(filters.minPrice, filters.maxPrice, limit, skip);
      }
      // Якщо немає фільтрів, повертаємо всі товари
      return productAPI.getProducts(limit, skip, sortBy, order);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => productAPI.getProduct(id),
    enabled: !!id,
  });
};

// Search products
export const useSearchProducts = (query, limit = 5, skip = 0) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH, query, limit, skip],
    queryFn: () => productAPI.searchProducts(query, limit, skip),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  });
};

// Get products by category
export const useProductsByCategory = (category, limit = 20, skip = 0) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'category', category, limit, skip],
    queryFn: () => productAPI.getProductsByCategory(category, limit, skip),
    enabled: !!category,
  });
};

// Get products by price range (для DummyJSON API)
export const useProductsByPriceRange = (minPrice, maxPrice, limit = 20, skip = 0) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'price', minPrice, maxPrice, limit, skip],
    queryFn: async () => {
      // DummyJSON не має прямого ендпоінту для фільтрації за ціною,
      // тому отримуємо всі товари і фільтруємо клієнтською стороною
      const allProducts = await productAPI.getProducts(100, 0); // Отримуємо більше товарів
      const filteredProducts = allProducts.products.filter(product => {
        const price = product.price;
        return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
      });
      
      // Емулюємо пагінацію
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);
      
      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        skip,
        limit
      };
    },
    enabled: !!(minPrice || maxPrice),
    staleTime: 5 * 60 * 1000,
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: productAPI.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Універсальний хук для комбінованих фільтрів
export const useProductsWithFilters = (options = {}) => {
  const {
    category,
    minPrice,
    maxPrice,
    searchQuery,
    limit = 20,
    skip = 0,
    sortBy = '',
    order = 'asc'
  } = options;

  // Створюємо унікальний ключ для кешування
  const cacheKey = [
    QUERY_KEYS.PRODUCTS,
    'filtered',
    category,
    minPrice,
    maxPrice,
    searchQuery,
    limit,
    skip,
    sortBy,
    order
  ];

  return useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      // Пріоритет: пошук > категорія > ціна > всі товари
      if (searchQuery && searchQuery.length > 2) {
        return productAPI.searchProducts(searchQuery, limit, skip);
      }
      
      if (category) {
        return productAPI.getProductsByCategory(category, limit, skip);
      }
      
      if (minPrice || maxPrice) {
        // Фільтрація за ціною (клієнтська сторона)
        const allProducts = await productAPI.getProducts(100, 0);
        const filteredProducts = allProducts.products.filter(product => {
          const price = product.price;
          return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
        });
        
        const paginatedProducts = filteredProducts.slice(skip, skip + limit);
        
        return {
          products: paginatedProducts,
          total: filteredProducts.length,
          skip,
          limit
        };
      }
      
      // Якщо немає фільтрів, повертаємо всі товари
      return productAPI.getProducts(limit, skip, sortBy, order);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Mutations for CRUD operations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCTS]);
      queryClient.invalidateQueries([QUERY_KEYS.FILTERED_PRODUCTS]);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, product }) => productAPI.updateProduct(id, product),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCTS]);
      queryClient.invalidateQueries([QUERY_KEYS.FILTERED_PRODUCTS]);
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCT, id]);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCTS]);
      queryClient.invalidateQueries([QUERY_KEYS.FILTERED_PRODUCTS]);
    },
  });
};