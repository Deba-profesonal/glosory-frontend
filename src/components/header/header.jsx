import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

function Header({
  cartCount,
  goToCart,
  goToHome,
  searchInput,
  setSearchInput,
  setSearch,
  setPage,
  user,
  logout,
  page,
}) {
  // Check if auth page
  const isAuthPage = page === 'login' || page === 'register';
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="navbar">
        {/* Logo */}
        <img
          src="/images/logo.jpg"
          alt="Glosory Logo"
          className="logo_img"
          onClick={goToHome}
        />

        {/* Search */}
        {!isAuthPage && (
          <div className="search_box">
            <input
              className="input_box"
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setSearch(searchInput);
                  setSearchInput('');
                }
              }}
            />

            <span
              className="search_icon"
              onClick={() => {
                setSearch(searchInput);
                setSearchInput('');
              }}
            >
              <i className="bi bi-search"></i>
            </span>
          </div>
        )}

        {/* Icons */}
        {!isAuthPage && (
          <div className="icon_group">
            {user && (
              <span
                className="icon_item"
                onClick={() => setPage('evaluation')}
                title="Evaluation"
              >
                <i className="bi bi-bar-chart"></i>
              </span>
            )}
            {/* Wishlist */}
            <span className="icon_item">
              <i className="bi bi-heart"></i>
            </span>

            {/* Cart */}
            <span className="icon_item cart_icon" onClick={goToCart}>
              <i className="bi bi-cart3"></i>
              <span className="cart_badge">{cartCount}</span>
            </span>

            {/* User */}
            {user ? (
              <div className="user_menu" ref={menuRef}>
                <div
                  className="user_icon_box"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <i className="bi bi-person-circle"></i>
                </div>

                {showMenu && (
                  <div className="user_dropdown_menu">
                    <div className="user_info">
                      <strong>{user.name}</strong>
                    </div>
                    <div>Profile</div>
                    <div
                      onClick={() => {
                        setPage('orders');
                        setShowMenu(false);
                      }}
                    >
                      My Orders
                    </div>
                    <div
                      onClick={() => {
                        setPage('cart');
                        setShowMenu(false);
                      }}
                    >
                      My Cart
                    </div>
                    <div>Whishlist</div>
                    <div>Settings</div>

                    <div onClick={logout}>Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <span className="login_clean" onClick={() => setPage('login')}>
                Login
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hide menu on login/register */}
      {!isAuthPage && (
        <div className="menu_bar">
          <span onClick={goToHome}>Home</span>
          <span onClick={() => setPage('about')}>About</span>
          <span>Vendor</span>
          <span>Blogs</span>
        </div>
      )}
    </>
  );
}

export default Header;
