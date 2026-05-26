import React, { useEffect, useRef, useState } from 'react';

const BackgroundNexus = () => {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      if (window.innerWidth <= 768) return; // Disable scroll calculation on mobile
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / (totalHeight || 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getBackgroundColor = () => {
    if (scrollProgress < 0.2) return '#100028';
    if (scrollProgress < 0.4) return '#0c1b3d';
    if (scrollProgress < 0.6) return '#1a1a2e';
    if (scrollProgress < 0.8) return '#0f172a';
    return '#160a2b';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    let particleCount = 150;
    const connectionDistance = 180;
    const triangleDistance = 110;
    const mouse = { x: -2000, y: -2000, viewportY: -2000, radius: 250 };

    class Particle {
      constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseSize = Math.random() * 1.5 + 0.8;
        this.size = this.baseSize;
      }

      update(width, height, currentMouseY) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        const dx = mouse.x - this.x;
        const dy = currentMouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.size = this.baseSize + (force * 2.5);
        } else {
          this.size = this.baseSize;
        }
      }

      draw(context, currentMouseY) {
        const dx = mouse.x - this.x;
        const dy = currentMouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        if (distance < mouse.radius) {
          const glowAlpha = (1 - distance / mouse.radius);
          context.shadowBlur = 15 * glowAlpha;
          context.shadowColor = '#60a5fa';
          context.fillStyle = `rgba(147, 197, 253, ${0.4 + (glowAlpha * 0.6)})`;
        } else {
          context.fillStyle = 'rgba(59, 130, 246, 0.4)';
        }

        context.fill();
        context.restore();
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const effectiveDpr = Math.min(dpr, 2);

      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * effectiveDpr;
      canvas.height = height * effectiveDpr;

      ctx.scale(effectiveDpr, effectiveDpr);

      const isMob = width <= 768;
      const densityFactor = (width * height) / (1920 * 1080);
      particleCount = isMob ? 30 : Math.floor(180 * densityFactor);
      particleCount = Math.max(isMob ? 20 : 50, Math.min(particleCount, 250));

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      const currentMouseY = mouse.viewportY;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.update(width, height, currentMouseY);
        p.draw(ctx, currentMouseY);

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2;
            const mdx = mouse.x - midX;
            const mdy = currentMouseY - midY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            ctx.beginPath();
            let opacity = 0.18 * (1 - dist / connectionDistance);

            if (mDist < mouse.radius) {
              opacity += (1 - mDist / mouse.radius) * 0.25;
              ctx.lineWidth = 1.2;
              ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
            } else {
              ctx.lineWidth = 0.6;
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            }

            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (dist < triangleDistance) {
              for (let k = j + 1; k < particles.length; k++) {
                const p3 = particles[k];
                const dx2 = p2.x - p3.x;
                const dy2 = p2.y - p3.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                const dx3 = p.x - p3.x;
                const dy3 = p.y - p3.y;
                const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                if (dist2 < triangleDistance && dist3 < triangleDistance) {
                  ctx.beginPath();
                  const triOpacity = 0.04 * (1 - dist / triangleDistance);
                  ctx.fillStyle = `rgba(59, 130, 246, ${triOpacity})`;
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.lineTo(p3.x, p3.y);
                  ctx.fill();
                }
              }
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.viewportY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.viewportY = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
        WebkitFilter: isMobile ? 'none' : 'blur(0.15px)',
        filter: isMobile ? 'none' : 'blur(0.15px)',
      }}
    />
  );
};

export default BackgroundNexus;
