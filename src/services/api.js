import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const productAPI = {
  // Get all products with optional sorting
  getProducts: (limit = 20, skip = 0, sortBy = '', order = 'asc') => {
    const params = { limit, skip };
    
    // DummyJSON API supports sortBy and order parameters
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order;
    }
    
    return api.get('/products', { params })
      .then(response => ({
        ...response,
        data: {
          ...response.data,
          // Ensure consistent structure
          products: response.data.products || [],
          total: response.data.total || 0,
          skip: response.data.skip || skip,
          limit: response.data.limit || limit
        }
      }));
  },

  // Get single product
  getProduct: (id) => {
    if (!id) {
      return Promise.reject(new Error('Product ID is required'));
    }
    return api.get(`/products/${id}`);
  },

  // Search products
  searchProducts: (query, limit = 30, skip = 0) => {
    if (!query || query.length < 2) {
      return Promise.reject(new Error('Search query must be at least 2 characters'));
    }
    
    return api.get('/products/search', { 
      params: { 
        q: query.trim(), 
        limit, 
        skip 
      } 
    }).then(response => ({
      ...response,
      data: {
        ...response.data,
        products: response.data.products || [],
        total: response.data.total || 0,
        skip: response.data.skip || skip,
        limit: response.data.limit || limit
      }
    }));
  },

  // Get products by category
  getProductsByCategory: (category, limit = 20, skip = 0) => {
    if (!category) {
      return Promise.reject(new Error('Category is required'));
    }
    
    // URL encode the category to handle special characters and spaces
    const encodedCategory = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));
    
    return api.get(`/products/category/${encodedCategory}`, { 
      params: { limit, skip } 
    }).then(response => ({
      ...response,
      data: {
        ...response.data,
        products: response.data.products || [],
        total: response.data.total || 0,
        skip: response.data.skip || skip,
        limit: response.data.limit || limit
      }
    })).catch(error => {
      // If category endpoint fails, try searching for products with category filter
      console.warn(`Category endpoint failed for "${category}", trying alternative approach:`, error.message);
      
      // Fallback: get all products and filter by category client-side
      return api.get('/products', { params: { limit: 100 } })
        .then(response => {
          const filteredProducts = response.data.products.filter(product => 
            product.category?.toLowerCase().includes(category.toLowerCase()) ||
            product.category?.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
          );
          
          // Apply pagination to filtered results
          const paginatedProducts = filteredProducts.slice(skip, skip + limit);
          
          return {
            ...response,
            data: {
              products: paginatedProducts,
              total: filteredProducts.length,
              skip,
              limit
            }
          };
        });
    });
  },

  // Get all categories
  getCategories: () => {
    return api.get('/products/categories')
      .then(response => ({
        ...response,
        data: response.data || []
      }))
      .catch(error => {
        console.error('Failed to fetch categories:', error);
        // Fallback: extract categories from products
        return api.get('/products?limit=100').then(productsResponse => {
          const categories = [...new Set(productsResponse.data.products.map(p => p.category))];
          return {
            data: categories.filter(Boolean)
          };
        });
      });
  },

  // Create product (DummyJSON simulated)
  createProduct: (product) => {
    if (!product.title || !product.price) {
      return Promise.reject(new Error('Title and price are required'));
    }
    return api.post('/products/add', product);
  },

  // Update product (DummyJSON simulated)
  updateProduct: (id, product) => {
    if (!id) {
      return Promise.reject(new Error('Product ID is required'));
    }
    return api.put(`/products/${id}`, product);
  },

  // Delete product (DummyJSON simulated)
  deleteProduct: (id) => {
    if (!id) {
      return Promise.reject(new Error('Product ID is required'));
    }
    return api.delete(`/products/${id}`);
  },

  // Get products by price range (client-side filtering)
  getProductsByPriceRange: async (minPrice, maxPrice, limit = 20, skip = 0) => {
    try {
      // Get a larger set of products for filtering
      const response = await api.get('/products', { params: { limit: 100 } });
      
      const filteredProducts = response.data.products.filter(product => {
        const price = product.price;
        return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
      });
      
      // Apply pagination
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);
      
      return {
        ...response,
        data: {
          products: paginatedProducts,
          total: filteredProducts.length,
          skip,
          limit
        }
      };
    } catch (error) {
      console.error('Price range filtering failed:', error);
      return Promise.reject(error);
    }
  }
};

export default api;