import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about">
      {/* Hero Section */}
      <div className="about_hero">
        <h1>Welcome to Glosory</h1>
        <p>Your Smart Grocery Shopping Partner</p>
      </div>

      {/* About Content */}
      <div className="about_content">
        <div className="about_text">
          <h2>Who We Are</h2>
          <p>
            Glosory is an online grocery platform that makes shopping easy and
            fast. We provide smart recommendations based on your cart items.
          </p>
        </div>

        <div className="about_text">
          <h2>Why Choose Us</h2>
          <ul>
            <li>Fast and simple shopping</li>
            <li>Smart product suggestions</li>
            <li>Clean and user-friendly design</li>
          </ul>
        </div>

        <div className="about_text">
          <h2>Our Mission</h2>
          <p>
            To simplify grocery shopping using technology and intelligent
            systems.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
