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

  // Project a world-space Z position to screen-space
  project(worldX, worldZ, cameraZ, cameraX, width, height) {
    const dz = worldZ - cameraZ;
    if (dz <= 0) return null;

    const scale = ROAD.CAMERA_DEPTH / dz;
    const horizonY = height * 0.4;

    return {
      x: width / 2 + scale * (worldX - cameraX) * width / 2,
      y: horizonY + scale * ROAD.CAMERA_HEIGHT * height,
      w: scale * ROAD.ROAD_WIDTH * width / 2,
      scale,
    };
  }

  render(ctx, width, height, position, playerX, speed, miles) {
    const season = this.getSeason(miles);

    // Draw sky (full canvas, road draws on top)
    const skyColors = COLORS['SKY_' + season];
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    skyGrad.addColorStop(0, skyColors.top);
    skyGrad.addColorStop(1, skyColors.bottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    const baseSegIndex = Math.floor(position / this.segmentLength);
    const cameraX = playerX * ROAD.ROAD_WIDTH * 0.3;

    // Project all segments from nearest to farthest
    // n=1 is closest to camera, n=DRAW_DISTANCE is farthest
    const projected = [];
    for (let n = 1; n <= ROAD.DRAW_DISTANCE; n++) {
      const segIndex = baseSegIndex + n;
      const worldZ = segIndex * this.segmentLength;

      const p = this.project(0, worldZ, position, cameraX, width, height);
      if (!p) continue;

      projected.push({ p, segIndex });
    }

    // Draw from FARTHEST to NEAREST (painter's algorithm)
    // projected[last] = farthest (smallest y, near horizon)
    // projected[0] = nearest (largest y, near bottom of screen)
    // So iterate from end to start
    for (let i = projected.length - 1; i > 0; i--) {
      const farSeg = projected[i];     // farther from camera (smaller y)
      const nearSeg = projected[i - 1]; // closer to camera (larger y)

      const s1 = farSeg.p;  // top of quad (smaller y)
      const s2 = nearSeg.p; // bottom of quad (larger y)

      // Skip if entirely off screen
      if (s1.y > height && s2.y > height) continue;
      if (s2.y < 0) continue;

      // Alternate colors based on world segment index
      const isAlt = Math.floor(farSeg.segIndex / ROAD.RUMBLE_LENGTH) % 2 === 0;
      const colors = this.getSeasonColors(season, isAlt);

      // Grass (full-width horizontal strip between the two y values)
      ctx.fillStyle = colors.grass;
      ctx.fillRect(0, s1.y, width, s2.y - s1.y + 1);

      // Rumble strips (slightly wider than road)
      this.drawQuad(ctx,
        s1.x, s1.y, s1.w * 1.15,
        s2.x, s2.y, s2.w * 1.15,
        colors.rumble);

      // Road surface
      this.drawQuad(ctx,
        s1.x, s1.y, s1.w,
        s2.x, s2.y, s2.w,
        colors.road);

      // Dashed center lane marking
      if (colors.lane) {
        this.drawQuad(ctx,
          s1.x, s1.y, s1.w * 0.01,
          s2.x, s2.y, s2.w * 0.01,
          colors.lane);
      }
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
