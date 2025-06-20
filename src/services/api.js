import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const productAPI = {

  getProducts: (limit = 20, skip = 0, sortBy = '', order = 'asc') => {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order;
    }
    return api.get('/products', { params });
  },

  getProduct: (id) => api.get(`/products/${id}`),

  // пошук
  searchProducts: (query, limit = 5, skip = 0) => 
    api.get('/products/search', { 
      params: { q: query, limit, skip } 
    }),

  // пошук за категорією, можливо не працює
  getProductsByCategory: (category, limit = 20, skip = 0) =>
    api.get(`/products/category/${category}`, { 
      params: { limit, skip } 
    }),

  // отримання категорій (працює)
  getCategories: () => api.get('/products/categories'),
  createProduct: (product) => api.post('/products/add', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default api;