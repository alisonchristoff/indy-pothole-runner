// ============================================================
// Screens — Title, Game Over, Pause
// ============================================================

// No fixed imports needed — damage data passed in dynamically

export class Screens {
  constructor(canvas) {
    this.canvas = canvas;
  }

  getRating(miles) {
    if (miles >= 6.0) return { title: 'True Hoosier', emoji: 'star' };
    if (miles >= 4.0) return { title: 'Pothole Pro', emoji: 'trophy' };
    if (miles >= 2.5) return { title: 'Road Warrior', emoji: 'muscle' };
    if (miles >= 1.0) return { title: 'Sunday Driver', emoji: 'car' };
    return { title: 'Rookie Driver', emoji: 'learner' };
  }

  renderTitle(ctx, width, height, animPhase) {
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const scale = width / 420;

    // Animated road (perspective vanishing point)
    const roadTop = height * 0.45;
    const roadBot = height;
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.moveTo(width * 0.42, roadTop);
    ctx.lineTo(width * 0.58, roadTop);
    ctx.lineTo(width * 0.95, roadBot);
    ctx.lineTo(width * 0.05, roadBot);
    ctx.closePath();
    ctx.fill();

    // Dashed lane markers scrolling
    ctx.strokeStyle = 'rgba(200,200,200,0.3)';
    ctx.lineWidth = 2 * scale;
    for (let i = 0; i < 8; i++) {
      const t = ((animPhase * 0.015 + i * 0.12) % 1);
      const y = roadTop + (roadBot - roadTop) * t;
      const spread = 0.08 * t;
      const dashLen = 12 * t * scale;
      if (dashLen < 1) continue;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, y);
      ctx.lineTo(width * 0.5, y + dashLen);
      ctx.stroke();
    }

