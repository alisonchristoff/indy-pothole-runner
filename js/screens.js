// ============================================================
// Screens — Title, Game Over, Pause
// ============================================================

import { DAMAGE_MESSAGES, REPAIR_COSTS } from './constants.js';

export class Screens {
  constructor(canvas) {
    this.canvas = canvas;
  }

  renderTitle(ctx, width, height, animPhase) {
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const scale = width / 420;

    // Animated road lines in background
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = ((animPhase * 2 + i * 150) % (height + 100)) - 50;
      ctx.beginPath();
      ctx.moveTo(width * 0.48, y);
      ctx.lineTo(width * 0.52, y + 30);
      ctx.stroke();
    }

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${36 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('INDY POTHOLE', width / 2, height * 0.28);
    ctx.fillText('RUNNER', width / 2, height * 0.28 + 42 * scale);

    // Subtitle
    ctx.fillStyle = '#AAAACC';
    ctx.font = `${16 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Survive the streets of Indianapolis', width / 2, height * 0.28 + 80 * scale);

    // Drive button
    const btnW = 200 * scale;
    const btnH = 60 * scale;
    const btnX = width / 2 - btnW / 2;
    const btnY = height * 0.55;

    // Button glow
    ctx.shadowColor = '#4488FF';
    ctx.shadowBlur = 20 + Math.sin(animPhase * 0.05) * 10;

    ctx.fillStyle = '#2E5CB8';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 12 * scale);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${28 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('DRIVE', width / 2, btnY + btnH * 0.65);

    // Controls hint
    ctx.fillStyle = '#777799';
    ctx.font = `${12 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Swipe or arrow keys to steer', width / 2, height * 0.78);

    // Return button bounds for click detection
    return { btnX, btnY, btnW, btnH };
  }

  renderGameOver(ctx, width, height, miles, damage, repairCost, lastStreet) {
    // Dim overlay
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, width, height);

    const scale = width / 420;
    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#FF4444';
    ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('GAME OVER', width / 2, height * 0.12);

    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`You survived ${miles.toFixed(1)} miles`, width / 2, height * 0.22);
    ctx.fillText('on Indianapolis roads', width / 2, height * 0.22 + 28 * scale);

    // Last street
    if (lastStreet) {
      ctx.fillStyle = '#88BBFF';
      ctx.font = `${16 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(`Made it to: ${lastStreet}`, width / 2, height * 0.35);
    }

    // Repair bill
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`Total repair bill: $${repairCost.toLocaleString()}`, width / 2, height * 0.43);

    // Damage report
    ctx.fillStyle = '#CCCCCC';
    ctx.font = `${14 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    const reportX = width * 0.15;
    let reportY = height * 0.52;
    ctx.fillText('Damage report:', reportX, reportY);
    reportY += 24 * scale;

    for (let i = 0; i < damage; i++) {
      ctx.fillStyle = '#FF8888';
      ctx.fillText(`• ${DAMAGE_MESSAGES[i]}`, reportX + 10 * scale, reportY);
      ctx.fillStyle = '#AAAAAA';
      ctx.textAlign = 'right';
      ctx.fillText(`+$${REPAIR_COSTS[i].toLocaleString()}`, width - reportX, reportY);
      ctx.textAlign = 'left';
      reportY += 22 * scale;
    }

    ctx.textAlign = 'center';

    // Buttons
    const btnW = 150 * scale;
    const btnH = 50 * scale;
    const gap = 20 * scale;

    // Drive Again button
    const driveX = width / 2 - btnW - gap / 2;
    const btnY = height * 0.82;
    ctx.fillStyle = '#2E5CB8';
    ctx.beginPath();
    ctx.roundRect(driveX, btnY, btnW, btnH, 10 * scale);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${16 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('DRIVE AGAIN', driveX + btnW / 2, btnY + btnH * 0.63);

    // Share button
    const shareX = width / 2 + gap / 2;
    ctx.fillStyle = '#44AA44';
    ctx.beginPath();
    ctx.roundRect(shareX, btnY, btnW, btnH, 10 * scale);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SHARE', shareX + btnW / 2, btnY + btnH * 0.63);

    return {
      driveBtn: { x: driveX, y: btnY, w: btnW, h: btnH },
      shareBtn: { x: shareX, y: btnY, w: btnW, h: btnH },
    };
  }

  renderPause(ctx, width, height, miles, damage, repairCost) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, width, height);

    const scale = width / 420;
    ctx.textAlign = 'center';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('PAUSED', width / 2, height * 0.3);

    ctx.font = `${16 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`Distance: ${miles.toFixed(1)} mi`, width / 2, height * 0.4);
    ctx.fillText(`Damage: ${damage}/5`, width / 2, height * 0.4 + 26 * scale);
    if (repairCost > 0) {
      ctx.fillText(`Repair bill: $${repairCost.toLocaleString()}`, width / 2, height * 0.4 + 52 * scale);
    }

    // Resume button
    const btnW = 160 * scale;
    const btnH = 50 * scale;
    const resumeX = width / 2 - btnW / 2;
    const resumeY = height * 0.58;

    ctx.fillStyle = '#2E5CB8';
    ctx.beginPath();
    ctx.roundRect(resumeX, resumeY, btnW, btnH, 10 * scale);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('RESUME', width / 2, resumeY + btnH * 0.63);

    // Quit button
    const quitY = resumeY + btnH + 16 * scale;
    ctx.fillStyle = '#883333';
    ctx.beginPath();
    ctx.roundRect(resumeX, quitY, btnW, btnH, 10 * scale);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('QUIT', width / 2, quitY + btnH * 0.63);

    return {
      resumeBtn: { x: resumeX, y: resumeY, w: btnW, h: btnH },
      quitBtn: { x: resumeX, y: quitY, w: btnW, h: btnH },
    };
  }
}
