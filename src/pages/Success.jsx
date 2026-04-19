import React from 'react';
import './Success.css';

function Success({ setPage }) {
  return (
    <div className="success_container">
      <div className="success_card">
        <div className="checkmark">✔</div>

        <h2>Order Placed Successfully 🎉</h2>

        <p>Your order has been confirmed and will be delivered soon.</p>

        <button className="success_btn primary" onClick={() => setPage('home')}>
          Continue Shopping
        </button>

        <button
          className="success_btn secondary"
          onClick={() => setPage('orders')}
        >
          View Orders
        </button>
      </div>
    </div>
  );
}

export default Success;
