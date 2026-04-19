import React from 'react';
import './Footer.css';

function Footer({ goToHome }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-section">
          <h2 className="logo">
            <img
              src="/images/logo.jpg"
              alt="Glosory Logo"
              className="logo_img"
              onClick={goToHome}
              style={{ cursor: 'pointer' }}
            />
          </h2>
          <p>Thanks For Visiting</p>

          <p>
            <i
              class="bi bi-geo-alt-fill"
              style={{ color: '#ccc', fontSize: '20px' }}
            ></i>{' '}
            Address: Bilaspur, C.G. India
          </p>
          <p>
            <i
              class="bi bi-telephone-fill"
              style={{ color: 'green', fontSize: '20px' }}
            ></i>{' '}
            Call Us: (+91) 540-025-124553
          </p>
          <p>
            <i
              class="bi bi-envelope-at-fill"
              style={{ color: 'blueviolet', fontSize: '20px' }}
            ></i>{' '}
            Email: sale@glosory.com
          </p>
          <p>
            <i
              class="bi bi-stopwatch"
              style={{ color: 'red', fontSize: '20px' }}
            ></i>
            Hours: 10:00 - 18:00, Mon - Sat
          </p>
        </div>

        {/* Links Section */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Delivery Information</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Corporate</h3>
          <ul>
            <li>About Us</li>
            <li>Delivery Information</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Careers</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Popular</h3>
          <ul>
            <li>About Us</li>
            <li>Delivery Information</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Support Center</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Glosory. All rights reserved.</p>
        <div className="social">
          <span>
            <i
              class="bi bi-globe2"
              style={{ color: 'green', fontSize: '20px' }}
            ></i>
          </span>
          <span>
            <i
              class="bi bi-facebook"
              style={{ color: 'blue', fontSize: '20px' }}
            ></i>
          </span>
          <span>
            <i
              class="bi bi-youtube"
              style={{ color: 'red', fontSize: '20px' }}
            ></i>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
