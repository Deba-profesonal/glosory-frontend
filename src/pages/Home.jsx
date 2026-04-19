import React, { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard.jsx';

function Home({ addToCart, search }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔥 FETCH API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    setError('');

    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('🚫 Server not connected');
        setLoading(false);
      });
  };

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div className="product_container">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div className="skeleton_card" key={i}>
              <div className="skeleton_img"></div>
              <div className="skeleton_text"></div>
              <div className="skeleton_text small"></div>
              <div className="skeleton_btn"></div>
            </div>
          ))}
      </div>
    );
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <div className="error_container">
        <div className="error_card">
          <div className="error_icon">⚠️</div>
          <h2>Connection Failed</h2>
          <p>Unable to connect to server. Please try again.</p>

          <button onClick={loadProducts}>🔄 Retry</button>
        </div>
      </div>
    );
  }

  // 🔥 SEARCH FILTER
  const filteredProducts = products.filter(item =>
    search ? item.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  // 🔥 NORMAL UI
  return (
    <div className="product_container">
      {filteredProducts.length === 0 ? (
        <div className="no_product">
          <h3>No Result Found for "{search}"</h3>
          <p>Try searching something else</p>
        </div>
      ) : (
        filteredProducts.map(item => (
          <ProductCard key={item.id} product={item} addToCart={addToCart} />
        ))
      )}
    </div>
  );
}

export default Home;
