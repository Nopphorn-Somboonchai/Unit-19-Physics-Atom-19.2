/**
 * @file photocell-app-plotter.js
 * @description Canvas 2D Plotter for Simulator 4: Automatic Sliding Door Photocell Sensor Application.
 * Visualizes light emitter beam, Cesium photocell receiver, walking person interrupting beam,
 * sliding glass doors responding to relay trigger, and live photocurrent indicator.
 */

export class PhotocellAppPlotter {
  /**
   * @param {CanvasRenderer} renderer
   */
  constructor(renderer) {
    this.r = renderer;
    this.ctx = renderer.ctx;
  }

  resize() {
    this.r.resize();
  }

  destroy() {
    this.r.destroy();
  }

  /**
   * Render automatic door & photocell sensor system
   * @param {{ state: Object, physics: Object, time: number }} snapshot
   */
  render(snapshot) {
    const w = this.r.width;
    const h = this.r.height;
    const ctx = this.ctx;
    const { state, physics, time } = snapshot;

    const isCompact = w < 640;
    const padX = isCompact ? 16 : 34;

    // 1. Background
    this.r.clear('#090D16');

    // Architectural Doorway Zone (Top 66%)
    const sceneTop = 44;
    const floorY = Math.round(h * 0.68);
    const doorW = Math.min(w - padX * 2 - 40, isCompact ? 260 : 420);
    const doorH = floorY - sceneTop - 16;
    const doorX = Math.round((w - doorW) / 2);
    const doorY = sceneTop + 16;

    // Top Status Bar
    const statusText = !physics.emitsElectrons
      ? `⚠️ แสง λ = ${state.wavelengthNm} nm พลังงานต่ำกว่า W ของ Cs (591 nm) → เซลล์ไม่ทำงาน!`
      : physics.beamBlocked
        ? `🚨 ลำแสงถูกบัง! กระแส I = 0 µA → รีเลย์สั่งมอเตอร์เปิดประตูอัตโนมัติ`
        : `✅ ลำแสงตกกระทบเซลล์โฟโตอิเล็กทริกปกติ (I = ${physics.photocurrentMicroA.toFixed(1)} µA) → ประตูปิดปกติ`;

    this.r.drawLabel(isCompact ? statusText.slice(0, 44) : statusText, w / 2, 20, {
      font: `bold ${isCompact ? 9.5 : 11.5}px Prompt, sans-serif`,
      color: physics.relayTriggeredOpen ? '#fde68a' : '#86efac',
      bgColor: physics.relayTriggeredOpen ? 'rgba(120, 53, 15, 0.88)' : 'rgba(6, 78, 59, 0.85)',
      borderColor: physics.relayTriggeredOpen ? '#f59e0b' : '#10b981',
      padding: 5
    });

    // Floor line
    this.r.drawLine(padX, floorY, w - padX, floorY, '#475569', 2);

    // Door Frame Exterior
    this.r.drawRoundedRect(doorX - 10, doorY - 12, doorW + 20, doorH + 12, 8, {
      fill: '#1e293b',
      stroke: '#475569',
      lineWidth: 2
    });

    // Dark interior opening behind sliding doors
    ctx.fillStyle = '#020617';
    ctx.fillRect(doorX, doorY, doorW, doorH);

    // Interior Welcome Sign
    this.r.drawLabel('ทางเข้าอาคารอัตโนมัติ', doorX + doorW / 2, doorY + 26, {
      font: '11px Prompt, sans-serif',
      color: '#475569'
    });

    // Sliding Glass Door Panels (Left & Right retract smoothly with doorOpenRatio)
    const halfW = doorW / 2;
    const slideOffset = state.doorOpenRatio * (halfW * 0.86);

    // Left glass leaf
    this.r.drawRoundedRect(doorX - slideOffset, doorY + 2, halfW - 1, doorH - 2, 3, {
      fill: 'rgba(56, 189, 248, 0.22)',
      stroke: '#38bdf8',
      lineWidth: 1.5
    });
    // Right glass leaf
    this.r.drawRoundedRect(doorX + halfW + 1 + slideOffset, doorY + 2, halfW - 1, doorH - 2, 3, {
      fill: 'rgba(56, 189, 248, 0.22)',
      stroke: '#38bdf8',
      lineWidth: 1.5
    });

    // Light Emitter Post (Left) & Photocell Receiver Post (Right)
    const sensorY = floorY - 36;
    const emitX = doorX - 20;
    const recvX = doorX + doorW + 20;

    this.r.drawRoundedRect(emitX - 10, sensorY - 14, 20, 28, 5, {
      fill: '#1e293b',
      stroke: physics.colorInfo.hex,
      lineWidth: 2
    });
    this.r.drawLabel('แหล่งแสง', emitX, sensorY - 26, {
      font: '9px Prompt, sans-serif',
      color: '#cbd5e1'
    });

    this.r.drawRoundedRect(recvX - 10, sensorY - 14, 20, 28, 5, {
      fill: '#1e293b',
      stroke: physics.photocurrentMicroA > 0 ? '#4ade80' : '#f43f5e',
      lineWidth: 2
    });
    this.r.drawLabel('Photocell (Cs)', recvX, sensorY - 26, {
      font: '9px Prompt, sans-serif',
      color: physics.photocurrentMicroA > 0 ? '#4ade80' : '#fda4af'
    });

    // Person Position
    const personX = doorX + state.personProgress * doorW;
    const showPerson = state.manualBlock || state.isWalking;

    // Light Beam from Emitter -> Person (if blocked) or Receiver (if clear)
    const beamEndX = physics.beamBlocked ? Math.max(emitX + 10, Math.min(recvX - 10, personX - 10)) : recvX - 10;
    ctx.save();
    ctx.strokeStyle = physics.colorInfo.hex;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = physics.colorInfo.hex;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(emitX + 10, sensorY);
    ctx.lineTo(beamEndX, sensorY);
    ctx.stroke();

    // Animated photon pulses along beam
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    const beamLen = Math.max(1, beamEndX - (emitX + 10));
    const numDots = Math.max(2, Math.floor(beamLen / 48));
    for (let i = 0; i < numDots; i++) {
      const frac = ((i / numDots) + time * 0.75) % 1;
      const dx = emitX + 10 + frac * beamLen;
      ctx.beginPath();
      ctx.arc(dx, sensorY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Draw Person Silhouette if active
    if (showPerson) {
      ctx.save();
      const px = Math.max(padX + 12, Math.min(w - padX - 12, personX));
      // Head
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, floorY - 76, 11, 0, Math.PI * 2);
      ctx.fill();
      // Torso
      this.r.drawRoundedRect(px - 12, floorY - 62, 24, 34, 8, {
        fill: '#fbbf24',
        stroke: '#fef08a',
        lineWidth: 1.5
      });
      // Legs
      const stride = state.isWalking ? Math.sin(time * 10) * 6 : 0;
      this.r.drawLine(px - 5, floorY - 28, px - 6 - stride, floorY - 2, '#f59e0b', 5);
      this.r.drawLine(px + 5, floorY - 28, px + 6 + stride, floorY - 2, '#f59e0b', 5);
      ctx.restore();
    }

    // Bottom Control Circuit Telemetry Strip (3 Cards)
    const stripY = floorY + 20;
    const stripH = Math.max(58, h - stripY - 16);
    const gap = isCompact ? 8 : 14;
    const cardW = (w - padX * 2 - gap * 2) / 3;

    const cards = [
      {
        title: '1. กระแสโฟโตอิเล็กทริก',
        value: `${physics.photocurrentMicroA.toFixed(1)} µA`,
        color: physics.photocurrentMicroA > 0 ? '#4ade80' : '#fb7185',
        border: physics.photocurrentMicroA > 0 ? '#10b981' : '#f43f5e'
      },
      {
        title: '2. สถานะรีเลย์ควบคุม',
        value: physics.relayTriggeredOpen ? 'สั่งเปิดวงจรมอเตอร์' : 'กระแสเลี้ยงปกติ',
        color: physics.relayTriggeredOpen ? '#fbbf24' : '#38bdf8',
        border: physics.relayTriggeredOpen ? '#f59e0b' : '#0284c7'
      },
      {
        title: '3. ประตูอัตโนมัติ',
        value: state.doorOpenRatio > 0.25 ? `เปิด (${Math.round(state.doorOpenRatio * 100)}%)` : 'ปิดปกติ',
        color: state.doorOpenRatio > 0.25 ? '#34d399' : '#cbd5e1',
        border: state.doorOpenRatio > 0.25 ? '#10b981' : '#475569'
      }
    ];

    cards.forEach((c, idx) => {
      const cx = padX + idx * (cardW + gap);
      this.r.drawRoundedRect(cx, stripY, cardW, stripH, 10, {
        fill: '#0f172a',
        stroke: c.border,
        lineWidth: 1.5
      });
      this.r.drawLabel(c.title, cx + cardW / 2, stripY + stripH * 0.34, {
        font: `${isCompact ? 9 : 10.5}px Prompt, sans-serif`,
        color: '#94a3b8'
      });
      this.r.drawLabel(c.value, cx + cardW / 2, stripY + stripH * 0.7, {
        font: `bold ${isCompact ? 10 : 12}px Fira Code, Prompt, sans-serif`,
        color: c.color
      });
    });
  }
}
