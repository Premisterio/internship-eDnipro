export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 10000,
  DEFAULT_LIMIT: 20,
};

export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5хв
export const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10хв

export const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'title', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'discountPercentage', label: 'Discount' },
];

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50];