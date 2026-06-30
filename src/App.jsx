import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from './Components/Navigation/Navigation';
import { MainContent } from './Components/MainContent/MainContent';
import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './Components/PortfolioPage/PortfolioPage';
import './App.css';
import './GlobalStyles.scss';
import BackgroundNexus from './Components/BackgroundNexus/BackgroundNexus';
import { BrowserRouter as Router } from 'react-router-dom';

import whiteGlow from './images/white-glow.webp';

import { LoadingScreen } from './Components/LoadingScreen/LoadingScreen';

function App() {
  const isTabletOrMobile = () => window.innerWidth < 1024;
  const [isMobile, setIsMobile] = useState(isTabletOrMobile());
  const [isLoading, setIsLoading] = useState(true);
  const bgRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
 
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', checkMobile);
 
    const handleScroll = () => {
      if (window.innerWidth < 1024) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / (totalHeight || 1);

      if (bgRef.current) {
        let color;
        if (progress < 0.33) color = 'rgb(15, 23, 42)';
        else if (progress < 0.66) color = 'rgb(12, 27, 61)';
        else color = 'rgb(26, 26, 46)';
        bgRef.current.style.backgroundColor = color;
      }

      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translateY(${progress * 200}px) translateZ(0)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translateY(${-progress * 200}px) translateZ(0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router basename='/'>
      <LoadingScreen isLoaded={!isLoading} />

      {/* Layer 0: Solid background — behind everything including the canvas */}
      <div
        ref={bgRef}
        style={{
          position: 'fixed',
          top: '-10vh',
          bottom: '-10vh',
          left: '-10vw',
          right: '-10vw',
          backgroundColor: 'rgb(15, 23, 42)',
          transition: 'background-color 1000ms ease-in-out',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 1: Atmospheric blur blobs (Zero-cost Alpha Masked WebP) */}
      <div
        style={{
          position: 'fixed',
          top: '-10vh',
          bottom: '-10vh',
          left: '-10vw',
          right: '-10vw',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: isMobile ? 0.35 : 0.45,
          zIndex: 1,
        }}
      >
        <div
          ref={blob1Ref}
          style={{
            position: 'absolute',
            top: '-80%',
            left: '-70%',
            width: '150%',
            height: '150%',
            backgroundColor: '#2563eb',
            WebkitMaskImage: `url(${whiteGlow})`,
            WebkitMaskSize: 'contain',
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `url(${whiteGlow})`,
            maskSize: '100% 100%',
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />
        <div
          ref={blob2Ref}
          style={{
            position: 'absolute',
            bottom: '-80%',
            right: '-70%',
            width: '150%',
            height: '150%',
            backgroundColor: '#9333ea',
            WebkitMaskImage: `url(${whiteGlow})`,
            WebkitMaskSize: 'contain',
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `url(${whiteGlow})`,
            maskSize: '100% 100%',
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            willChange: 'transform',
            transform: 'translateZ(0)',
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
          <Route path="/" element={<MainContent />} />
          <Route path='/portfolio' element={<PortfolioPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
