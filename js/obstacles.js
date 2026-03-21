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

    // Spawn new potholes far ahead
    if (Math.random() < spawnRate) {
      const size = POTHOLE.MIN_SIZE + Math.random() * (POTHOLE.MAX_SIZE - POTHOLE.MIN_SIZE);
      const isWater = miles >= SEASONS.SPRING.start && Math.random() < 0.3;

      this.potholes.push({
        z: position + this.road.segmentLength * ROAD.DRAW_DISTANCE * 0.8,
        x: (Math.random() - 0.5) * 1.4, // -0.7 to 0.7 across road width
        size,
        isWater,
        hit: false,
      });
    }

    // Remove potholes that have scrolled behind the camera
    this.potholes = this.potholes.filter(p => p.z > position - 500);
  }

  checkCollision(playerX, position) {
    // The car visually sits a few segments ahead of the camera position
    const carZ = position + this.road.segmentLength * 3;
    const hitZoneZ = this.road.segmentLength * 2;

    for (const pothole of this.potholes) {
      if (pothole.hit) continue;

      const dz = Math.abs(pothole.z - carZ);
      if (dz < hitZoneZ) {
        // Convert playerX (-0.8 to 0.8) to same scale as pothole.x (-0.7 to 0.7)
        const dx = Math.abs(pothole.x - playerX);
        const sizeScale = pothole.size / POTHOLE.MAX_SIZE;
        if (dx < 0.15 + sizeScale * 0.1) {
          pothole.hit = true;
          return pothole;
        }
      }
    }
    return null;
  }

  render(ctx, width, height, position, playerX) {
    // Sort far-to-near so closer potholes draw on top
    const sorted = this.potholes
      .filter(p => {
        const dz = p.z - position;
        return dz > 0 && dz <= this.road.segmentLength * ROAD.DRAW_DISTANCE;
      })
      .sort((a, b) => b.z - a.z);

    for (const pothole of sorted) {
      // Use the same projection as the road
      const p = this.road.project(
        pothole.x * ROAD.ROAD_WIDTH * 0.3,
        pothole.z,
        position,
        playerX * ROAD.ROAD_WIDTH * 0.3,
        width,
        height
      );
      if (!p || p.y < 0 || p.y > height) continue;

      const screenSize = p.scale * pothole.size * width * 0.15;
      if (screenSize < 1) continue;

      // Outer ring (shadow/depth)
      ctx.fillStyle = COLORS.POTHOLE_RING;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, screenSize * 1.3, screenSize * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner hole
      ctx.fillStyle = pothole.isWater ? '#2A4A6A' : COLORS.POTHOLE_FILL;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, screenSize, screenSize * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Water shimmer
      if (pothole.isWater) {
        ctx.fillStyle = 'rgba(100,160,220,0.3)';
        ctx.beginPath();
        ctx.ellipse(p.x - screenSize * 0.2, p.y - screenSize * 0.08, screenSize * 0.4, screenSize * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
