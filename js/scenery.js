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
  const s = width / 420;

  ctx.fillStyle = skylineColor;
  const cx = width / 2;

  drawRect(ctx, cx - 160 * s, baseY, 18 * s, -35 * s);
  drawRect(ctx, cx - 138 * s, baseY, 14 * s, -25 * s);
  drawRect(ctx, cx - 120 * s, baseY, 20 * s, -42 * s);
  drawLucasOil(ctx, cx - 85 * s, baseY, 50 * s, 28 * s);
  drawRect(ctx, cx - 50 * s, baseY, 16 * s, -48 * s);
  drawRect(ctx, cx - 30 * s, baseY, 12 * s, -38 * s);
  drawMonument(ctx, cx - 5 * s, baseY, 10 * s, 55 * s);
  drawOneAmerica(ctx, cx + 20 * s, baseY, 18 * s, 65 * s);
  drawRect(ctx, cx + 45 * s, baseY, 22 * s, -80 * s);
  drawRect(ctx, cx + 53 * s, baseY - 80 * s, 3 * s, -10 * s);
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
    ctx.lineWidth = Math.max(1, size * 0.03);
    ctx.beginPath();
    ctx.moveTo(x, baseY - trunkH);
    ctx.lineTo(x - size * 0.3, baseY - trunkH - size * 0.3);
    ctx.moveTo(x, baseY - trunkH);
    ctx.lineTo(x + size * 0.25, baseY - trunkH - size * 0.35);
    ctx.moveTo(x, baseY - trunkH * 0.7);
    ctx.lineTo(x - size * 0.2, baseY - trunkH - size * 0.15);
    ctx.stroke();
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

// ---- Street Sign (3D, on a post) ----

function drawStreetSign3D(ctx, x, baseY, signName, size) {
  if (!signName || size < 4) return;

  const postH = size * 2.5;
  const postW = Math.max(2, size * 0.1);
  const signW = size * 4;
  const signH = size * 1.2;

  // Post
  ctx.fillStyle = COLORS.SIGN_POST;
  ctx.fillRect(x - postW / 2, baseY - postH, postW, postH);

  // Sign background
  ctx.fillStyle = COLORS.SIGN_BG;
  const signX = x - signW / 2;
  const signY = baseY - postH - signH;
  ctx.fillRect(signX, signY, signW, signH);

  // White border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.strokeRect(signX + 1, signY + 1, signW - 2, signH - 2);

  // Text
  ctx.fillStyle = COLORS.SIGN_TEXT;
  ctx.font = `bold ${Math.max(6, size * 0.8)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(signName, x, signY + signH * 0.72);
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
    this.activeStreetSigns = []; // signs placed in 3D world
  }

  reset() {
    this.activeStreetSigns = [];
  }

  hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  // Place a street sign in the 3D world when player reaches that street
  showStreetSign(name, position) {
    this.activeStreetSigns.push({
      name,
      z: position + 6000, // place it well ahead so player sees it approach
    });
  }

  renderSkyline(ctx, width, height, season) {
    const horizonY = height * 0.4;
    drawSkyline(ctx, width, horizonY, season);
  }

  // Render roadside objects for a road segment pair
  // s1 = far edge of segment (smaller y), s2 = near edge (larger y)
  renderRoadsideForSegment(ctx, s1, s2, segIndex, width, height, season) {
    const h1 = this.hash(segIndex);
    const h2 = this.hash(segIndex + 1000);
    const h3 = this.hash(segIndex + 2000); // separate hash for side

    if (h1 > 0.25) return;

    const isTree = h2 > 0.35; // 65% trees, 35% buildings
    const side = h3 > 0.5 ? 1 : -1;

    // Road edge on screen = road center (s2.x) ± rumble width (s2.w * 1.15)
    const roadEdge = s2.x + side * s2.w * 1.15;

    // Only draw if the road edge is on screen (with margin for the object)
    // If road edge is off screen, object would be even further off — skip
    if (side > 0 && roadEdge > width + 20) return;
    if (side < 0 && roadEdge < -20) return;

    // Size proportional to road width at this depth
    const objSize = Math.max(5, s2.w * 0.3);
    if (objSize < 4) return;

    const gap = s2.w * 0.08;
    const objY = s2.y;

    if (isTree) {
      // Anchor tree trunk at road edge + gap, foliage grows outward
      const treeX = roadEdge + side * (gap + objSize * 0.2);
      drawTree(ctx, treeX, objY, objSize, season);
    } else {
      const bldgW = objSize * 1.8;
      const bldgH = objSize * (2 + h1 * 3);
      // Anchor building's road-facing edge at road edge + gap
      const bldgX = roadEdge + side * (gap + bldgW / 2);
      drawBuilding(ctx, bldgX, objY, bldgW, bldgH, season);
    }
  }

  // Render 3D street signs that you drive past
  renderStreetSigns(ctx, width, height, position) {
    // Remove signs well behind camera
    this.activeStreetSigns = this.activeStreetSigns.filter(s => s.z > position - 500);

    for (const sign of this.activeStreetSigns) {
      const dz = sign.z - position;
      if (dz <= 10 || dz > 8000) continue;

      const scale = ROAD.CAMERA_DEPTH / dz;
      const horizonY = height * 0.4;
      const screenY = horizonY + scale * ROAD.CAMERA_HEIGHT * height;
      const roadHalfW = scale * ROAD.ROAD_WIDTH * width / 2;

      // Place on right side, just outside road edge
      const roadEdge = width / 2 + roadHalfW * 1.15;

      // Skip if road edge is off screen (sign would be invisible)
      if (roadEdge > width + 50) continue;

      const signX = roadEdge + roadHalfW * 0.15;

      // Size scales with perspective
      const signSize = Math.max(4, roadHalfW * 0.06);
      if (signSize < 3) continue;

      drawStreetSign3D(ctx, signX, screenY, sign.name, signSize);
    }
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
