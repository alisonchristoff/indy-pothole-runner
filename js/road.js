// ============================================================
// Pseudo-3D Road Renderer (OutRun-style)
// ============================================================

import { ROAD, COLORS, SEASONS } from './constants.js';

export class Road {
  constructor() {
    this.segmentLength = 200; // world units per segment
    this._cachedSkyGrad = null;
    this._cachedSkySeason = null;
    this._cachedSkyH = 0;
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

  render(ctx, width, height, position, playerX, speed, miles, scenery) {
    const season = this.getSeason(miles);

    // Draw sky (full canvas, road draws on top) — cache gradient
    if (this._cachedSkySeason !== season || this._cachedSkyH !== height) {
      const skyColors = COLORS['SKY_' + season];
      this._cachedSkyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      this._cachedSkyGrad.addColorStop(0, skyColors.top);
      this._cachedSkyGrad.addColorStop(1, skyColors.bottom);
      this._cachedSkySeason = season;
      this._cachedSkyH = height;
    }
    ctx.fillStyle = this._cachedSkyGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw skyline silhouette on the horizon
    if (scenery) {
      scenery.renderSkyline(ctx, width, height, season);
    }

    const baseSegIndex = Math.floor(position / this.segmentLength);

    // Reduce draw distance on mobile for performance
    const drawDist = width <= 500 ? Math.min(60, ROAD.DRAW_DISTANCE) : ROAD.DRAW_DISTANCE;

    // Camera stays centered on road
    const projected = [];
    for (let n = 1; n <= drawDist; n++) {
      const segIndex = baseSegIndex + n;
      const worldZ = segIndex * this.segmentLength;

      const p = this.project(0, worldZ, position, 0, width, height);
      if (!p) continue;

      projected.push({ p, segIndex });
    }

    // Fill gap between horizon and farthest segment with grass color
    if (projected.length > 0) {
      const farthestY = projected[projected.length - 1].p.y;
      const horizonY = height * 0.4;
      if (farthestY > horizonY) {
        const farthestAlt = Math.floor(projected[projected.length - 1].segIndex / ROAD.RUMBLE_LENGTH) % 2 === 0;
        ctx.fillStyle = this.getSeasonColors(season, farthestAlt).grass;
        ctx.fillRect(0, horizonY, width, farthestY - horizonY + 1);
      }
    }

    // Draw from FARTHEST to NEAREST (painter's algorithm)
    for (let i = projected.length - 1; i > 0; i--) {
      const farSeg = projected[i];
      const nearSeg = projected[i - 1];

      const s1 = farSeg.p;  // top of quad (smaller y)
      const s2 = nearSeg.p; // bottom of quad (larger y)

      if (s1.y > height && s2.y > height) continue;
      if (s2.y < 0) continue;

      const isAlt = Math.floor(farSeg.segIndex / ROAD.RUMBLE_LENGTH) % 2 === 0;
      const colors = this.getSeasonColors(season, isAlt);

      // Grass
      ctx.fillStyle = colors.grass;
      ctx.fillRect(0, s1.y, width, s2.y - s1.y + 1);

      // Rumble strips
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

      // Snow on road edges (winter)
      if (scenery) {
        scenery.renderSnowForSegment(ctx, s1, s2, season, width <= 500);
      }

      // Roadside objects (trees, buildings)
      if (scenery) {
        scenery.renderRoadsideForSegment(ctx, s1, s2, farSeg.segIndex, width, height, season);
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
