import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const {
    id,
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
  } = product;

  const discountedPrice = price - (price * discountPercentage) / 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category & Brand */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-xs text-gray-500">{brand}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 flex-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Rating & Stock */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
          <span className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-green-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
              -{discountPercentage.toFixed(0)}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/products/${id}`}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center text-sm"
          >
            Деталі
          </Link>
          <button
            onClick={() => onEdit?.(product)}
            className="hover:cursor-not-allowed bg-yellow-500 text-white py-2 px-3 rounded hover:bg-yellow-600 transition-colors text-sm"
          >
            Ред.
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition-colors text-sm"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;