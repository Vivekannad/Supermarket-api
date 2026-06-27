import { Link } from "react-router-dom";

export function ProductCard({ product, onAddToCart }) {
  const outOfStock = product.product_stock === 0;
 
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden
                    hover:shadow-md transition group">
 
      {/* Image */}
      <Link to={`/products/${product.product_id}`} className="block">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          {product.product_image ? (
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
              🛒
            </div>
          )}
        </div>
      </Link>
 
      {/* Info */}
      <div className="p-4">
        {/* Categories */}
        {product.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.map((cat, i) => (
              <span
                key={i}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
 
        {/* Name */}
        <Link to={`/products/${product.product_id}`}>
          <h3 className="text-sm font-medium text-gray-900 hover:underline line-clamp-2 mb-1">
            {product.product_name}
          </h3>
        </Link>
 
        {/* Price + stock */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-gray-900">
            Rs. {product.product_price?.toLocaleString()}
          </span>
          {outOfStock && (
            <span className="text-xs text-red-500">Out of stock</span>
          )}
        </div>
 
        {/* Add to cart */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={outOfStock}
          className="mt-3 w-full py-2 text-sm font-medium border border-gray-900 text-gray-900
                     rounded-lg hover:bg-gray-900 hover:text-white transition
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}