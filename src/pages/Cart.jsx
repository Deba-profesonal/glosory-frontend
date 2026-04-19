import React, { useEffect, useState } from 'react';
import './Cart.css';

function Cart({ cart, setCart, goToHome, removeFromCart, setPage, user }) {
  // 🔹 Total Price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Recommendation state
  const [recommendedItems, setRecommendedItems] = useState([]);
  // Track last clicked recommended item id (or name) for logging
  const [lastClickedRecommendedId, setLastClickedRecommendedId] =
    useState(null);
  // Loading state for checkout logging
  const [loggingCheckout, setLoggingCheckout] = useState(false);

  useEffect(() => {
    if (cart.length === 0) return;

    const cartItems = cart.map(item => item.name.toLowerCase());

    fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems }),
    })
      .then(res => res.json())
      .then(data => {
        // If your backend returns { recommendations, log_id } adjust accordingly.
        // Here we assume it returns an array of product objects.
        setRecommendedItems(data);
      })
      .catch(err => console.error('Recommend fetch error:', err));
  }, [cart]);

  //  Quantity
  const increaseQty = index => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  const decreaseQty = index => {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }

    setCart(updatedCart);
  };

  // Helper: return cart item names only for logging
  const cartNamesForLog = cartArr => cartArr.map(i => i.name);

  // Helper: return recommended item names only for logging
  const recommendedNamesForLog = () => recommendedItems.map(p => p.name);

  // Called when user clicks Add to Cart on a recommended item
  const handleAddRecommendedToCart = item => {
    // mark this recommended item as clicked for logging (store name)
    setLastClickedRecommendedId(item.name);

    // add to cart (same logic as your existing inline handler)
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      const updatedCart = cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Proceed to Checkout handler: log checkout-start then navigate
  const handleProceedToCheckout = () => {
    if (!user) {
      setPage('login');
      return;
    }

    // Build names-only payload
    const payload = {
      user_id: user.id || null,
      cart_items: cartNamesForLog(cart), // ["Apples","Yogurt"]
      recommended_items: recommendedNamesForLog(), // ["Apples","Bananas","Yogurt"]
      clicked_item: lastClickedRecommendedId || null, // product name or null
    };

    setLoggingCheckout(true);

    fetch(`${import.meta.env.VITE_API_URL}/log-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        // Expecting { message, log_id }
        if (data && data.log_id) {
          localStorage.setItem('recommendation_log_id', data.log_id);
        }
        // proceed to order page
        setPage('order');
      })
      .catch(err => {
        console.error('Failed to log recommendation:', err);
        // proceed anyway — logging should not block checkout
        setPage('order');
      })
      .finally(() => setLoggingCheckout(false));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      {/* EMPTY CART UI */}
      {cart.length === 0 ? (
        <div className="empty_cart">
          <h2>Your Cart is Empty 🛒</h2>
          <p>Add items to start shopping.</p>

          <button className="continue_btn" onClick={goToHome}>
            <i className="bi bi-arrow-left arrow"></i>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <h2>Your Cart</h2>
          {/* Cart Items */}
          {cart.map((item, index) => (
            <div className="cart_item" key={index}>
              <img
                src={item.image}
                alt={item.name}
                onError={e => (e.target.src = '/images/default.webp')}
              />

              <div className="cart_details">
                <h4>
                  {item.name
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </h4>

                <p>{item.description}</p>

                <div className="price_box">
                  {item.original_price && (
                    <span className="old_price">₹{item.original_price}</span>
                  )}
                  <span className="new_price">₹{item.price}</span>
                </div>

                <div className="total_item_price">
                  ₹{item.price} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </div>

                <div className="qty_box">
                  <button onClick={() => decreaseQty(index)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(index)}>+</button>
                </div>
              </div>

              <button
                className="remove_btn"
                onClick={() => removeFromCart(index)}
              >
                Remove
              </button>
            </div>
          ))}

          {/*Recommendations */}
          <div className="recommend_section">
            <h3 className="recommend_title">Recommended for you</h3>

            <div className="recommend_container">
              {recommendedItems.length === 0 ? (
                <p>No recommendations</p>
              ) : (
                recommendedItems.map(item => (
                  <div className="recommend_card" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={e => (e.target.src = '/images/default.webp')}
                    />
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddRecommendedToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/*Summary */}
          <div className="cart_summary">
            <h3 className="summary_title">Price Details</h3>

            <div className="summary_row">
              <span>
                Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="summary_row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>

            <hr />

            <div className="summary_total">
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              className="checkout_btn"
              disabled={cart.length === 0 || loggingCheckout}
              onClick={handleProceedToCheckout}
            >
              <span>
                {loggingCheckout
                  ? 'Preparing checkout...'
                  : 'Proceed to Checkout'}
                <i className="bi bi-arrow-right arrow"></i>
              </span>
            </button>

            <button className="continue_btn" onClick={goToHome}>
              <i className="bi bi-arrow-left arrow"></i>
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
