// ============================================================
// Pseudo-3D Road Renderer (OutRun-style)
// ============================================================

import { ROAD, COLORS, SEASONS } from './constants.js';

export class Road {
  constructor() {
    this.segmentLength = 200; // world units per segment
  }

  getSeason(miles) {
    if (miles >= SEASONS.SPRING.start) return 'SPRING';
    if (miles >= SEASONS.WINTER.start) return 'WINTER';
    if (miles >= SEASONS.FALL.start) return 'FALL';
    return 'SUMMER';
  }

  getSeasonColors(season, isAlternate) {
    const grassKey = isAlternate ? 'GRASS_LIGHT_' : 'GRASS_DARK_';
    return {
      grass: COLORS[grassKey + season],
      road: isAlternate ? COLORS.ROAD_LIGHT : COLORS.ROAD_DARK,
      rumble: isAlternate ? COLORS.RUMBLE_LIGHT : COLORS.RUMBLE_DARK,
      lane: isAlternate ? COLORS.LANE_MARKER : null,
    };
  }

  // Project a world-space point to screen-space
  // Returns { x, y, w } in screen pixels
  project(worldX, worldZ, cameraZ, playerX, width, height) {
    const dz = worldZ - cameraZ;
    if (dz <= 0) return null;

    // Perspective scale factor
    const scale = ROAD.CAMERA_DEPTH / dz;

    // Horizon sits at ~40% from top
    const horizonY = height * 0.4;

    return {
      x: width / 2 + scale * (worldX - playerX) * width / 2,
      y: horizonY + scale * ROAD.CAMERA_HEIGHT * height,
      w: scale * ROAD.ROAD_WIDTH * width / 2,
      scale,
    };
  }

  render(ctx, width, height, position, playerX, speed, miles) {
    const season = this.getSeason(miles);

    // Draw sky
    const skyColors = COLORS['SKY_' + season];
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
    skyGrad.addColorStop(0, skyColors.top);
    skyGrad.addColorStop(1, skyColors.bottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // The camera is at `position`. We draw segments ahead of the camera.
    const baseSegIndex = Math.floor(position / this.segmentLength);
    const drawCount = ROAD.DRAW_DISTANCE;

    // Project all visible segments
    const projected = [];
    for (let n = 1; n <= drawCount; n++) {
      const segIndex = baseSegIndex + n;
      const worldZ = segIndex * this.segmentLength;

      const p = this.project(0, worldZ, position, playerX * ROAD.ROAD_WIDTH * 0.3, width, height);
      if (!p) continue;
      if (p.y < 0) continue; // above screen

      projected.push({ p, segIndex, n });
    }

    // Draw back to front (far segments first, near segments on top)
    // But we need pairs: each quad is drawn between segment[i] and segment[i+1]
    // Far segments have smaller y (closer to horizon), near segments have larger y (closer to bottom)
    // So we iterate from beginning (far) to end (near)

    let clipY = height; // only draw above previous segment

    for (let i = projected.length - 2; i >= 0; i--) {
      const far = projected[i];
      const near = projected[i + 1];

      const s1 = far.p;   // farther (smaller y, closer to horizon)
      const s2 = near.p;  // nearer (larger y, closer to bottom)

      // Clip — don't draw if below the clip line
      if (s1.y >= clipY) continue;
      if (s2.y > clipY) {
        // s2 extends below clip; we still draw but grass gets clipped naturally
      }

      // Alternate colors based on world segment index
      const isAlt = Math.floor(far.segIndex / ROAD.RUMBLE_LENGTH) % 2 === 0;
      const colors = this.getSeasonColors(season, isAlt);

      // Draw grass strip (full width, between s1.y and s2.y)
      const grassTop = Math.max(0, s1.y);
      const grassBot = Math.min(clipY, s2.y);
      if (grassBot > grassTop) {
        ctx.fillStyle = colors.grass;
        ctx.fillRect(0, grassTop, width, grassBot - grassTop + 1);
      }

      // Draw rumble strips (slightly wider than road)
      const rumbleW1 = s1.w * 1.15;
      const rumbleW2 = s2.w * 1.15;
      this.drawQuad(ctx, s1.x, s1.y, rumbleW1, s2.x, s2.y, rumbleW2, colors.rumble);

      // Draw road surface
      this.drawQuad(ctx, s1.x, s1.y, s1.w, s2.x, s2.y, s2.w, colors.road);

      // Draw lane markings (dashed center line)
      if (colors.lane) {
        const laneW1 = s1.w * 0.01;
        const laneW2 = s2.w * 0.01;
        this.drawQuad(ctx, s1.x, s1.y, laneW1, s2.x, s2.y, laneW2, colors.lane);
      }

      clipY = s1.y;
    }
  }

  drawQuad(ctx, x1, y1, w1, x2, y2, w2, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1 - w1, y1);
    ctx.lineTo(x1 + w1, y1);
    ctx.lineTo(x2 + w2, y2);
    ctx.lineTo(x2 - w2, y2);
    ctx.closePath();
    ctx.fill();
  }
}
