import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct, useDeleteProduct } from '../hooks/useProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading, error } = useProduct(id);
  const deleteProductMutation = useDeleteProduct();

  const product = productData?.data;

  const handleDelete = async () => {
    if (window.confirm('Бажаєте видалити цей продукт?')) {
      try {
        await deleteProductMutation.mutateAsync(id);
        alert('Товар успішно видалено!');
        navigate('/products');
      } catch (error) {
        alert(`Помилка при видаленні товару. Спробуйте ще раз: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      // loading placeholder створив Claude
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 mb-6 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
                <div className="bg-gray-200 h-8 w-1/3 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/products"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
          >
            ← Назад
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Товар не знайдено, або сталась помилка при завантаженні даних.
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        <Link
          to="/products"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          ← Назад до продуктів
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

            {/* Фото товару */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Альтернативні зображення */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

         
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {/* категорія */}
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {/* бренд */}
                <span className="text-gray-500">Бренд: {product.brand}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

              {/* Оцінка товару та ціна, створено з Claude */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? '' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating})</span>
                </div>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                        -{product.discountPercentage.toFixed(0)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Опис</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-500">Розміри</span>
                  <p className="text-gray-900">
                    {product.dimensions 
                      ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth}`
                      : 'Не вказано'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Гарантія</span>
                  <p className="text-gray-900">{product.warrantyInformation || 'Не вказано'}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  disabled={product.stock === 0}
                  onClick={() => alert('Кошик не імплементовано')}
                  className="hover:cursor-not-allowed flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {product.stock > 0 ? 'Додати до кошика' : 'Немає в наявності'}
                </button>
                <button
                  onClick={() => alert('Функція редагування відсутня')}
                  className="hover:cursor-not-allowed bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Редагувати
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Видалити
                </button>
              </div>

              {(product.shippingInformation || product.returnPolicy) && (
                <div className="border-t pt-6 space-y-3">
                  {product.shippingInformation && (
                    <div>
                      <h4 className="font-medium text-gray-900">Інформація про доставку</h4>
                      <p className="text-gray-600 text-sm">{product.shippingInformation}</p>
                    </div>
                  )}
                  {product.returnPolicy && (
                    <div>
                      <h4 className="font-medium text-gray-900">Політика повернення продукту</h4>
                      <p className="text-gray-600 text-sm">{product.returnPolicy}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Відгуки користувачів, створено з Claude */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Відгуки покупців</h2>
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{review.reviewerName}</span>
                      <div className="flex text-yellow-400 ml-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? '' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;