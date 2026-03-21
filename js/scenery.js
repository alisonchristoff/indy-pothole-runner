// ============================================================
// Scenery — Skyline, roadside buildings/trees, street signs
// ============================================================

import { ROAD, COLORS, SEASONS, STREET_SIGNS } from './constants.js';

// ---- Indianapolis Skyline Silhouette ----

function drawSkyline(ctx, width, horizonY, season) {
  const skylineColor = season === 'WINTER' ? '#3A4050' :
                       season === 'FALL' ? '#2A3040' :
                       season === 'SPRING' ? '#2A3545' : '#1A2535';

  const baseY = horizonY + 2;
  const s = width / 420; // original 1x scale

  ctx.fillStyle = skylineColor;
  const cx = width / 2;

  // Far left buildings
  drawRect(ctx, cx - 160 * s, baseY, 18 * s, -35 * s);
  drawRect(ctx, cx - 138 * s, baseY, 14 * s, -25 * s);
  drawRect(ctx, cx - 120 * s, baseY, 20 * s, -42 * s);

  // Lucas Oil Stadium
  drawLucasOil(ctx, cx - 85 * s, baseY, 50 * s, 28 * s);

  // Mid-left buildings
  drawRect(ctx, cx - 50 * s, baseY, 16 * s, -48 * s);
  drawRect(ctx, cx - 30 * s, baseY, 12 * s, -38 * s);

  // Soldiers and Sailors Monument
  drawMonument(ctx, cx - 5 * s, baseY, 10 * s, 55 * s);

  // OneAmerica Tower
  drawOneAmerica(ctx, cx + 20 * s, baseY, 18 * s, 65 * s);

  // Salesforce Tower
  drawRect(ctx, cx + 45 * s, baseY, 22 * s, -80 * s);
  drawRect(ctx, cx + 53 * s, baseY - 80 * s, 3 * s, -10 * s);

  // Right side buildings
  drawRect(ctx, cx + 75 * s, baseY, 16 * s, -50 * s);
  drawRect(ctx, cx + 95 * s, baseY, 20 * s, -36 * s);
  drawRect(ctx, cx + 120 * s, baseY, 14 * s, -28 * s);
  drawRect(ctx, cx + 140 * s, baseY, 18 * s, -20 * s);
}

function drawRect(ctx, x, y, w, h) {
  ctx.fillRect(x, y + h, w, -h);
}

function drawLucasOil(ctx, x, baseY, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x, baseY - h * 0.6);
  ctx.quadraticCurveTo(x + w / 2, baseY - h, x + w, baseY - h * 0.6);
  ctx.lineTo(x + w, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawMonument(ctx, x, baseY, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + w, baseY);
  ctx.lineTo(x + w * 0.7, baseY - h);
  ctx.lineTo(x + w * 0.3, baseY - h);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w * 0.5, baseY - h - 8);
  ctx.lineTo(x + w * 0.3, baseY - h);
  ctx.lineTo(x + w * 0.7, baseY - h);
  ctx.closePath();
  ctx.fill();
}

function drawOneAmerica(ctx, x, baseY, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + w, baseY);
  ctx.lineTo(x + w, baseY - h * 0.85);
  ctx.lineTo(x + w / 2, baseY - h);
  ctx.lineTo(x, baseY - h * 0.85);
  ctx.closePath();
  ctx.fill();
}

// ---- Roadside Trees ----

function drawTree(ctx, x, baseY, size, season) {
  const trunkW = size * 0.15;
  const trunkH = size * 0.4;

  ctx.fillStyle = '#5C3D2E';
  ctx.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

  if (season === 'WINTER') {
    ctx.strokeStyle = '#5C3D2E';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, baseY - trunkH);
    ctx.lineTo(x - size * 0.3, baseY - trunkH - size * 0.3);
    ctx.moveTo(x, baseY - trunkH);
    ctx.lineTo(x + size * 0.25, baseY - trunkH - size * 0.35);
    ctx.moveTo(x, baseY - trunkH * 0.7);
    ctx.lineTo(x - size * 0.2, baseY - trunkH - size * 0.15);
    ctx.stroke();
    // Snow at base
    ctx.fillStyle = 'rgba(220,230,240,0.6)';
    ctx.beginPath();
    ctx.ellipse(x, baseY, size * 0.2, size * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const foliageColor = season === 'FALL' ? '#C4762B' :
                         season === 'SPRING' ? '#3D8B37' : '#2D7B27';
    ctx.fillStyle = foliageColor;
    ctx.beginPath();
    ctx.arc(x, baseY - trunkH - size * 0.25, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    const foliageColor2 = season === 'FALL' ? '#D4863B' :
                          season === 'SPRING' ? '#4D9B47' : '#3D8B37';
    ctx.fillStyle = foliageColor2;
    ctx.beginPath();
    ctx.arc(x + size * 0.15, baseY - trunkH - size * 0.15, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- Roadside Building ----

function drawBuilding(ctx, x, baseY, w, h, season) {
  const bodyColors = ['#6B5B5B', '#5B6B6B', '#7B6B5B', '#5B5B6B', '#6B6B5B'];
  ctx.fillStyle = bodyColors[Math.floor(Math.abs(x * 7)) % bodyColors.length];
  ctx.fillRect(x - w / 2, baseY - h, w, h);

  const winColor = season === 'WINTER' || season === 'FALL' ? '#FFE88B' : '#AAD4E8';
  ctx.fillStyle = winColor;
  const cols = 3;
  const rows = 3;
  const winW = w * 0.15;
  const winH = h * 0.08;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x - w / 2 + w * 0.15 + c * (w * 0.25);
      const wy = baseY - h + h * 0.12 + r * (h * 0.28);
      ctx.fillRect(wx, wy, winW, winH);
    }
  }
}

// ---- Rain Effect ----

function drawRain(ctx, width, height, phase) {
  ctx.strokeStyle = 'rgba(180,200,220,0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const x = (i * 97 + phase * 3) % width;
    const y = (i * 131 + phase * 7) % height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 2, y + 12);
    ctx.stroke();
  }
}

