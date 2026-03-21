// ============================================================
// Input Handler — Touch drag + Keyboard
// ============================================================

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.direction = 0; // -1 left, 0 center, 1 right
    this.touching = false;
    this.touchStartX = 0;
    this.touchCurrentX = 0;
    this.keys = {};

    this.bindKeyboard();
    this.bindTouch();
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      // Prevent arrow key scrolling
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  bindTouch() {
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touching = true;
      this.touchStartX = touch.clientX;
      this.touchCurrentX = touch.clientX;
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.touching) return;
      const touch = e.touches[0];
      this.touchCurrentX = touch.clientX;
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touching = false;
      this.direction = 0;
    }, { passive: false });

    this.canvas.addEventListener('touchcancel', () => {
      this.touching = false;
      this.direction = 0;
    });
  }

  update() {
    // Keyboard input
    const left = this.keys['ArrowLeft'] || this.keys['KeyA'];
    const right = this.keys['ArrowRight'] || this.keys['KeyD'];

    if (left && !right) {
      this.direction = -1;
    } else if (right && !left) {
      this.direction = 1;
    } else if (this.touching) {
      // Touch input — proportional to drag distance
      const dx = this.touchCurrentX - this.touchStartX;
      const sensitivity = 50; // pixels of drag for full turn
      this.direction = Math.max(-1, Math.min(1, dx / sensitivity));
      // Update start position for continuous dragging feel
      this.touchStartX += dx * 0.1;
    } else {
      this.direction = 0;
    }

    return this.direction;
  }

  isEscapePressed() {
    return this.keys['Escape'];
  }

  consumeEscape() {
    this.keys['Escape'] = false;
  }
}
