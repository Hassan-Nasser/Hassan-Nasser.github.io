import React, { useState, useEffect } from 'react';
import { Navigation } from './Components/Navigation/Navigation';
import { Home } from './Components/Home/Home';
import { Routes, Route } from 'react-router-dom';
import Portfolio from './Components/Portfolio/Portfolio';
import './App.css';
import './GlobalStyles.scss';
import BackgroundNexus from './Components/BackgroundNexus/BackgroundNexus';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / (totalHeight || 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getBackgroundColor = () => {
    if (scrollProgress < 0.33) return 'rgb(15, 23, 42)';  // #0f172a
    if (scrollProgress < 0.66) return 'rgb(12, 27, 61)';  // #0c1b3d
    return 'rgb(26, 26, 46)';                              // #1a1a2e
  };

  return (
    <Router basename='/'>
      {/* Layer 0: Solid background — behind everything including the canvas */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: getBackgroundColor(),
          transition: 'background-color 1000ms ease-in-out',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 1: Atmospheric blur blobs */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.2,
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            backgroundColor: '#2563eb',
            WebkitFilter: 'blur(200px)',
            filter: 'blur(200px)',
            borderRadius: '50%',
            transition: 'transform 1000ms ease-out',
            transform: `translateY(${scrollProgress * 200}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '60%',
            backgroundColor: '#9333ea',
            WebkitFilter: 'blur(200px)',
            filter: 'blur(200px)',
            borderRadius: '50%',
            transition: 'transform 1000ms ease-out',
            transform: `translateY(${-scrollProgress * 200}px)`,
          }}
        />
      </div>

      {/* Layer 2: Canvas particle animation (zIndex: 2 set inside BackgroundNexus) */}
      <BackgroundNexus />

      {/* Layer 10+: All page content — transparent so layers below show through */}
      <div
        className="App"
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          backgroundColor: 'transparent',
        }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/portfolio' element={<Portfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
