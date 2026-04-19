import React, { useState } from 'react';
import './Order.css';

function Order({ cart, setCart, user, setPage }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Delete recommendation log on Back to Cart
  const handleBackToCart = async () => {
    const logId = localStorage.getItem('recommendation_log_id');
    // If no log id, just go back
    if (!logId) {
      setPage('cart');
      return;
    }

    try {
      // Call backend DELETE endpoint (option A: delete entire row)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/recommendation-log/${logId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user?.id || null }),
        }
      );

      // optional: inspect response for success/failure
      // const data = await res.json();
    } catch (err) {
      console.error('Failed to delete recommendation log:', err);
      // proceed anyway to avoid blocking UX
    } finally {
      // Remove local log id and go back to cart
      localStorage.removeItem('recommendation_log_id');
      setPage('cart');
    }
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    setMessage('Pls Wait Placing Your Order....');

    if (!user) {
      alert('please login first');
      setLoading(false);
      return;
    }

    const logId = localStorage.getItem('recommendation_log_id') || null;

    fetch(`${import.meta.env.VITE_API_URL}/place-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        email: user.email,
        items: cart,
        total: totalPrice,
        log_id: logId,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.message) {
          setMessage(data.message);
        } else {
          setMessage('Order placed successfully');
        }

        if (logId) {
          localStorage.removeItem('recommendation_log_id');
        }

        setTimeout(() => {
          setLoading(false);
          setCart([]);
          setPage('success');
        }, 1000);
      })
      .catch(err => {
        console.error('Place order error:', err);
        setMessage('Order failed');
        setLoading(false);
      });
  };

  return (
    <div className="order_container">
      <h2>Checkout</h2>

      {message && <div className="order_message">{message}</div>}

      <div className="order_items">
        {cart.map((item, index) => (
          <div className="order_item" key={index}>
            <span>{item.name}</span>
            <span>
              ₹{item.price} × {item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="order_total">
        <h3>Total: ₹{totalPrice}</h3>
      </div>

      <button className="back_btn" onClick={handleBackToCart}>
        ← Back to Cart
      </button>

      <button
        className="place_order_btn"
        onClick={handlePlaceOrder}
        disabled={loading || cart.length === 0}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}

export default Order;
