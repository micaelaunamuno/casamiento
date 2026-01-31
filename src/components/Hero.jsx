import React, { useState, useEffect } from 'react';
import './Hero.css';
import heroBg from '../assets/hero-bg.png';
import photo1 from '../assets/20250621_164620.jpg';
import photo2 from '../assets/20250720_154659.jpg';
import photo3 from '../assets/20250809_232617.jpg';
import photo4 from '../assets/IMG-20260101-WA0090.jpg';

const images = [heroBg, photo1, photo2, photo3, photo4];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {images.map((img, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentImage ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
      <div className="hero-content fade-in">
        <h1 className="names">Micky & Zurdo</h1>
        <p className="date">30 de Mayo</p>
        <p className="location">Puerto Salguero, CABA</p>
      </div>
    </section>
  );
};

export default Hero;
