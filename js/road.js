// ============================================================
// Pseudo-3D Road Renderer (OutRun-style)
// ============================================================

import { ROAD, COLORS, SEASONS } from './constants.js';

// A road segment stores world-space and projected screen-space coords
function createSegment(index) {
  return {
    index,
    p: { world: { z: index * ROAD.SEGMENT_COUNT }, screen: {} },
    color: {},
  };
}

export class Road {
  constructor() {
    this.segments = [];
    this.totalSegments = ROAD.SEGMENT_COUNT * 4; // enough segments for the loop
    this.segmentLength = 200; // world units per segment
    this.trackLength = 0;

    this.buildTrack();
  }

  buildTrack() {
    this.segments = [];
    for (let i = 0; i < this.totalSegments; i++) {
      const seg = {
        index: i,
        world: { z: i * this.segmentLength },
        screen: { x: 0, y: 0, w: 0 },
        color: {},
        clip: 0,
      };
      this.segments.push(seg);
    }
    this.trackLength = this.totalSegments * this.segmentLength;
  }

  getSegment(z) {
    const index = Math.floor(z / this.segmentLength) % this.totalSegments;
    return this.segments[index < 0 ? index + this.totalSegments : index];
  }

  project(seg, cameraX, cameraZ, cameraY, width, height) {
    const halfW = width / 2;
    const halfH = height / 2;
    const dz = seg.world.z - cameraZ;

    // Don't render segments behind the camera
    if (dz <= 0) {
      seg.screen.scale = 0;
      return;
    }

    const scale = ROAD.CAMERA_DEPTH / dz;
    seg.screen.scale = scale;
    seg.screen.x = halfW + (scale * cameraX * halfW);
    seg.screen.y = halfH - (scale * cameraY * halfH);
    seg.screen.w = scale * ROAD.ROAD_WIDTH * halfW;
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
      lane: isAlternate ? COLORS.LANE_MARKER : null, // only draw lane on alternate
    };
  }

  getSkyGradient(ctx, season, width, height) {
    const skyKey = 'SKY_' + season;
    const colors = COLORS[skyKey];
    const grad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    grad.addColorStop(0, colors.top);
    grad.addColorStop(1, colors.bottom);
    return grad;
  }

  render(ctx, width, height, position, playerX, speed, miles) {
    const season = this.getSeason(miles);
    const cameraY = ROAD.CAMERA_HEIGHT;
    const baseSegIndex = Math.floor(position / this.segmentLength);

    // Draw sky
    const skyGrad = this.getSkyGradient(ctx, season, width, height);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Find the base segment
    let maxY = height; // clip line — only draw segments above previous ones

    // Draw segments from far to near
    const drawCount = ROAD.DRAW_DISTANCE;

    // First pass: project all visible segments
    const visibleSegs = [];
    for (let n = 0; n < drawCount; n++) {
      const segIndex = (baseSegIndex + n) % this.totalSegments;
      const seg = this.segments[segIndex];

      // Use an offset z so the camera is always at position
      const loopedZ = seg.world.z;
      const adjustedZ = loopedZ;

      // For segments that wrapped around
      let worldZ = adjustedZ;
      if (segIndex < baseSegIndex % this.totalSegments) {
        worldZ += this.trackLength;
      }

      // Project
      const dz = worldZ - position;
      if (dz <= 0) continue;

      const scale = ROAD.CAMERA_DEPTH / dz;
      const halfW = width / 2;
      const halfH = height / 2;

      seg.screen.scale = scale;
      seg.screen.x = halfW + (scale * (-playerX) * halfW);
      seg.screen.y = halfH - (scale * cameraY * halfH);
      seg.screen.w = scale * ROAD.ROAD_WIDTH * halfW;

      visibleSegs.push({ seg, n, worldZ });
    }

    // Draw from far to near
    for (let i = 0; i < visibleSegs.length; i++) {
      const { seg, n } = visibleSegs[i];
      const nextEntry = visibleSegs[i + 1];

      if (!nextEntry) continue;

      const s1 = seg.screen;
      const s2 = nextEntry.seg.screen;

      if (s1.scale <= 0 || s2.scale <= 0) continue;

      // Alternate colors based on segment index
      const isAlt = Math.floor(n / ROAD.RUMBLE_LENGTH) % 2 === 0;
      const colors = this.getSeasonColors(season, isAlt);

      // Draw grass
      ctx.fillStyle = colors.grass;
      ctx.fillRect(0, s2.y, width, s1.y - s2.y + 1);

      // Draw road
      this.drawPolygon(ctx, s2.x, s2.y, s2.w, s1.x, s1.y, s1.w, colors.road);

      // Draw rumble strips
      const rumbleW2 = s2.w * 1.15;
      const rumbleW1 = s1.w * 1.15;
      this.drawPolygon(ctx, s2.x, s2.y, rumbleW2, s1.x, s1.y, rumbleW1, colors.rumble);
      // Re-draw road on top of rumble
      this.drawPolygon(ctx, s2.x, s2.y, s2.w, s1.x, s1.y, s1.w, colors.road);

      // Draw lane markings (dashed center line)
      if (colors.lane) {
        const laneW = s2.w * 0.005;
        const laneW1 = s1.w * 0.005;
        this.drawPolygon(ctx, s2.x, s2.y, laneW, s1.x, s1.y, laneW1, colors.lane);
      }
    }
  }

  drawPolygon(ctx, x1, y1, w1, x2, y2, w2, color) {
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
