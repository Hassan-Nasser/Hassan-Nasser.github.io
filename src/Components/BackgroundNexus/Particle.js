import { NEXUS_CONFIG, mouseState } from './nexusConfig';

export class Particle {
  constructor(width, height, id) {
    this.id = id;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.baseSize = Math.random() * 1.5 + 0.8;
    this.size = this.baseSize;
    this.gridCol = 0;
    this.gridRow = 0;
  }

  update(width, height, currentMouseY, timeMultiplier = 1) {
    this.x += this.vx * timeMultiplier;
    this.y += this.vy * timeMultiplier;

    if (this.x < 0) this.x += width;
    if (this.x > width) this.x -= width;
    if (this.y < 0) this.y += height;
    if (this.y > height) this.y -= height;

    const dx = mouseState.x - this.x;
    const dy = currentMouseY - this.y;
    const distSq = dx * dx + dy * dy;
    const mouseRadiusSq = mouseState.radius * mouseState.radius;

    if (distSq < mouseRadiusSq) {
      const distance = Math.sqrt(distSq);
      const force = (mouseState.radius - distance) / mouseState.radius;
      this.size = this.baseSize + (force * 2.5);
    } else {
      this.size = this.baseSize;
    }
  }

  draw(context, currentMouseY, isSpriteReady, glowSprite) {
    const dx = mouseState.x - this.x;
    const dy = currentMouseY - this.y;
    const distSq = dx * dx + dy * dy;
    const mouseRadiusSq = mouseState.radius * mouseState.radius;

    if (distSq < mouseRadiusSq) {
      const distance = Math.sqrt(distSq);
      const glowAlpha = (1 - distance / mouseState.radius);

      if (isSpriteReady && glowSprite) {
        context.globalAlpha = Math.min(glowAlpha * NEXUS_CONFIG.glowOpacityMultiplier, 1.0);
        const targetRadius = this.size + (NEXUS_CONFIG.glowSpread * glowAlpha);
        const drawSize = targetRadius * 2 * NEXUS_CONFIG.glowPaddingScale;

        context.drawImage(glowSprite, this.x - drawSize / 2, this.y - drawSize / 2, drawSize, drawSize);
        context.globalAlpha = 1.0;
      }

      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(147, 197, 253, ${0.4 + (glowAlpha * 0.6)})`;
      context.fill();
    } else {
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = 'rgba(59, 130, 246, 0.4)';
      context.fill();
    }
  }
}
