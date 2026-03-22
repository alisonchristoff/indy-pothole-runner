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

function drawTree(ctx, x, baseY, size, season, isMobile) {
  const trunkW = size * 0.15;
  const trunkH = size * 0.4;

  ctx.fillStyle = '#5C3D2E';
  ctx.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

  if (season === 'WINTER') {
    if (!isMobile) {
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
    }
  } else {
    const foliageColor = season === 'FALL' ? '#C4762B' :
                         season === 'SPRING' ? '#3D8B37' : '#2D7B27';
    ctx.fillStyle = foliageColor;
    ctx.beginPath();
    ctx.arc(x, baseY - trunkH - size * 0.25, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    if (!isMobile) {
      const foliageColor2 = season === 'FALL' ? '#D4863B' :
                            season === 'SPRING' ? '#4D9B47' : '#3D8B37';
      ctx.fillStyle = foliageColor2;
      ctx.beginPath();
      ctx.arc(x + size * 0.15, baseY - trunkH - size * 0.15, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ---- Roadside Building ----

function drawBuilding(ctx, x, baseY, w, h, season, isMobile) {
  const bodyColors = ['#6B5B5B', '#5B6B6B', '#7B6B5B', '#5B5B6B', '#6B6B5B'];
  ctx.fillStyle = bodyColors[Math.floor(Math.abs(x * 7)) % bodyColors.length];
  ctx.fillRect(x - w / 2, baseY - h, w, h);

  if (!isMobile) {
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

// ---- Landmarks ----
// Each draws a recognizable silhouette at (x, baseY) with given size

function drawLandmarkSimple(ctx, type, x, baseY, size, label) {
  const s = size;
  // Simplified landmark for mobile — just a colored block + label
  const colorMap = {
    statehouse: '#D8D0BE', fieldhouse: '#7A4A3A', speedway: '#7A7A7A',
    museum: '#E0D8C8', cemetery: '#4A6A3A', university: '#8B4020',
    monon: '#3A6A2A', broadripple: '#CC5544', stripmall: '#B0A898',
    bigbox: '#8A8A8A', office: '#D8D0C0', arts: '#E8DDD0',
  };
  ctx.fillStyle = colorMap[type] || '#888';
  ctx.fillRect(x - s * 0.5, baseY - s * 0.4, s * 1.0, s * 0.4);
  // Roof
  ctx.fillStyle = '#666';
  ctx.fillRect(x - s * 0.52, baseY - s * 0.42, s * 1.04, s * 0.03);
  // Windows
  ctx.fillStyle = '#FFE88B';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(x - s * 0.35 + i * s * 0.25, baseY - s * 0.3, s * 0.12, s * 0.1);
  }
  if (s >= 8) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(5, Math.min(12, s * 0.15))}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(label, x, baseY + s * 0.12);
  }
}

function drawLandmark(ctx, type, x, baseY, size, label) {
  const s = size;
  const drawLabel = (text) => {
    if (s < 8) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(5, Math.min(12, s * 0.15))}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, baseY + s * 0.12);
  };

  switch (type) {
    case 'statehouse': { // Indiana State Capitol — limestone, big dome with cupola, columned portico
      // Wide low body — Indiana limestone cream color
      ctx.fillStyle = '#D8D0BE';
      ctx.fillRect(x - s * 0.7, baseY - s * 0.45, s * 1.4, s * 0.45);
      // Wings (slightly darker)
      ctx.fillStyle = '#CCC4B0';
      ctx.fillRect(x - s * 0.85, baseY - s * 0.35, s * 0.2, s * 0.35);
      ctx.fillRect(x + s * 0.65, baseY - s * 0.35, s * 0.2, s * 0.35);
      // Triangular pediment over portico
      ctx.fillStyle = '#C8BEA8';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.35, baseY - s * 0.45);
      ctx.lineTo(x, baseY - s * 0.58);
      ctx.lineTo(x + s * 0.35, baseY - s * 0.45);
      ctx.closePath();
      ctx.fill();
      // Corinthian columns across the front
      ctx.fillStyle = '#E0D8C8';
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(x + i * s * 0.09 - s * 0.02, baseY - s * 0.45, s * 0.04, s * 0.45);
      }
      // Large dome
      ctx.fillStyle = '#B8B0A0';
      ctx.beginPath();
      ctx.arc(x, baseY - s * 0.55, s * 0.3, Math.PI, 0);
      ctx.fill();
      // Cupola (lantern) on top of dome
      ctx.fillStyle = '#A8A090';
      ctx.fillRect(x - s * 0.06, baseY - s * 0.92, s * 0.12, s * 0.12);
      // Tiny dome on cupola
      ctx.beginPath();
      ctx.arc(x, baseY - s * 0.92, s * 0.07, Math.PI, 0);
      ctx.fill();
      // Flagpole
      ctx.strokeStyle = '#888';
      ctx.lineWidth = Math.max(1, s * 0.015);
      ctx.beginPath();
      ctx.moveTo(x, baseY - s * 0.98);
      ctx.lineTo(x, baseY - s * 1.12);
      ctx.stroke();
      drawLabel(label);
      break;
    }

    case 'fieldhouse': { // Gainbridge Fieldhouse — brick/glass retro, barrel roof, Pacers gold
      // Brick body — wide and low like a big fieldhouse
      ctx.fillStyle = '#7A4A3A';
      ctx.fillRect(x - s * 0.75, baseY - s * 0.5, s * 1.5, s * 0.5);
      // Barrel/shed roof — low arc, not a flying saucer
      ctx.fillStyle = '#5A3A2A';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.75, baseY - s * 0.5);
      ctx.quadraticCurveTo(x, baseY - s * 0.68, x + s * 0.75, baseY - s * 0.5);
      ctx.fill();
      // Glass atrium entrance panel (center)
      ctx.fillStyle = 'rgba(130,180,220,0.6)';
      ctx.fillRect(x - s * 0.18, baseY - s * 0.55, s * 0.36, s * 0.55);
      // Glass grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = Math.max(0.5, s * 0.01);
      for (let i = 1; i < 4; i++) {
        const gy = baseY - s * 0.55 + i * s * 0.14;
        ctx.beginPath();
        ctx.moveTo(x - s * 0.18, gy);
        ctx.lineTo(x + s * 0.18, gy);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x, baseY - s * 0.55);
      ctx.lineTo(x, baseY);
      ctx.stroke();
      // Pacers gold accent band
      ctx.fillStyle = '#FDBB30';
      ctx.fillRect(x - s * 0.75, baseY - s * 0.52, s * 1.5, s * 0.03);
      // "FIELDHOUSE" text in gold
      ctx.fillStyle = '#FDBB30';
      ctx.font = `bold ${Math.max(4, s * 0.08)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('FIELDHOUSE', x, baseY - s * 0.42);
      // Navy blue Pacers banner
      ctx.fillStyle = '#002D62';
      ctx.fillRect(x - s * 0.5, baseY - s * 0.38, s * 0.15, s * 0.12);
      ctx.fillRect(x + s * 0.35, baseY - s * 0.38, s * 0.15, s * 0.12);
      drawLabel(label);
      break;
    }

    case 'speedway': { // IMS — 9-tier pagoda, green glass, yard of bricks, grandstands
      // Long grandstands
      ctx.fillStyle = '#7A7A7A';
      ctx.fillRect(x - s * 0.9, baseY - s * 0.25, s * 1.8, s * 0.25);
      // Grandstand steps
      ctx.fillStyle = '#8A8A8A';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - s * 0.85 + i * s * 0.05, baseY - s * 0.25 - i * s * 0.04, s * 1.7 - i * s * 0.1, s * 0.04);
      }
      // Yard of Bricks — the iconic start/finish line
      ctx.fillStyle = '#C4A882';
      ctx.fillRect(x - s * 0.9, baseY - s * 0.02, s * 1.8, s * 0.04);
      // Brick pattern
      ctx.strokeStyle = '#A08860';
      ctx.lineWidth = Math.max(0.5, s * 0.005);
      for (let i = 0; i < 12; i++) {
        const bx = x - s * 0.85 + i * s * 0.15;
        ctx.beginPath();
        ctx.moveTo(bx, baseY - s * 0.02);
        ctx.lineTo(bx, baseY + s * 0.02);
        ctx.stroke();
      }
      // Pagoda — stacked tapering tiers with green-tinted glass
      const pagodaX = x + s * 0.1;
      for (let i = 0; i < 5; i++) {
        const tw = s * 0.22 - i * s * 0.025;
        const th = s * 0.13;
        const ty = baseY - s * 0.25 - i * th;
        // Green glass panel
        ctx.fillStyle = 'rgba(100,140,120,0.7)';
        ctx.fillRect(pagodaX - tw / 2, ty - th, tw, th);
        // Concrete ledge between tiers
        ctx.fillStyle = '#D0D0D0';
        ctx.fillRect(pagodaX - tw / 2 - s * 0.015, ty - th, tw + s * 0.03, s * 0.015);
      }
      // Flagpole at top
      ctx.strokeStyle = '#666';
      ctx.lineWidth = Math.max(1, s * 0.015);
      ctx.beginPath();
      ctx.moveTo(pagodaX, baseY - s * 0.9);
      ctx.lineTo(pagodaX, baseY - s * 1.1);
      ctx.stroke();
      // Checkered flag
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(pagodaX + s * 0.015, baseY - s * 1.1, s * 0.1, s * 0.07);
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(pagodaX + s * 0.015 + c * s * 0.033, baseY - s * 1.1 + r * s * 0.035, s * 0.033, s * 0.035);
          }
        }
      }
      drawLabel(label);
      break;
    }

    case 'museum': { // Newfields — modernist flat-roof pavilion on a hill, LOVE sculpture, tree allee
      // Hilltop/grounds
      ctx.fillStyle = '#4A7A3A';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.9, baseY);
      ctx.quadraticCurveTo(x, baseY - s * 0.15, x + s * 0.9, baseY);
      ctx.fill();
      // Tree-lined allee leading up
      ctx.fillStyle = '#3A6A2A';
      for (let i = -3; i <= 3; i++) {
        const tx = x + i * s * 0.12;
        const ty = baseY - s * 0.08;
        ctx.beginPath();
        ctx.arc(tx, ty - s * 0.06, s * 0.04, 0, Math.PI * 2);
        ctx.fill();
      }
      // Flat-roofed modernist pavilion (Krannert) — clean rectangle
      ctx.fillStyle = '#E0D8C8';
      ctx.fillRect(x - s * 0.5, baseY - s * 0.5, s * 1.0, s * 0.35);
      // Flat roof overhang
      ctx.fillStyle = '#C8C0B0';
      ctx.fillRect(x - s * 0.55, baseY - s * 0.52, s * 1.1, s * 0.03);
      // Large glass panels
      ctx.fillStyle = 'rgba(130,170,200,0.4)';
      ctx.fillRect(x - s * 0.45, baseY - s * 0.47, s * 0.35, s * 0.28);
      ctx.fillRect(x + s * 0.1, baseY - s * 0.47, s * 0.35, s * 0.28);
      // Robert Indiana LOVE sculpture — the iconic tilted red letters
      ctx.fillStyle = '#CC2222';
      ctx.font = `bold ${Math.max(5, s * 0.18)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + s * 0.6, baseY - s * 0.12);
      // The "O" is famously tilted
      ctx.fillText('L', -s * 0.08, 0);
      ctx.save();
      ctx.translate(s * 0.06, -s * 0.02);
      ctx.rotate(-0.2);
      ctx.fillText('O', 0, 0);
      ctx.restore();
      ctx.fillText('VE', -s * 0.01, s * 0.14);
      ctx.restore();
      drawLabel(label);
      break;
    }

    case 'cemetery': { // Crown Hill — triple Gothic arches in limestone, hilltop, headstones
      // Rolling green hill (highest point in Indy)
      ctx.fillStyle = '#4A6A3A';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.9, baseY);
      ctx.quadraticCurveTo(x - s * 0.2, baseY - s * 0.45, x + s * 0.3, baseY - s * 0.2);
      ctx.quadraticCurveTo(x + s * 0.7, baseY - s * 0.1, x + s * 0.9, baseY);
      ctx.fill();
      // Small hilltop chapel
      ctx.fillStyle = '#BBBBBB';
      ctx.fillRect(x - s * 0.08, baseY - s * 0.52, s * 0.12, s * 0.1);
      ctx.beginPath();
      ctx.moveTo(x - s * 0.08, baseY - s * 0.52);
      ctx.lineTo(x - s * 0.02, baseY - s * 0.58);
      ctx.lineTo(x + s * 0.04, baseY - s * 0.52);
      ctx.fill();
      // Triple Gothic arch gateway — limestone, center arch tallest
      ctx.fillStyle = '#D0C8B8';
      // Left pillar
      ctx.fillRect(x - s * 0.45, baseY - s * 0.4, s * 0.06, s * 0.4);
      // Left-center pillar
      ctx.fillRect(x - s * 0.18, baseY - s * 0.45, s * 0.06, s * 0.45);
      // Right-center pillar
      ctx.fillRect(x + s * 0.12, baseY - s * 0.45, s * 0.06, s * 0.45);
      // Right pillar
      ctx.fillRect(x + s * 0.39, baseY - s * 0.4, s * 0.06, s * 0.4);
      // Gothic pointed arches
      ctx.strokeStyle = '#D0C8B8';
      ctx.lineWidth = Math.max(1, s * 0.025);
      // Left arch (shorter)
      ctx.beginPath();
      ctx.moveTo(x - s * 0.45, baseY - s * 0.35);
      ctx.quadraticCurveTo(x - s * 0.32, baseY - s * 0.52, x - s * 0.18, baseY - s * 0.35);
      ctx.stroke();
      // Center arch (tallest, pointed Gothic)
      ctx.beginPath();
      ctx.moveTo(x - s * 0.18, baseY - s * 0.4);
      ctx.quadraticCurveTo(x - s * 0.03, baseY - s * 0.65, x + s * 0.12, baseY - s * 0.4);
      ctx.stroke();
      // Right arch (shorter)
      ctx.beginPath();
      ctx.moveTo(x + s * 0.12, baseY - s * 0.35);
      ctx.quadraticCurveTo(x + s * 0.26, baseY - s * 0.52, x + s * 0.39, baseY - s * 0.35);
      ctx.stroke();
      // Headstones scattered on the hill
      ctx.fillStyle = '#AAAAAA';
      for (const [ox, oy] of [[0.25, 0.18], [0.45, 0.12], [0.6, 0.08], [-0.55, 0.15], [-0.7, 0.1]]) {
        ctx.fillRect(x + ox * s - s * 0.02, baseY - oy * s - s * 0.06, s * 0.04, s * 0.06);
      }
      drawLabel(label);
      break;
    }

    case 'university': { // Hinkle Fieldhouse — massive red brick hangar, arched roof, tiny entrance
      // Massive elongated brick body
      ctx.fillStyle = '#8B4020';
      ctx.fillRect(x - s * 0.7, baseY - s * 0.5, s * 1.4, s * 0.5);
      // Prominent arched barrel roof
      ctx.fillStyle = '#6B3010';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.7, baseY - s * 0.5);
      ctx.quadraticCurveTo(x, baseY - s * 0.78, x + s * 0.7, baseY - s * 0.5);
      ctx.fill();
      // Brick buttress bays with pointed stone caps
      ctx.fillStyle = '#9A5030';
      for (let i = -3; i <= 3; i++) {
        const bx = x + i * s * 0.18;
        ctx.fillRect(bx - s * 0.02, baseY - s * 0.52, s * 0.04, s * 0.52);
        // Pointed stone cap on each buttress
        ctx.fillStyle = '#C8C0B0';
        ctx.beginPath();
        ctx.moveTo(bx - s * 0.025, baseY - s * 0.52);
        ctx.lineTo(bx, baseY - s * 0.56);
        ctx.lineTo(bx + s * 0.025, baseY - s * 0.52);
        ctx.fill();
        ctx.fillStyle = '#9A5030';
      }
      // Tall multi-pane windows between buttresses (lit yellow)
      ctx.fillStyle = '#FFE088';
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(x + i * s * 0.18 - s * 0.06, baseY - s * 0.45, s * 0.08, s * 0.25);
      }
      // Comically small entrance (the real one is understated)
      ctx.fillStyle = '#4A2A10';
      ctx.fillRect(x - s * 0.05, baseY - s * 0.12, s * 0.1, s * 0.12);
      // "HINKLE" text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(4, s * 0.06)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('HINKLE', x, baseY - s * 0.14);
      drawLabel(label);
      break;
    }

    case 'monon': { // Monon Trail — paved path, green trees, trail marker sign
      // Trail path
      ctx.fillStyle = '#888888';
      ctx.fillRect(x - s * 0.08, baseY - s * 0.1, s * 0.16, s * 0.15);
      // Dashed center line
      ctx.strokeStyle = '#CCCC00';
      ctx.lineWidth = Math.max(1, s * 0.01);
      ctx.setLineDash([s * 0.03, s * 0.02]);
      ctx.beginPath();
      ctx.moveTo(x, baseY - s * 0.1);
      ctx.lineTo(x, baseY + s * 0.05);
      ctx.stroke();
      ctx.setLineDash([]);
      // Trees on both sides
      ctx.fillStyle = '#3A6A2A';
      for (const [tx, ts] of [[-0.25, 0.18], [-0.18, 0.14], [0.2, 0.16], [0.28, 0.12]]) {
        ctx.beginPath();
        ctx.arc(x + tx * s, baseY - s * 0.2, s * ts, 0, Math.PI * 2);
        ctx.fill();
      }
      // Tree trunks
      ctx.fillStyle = '#5C3D2E';
      for (const tx of [-0.25, -0.18, 0.2, 0.28]) {
        ctx.fillRect(x + tx * s - s * 0.01, baseY - s * 0.08, s * 0.02, s * 0.08);
      }
      // Monon Trail sign post
      ctx.fillStyle = '#666666';
      ctx.fillRect(x + s * 0.35, baseY - s * 0.4, s * 0.03, s * 0.4);
      // Green trail sign
      ctx.fillStyle = '#2D6B2D';
      ctx.fillRect(x + s * 0.28, baseY - s * 0.42, s * 0.18, s * 0.08);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(3, s * 0.04)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('MONON', x + s * 0.37, baseY - s * 0.36);
      drawLabel(label);
      break;
    }

    case 'broadripple': { // Broad Ripple — mismatched storefronts, murals, colorful bridge
      // Irregular-height storefronts
      const brColors = ['#CC5544', '#44AA77', '#4477BB', '#CC8833', '#7744AA'];
      const heights = [0.35, 0.45, 0.3, 0.4, 0.38];
      const shopW = s * 0.32;
      for (let i = 0; i < 5; i++) {
        const sx = x - s * 0.8 + i * shopW;
        const sh = s * heights[i];
        ctx.fillStyle = brColors[i];
        ctx.fillRect(sx, baseY - sh, shopW - s * 0.02, sh);
        // Striped awning
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(sx, baseY - sh, shopW - s * 0.02, s * 0.03);
        for (let j = 0; j < 3; j++) {
          ctx.fillStyle = brColors[i];
          ctx.fillRect(sx + j * shopW * 0.33, baseY - sh + s * 0.03, shopW * 0.16, s * 0.02);
        }
        // Window or door
        ctx.fillStyle = '#FFE88B';
        ctx.fillRect(sx + shopW * 0.2, baseY - sh * 0.6, shopW * 0.5, sh * 0.35);
      }
      // Mural on the tall building — colorful rectangle
      ctx.fillStyle = '#FF6B9D';
      ctx.fillRect(x - s * 0.48 + s * 0.05, baseY - s * 0.4, s * 0.18, s * 0.15);
      ctx.fillStyle = '#44DDDD';
      ctx.fillRect(x - s * 0.48 + s * 0.07, baseY - s * 0.38, s * 0.14, s * 0.11);
      drawLabel(label);
      break;
    }

    case 'stripmall': { // Nora — Monon Trail through suburban trees, quiet residential feel
      // Tree-lined suburban setting
      ctx.fillStyle = '#4A7A3A';
      for (const [tx, ts] of [[-0.6, 0.14], [-0.35, 0.18], [-0.1, 0.16], [0.15, 0.2], [0.4, 0.15], [0.65, 0.17]]) {
        ctx.beginPath();
        ctx.arc(x + tx * s, baseY - s * 0.2, s * ts, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#5C3D2E';
      for (const tx of [-0.6, -0.35, -0.1, 0.15, 0.4, 0.65]) {
        ctx.fillRect(x + tx * s - s * 0.015, baseY - s * 0.08, s * 0.03, s * 0.08);
      }
      // Low commercial building peeking through
      ctx.fillStyle = '#B0A898';
      ctx.fillRect(x - s * 0.4, baseY - s * 0.2, s * 0.8, s * 0.2);
      ctx.fillStyle = '#FFE88B';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - s * 0.3 + i * s * 0.22, baseY - s * 0.15, s * 0.1, s * 0.1);
      }
      drawLabel(label);
      break;
    }

    case 'bigbox': { // Castleton Square Mall — sprawling flat box, anchor stores, parking sea
      // Massive sprawling flat-roofed box
      ctx.fillStyle = '#8A8A8A';
      ctx.fillRect(x - s * 0.9, baseY - s * 0.35, s * 1.8, s * 0.35);
      // Anchor store masses at ends (slightly taller)
      ctx.fillStyle = '#7A7A7A';
      ctx.fillRect(x - s * 0.9, baseY - s * 0.42, s * 0.35, s * 0.42);
      ctx.fillRect(x + s * 0.55, baseY - s * 0.42, s * 0.35, s * 0.42);
      // Minimal windows — classic enclosed mall
      ctx.fillStyle = '#999';
      ctx.fillRect(x - s * 0.25, baseY - s * 0.33, s * 0.5, s * 0.04);
      // Main entrance
      ctx.fillStyle = '#FFE88B';
      ctx.fillRect(x - s * 0.1, baseY - s * 0.22, s * 0.2, s * 0.22);
      // Parking lot — sea of lines
      ctx.fillStyle = '#444';
      ctx.fillRect(x - s * 0.7, baseY, s * 1.4, s * 0.1);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = Math.max(0.5, s * 0.005);
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * s * 0.1, baseY);
        ctx.lineTo(x + i * s * 0.1, baseY + s * 0.08);
        ctx.stroke();
      }
      // Tall pole signs
      ctx.fillStyle = '#666';
      ctx.fillRect(x - s * 0.7, baseY - s * 0.6, s * 0.03, s * 0.55);
      ctx.fillStyle = '#CC3333';
      ctx.fillRect(x - s * 0.78, baseY - s * 0.62, s * 0.2, s * 0.08);
      drawLabel(label);
      break;
    }

    case 'office': { // Keystone Crossing — two buildings with glass arch connector, upscale
      // Left building
      ctx.fillStyle = '#D8D0C0';
      ctx.fillRect(x - s * 0.5, baseY - s * 0.5, s * 0.4, s * 0.5);
      // Right building
      ctx.fillRect(x + s * 0.1, baseY - s * 0.5, s * 0.4, s * 0.5);
      // Glass arch connector — the signature "Crossing" element
      ctx.strokeStyle = 'rgba(130,180,220,0.8)';
      ctx.lineWidth = Math.max(1, s * 0.03);
      ctx.beginPath();
      ctx.moveTo(x - s * 0.1, baseY - s * 0.25);
      ctx.quadraticCurveTo(x, baseY - s * 0.55, x + s * 0.1, baseY - s * 0.25);
      ctx.stroke();
      // Glass fill in arch
      ctx.fillStyle = 'rgba(130,180,220,0.3)';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.1, baseY - s * 0.25);
      ctx.quadraticCurveTo(x, baseY - s * 0.55, x + s * 0.1, baseY - s * 0.25);
      ctx.closePath();
      ctx.fill();
      // Metal canopies over entrances
      ctx.fillStyle = '#888';
      ctx.fillRect(x - s * 0.52, baseY - s * 0.2, s * 0.44, s * 0.02);
      ctx.fillRect(x + s * 0.08, baseY - s * 0.2, s * 0.44, s * 0.02);
      // Windows — refined grid
      ctx.fillStyle = 'rgba(130,180,220,0.4)';
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.fillRect(x - s * 0.46 + c * s * 0.15, baseY - s * 0.47 + r * s * 0.12, s * 0.1, s * 0.08);
          ctx.fillRect(x + s * 0.14 + c * s * 0.15, baseY - s * 0.47 + r * s * 0.12, s * 0.1, s * 0.08);
        }
      }
      drawLabel(label);
      break;
    }

    case 'arts': { // Palladium — Villa Rotonda inspired, 4-wing cruciform, dome, terracotta roof
      // Main body — cream limestone
      ctx.fillStyle = '#E8DDD0';
      ctx.fillRect(x - s * 0.45, baseY - s * 0.5, s * 0.9, s * 0.5);
      // Projecting portico wing
      ctx.fillStyle = '#DDD0C0';
      ctx.fillRect(x - s * 0.55, baseY - s * 0.45, s * 0.15, s * 0.45);
      ctx.fillRect(x + s * 0.4, baseY - s * 0.45, s * 0.15, s * 0.45);
      // Terracotta red tile roof sections
      ctx.fillStyle = '#B85C38';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.55, baseY - s * 0.45);
      ctx.lineTo(x - s * 0.48, baseY - s * 0.55);
      ctx.lineTo(x - s * 0.4, baseY - s * 0.45);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + s * 0.4, baseY - s * 0.45);
      ctx.lineTo(x + s * 0.48, baseY - s * 0.55);
      ctx.lineTo(x + s * 0.55, baseY - s * 0.45);
      ctx.fill();
      // Central dome — cream limestone
      ctx.fillStyle = '#D8CDB8';
      ctx.beginPath();
      ctx.arc(x, baseY - s * 0.55, s * 0.28, Math.PI, 0);
      ctx.fill();
      // Open colonnaded loggias (arcade on second level)
      ctx.fillStyle = '#C8BDA8';
      for (let i = -2; i <= 2; i++) {
        // Column
        ctx.fillRect(x + i * s * 0.15 - s * 0.015, baseY - s * 0.5, s * 0.03, s * 0.2);
        // Arch between columns
        if (i < 2) {
          ctx.beginPath();
          ctx.arc(x + i * s * 0.15 + s * 0.075, baseY - s * 0.5, s * 0.065, Math.PI, 0);
          ctx.stroke();
        }
      }
      // Ground floor columns (taller, supporting the portico)
      ctx.fillStyle = '#F0E8D8';
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(x + i * s * 0.15 - s * 0.02, baseY - s * 0.3, s * 0.04, s * 0.3);
      }
      // Dome lantern/cupola
      ctx.fillStyle = '#C0B098';
      ctx.fillRect(x - s * 0.04, baseY - s * 0.87, s * 0.08, s * 0.06);
      ctx.beginPath();
      ctx.arc(x, baseY - s * 0.87, s * 0.05, Math.PI, 0);
      ctx.fill();
      drawLabel(label);
      break;
    }
  }
}

