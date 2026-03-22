// ============================================================
// Potholes — Generation, Rendering, Collision Detection
// ============================================================

import { POTHOLE, ROAD, COLORS, SEASONS } from './constants.js';

export class Obstacles {
  constructor(road) {
    this.road = road;
    this.potholes = [];
  }

  reset() {
    this.potholes = [];
  }

  getSpawnRate(miles) {
    // Smooth ramp from initial to max over the full distance
    // progress goes 0 → 1 as miles go 0 → SPRING start
    const maxMiles = SEASONS.SPRING.start; // 4.0 mi
    const progress = Math.min(1, miles / maxMiles);
    // Ease-in curve so early game stays easy longer
    const eased = progress * progress;
    return POTHOLE.SPAWN_RATE_INITIAL + (POTHOLE.SPAWN_RATE_MAX - POTHOLE.SPAWN_RATE_INITIAL) * eased;
  }

  update(position, speed, miles) {
    const spawnRate = this.getSpawnRate(miles);

    // Spawn new potholes ahead (close enough to reach player in a few seconds)
    if (Math.random() < spawnRate) {
      // Weighted size distribution — mostly small/medium, occasionally huge
      const r = Math.random();
      const sizeFactor = r < 0.5 ? r * 2 * 0.4 :   // 50%: small (0-40% of range)
                         r < 0.85 ? 0.4 + (r - 0.5) / 0.35 * 0.35 : // 35%: medium (40-75%)
                         0.75 + (r - 0.85) / 0.15 * 0.25; // 15%: large (75-100%)
      const size = POTHOLE.MIN_SIZE + sizeFactor * (POTHOLE.MAX_SIZE - POTHOLE.MIN_SIZE);
      const isWater = miles >= SEASONS.SPRING.start && Math.random() < 0.3;

      // Generate jagged edge offsets (8-12 points around the rim)
      const numPoints = 8 + Math.floor(Math.random() * 5);
      const jagged = [];
      for (let i = 0; i < numPoints; i++) {
        jagged.push(0.7 + Math.random() * 0.5); // radius multiplier 0.7-1.2
      }

      this.potholes.push({
        z: position + 2000 + Math.random() * 2000,
        x: (Math.random() - 0.5) * 0.4,
        size,
        isWater,
        hit: false,
        jagged,
        elongation: 0.7 + Math.random() * 0.6, // 0.7-1.3 width/height ratio
      });
    }

    // Remove potholes behind the camera
    this.potholes = this.potholes.filter(p => p.z > position - 500);
  }

  // Get the screen X position of a road-normalized x value at a given Z depth
  getScreenX(roadX, worldZ, position, width, height) {
    const dz = worldZ - position;
    if (dz <= 0) return null;
    const scale = ROAD.CAMERA_DEPTH / dz;
    const horizonY = height * 0.4;
    const screenY = horizonY + scale * ROAD.CAMERA_HEIGHT * height;
    // Road half-width at this depth in pixels
    const roadHalfW = scale * ROAD.ROAD_WIDTH * width / 2;
    return {
      x: width / 2 + roadX * roadHalfW,
      y: screenY,
      roadHalfW,
      scale,
    };
  }

  checkCollision(playerX, position, width, height) {
    // Figure out where the car is in world Z
    // Car renders at height * 0.82. Solve for Z: 0.82*h = 0.4*h + scale*CAM_H*h
    // scale = 0.42 / CAM_H = 0.42 / 150 = 0.0028
    // dz = CAM_DEPTH / scale = 0.84 / 0.0028 = 300
    const carZ = position + 300;
    const hitZoneZ = 150; // tight Z tolerance

    for (const pothole of this.potholes) {
      if (pothole.hit) continue;

      const dz = Math.abs(pothole.z - carZ);
      if (dz < hitZoneZ) {
        // Compare in normalized road coordinates (both -0.2 to 0.2 range)
        const dx = Math.abs(pothole.x - playerX);
        const sizeScale = pothole.size / POTHOLE.MAX_SIZE;
        // Hit if car center is within pothole width (scaled with elongation)
        const elong = pothole.elongation || 1;
        if (dx < 0.02 + sizeScale * 0.04 * elong) {
          pothole.hit = true;
          return pothole;
        }
      }
    }
    return null;
  }

  render(ctx, width, height, position) {
    // Sort far-to-near (painter's algorithm)
    const sorted = this.potholes
      .filter(p => {
        const dz = p.z - position;
        return dz > 10 && dz <= this.road.segmentLength * ROAD.DRAW_DISTANCE;
      })
      .sort((a, b) => b.z - a.z);

    for (const pothole of sorted) {
      const dz = pothole.z - position;
      const scale = ROAD.CAMERA_DEPTH / dz;
      const horizonY = height * 0.4;
      const screenY = horizonY + scale * ROAD.CAMERA_HEIGHT * height;

      // Road half-width at this depth
      const roadHalfW = scale * ROAD.ROAD_WIDTH * width / 2;

      // Pothole screen position
      const screenX = width / 2 + pothole.x * roadHalfW;

      // Pothole visual size scales with perspective
      const screenSize = scale * pothole.size * width * 0.12;
      if (screenSize < 1) continue;
      if (screenY < 0 || screenY > height) continue;

      const elong = pothole.elongation || 1;
      const jaggedPts = pothole.jagged || [];
      const numPts = jaggedPts.length || 10;

      // Outer ring (cracked asphalt edge) — jagged shape
      ctx.fillStyle = COLORS.POTHOLE_RING;
      ctx.beginPath();
      for (let i = 0; i <= numPts; i++) {
        const idx = i % numPts;
        const angle = (idx / numPts) * Math.PI * 2;
        const jag = jaggedPts[idx] || 1;
        const rx = screenSize * 1.3 * elong * jag;
        const ry = screenSize * 0.5 * jag;
        const px = screenX + Math.cos(angle) * rx;
        const py = screenY + Math.sin(angle) * ry;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Inner hole — jagged but slightly smoother
      ctx.fillStyle = pothole.isWater ? '#2A4A6A' : COLORS.POTHOLE_FILL;
      ctx.beginPath();
      for (let i = 0; i <= numPts; i++) {
        const idx = i % numPts;
        const angle = (idx / numPts) * Math.PI * 2;
        const jag = 0.7 + jaggedPts[idx] * 0.3;
        const rx = screenSize * elong * jag;
        const ry = screenSize * 0.35 * jag;
        const px = screenX + Math.cos(angle) * rx;
        const py = screenY + Math.sin(angle) * ry;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Cracked edges detail (for larger potholes)
      if (screenSize > 8) {
        ctx.strokeStyle = 'rgba(60,60,60,0.5)';
        ctx.lineWidth = Math.max(0.5, screenSize * 0.03);
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3 + 0.1) * Math.PI * 2;
          const jag = jaggedPts[i % numPts] || 1;
          const innerR = screenSize * 0.3 * elong;
          const outerR = screenSize * 1.2 * elong * jag;
          ctx.beginPath();
          ctx.moveTo(screenX + Math.cos(angle) * innerR, screenY + Math.sin(angle) * innerR * 0.35);
          ctx.lineTo(screenX + Math.cos(angle) * outerR, screenY + Math.sin(angle) * outerR * 0.4);
          ctx.stroke();
        }
      }

      // Water shimmer
      if (pothole.isWater) {
        ctx.fillStyle = 'rgba(100,160,220,0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX - screenSize * 0.2, screenY - screenSize * 0.08, screenSize * 0.4 * elong, screenSize * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
