import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Order from './pages/Order.jsx';
import Success from './pages/Success.jsx';
import Orders from './pages/Orders.jsx';
import Evaluation from './pages/Evaluation.jsx';

function App() {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState('home');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

  const addToCart = (item, qty = 1) => {
    const existing = cart.find(i => i.id === item.id);

    if (existing) {
      const updatedCart = cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }
  };
  const removeFromCart = index => {
    const updateCart = cart.filter((_, i) => i !== index);
    setCart(updateCart);
  };
  const isAuthPage = page === 'login' || page === 'register';
  return (
    <>
      {/* Hide Header on login/register */}
      {!isAuthPage && (
        <Header
          cartCount={cart.length}
          goToCart={() => setPage('cart')}
          goToHome={() => {
            setPage('home');
            setSearch('');
            setSearchInput('');
          }}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearch={setSearch}
          setPage={setPage}
          user={user}
          logout={() => {
            setUser(null);
            setPage('home');
          }}
          page={page}
        />
      )}

      {/* Pages */}
      {page === 'evaluation' && user && <Evaluation />}
      {page === 'orders' && <Orders user={user} />}
      {page === 'success' && <Success setPage={setPage} />}
      {page === 'order' && (
        <Order cart={cart} setCart={setCart} user={user} setPage={setPage} />
      )}
      {page === 'register' && <Register setPage={setPage} setUser={setUser} />}
      {page === 'login' && <Login setPage={setPage} setUser={setUser} />}
      {page === 'home' && <Home addToCart={addToCart} search={search} />}
      {page === 'cart' && (
        <Cart
          cart={cart}
          setCart={setCart}
          goToHome={() => setPage('home')}
          removeFromCart={removeFromCart}
          setPage={setPage}
          user={user}
        />
      )}
      {page === 'about' && <About />}

      {/*  Hide Footer on login/register */}
      {!isAuthPage && (
        <Footer
          goToHome={() => {
            setPage('home');
            setSearch('');
            setSearchInput('');
            window.scrollTo(0, 0);
          }}
        />
      )}
    </>
  );
}

export default App;
