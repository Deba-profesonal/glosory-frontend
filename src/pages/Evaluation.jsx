import React, { useEffect, useState } from 'react';
import './Evaluation.css';

function Evaluation() {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 popup state
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ load data
  useEffect(() => {
    fetchMetrics();
    fetchLogs();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/recommendation-eval/metrics`);
      const data = await res.json();
      setMetrics(data);
    } catch {
      setMetrics(null);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/recommendation-eval/logs`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE CONFIRM
  const confirmDelete = async () => {
    try {
      await fetch(`${API_BASE}/recommendation-log/${selectedDeleteId}`, {
        method: 'DELETE',
      });
    } catch {}

    setShowConfirm(false);
    setSelectedDeleteId(null);
    fetchLogs();
  };

  // ✅ SAFE PARSER
  const formatItems = items => {
    if (!items) return [];

    if (Array.isArray(items)) return items;

    try {
      const parsed = JSON.parse(items);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    return items.split(',').map(i => i.trim());
  };

  // ✅ TOP ITEMS LOGIC (SAFE)
  const getTopItems = () => {
    if (!logs || logs.length === 0) return [];

    const countMap = {};

    logs.forEach(log => {
      if (!log || !log.recommended_items) return;

      let items = formatItems(log.recommended_items);

      items.forEach(item => {
        const clean = item?.trim();

        if (clean) {
          countMap[clean] = (countMap[clean] || 0) + 1;
        }
      });
    });

    return Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  return (
    <div className="eval_container">
      <h2>📊 Recommendation Dashboard</h2>

      {/* KPI */}
      <div className="kpi_row">
        <div className="kpi_card">
          <span>Total Logs</span>
          <h3>{metrics?.total_logs ?? '--'}</h3>
        </div>

        <div className="kpi_card">
          <span>CTR</span>
          <h3>{metrics ? (metrics.ctr * 100).toFixed(1) + '%' : '--'}</h3>
        </div>

        <div className="kpi_card">
          <span>Conversion</span>
          <h3>
            {metrics ? (metrics.conversion_rate * 100).toFixed(1) + '%' : '--'}
          </h3>
        </div>
      </div>

      {/* 🔥 TOP ITEMS */}
      <div className="top_section">
        <h3>🔥 Top Recommended</h3>

        <div className="top_grid">
          {getTopItems().length > 0 ? (
            getTopItems().map((item, i) => (
              <div className="top_item_box" key={i}>
                <span className="item_name">{item.name}</span>
                <span className="item_count">{item.count}</span>
              </div>
            ))
          ) : (
            <p>No recommendations yet</p>
          )}
        </div>
      </div>

      {/* 🔥 LOG TABLE */}
      <div className="card">
        <h3>Logs</h3>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Cart</th>
                <th>Recommended</th>
                <th>Clicked</th>
                <th>Order</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7">No logs found</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.log_id}>
                    <td>{log.log_id}</td>
                    <td>{log.user_id}</td>

                    <td>{formatItems(log.cart_items).join(', ')}</td>

                    <td>{formatItems(log.recommended_items).join(', ')}</td>

                    <td>{log.clicked_item || '-'}</td>
                    <td>{log.order_id ? '✔' : '✖'}</td>

                    <td>
                      <button
                        onClick={() => {
                          setSelectedDeleteId(log.log_id);
                          setShowConfirm(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 DELETE POPUP */}
      {showConfirm && (
        <div className="confirm_overlay">
          <div className="confirm_box">
            <h4>Delete Log?</h4>
            <p>Are you sure you want to delete?</p>

            <div className="confirm_actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>

              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Evaluation;
