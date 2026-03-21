// ============================================================
// Scenery — Skyline, roadside buildings/trees, street signs
// ============================================================

import { ROAD, COLORS, SEASONS, STREET_SIGNS } from './constants.js';

// ---- Indianapolis Skyline Silhouette ----

function drawSkyline(ctx, width, horizonY, season) {
  const skylineColor = season === 'WINTER' ? '#3A4050' :
                       season === 'FALL' ? '#2A3040' :
                       season === 'SPRING' ? '#2A3545' : '#1A2535';

  const baseY = horizonY + 2; // sit just below horizon
  const s = width / 420 * 2; // 2x scale for visibility

  ctx.fillStyle = skylineColor;

  const cx = width / 2;

  // Far left buildings (small)
  drawRect(ctx, cx - 180 * s, baseY, 22 * s, -40 * s);
  drawRect(ctx, cx - 155 * s, baseY, 16 * s, -30 * s);
  drawRect(ctx, cx - 135 * s, baseY, 24 * s, -50 * s);

  // Lucas Oil Stadium (wide, low arch) — left of center
  drawLucasOil(ctx, cx - 100 * s, baseY, 60 * s, 35 * s);

  // Mid-left buildings
  drawRect(ctx, cx - 55 * s, baseY, 20 * s, -55 * s);
  drawRect(ctx, cx - 32 * s, baseY, 14 * s, -45 * s);

  // Soldiers and Sailors Monument (center) — column with figure on top
  drawMonument(ctx, cx - 6 * s, baseY, 12 * s, 65 * s);

  // OneAmerica Tower (pointed top) — right of center
  drawOneAmerica(ctx, cx + 22 * s, baseY, 22 * s, 78 * s);

  // Salesforce Tower (tallest, rectangular) — prominent
  drawRect(ctx, cx + 50 * s, baseY, 26 * s, -95 * s);
  // Antenna on top
  drawRect(ctx, cx + 60 * s, baseY - 95 * s, 4 * s, -14 * s);

  // Right side buildings
  drawRect(ctx, cx + 82 * s, baseY, 20 * s, -58 * s);
  drawRect(ctx, cx + 108 * s, baseY, 24 * s, -42 * s);
  drawRect(ctx, cx + 136 * s, baseY, 16 * s, -32 * s);
  drawRect(ctx, cx + 158 * s, baseY, 20 * s, -24 * s);
}

function drawRect(ctx, x, y, w, h) {
  ctx.fillRect(x, y + h, w, -h);
}

function drawLucasOil(ctx, x, baseY, w, h) {
  // Wide building with arched roof
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x, baseY - h * 0.6);
  // Arch
  ctx.quadraticCurveTo(x + w / 2, baseY - h, x + w, baseY - h * 0.6);
  ctx.lineTo(x + w, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawMonument(ctx, x, baseY, w, h) {
  // Tapered column
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + w, baseY);
  ctx.lineTo(x + w * 0.7, baseY - h);
  ctx.lineTo(x + w * 0.3, baseY - h);
  ctx.closePath();
  ctx.fill();
  // Statue on top (small triangle)
  ctx.beginPath();
  ctx.moveTo(x + w * 0.5, baseY - h - 8);
  ctx.lineTo(x + w * 0.3, baseY - h);
  ctx.lineTo(x + w * 0.7, baseY - h);
  ctx.closePath();
  ctx.fill();
}

function drawOneAmerica(ctx, x, baseY, w, h) {
  // Rectangular with pointed top
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + w, baseY);
  ctx.lineTo(x + w, baseY - h * 0.85);
  ctx.lineTo(x + w / 2, baseY - h); // point
  ctx.lineTo(x, baseY - h * 0.85);
  ctx.closePath();
  ctx.fill();
}

// ---- Roadside Trees ----

