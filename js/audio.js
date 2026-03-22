// ============================================================
// Audio — Synthesized sound effects using Web Audio API
// ============================================================

export class Audio {
  constructor() {
    this.ctx = null;
    this.muted = true; // default to muted
    this.initialized = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.engineRunning = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      // Web Audio not supported
    }
  }

  toggle() {
    this.muted = !this.muted;
    if (!this.initialized) this.init();
    if (this.muted) {
      this.stopEngine();
    }
    return this.muted;
  }

  startEngine() {
    if (this.muted || !this.ctx || this.engineRunning) return;
    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
    this.engineGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    this.engineOsc.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    this.engineOsc.start();
    this.engineRunning = true;
  }

  stopEngine() {
    if (this.engineOsc && this.engineRunning) {
      try {
        this.engineOsc.stop();
      } catch (e) {}
      this.engineOsc = null;
      this.engineGain = null;
      this.engineRunning = false;
    }
  }

  updateEngineSpeed(speed) {
    if (!this.engineOsc || !this.engineRunning || this.muted) return;
    // Map speed (2-8) to frequency (45-90 Hz)
    const freq = 45 + (speed - 2) * 7.5;
    this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
  }

  playWhoosh() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const noise = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    noise.type = 'sine';
    noise.frequency.setValueAtTime(800, now);
    noise.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
    noise.stop(now + 0.3);
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Descending tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
    osc.start();
    osc.stop(now + 1);
  }
}