// ---- Snow on road edges ----

function drawSnowEdges(ctx, s1, s2) {
  ctx.fillStyle = 'rgba(220,230,240,0.5)';
  const snowW1 = s1.w * 0.08;
  const snowW2 = s2.w * 0.08;

  ctx.beginPath();
  ctx.moveTo(s1.x - s1.w * 1.15, s1.y);
  ctx.lineTo(s1.x - s1.w * 1.15 - snowW1, s1.y);
  ctx.lineTo(s2.x - s2.w * 1.15 - snowW2, s2.y);
  ctx.lineTo(s2.x - s2.w * 1.15, s2.y);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(s1.x + s1.w * 1.15, s1.y);
  ctx.lineTo(s1.x + s1.w * 1.15 + snowW1, s1.y);
  ctx.lineTo(s2.x + s2.w * 1.15 + snowW2, s2.y);
  ctx.lineTo(s2.x + s2.w * 1.15, s2.y);
  ctx.closePath();
  ctx.fill();
}

// ============================================================
// Public: Scenery renderer
// ============================================================

export class Scenery {
  constructor() {
    this.signQueue = [];
    this.activeSign = null; // currently displayed street sign overlay
    this.signTimer = 0;
  }

  reset() {
    this.signQueue = [];
    this.activeSign = null;
    this.signTimer = 0;
  }

  hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  // Called when HUD street name changes — show the sign overlay
  showStreetSign(name) {
    this.activeSign = name;
    this.signTimer = 180; // ~3 seconds at 60fps
  }

  renderSkyline(ctx, width, height, season) {
    const horizonY = height * 0.4;
    drawSkyline(ctx, width, horizonY, season);
  }

  renderRoadsideForSegment(ctx, s1, s2, segIndex, width, height, season) {
    const h1 = this.hash(segIndex);
    const h2 = this.hash(segIndex + 1000);

    // Only place objects on ~25% of segments
    if (h1 > 0.25) return;

    const isTree = h2 > 0.4;
    const side = h2 > 0.5 ? 1 : -1;

    // Position objects at the screen edge, not relative to road width
    // (road is wider than screen at near segments)
    const horizonY = height * 0.4;
    const progress = (s2.y - horizonY) / (height - horizonY);

    // Objects sit at screen edges, lerping inward toward horizon
    // At progress=0 (horizon): near center. At progress=1 (bottom): at screen edge
    const edgeX = side > 0
      ? width * (0.55 + progress * 0.4)  // right side: 55% to 95%
      : width * (0.45 - progress * 0.4); // left side: 45% to 5%

    const objY = s2.y;

    // Size based on vertical position (perspective)
    const objSize = Math.max(6, progress * 60);

    if (objSize < 5 || progress < 0.02 || progress > 0.85) return;

    if (isTree) {
      drawTree(ctx, edgeX, objY, objSize, season);
    } else {
      const bldgW = objSize * 1.8;
      const bldgH = objSize * (1.5 + h1 * 2.5);
      drawBuilding(ctx, edgeX, objY, bldgW, bldgH, season);
    }
  }

  // Render street sign as a HUD-style overlay on the right side
  renderStreetSign(ctx, width, height) {
    if (!this.activeSign || this.signTimer <= 0) return;

    this.signTimer--;

    const scale = width / 420;
    const alpha = this.signTimer < 30 ? this.signTimer / 30 : 1;

    ctx.globalAlpha = alpha;

    const signW = Math.max(120, this.activeSign.length * 10 + 30) * scale;
    const signH = 30 * scale;
    const signX = width - signW - 12 * scale;
    const signY = height * 0.15;

    // Green sign background
    ctx.fillStyle = COLORS.SIGN_BG;
    ctx.beginPath();
    ctx.roundRect(signX, signY, signW, signH, 4 * scale);
    ctx.fill();

    // White border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(signX + 2, signY + 2, signW - 4, signH - 4, 3 * scale);
    ctx.stroke();

    // Text
    ctx.fillStyle = COLORS.SIGN_TEXT;
    ctx.font = `bold ${14 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(this.activeSign, signX + signW / 2, signY + signH * 0.68);

    ctx.globalAlpha = 1;
  }

  renderWeather(ctx, width, height, season, phase) {
    if (season === 'SPRING') {
      drawRain(ctx, width, height, phase);
    }
  }

  renderSnowForSegment(ctx, s1, s2, season) {
    if (season === 'WINTER') {
      drawSnowEdges(ctx, s1, s2);
    }
  }
}