    // Animated potholes on the road
    for (let i = 0; i < 4; i++) {
      const t = ((animPhase * 0.012 + i * 0.25) % 1);
      if (t < 0.05) continue;
      const y = roadTop + (roadBot - roadTop) * t;
      const spread = t;
      const roadW = (width * 0.08 + width * 0.43 * spread);
      const px = width / 2 + (((i * 137) % 5) - 2) * roadW * 0.15;
      const pSize = 4 + spread * 14 * scale;

      ctx.fillStyle = 'rgba(20,20,20,0.8)';
      ctx.beginPath();
      ctx.ellipse(px, y, pSize, pSize * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(10,10,10,0.9)';
      ctx.beginPath();
      ctx.ellipse(px, y, pSize * 0.7, pSize * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title — "AVOID INDY POTHOLES" in a rougher, road-worn style
    ctx.textAlign = 'center';

    // Draw each word with slight offsets and rotation for a hand-painted road sign feel
    ctx.save();
    ctx.translate(width / 2, height * 0.13);

    // "AVOID" — slightly tilted, yellow warning color
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 * scale;
    ctx.font = `bold italic ${26 * scale}px Georgia, "Times New Roman", serif`;
    ctx.rotate(-0.03);
    ctx.strokeText('AVOID', 0, 0);
    ctx.fillText('AVOID', 0, 0);

    // "INDY" — big and bold, white
    ctx.rotate(0.03);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${40 * scale}px Georgia, "Times New Roman", serif`;
    ctx.strokeText('INDY', 0, 40 * scale);
    ctx.fillText('INDY', 0, 40 * scale);

    // "POTHOLES" — widest word, slightly rough
    ctx.rotate(0.02);
    ctx.fillStyle = '#FF6B4A';
    ctx.font = `bold italic ${32 * scale}px Georgia, "Times New Roman", serif`;
    ctx.strokeText('POTHOLES', 0, 78 * scale);
    ctx.fillText('POTHOLES', 0, 78 * scale);

    ctx.restore();

    // Subtitle
    ctx.textAlign = 'center';
    ctx.fillStyle = '#AAAACC';
    ctx.font = `${14 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText('Survive the streets of Indianapolis', width / 2, height * 0.13 + 100 * scale);

    // Drive button
    const btnW = 200 * scale;
    const btnH = 60 * scale;
    const btnX = width / 2 - btnW / 2;
    const btnY = height * 0.38;

    // Button glow — use a simple border pulse instead of expensive shadowBlur
    const pulse = 0.6 + Math.sin(animPhase * 0.05) * 0.4;
    ctx.strokeStyle = `rgba(68,136,255,${pulse})`;
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.roundRect(btnX - 2, btnY - 2, btnW + 4, btnH + 4, 14 * scale);
    ctx.stroke();

    ctx.fillStyle = '#2E5CB8';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 12 * scale);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${28 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText('DRIVE', width / 2, btnY + btnH * 0.65);

    // Controls hint
    ctx.fillStyle = '#777799';
    ctx.font = `${12 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText('Swipe or arrow keys to dodge potholes', width / 2, btnY + btnH + 30 * scale);

    // Return button bounds for click detection
    return { btnX, btnY, btnW, btnH };
  }

  renderGameOver(ctx, width, height, miles, damage, repairCost, lastStreet, damageLog) {
    // Dim overlay
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, width, height);

    const scale = width / 420;
    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#FF4444';
    ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('GAME OVER', width / 2, height * 0.12);

    // Rating
    const rating = this.getRating(miles);
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(rating.title, width / 2, height * 0.20);

    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`You survived ${miles.toFixed(1)} miles`, width / 2, height * 0.27);
    ctx.fillText('on Indianapolis roads', width / 2, height * 0.27 + 28 * scale);

    // Last street
    if (lastStreet) {
      ctx.fillStyle = '#88BBFF';
      ctx.font = `${16 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(`Made it to: ${lastStreet}`, width / 2, height * 0.39);
    }

    // Repair bill
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`Total repair bill: $${repairCost.toLocaleString()}`, width / 2, height * 0.47);

    // Damage report
    ctx.fillStyle = '#CCCCCC';
    ctx.font = `${14 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    const reportX = width * 0.15;
    let reportY = height * 0.55;
    ctx.fillText('Damage report:', reportX, reportY);
    reportY += 24 * scale;

    const log = damageLog || [];
    for (let i = 0; i < log.length; i++) {
      ctx.fillStyle = '#FF8888';
      ctx.fillText(`• ${log[i].message}`, reportX + 10 * scale, reportY);
      ctx.fillStyle = '#AAAAAA';
      ctx.textAlign = 'right';
      ctx.fillText(`+$${log[i].cost.toLocaleString()}`, width - reportX, reportY);
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

  generateScoreCard(miles, damage, repairCost, lastStreet) {
    const w = 600;
    const h = 315;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Road stripe accent
    ctx.fillStyle = '#333';
    ctx.fillRect(0, h - 40, w, 40);
    ctx.fillStyle = '#DD0000';
    ctx.fillRect(0, h - 42, w, 4);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('INDY POTHOLE RUNNER', w / 2, 45);

    // Rating
    const rating = this.getRating(miles);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(rating.title, w / 2, 80);

    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Survived ${miles.toFixed(1)} miles on Indianapolis roads`, w / 2, 120);

    if (lastStreet) {
      ctx.fillStyle = '#88BBFF';
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Made it to: ${lastStreet}`, w / 2, 150);
    }

    // Repair bill
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Repair bill: $${repairCost.toLocaleString()}`, w / 2, 190);

    // Damage meter
    const meterW = 200;
    const segW = meterW / 5;
    const meterX = w / 2 - meterW / 2;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < (5 - damage) ? '#44CC44' : '#CC4444';
      ctx.fillRect(meterX + i * segW + 2, 210, segW - 4, 16);
    }
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText('CAR HEALTH', w / 2, 244);

    // URL
    ctx.fillStyle = '#666688';
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillText('indypotholes.org', w / 2, h - 14);

    return canvas;
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
