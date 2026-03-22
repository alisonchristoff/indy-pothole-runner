// ============================================================
// HUD — Score, Damage Meter, Messages
// ============================================================

import { CAR, DAMAGE_MESSAGES, REPAIR_COSTS } from './constants.js';

export class HUD {
  constructor() {
    this.message = '';
    this.messageTimer = 0;
    this.shakeIntensity = 0;
    this.seasonMessage = '';
    this.seasonTimer = 0;
  }

  reset() {
    this.message = '';
    this.messageTimer = 0;
    this.shakeIntensity = 0;
    this.seasonMessage = '';
    this.seasonTimer = 0;
  }

  showDamageMessage(damageLevel) {
    this.message = DAMAGE_MESSAGES[damageLevel - 1] || '';
    this.messageTimer = 120;
    this.shakeIntensity = 15;
  }

  showSeasonChange(seasonLabel) {
    this.seasonMessage = seasonLabel;
    this.seasonTimer = 150; // ~2.5 seconds
  }

  update() {
    if (this.messageTimer > 0) this.messageTimer--;
    if (this.seasonTimer > 0) this.seasonTimer--;
    if (this.shakeIntensity > 0) this.shakeIntensity *= 0.9;
    if (this.shakeIntensity < 0.5) this.shakeIntensity = 0;
  }

  getShakeOffset() {
    if (this.shakeIntensity <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeIntensity,
      y: (Math.random() - 0.5) * this.shakeIntensity,
    };
  }

  render(ctx, width, height, miles, damage, repairCost, lastStreet) {
    const scale = width / 420;
    const pad = 16 * scale;

    // Distance (top left)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 * scale;
    ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.strokeText(`${miles.toFixed(1)} mi`, pad, pad + 24 * scale);
    ctx.fillText(`${miles.toFixed(1)} mi`, pad, pad + 24 * scale);

    // Last street name (below distance)
    if (lastStreet) {
      ctx.font = `${14 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.strokeText(lastStreet, pad, pad + 44 * scale);
      ctx.fillText(lastStreet, pad, pad + 44 * scale);
    }

    // Damage meter (top right) — 5 segments
    const meterX = width - pad;
    const segW = 20 * scale;
    const segH = 10 * scale;
    const segGap = 4 * scale;
    for (let i = 0; i < CAR.MAX_DAMAGE; i++) {
      const x = meterX - (CAR.MAX_DAMAGE - i) * (segW + segGap);
      const y = pad;

      if (i < CAR.MAX_DAMAGE - damage) {
        ctx.fillStyle = '#44CC44';
      } else {
        ctx.fillStyle = '#CC4444';
      }
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.fillRect(x, y, segW, segH);
      ctx.strokeRect(x, y, segW, segH);
    }

    // Health label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${11 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'right';
    ctx.strokeText('CAR HEALTH', meterX, pad + segH + 14 * scale);
    ctx.fillText('CAR HEALTH', meterX, pad + segH + 14 * scale);

    // Repair cost (bottom)
    if (repairCost > 0) {
      ctx.textAlign = 'center';
      ctx.font = `${14 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2 * scale;
      const costText = `Repair bill: $${repairCost.toLocaleString()}`;
      ctx.strokeText(costText, width / 2, height - pad);
      ctx.fillText(costText, width / 2, height - pad);
    }

    // Damage message (center)
    if (this.messageTimer > 0) {
      const alpha = Math.min(1, this.messageTimer / 30);
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#FF4444';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3 * scale;
      ctx.strokeText(this.message, width / 2, height * 0.35);
      ctx.fillText(this.message, width / 2, height * 0.35);
      ctx.globalAlpha = 1;
    }

    // Season transition (top center, large text)
    if (this.seasonTimer > 0) {
      // Fade in for first 30 frames, hold, fade out for last 30
      let alpha;
      if (this.seasonTimer > 120) alpha = (150 - this.seasonTimer) / 30;
      else if (this.seasonTimer < 30) alpha = this.seasonTimer / 30;
      else alpha = 1;
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.font = `bold ${28 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4 * scale;
      ctx.strokeText(this.seasonMessage, width / 2, height * 0.2);
      ctx.fillText(this.seasonMessage, width / 2, height * 0.2);
      ctx.globalAlpha = 1;
    }
  }
}