function drawTree(ctx, x, baseY, size, season) {
  const trunkW = size * 0.15;
  const trunkH = size * 0.4;

  // Trunk
  ctx.fillStyle = '#5C3D2E';
  ctx.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

  // Foliage (varies by season)
  if (season === 'WINTER') {
    // Bare branches — just draw a few lines
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
  } else {
    const foliageColor = season === 'FALL' ? '#C4762B' :
                         season === 'SPRING' ? '#3D8B37' : '#2D7B27';
    ctx.fillStyle = foliageColor;
    ctx.beginPath();
    ctx.arc(x, baseY - trunkH - size * 0.25, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Second smaller circle for fullness
    const foliageColor2 = season === 'FALL' ? '#D4863B' :
                          season === 'SPRING' ? '#4D9B47' : '#3D8B37';
    ctx.fillStyle = foliageColor2;
    ctx.beginPath();
    ctx.arc(x + size * 0.15, baseY - trunkH - size * 0.15, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Snow caps in winter
  if (season === 'WINTER') {
    ctx.fillStyle = 'rgba(220,230,240,0.6)';
    ctx.beginPath();
    ctx.ellipse(x, baseY - trunkH, size * 0.15, size * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- Roadside Building ----

function drawBuilding(ctx, x, baseY, w, h, season) {
  // Building body
  const bodyColors = ['#6B5B5B', '#5B6B6B', '#7B6B5B', '#5B5B6B', '#6B6B5B'];
  ctx.fillStyle = bodyColors[Math.floor(Math.abs(x * 7)) % bodyColors.length];
  ctx.fillRect(x - w / 2, baseY - h, w, h);

  // Windows (grid)
  const winColor = season === 'WINTER' || season === 'FALL' ? '#FFE88B' : '#AAD4E8';
  ctx.fillStyle = winColor;
  const winW = w * 0.15;
  const winH = h * 0.1;
  const cols = 3;
  const rows = Math.max(2, Math.floor(h / 12));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x - w / 2 + w * 0.15 + c * (w * 0.25);
      const wy = baseY - h + h * 0.1 + r * (h / rows);
      ctx.fillRect(wx, wy, winW, winH);
    }
  }
}

// ---- Street Sign ----

function drawStreetSign(ctx, x, baseY, signName, scale) {
  if (!signName) return;

  const postH = 40 * scale;
  const signW = Math.max(70, signName.length * 7) * scale;
  const signH = 18 * scale;

  // Post
  ctx.fillStyle = COLORS.SIGN_POST;
  ctx.fillRect(x - 1.5 * scale, baseY - postH, 3 * scale, postH);

  // Sign background
  ctx.fillStyle = COLORS.SIGN_BG;
  const signX = x - signW / 2;
  const signY = baseY - postH - signH;
  ctx.fillRect(signX, signY, signW, signH);

  // White border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(signX + 1, signY + 1, signW - 2, signH - 2);

  // Text
  ctx.fillStyle = COLORS.SIGN_TEXT;
  ctx.font = `bold ${10 * scale}px system-ui, -apple-system, sans-serif`;
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
  // White strips along road edges
  ctx.fillStyle = 'rgba(220,230,240,0.5)';
  const snowW1 = s1.w * 0.08;
  const snowW2 = s2.w * 0.08;

  // Left snow
  ctx.beginPath();
  ctx.moveTo(s1.x - s1.w * 1.15, s1.y);
  ctx.lineTo(s1.x - s1.w * 1.15 - snowW1, s1.y);
  ctx.lineTo(s2.x - s2.w * 1.15 - snowW2, s2.y);
  ctx.lineTo(s2.x - s2.w * 1.15, s2.y);
  ctx.closePath();
  ctx.fill();

  // Right snow
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
    // Pre-generate roadside object positions (deterministic by segment index)
    // Using a simple hash so objects stay in consistent positions
    this.signQueue = []; // active street signs on screen
  }

  reset() {
    this.signQueue = [];
  }

  // Get a deterministic pseudo-random value for a segment index
  hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  getSeason(miles) {
    if (miles >= SEASONS.SPRING.start) return 'SPRING';
    if (miles >= SEASONS.WINTER.start) return 'WINTER';
    if (miles >= SEASONS.FALL.start) return 'FALL';
    return 'SUMMER';
  }

  // Update street sign queue based on miles
  updateSigns(miles, position) {
    // Add signs that should now be visible
    for (const sign of STREET_SIGNS) {
      const alreadyQueued = this.signQueue.some(s => s.name === sign.name);
      if (!alreadyQueued && miles >= sign.distance - 0.05) {
        // Place sign at a world Z position ahead
        this.signQueue.push({
          name: sign.name,
          z: position + 800,
          shown: false,
        });
      }
    }
    // Remove signs well behind the camera
    this.signQueue = this.signQueue.filter(s => s.z > position - 1000);
  }

  renderSkyline(ctx, width, height, season) {
    const horizonY = height * 0.4;
    drawSkyline(ctx, width, horizonY, season);
  }

  // Render roadside objects for a road segment pair
  renderRoadsideForSegment(ctx, s1, s2, segIndex, width, height, season) {
    const h1 = this.hash(segIndex);
    const h2 = this.hash(segIndex + 1000);

    // Only place objects on ~30% of segments to avoid clutter
    if (h1 > 0.3) return;

    const isTree = h2 > 0.4;
    const side = h2 > 0.5 ? 1 : -1; // left or right of road

    // Object position: just outside the rumble strip
    const edgeOffset = 1.3; // multiplier of road width
    const objX = s2.x + side * s2.w * edgeOffset;
    const objY = s2.y;

    // Scale object with perspective — proportional to road width
    const objSize = Math.max(6, s2.w * 0.25);

    if (objSize < 5) return; // too small to see

    if (isTree) {
      drawTree(ctx, objX, objY, objSize, season);
    } else {
      const bldgW = objSize * 2;
      const bldgH = objSize * (1.5 + h1 * 3);
      drawBuilding(ctx, objX, objY, bldgW, bldgH, season);
    }
  }

  renderStreetSigns(ctx, width, height, position) {
    for (const sign of this.signQueue) {
      const dz = sign.z - position;
      if (dz <= 0 || dz > 5000) continue;

      const scale = ROAD.CAMERA_DEPTH / dz;
      const horizonY = height * 0.4;
      const screenY = horizonY + scale * ROAD.CAMERA_HEIGHT * height;
      const roadW = scale * ROAD.ROAD_WIDTH * width / 2;

      // Place sign on the right side of the road
      const signX = width / 2 + roadW * 1.3;
      const signScale = Math.min(3, roadW / 30);

      if (signScale < 0.4 || screenY < 0 || screenY > height) continue;

      drawStreetSign(ctx, signX, screenY, sign.name, signScale);
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
