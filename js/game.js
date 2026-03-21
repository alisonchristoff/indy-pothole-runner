// ============================================================
// Game — Main loop and state management
// ============================================================

import { GAME, CAR, REPAIR_COSTS, STREET_SIGNS } from './constants.js';
import { Road } from './road.js';
import { Car } from './car.js';
import { Input } from './input.js';
import { Obstacles } from './obstacles.js';
import { HUD } from './hud.js';
import { Screens } from './screens.js';
import { Audio } from './audio.js';

const STATES = {
  TITLE: 'title',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
};

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.road = new Road();
    this.car = new Car();
    this.input = new Input(this.canvas);
    this.obstacles = new Obstacles(this.road);
    this.hud = new HUD();
    this.screens = new Screens(this.canvas);
    this.audio = new Audio();

    this.state = STATES.TITLE;
    this.position = 0;
    this.speed = 0;
    this.miles = 0;
    this.repairCost = 0;
    this.lastStreet = '';
    this.nextStreetIndex = 0;
    this.animPhase = 0;

    // Button bounds for click detection
    this.buttons = {};

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Click/tap handling for menus
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('touchend', (e) => {
      // Only handle taps on menu screens, not during gameplay
      if (this.state !== STATES.PLAYING) {
        const touch = e.changedTouches[0];
        this.handleClick({
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
      }
    });

    // Pause button (Escape key)
    // Handled in game loop via input

    // Mute button
    this.muteBtn = document.getElementById('muteBtn');
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const muted = this.audio.toggle();
        this.muteBtn.textContent = muted ? '🔇' : '🔊';
      });
    }

    this.lastTime = 0;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.state === STATES.TITLE && this.buttons.start) {
      const b = this.buttons.start;
      if (x >= b.btnX && x <= b.btnX + b.btnW && y >= b.btnY && y <= b.btnY + b.btnH) {
        this.startGame();
      }
    } else if (this.state === STATES.GAME_OVER && this.buttons.gameOver) {
      const { driveBtn, shareBtn } = this.buttons.gameOver;
      if (this.hitTest(x, y, driveBtn)) {
        this.startGame();
      } else if (this.hitTest(x, y, shareBtn)) {
        this.share();
      }
    } else if (this.state === STATES.PAUSED && this.buttons.pause) {
      const { resumeBtn, quitBtn } = this.buttons.pause;
      if (this.hitTest(x, y, resumeBtn)) {
        this.state = STATES.PLAYING;
      } else if (this.hitTest(x, y, quitBtn)) {
        this.state = STATES.TITLE;
      }
    }
  }

  hitTest(x, y, btn) {
    return x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h;
  }

  startGame() {
    this.audio.init();
    this.state = STATES.PLAYING;
    this.position = 0;
    this.speed = GAME.INITIAL_SPEED;
    this.miles = 0;
    this.repairCost = 0;
    this.lastStreet = STREET_SIGNS[0].name;
    this.nextStreetIndex = 1;
    this.car.reset();
    this.obstacles.reset();
    this.hud.reset();
  }

  share() {
    const text = `I survived ${this.miles.toFixed(1)} miles on Indianapolis roads and racked up $${this.repairCost.toLocaleString()} in repairs before my car died at ${this.lastStreet}. Think you can do better?`;

    if (navigator.share) {
      navigator.share({
        title: 'Indy Pothole Runner',
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
        // Brief visual feedback
        this.hud.message = 'Copied to clipboard!';
        this.hud.messageTimer = 90;
      }).catch(() => {});
    }
  }

  update(dt) {
    if (this.state !== STATES.PLAYING) return;

    // Check pause
    if (this.input.isEscapePressed()) {
      this.input.consumeEscape();
      this.state = STATES.PAUSED;
      return;
    }

    // Input
    const dir = this.input.update();
    this.car.update(dir, this.speed);

    // Speed increases over time
    this.speed = Math.min(GAME.MAX_SPEED, this.speed + GAME.SPEED_INCREASE_RATE);

    // Position advances (no track looping — infinite road)
    this.position += this.speed * this.road.segmentLength * 0.02;

    // Miles
    this.miles = this.position * GAME.MILES_PER_UNIT;

    // Street signs
    if (this.nextStreetIndex < STREET_SIGNS.length &&
        this.miles >= STREET_SIGNS[this.nextStreetIndex].distance) {
      this.lastStreet = STREET_SIGNS[this.nextStreetIndex].name;
      this.nextStreetIndex++;
    }

    // Obstacles
    this.obstacles.update(this.position, this.speed, this.miles);

    // Collision
    const hit = this.obstacles.checkCollision(this.car.x, this.position, this.width, this.height);
    if (hit) {
      this.car.hit();
      const dmg = this.car.damage;
      this.repairCost += REPAIR_COSTS[dmg - 1] || 0;
      this.hud.showDamageMessage(dmg);
      this.audio.playHit();

      if (dmg >= CAR.MAX_DAMAGE) {
        this.state = STATES.GAME_OVER;
        this.audio.playGameOver();
      }
    }

    this.hud.update();
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    this.animPhase++;

    if (this.state === STATES.TITLE) {
      this.buttons.start = this.screens.renderTitle(ctx, w, h, this.animPhase);
      return;
    }

    // Apply screen shake
    const shake = this.hud.getShakeOffset();
    if (shake.x || shake.y) {
      ctx.save();
      ctx.translate(shake.x, shake.y);
    }

    // Road
    this.road.render(ctx, w, h, this.position, this.car.x, this.speed, this.miles);

    // Potholes
    this.obstacles.render(ctx, w, h, this.position);

    // Car
    this.car.render(ctx, w, h);

    if (shake.x || shake.y) {
      ctx.restore();
    }

    // HUD
    this.hud.render(ctx, w, h, this.miles, this.car.damage, this.repairCost, this.lastStreet);

    // Pause button (top right area during gameplay)
    if (this.state === STATES.PLAYING) {
      const scale = w / 420;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = `${20 * scale}px system-ui`;
      ctx.textAlign = 'right';
      ctx.fillText('⏸', w - 16 * scale, h * 0.07 + 50 * scale);
    }

    // Overlays
    if (this.state === STATES.GAME_OVER) {
      this.buttons.gameOver = this.screens.renderGameOver(
        ctx, w, h, this.miles, this.car.damage, this.repairCost, this.lastStreet
      );
    } else if (this.state === STATES.PAUSED) {
      this.buttons.pause = this.screens.renderPause(
        ctx, w, h, this.miles, this.car.damage, this.repairCost
      );
    }
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 16.67, 2); // normalize to ~60fps
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  }
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
