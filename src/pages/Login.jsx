import React, { useState } from 'react';
import './Auth.css';

function Login({ setPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // validation
    setLoading(true);
    if (!email || !password) {
      setMessage('Please fill all fields');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setMessage(data.message);

        if (data.message === 'Login successful') {
          setTimeout(() => {
            setUser({ id: data.user_id, name: data.name, email: data.email });
            setPage('home');
          }, 1000);
        }
      })
      .catch(() => {
        setLoading(false);
        setMessage('Server error');
      });
  };

  return (
    <div className="auth_container">
      <div className="auth_card">
        <button className="back_btn" onClick={() => setPage('home')}>
          <i className="bi bi-arrow-left"></i> <span>Home</span>
        </button>
        <h2>Login</h2>

        {/*MESSAGE UI */}
        {message && <div className="auth_message">{message}</div>}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? <span className="btn_loader"></span> : 'Login'}
        </button>

        <p>
          Don’t have an account?{' '}
          <span onClick={() => setPage('register')}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
