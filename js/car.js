// ============================================================
// Car — Rendering and Movement
// ============================================================

import { CAR, ROAD, COLORS } from './constants.js';

export class Car {
  constructor() {
    // x position: -1 (full left) to 1 (full right), 0 = center
    this.x = 0;
    this.velocity = 0;
    this.damage = 0;
    this.bobPhase = 0;
    this.flashTimer = 0;
  }

  reset() {
    this.x = 0;
    this.velocity = 0;
    this.damage = 0;
    this.bobPhase = 0;
    this.flashTimer = 0;
  }

  update(inputDirection, speed) {
    // Apply input with momentum
    const targetVelocity = inputDirection * CAR.MOVE_SPEED * 0.02;
    this.velocity = this.velocity * CAR.MOMENTUM + targetVelocity * (1 - CAR.MOMENTUM);

    this.x += this.velocity;

    // Clamp to stay on screen (road is wider than screen at car's depth)
    const maxX = 0.45;
    if (this.x < -maxX) { this.x = -maxX; this.velocity = 0; }
    if (this.x > maxX) { this.x = maxX; this.velocity = 0; }

    // Bobbing animation
    this.bobPhase += speed * 0.05;

    // Flash timer countdown
    if (this.flashTimer > 0) this.flashTimer--;
  }

  hit() {
    this.damage++;
    this.flashTimer = 20;
  }

  render(ctx, width, height) {
    const carW = CAR.WIDTH * (width / 420); // scale with screen
    const carH = carW * 0.65;
    const cy = height * (1 - CAR.BOTTOM_OFFSET);

    // Calculate road width at car's depth to position car correctly
    // Car is at y = height * 0.82, horizon at height * 0.4
    // scale = (cy - horizon) / (CAMERA_HEIGHT * height)
    const horizon = height * 0.4;
    const carScale = (cy - horizon) / (ROAD.CAMERA_HEIGHT * height);
    const roadHalfWAtCar = carScale * ROAD.ROAD_WIDTH * width / 2;
    // Car x position maps onto the road width at its depth
    const cx = width / 2 + this.x * roadHalfWAtCar;

    // Bobbing
    const bob = Math.sin(this.bobPhase) * 1.5;

    // Damage tilt
    const tilt = this.damage >= 3 ? Math.sin(this.bobPhase * 0.7) * 0.03 * this.damage : 0;

    ctx.save();
    ctx.translate(cx, cy + bob);
    ctx.rotate(tilt);

    // Flash white when recently hit
    const flashing = this.flashTimer > 0 && this.flashTimer % 4 < 2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, carH * 0.35, carW * 0.55, carH * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Car body
    ctx.fillStyle = flashing ? '#FFFFFF' : COLORS.CAR_BODY;
    this.drawRoundRect(ctx, -carW / 2, -carH * 0.2, carW, carH * 0.55, 4);
    ctx.fill();

    // Roof
    ctx.fillStyle = flashing ? '#DDDDDD' : COLORS.CAR_ROOF;
    this.drawRoundRect(ctx, -carW * 0.35, -carH * 0.55, carW * 0.7, carH * 0.4, 6);
    ctx.fill();

    // Rear window
    ctx.fillStyle = COLORS.CAR_WINDOW;
    this.drawRoundRect(ctx, -carW * 0.28, -carH * 0.48, carW * 0.56, carH * 0.22, 3);
    ctx.fill();

    // Taillights
    const tlColor = flashing ? '#FFFFFF' : COLORS.CAR_TAILLIGHT;
    ctx.fillStyle = tlColor;
    // Left taillight
    this.drawRoundRect(ctx, -carW / 2 + 2, carH * 0.05, carW * 0.12, carH * 0.1, 2);
    ctx.fill();
    // Right taillight
    this.drawRoundRect(ctx, carW / 2 - carW * 0.12 - 2, carH * 0.05, carW * 0.12, carH * 0.1, 2);
    ctx.fill();

    // Smoke at high damage
    if (this.damage >= 3) {
      this.drawSmoke(ctx, carW, carH);
    }

    // Missing hubcap indicator at damage 3+
    if (this.damage >= 3) {
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.arc(-carW / 2 - 2, carH * 0.25, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawSmoke(ctx, carW, carH) {
    const intensity = (this.damage - 2) * 0.3;
    for (let i = 0; i < 3; i++) {
      const t = (this.bobPhase * 2 + i * 2) % 10;
      const alpha = Math.max(0, intensity * (1 - t / 10));
      ctx.fillStyle = `rgba(150,150,150,${alpha})`;
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * carW * 0.3,
        -carH * 0.55 - t * 3,
        3 + t * 1.5,
        0, Math.PI * 2
      );
      ctx.fill();
    }
  }

  drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
