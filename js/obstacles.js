// ============================================================
// Potholes — Generation, Rendering, Collision Detection
// ============================================================

import { POTHOLE, GAME, ROAD, COLORS, SEASONS } from './constants.js';

export class Obstacles {
  constructor(road) {
    this.road = road;
    this.potholes = [];
  }

  reset() {
    this.potholes = [];
  }

  getSpawnRate(miles) {
    // Ramp up spawn rate based on season/distance
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

    // Spawn new potholes ahead
    if (Math.random() < spawnRate) {
      const size = POTHOLE.MIN_SIZE + Math.random() * (POTHOLE.MAX_SIZE - POTHOLE.MIN_SIZE);
      // At spring, chance of water-filled pothole
      const isWater = miles >= SEASONS.SPRING.start && Math.random() < 0.3;

      this.potholes.push({
        z: position + this.road.segmentLength * ROAD.DRAW_DISTANCE * 0.9,
        x: (Math.random() - 0.5) * 1.4, // -0.7 to 0.7 across road
        size,
        isWater,
        hit: false,
      });
    }

    // Remove potholes that are behind the camera
    this.potholes = this.potholes.filter(p => p.z > position - this.road.segmentLength * 5);
  }

  checkCollision(playerX, position) {
    const carZ = position + this.road.segmentLength * 2; // car is a few segments ahead of camera
    const hitZone = this.road.segmentLength * 3;
    const hitXRange = 0.18;

    for (const pothole of this.potholes) {
      if (pothole.hit) continue;

      const dz = Math.abs(pothole.z - carZ);
      if (dz < hitZone) {
        const dx = Math.abs(pothole.x - playerX);
        const sizeScale = pothole.size / POTHOLE.MAX_SIZE;
        if (dx < hitXRange + sizeScale * 0.12) {
          pothole.hit = true;
          return pothole;
        }
      }
    }
    return null;
  }

  render(ctx, width, height, position, playerX) {
    const cameraY = ROAD.CAMERA_HEIGHT;

    for (const pothole of this.potholes) {
      const dz = pothole.z - position;
      if (dz <= 0 || dz > this.road.segmentLength * ROAD.DRAW_DISTANCE) continue;

      const scale = ROAD.CAMERA_DEPTH / dz;
      const halfW = width / 2;
      const halfH = height / 2;

      const screenX = halfW + scale * (-playerX + pothole.x) * halfW;
      const screenY = halfH - scale * cameraY * halfH;
      const screenSize = scale * pothole.size * halfW * 0.5;

      if (screenSize < 1) continue;

      // Outer ring (shadow)
      ctx.fillStyle = COLORS.POTHOLE_RING;
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, screenSize * 1.2, screenSize * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner hole
      ctx.fillStyle = pothole.isWater ? '#2A4A6A' : COLORS.POTHOLE_FILL;
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, screenSize, screenSize * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Water shimmer
      if (pothole.isWater) {
        ctx.fillStyle = 'rgba(100,160,220,0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX - screenSize * 0.2, screenY - screenSize * 0.1, screenSize * 0.4, screenSize * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
