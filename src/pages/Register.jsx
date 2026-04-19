import React, { useState } from 'react';
import './Auth.css';

function Register({ setPage, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  //Send OTP
  const sendOtp = () => {
    if (!email) {
      setMessage('Enter email first');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);

        // 🔥 ONLY when OTP success
        if (data.message === 'OTP sent successfully') {
          setOtpSent(true);
        }
      })
      .catch(() => {
        setMessage('Error sending OTP');
      });
  };

  //Register (Verify OTP)
  const handleRegister = () => {
    setLoading(true);
    if (!name || !email || !password || !otp) {
      setMessage('Please fill all fields + OTP');
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, otp }),
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setMessage(data.message);

        if (data.message === 'Registration successful') {
          setTimeout(() => {
            setPage('login');
          }, 1500);
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
          <i className="bi bi-arrow-left"></i>
          <span>Home</span>
        </button>
        <h2>Register</h2>

        {/* MESSAGE UI */}
        {message && <div className="auth_message">{message}</div>}

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

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

        {/*Send OTP */}
        <button onClick={sendOtp}>Send OTP</button>

        {/*OTP Input */}
        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
        )}

        {/* Register */}
        <button onClick={handleRegister} disabled={loading}>
          {loading ? <span className="btn_loader"></span> : 'Register'}
        </button>

        <p>
          Already have an account?{' '}
          <span onClick={() => setPage('login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
