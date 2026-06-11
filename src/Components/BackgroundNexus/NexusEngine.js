import { NEXUS_CONFIG, mouseState } from './nexusConfig';
import { SpatialGrid } from './SpatialGrid';
import { Particle } from './Particle';
import whiteGlow from '../../images/white-glow.webp';

export class NexusEngine {
  constructor(canvas, isMobileRef) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.isMobileRef = isMobileRef;
    this.animationFrameId = null;
    this.particles = [];
    this.lastDrawTime = 0;
    this.currentFilter = '';

    this.connectionDistSq = NEXUS_CONFIG.connectionDistance * NEXUS_CONFIG.connectionDistance;
    this.triangleDistSq = NEXUS_CONFIG.triangleDistance * NEXUS_CONFIG.triangleDistance;
    this.mouseRadiusSq = mouseState.radius * mouseState.radius;

    this.glowSprite = document.createElement('canvas');
    this.INTERNAL_SPRITE_RES = 120;
    this.glowSprite.width = this.INTERNAL_SPRITE_RES;
    this.glowSprite.height = this.INTERNAL_SPRITE_RES;
    this.isSpriteReady = false;

    this.spatialGrid = null;

    this.loadSprite();
    this.bindEvents();
    this.init();
  }

  loadSprite() {
    const img = new Image();
    img.src = whiteGlow;
    img.onload = () => {
      const ctxSprite = this.glowSprite.getContext('2d');
      ctxSprite.drawImage(img, 0, 0, this.INTERNAL_SPRITE_RES, this.INTERNAL_SPRITE_RES);
      ctxSprite.globalCompositeOperation = 'source-in';
      ctxSprite.fillStyle = '#60a5fa';
      ctxSprite.fillRect(0, 0, this.INTERNAL_SPRITE_RES, this.INTERNAL_SPRITE_RES);
      this.isSpriteReady = true;
    };
  }

  init() {
    const dpr = window.devicePixelRatio || 1;
    const effectiveDpr = Math.min(dpr, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * effectiveDpr;
    this.canvas.height = height * effectiveDpr;
    this.ctx.scale(effectiveDpr, effectiveDpr);

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMob = width <= 1024 || (width <= 1366 && isTouch);
    const densityFactor = (width * height) / (1920 * 1080);
    let particleCount = isMob ? 30 : Math.floor(180 * densityFactor);
    particleCount = Math.max(isMob ? 20 : 50, Math.min(particleCount, 250));

    this.spatialGrid = new SpatialGrid(width, height, NEXUS_CONFIG.connectionDistance);

    if (this.particles.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(new Particle(width, height, i));
      }
    } else if (this.particles.length < particleCount) {
      for (let i = this.particles.length; i < particleCount; i++) {
        this.particles.push(new Particle(width, height, i));
      }
    } else if (this.particles.length > particleCount) {
      this.particles.splice(particleCount);
    }
  }

  animate = (timestamp) => {
    const now = timestamp || performance.now();
    const shouldBlur = window.scrollY > window.innerHeight * 0.5;

    if (this.isMobileRef.current) {
      const targetOpacity = shouldBlur ? '0.75' : '1';
      const targetScale = shouldBlur ? 'scale(1.08) translate3d(0,0,0)' : 'scale(1) translate3d(0,0,0)';

      if (this.canvas.style.opacity !== targetOpacity) {
        this.canvas.style.opacity = targetOpacity;
        this.canvas.style.transform = targetScale;
        this.canvas.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        this.canvas.style.willChange = 'opacity, transform';
      }

      if (this.currentFilter !== 'none') {
        this.currentFilter = 'none';
        this.canvas.style.filter = 'none';
        this.canvas.style.WebkitFilter = 'none';
      }
    } else {
      const targetFilter = shouldBlur ? 'blur(3px)' : 'blur(0.15px)';
      if (targetFilter !== this.currentFilter) {
        this.currentFilter = targetFilter;
        this.canvas.style.WebkitFilter = targetFilter;
        this.canvas.style.filter = targetFilter;
        this.canvas.style.transition = 'filter 0.4s ease, -webkit-filter 0.4s ease';
        this.canvas.style.opacity = '1';
        this.canvas.style.transform = 'translate3d(0,0,0)';
      }
    }

    const frameInterval = this.isMobileRef.current ? NEXUS_CONFIG.mobileFrameInterval : NEXUS_CONFIG.desktopFrameInterval;

    if (now - this.lastDrawTime < frameInterval) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      return;
    }

    let timeMultiplier = (now - this.lastDrawTime) / (1000 / 60);
    timeMultiplier = Math.min(timeMultiplier, 4);
    this.lastDrawTime = now;

    const currentMouseY = mouseState.viewportY;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.ctx.clearRect(0, 0, width, height);
    this.spatialGrid.clear();

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(width, height, currentMouseY, timeMultiplier);
      this.spatialGrid.insert(this.particles[i]);
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(this.ctx, currentMouseY, this.isSpriteReady, this.glowSprite);
    }

    this.drawConnections(currentMouseY);

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  drawConnections(currentMouseY) {
    const lineBuckets = {};
    const hoverLineBuckets = {};
    const triBuckets = {};

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const neighbors = this.spatialGrid.getNeighbors(p);

      for (let j = 0; j < neighbors.length; j++) {
        const p2 = neighbors[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < this.connectionDistSq) {
          const dist = Math.sqrt(distSq);
          const midX = (p.x + p2.x) / 2;
          const midY = (p.y + p2.y) / 2;
          const mdx = mouseState.x - midX;
          const mdy = currentMouseY - midY;
          const mDistSq = mdx * mdx + mdy * mdy;

          let baseOpacity = 0.18 * (1 - dist / NEXUS_CONFIG.connectionDistance);

          if (mDistSq < this.mouseRadiusSq) {
            const mDist = Math.sqrt(mDistSq);
            baseOpacity += (1 - mDist / mouseState.radius) * 0.25;
            const roundedOpacity = (Math.round(baseOpacity * 20) / 20).toFixed(2);
            if (!hoverLineBuckets[roundedOpacity]) hoverLineBuckets[roundedOpacity] = [];
            hoverLineBuckets[roundedOpacity].push(p.x, p.y, p2.x, p2.y);
          } else {
            const roundedOpacity = (Math.round(baseOpacity * 20) / 20).toFixed(2);
            if (!lineBuckets[roundedOpacity]) lineBuckets[roundedOpacity] = [];
            lineBuckets[roundedOpacity].push(p.x, p.y, p2.x, p2.y);
          }

          if (!this.isMobileRef.current && distSq < this.triangleDistSq) {
            for (let k = j + 1; k < neighbors.length; k++) {
              const p3 = neighbors[k];
              const dx2 = p2.x - p3.x;
              const dy2 = p2.y - p3.y;
              const dist2Sq = dx2 * dx2 + dy2 * dy2;

              if (dist2Sq < this.triangleDistSq) {
                const dx3 = p.x - p3.x;
                const dy3 = p.y - p3.y;
                const dist3Sq = dx3 * dx3 + dy3 * dy3;

                if (dist3Sq < this.triangleDistSq) {
                  const triOpacity = 0.04 * (1 - dist / NEXUS_CONFIG.triangleDistance);
                  const roundedTriOp = (Math.round(triOpacity * 20) / 20).toFixed(2);
                  if (!triBuckets[roundedTriOp]) triBuckets[roundedTriOp] = [];
                  triBuckets[roundedTriOp].push(p.x, p.y, p2.x, p2.y, p3.x, p3.y);
                }
              }
            }
          }
        }
      }
    }

    this.ctx.lineWidth = 0.6;
    for (const opacity in lineBuckets) {
      this.ctx.beginPath();
      const lines = lineBuckets[opacity];
      for (let i = 0; i < lines.length; i += 4) {
        this.ctx.moveTo(lines[i], lines[i + 1]);
        this.ctx.lineTo(lines[i + 2], lines[i + 3]);
      }
      this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
      this.ctx.stroke();
    }

    this.ctx.lineWidth = 1.2;
    for (const opacity in hoverLineBuckets) {
      this.ctx.beginPath();
      const lines = hoverLineBuckets[opacity];
      for (let i = 0; i < lines.length; i += 4) {
        this.ctx.moveTo(lines[i], lines[i + 1]);
        this.ctx.lineTo(lines[i + 2], lines[i + 3]);
      }
      this.ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
      this.ctx.stroke();
    }

    for (const opacity in triBuckets) {
      this.ctx.beginPath();
      const tris = triBuckets[opacity];
      for (let i = 0; i < tris.length; i += 6) {
        this.ctx.moveTo(tris[i], tris[i + 1]);
        this.ctx.lineTo(tris[i + 2], tris[i + 3]);
        this.ctx.lineTo(tris[i + 4], tris[i + 5]);
      }
      this.ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
      this.ctx.fill();
    }
  }

  handleResize = () => {
    if (this.isMobileRef.current && window.innerWidth === this.lastWidth) return;
    this.lastWidth = window.innerWidth;
    this.init();
  };

  handleMouseMove = (e) => {
    mouseState.x = e.clientX;
    mouseState.viewportY = e.clientY;
  };

  handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      mouseState.x = e.touches[0].clientX;
      mouseState.viewportY = e.touches[0].clientY;
    }
  };

  bindEvents() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
  }

  start() {
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
  }
}
