import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Максимальна кількість видимих сторінок
    
    // Написано з Claude
    if (totalPages <= maxVisiblePages) {
      // Якщо загальна кількість сторінок менша або дорівнює максимальній, показуємо всі
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Завжди показуємо першу сторінку
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Якщо поточна сторінка близько до початку
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      }
      
      // Якщо поточна сторінка близько до кінця
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }
      
      // Додаємо ... після першої сторінки
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Додаємо середні сторінки
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Додаємо ... перед останньою сторінкою
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Завжди показуємо останню сторінку
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
      
      <div className="text-sm text-gray-700">
        Показано {startItem}-{endItem} з {totalItems} товарів
      </div>

      {/* керування пагінацією */}
      <div className="flex items-center space-x-2">
        {/* назад */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={`${page}-${index}`}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* далі */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Далі
        </button>
      </div>
    </div>
  );
};

export default Pagination;