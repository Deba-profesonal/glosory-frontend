import React, { useEffect, useState } from 'react';
import './Orders.css';

function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/my-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="orders_container">
      <h2 className="orders_title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="no_orders">No orders found 😔</div>
      ) : (
        orders.map(order => (
          <div key={order.order_id} className="order_card">
            {/* HEADER */}
            <div className="order_header">
              <span>Order ID #{order.order_id}</span>
              <span>
                {new Date(order.date).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                })}
              </span>
            </div>

            {/* ITEMS */}
            <div className="order_items">
              {order.items.map((item, i) => (
                <div key={i} className="order_item">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="order_footer">
              <span>Total: ₹{order.total}</span>
              <div className="order_status">Delivered</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
