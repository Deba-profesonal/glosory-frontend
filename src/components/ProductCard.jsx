import React, { useState } from 'react';
import './Product.css';

function ProductCard({ product, addToCart }) {
  const [qty, setQty] = useState(1);

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : 0;

  return (
    <div className="product_card">
      <img
        src={product.image}
        alt={product.name}
        onError={e => (e.target.src = '/images/default.webp')}
      />

      <h3>
        {product.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </h3>

      {/* Description */}
      <p className="desc">{product.description}</p>

      {/* Price */}
      <div className="price_section">
        <span className="price">₹{product.price}</span>

        {product.original_price && (
          <>
            <span className="old_price">₹{product.original_price}</span>
            <span className="discount">{discount}% OFF</span>
          </>
        )}
      </div>

      {/* Quantity */}
      <div className="qty_section">
        <label>Qty</label>
        <select value={qty} onChange={e => setQty(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Add to cart */}
      <button onClick={() => addToCart(product, qty)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
