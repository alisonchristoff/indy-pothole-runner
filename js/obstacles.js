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
    let rate = POTHOLE.SPAWN_RATE_INITIAL;
    if (miles >= SEASONS.SPRING.start) {
      rate = POTHOLE.SPAWN_RATE_MAX;
    } else if (miles >= SEASONS.WINTER.start) {
      rate = POTHOLE.SPAWN_RATE_INITIAL + (POTHOLE.SPAWN_RATE_MAX - POTHOLE.SPAWN_RATE_INITIAL) * 0.6;
    } else if (miles >= SEASONS.FALL.start) {
      rate = POTHOLE.SPAWN_RATE_INITIAL + (POTHOLE.SPAWN_RATE_MAX - POTHOLE.SPAWN_RATE_INITIAL) * 0.3;
    }
    return rate;
  }

  update(position, speed, miles) {
    const spawnRate = this.getSpawnRate(miles);

    // Spawn new potholes ahead (close enough to reach player in a few seconds)
    if (Math.random() < spawnRate) {
      const size = POTHOLE.MIN_SIZE + Math.random() * (POTHOLE.MAX_SIZE - POTHOLE.MIN_SIZE);
      const isWater = miles >= SEASONS.SPRING.start && Math.random() < 0.3;

      this.potholes.push({
        // Spawn 2000-4000 units ahead (arrives in ~2-4 seconds at initial speed)
        z: position + 2000 + Math.random() * 2000,
        // x: -0.8 to 0.8 across the road (same scale as car.x)
        x: (Math.random() - 0.5) * 1.6,
        size,
        isWater,
        hit: false,
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
        // Compare in normalized road coordinates (both -0.8 to 0.8 range)
        const dx = Math.abs(pothole.x - playerX);
        const sizeScale = pothole.size / POTHOLE.MAX_SIZE;
        // Hit if car center is within pothole width
        if (dx < 0.12 + sizeScale * 0.08) {
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

      // Pothole screen position (x is in same -0.8..0.8 space as car)
      const screenX = width / 2 + pothole.x * roadHalfW;

      // Pothole visual size scales with perspective
      const screenSize = scale * pothole.size * width * 0.12;
      if (screenSize < 1) continue;
      if (screenY < 0 || screenY > height) continue;

      // Outer ring (shadow/depth)
      ctx.fillStyle = COLORS.POTHOLE_RING;
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, screenSize * 1.3, screenSize * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner hole
      ctx.fillStyle = pothole.isWater ? '#2A4A6A' : COLORS.POTHOLE_FILL;
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, screenSize, screenSize * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Water shimmer
      if (pothole.isWater) {
        ctx.fillStyle = 'rgba(100,160,220,0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX - screenSize * 0.2, screenY - screenSize * 0.08, screenSize * 0.4, screenSize * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
