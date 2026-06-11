import React, { useEffect, useRef, useState } from 'react';
import { NexusEngine } from './NexusEngine';

const BackgroundNexus = () => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      setIsMobile(window.innerWidth <= 1024 || (window.innerWidth <= 1366 && isTouch));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new NexusEngine(canvas, isMobileRef);
    engine.start();

    return () => {
      engine.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        transition: 'filter 0.4s ease, -webkit-filter 0.4s ease',
      }}
    />
  );
};

export default BackgroundNexus;