// ---- Rain Effect ----

function drawRain(ctx, width, height, phase, isMobile) {
  ctx.strokeStyle = 'rgba(180,200,220,0.3)';
  ctx.lineWidth = 1;
  const count = isMobile ? 25 : 60;
  for (let i = 0; i < count; i++) {
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
    this.activeStreetSigns = [];
    this.activeLandmarks = [];
  }

  reset() {
    this.activeStreetSigns = [];
    this.activeLandmarks = [];
  }

  hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  // Place a street sign in the 3D world when player reaches that street
  showStreetSign(name, position) {
    this.activeStreetSigns.push({
      name,
      z: position + 6000,
    });
  }

  // Place a landmark in the 3D world
  showLandmark(type, label, side, position) {
    this.activeLandmarks.push({
      type,
      label,
      side, // -1 left, 1 right
      z: position + 5000, // slightly before the street sign
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

    // Reduce roadside object density on mobile (skip half)
    const isMobile = width <= 500;
    if (isMobile) {
      if (h1 > 0.12) return;
    } else {
      if (h1 > 0.25) return;
    }

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
      drawTree(ctx, treeX, objY, objSize, season, isMobile);
    } else {
      const bldgW = objSize * 1.8;
      const bldgH = objSize * (2 + h1 * 3);
      // Anchor building's road-facing edge at road edge + gap
      const bldgX = roadEdge + side * (gap + bldgW / 2);
      drawBuilding(ctx, bldgX, objY, bldgW, bldgH, season, isMobile);
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

  // Render landmarks that you drive past
  renderLandmarks(ctx, width, height, position) {
    this.activeLandmarks = this.activeLandmarks.filter(l => l.z > position - 500);

    const isMobile = width <= 500;

    for (const lm of this.activeLandmarks) {
      const dz = lm.z - position;
      if (dz <= 10 || dz > 8000) continue;

      const scale = ROAD.CAMERA_DEPTH / dz;
      const horizonY = height * 0.4;
      const screenY = horizonY + scale * ROAD.CAMERA_HEIGHT * height;
      const roadHalfW = scale * ROAD.ROAD_WIDTH * width / 2;

      // Place on the specified side, just outside road edge
      const roadEdge = width / 2 + lm.side * roadHalfW * 1.15;

      // Skip if road edge is off screen
      if (lm.side > 0 && roadEdge > width + 50) continue;
      if (lm.side < 0 && roadEdge < -50) continue;

      const lmX = roadEdge + lm.side * roadHalfW * 0.4;

      // Size scales with perspective — landmarks are big buildings
      const lmSize = Math.max(8, roadHalfW * 0.75);
      if (lmSize < 5) continue;

      // Use simplified drawing on mobile for performance
      if (isMobile) {
        drawLandmarkSimple(ctx, lm.type, lmX, screenY, lmSize, lm.label);
      } else {
        drawLandmark(ctx, lm.type, lmX, screenY, lmSize, lm.label);
      }
    }
  }

  renderWeather(ctx, width, height, season, phase) {
    if (season === 'SPRING') {
      drawRain(ctx, width, height, phase, width <= 500);
    }
  }

  renderSnowForSegment(ctx, s1, s2, season, isMobile) {
    if (season === 'WINTER' && !isMobile) {
      drawSnowEdges(ctx, s1, s2);
    }
  }
}
