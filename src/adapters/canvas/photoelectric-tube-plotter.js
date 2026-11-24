/**
 * @file photoelectric-tube-plotter.js
 * @description Canvas 2D Plotter for Simulator 1: Virtual Photoelectric Vacuum Tube Lab.
 * Renders light source, wavelength-colored photon beam, vacuum chamber, cathode/anode plates,
 * accelerating/retarding photoelectrons, external circuit, Ammeter (µA), and Voltmeter (V).
 */

export class PhotoelectricTubePlotter {
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
   * Render virtual photoelectric tube scene
   * @param {{ state: Object, physics: Object, photons: Array, electrons: Array, time: number }} snapshot
   */
  render(snapshot) {
    const w = this.r.width;
    const h = this.r.height;
    const ctx = this.ctx;
    const { state, physics, photons, electrons } = snapshot;

    const isCompact = w < 640;
    const padX = isCompact ? 16 : 36;

    // 1. Background with subtle dark engineering grid
    this.r.clear('#090D16');
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 24; x < w; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 24; y < h; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Geometry Layout (guaranteed safe clearance from 360px to 1440px)
    const tubeW = Math.min(w - padX * 2, isCompact ? w - 32 : 580);
    const tubeH = isCompact ? 148 : 172;
    const tubeX = Math.round((w - tubeW) / 2);
    const tubeY = isCompact ? 78 : 88;
    const tubeCy = tubeY + tubeH / 2;

    const cathodeX = tubeX + (isCompact ? 34 : 52);
    const anodeX = tubeX + tubeW - (isCompact ? 34 : 52);
    const plateH = tubeH * 0.54;
    const plateTop = tubeCy - plateH / 2;

    const lampX = tubeX + tubeW * 0.5;
    const lampY = isCompact ? 26 : 30;

    // 3. Draw Light Source Housing & Spectrum Beam
    const beamAlpha = state.intensityPercent > 0 ? 0.08 + (state.intensityPercent / 100) * 0.28 : 0;
    const { r, g, b, hex, isUV, labelTh } = physics.colorInfo;

    if (beamAlpha > 0) {
      ctx.save();
      const grad = ctx.createLinearGradient(lampX, lampY + 12, cathodeX + 8, tubeCy);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${beamAlpha * 1.4})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${beamAlpha * 0.45})`);

      ctx.beginPath();
      ctx.moveTo(lampX - 16, lampY + 14);
      ctx.lineTo(lampX + 16, lampY + 14);
      ctx.lineTo(cathodeX + 12, plateTop + plateH - 6);
      ctx.lineTo(cathodeX + 8, plateTop + 6);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Light Source Lamp Fixture
    this.r.drawRoundedRect(lampX - 44, lampY - 12, 88, 28, 8, {
      fill: '#1e293b',
      stroke: state.intensityPercent > 0 ? hex : '#475569',
      lineWidth: 2
    });
    this.r.drawLabel(
      isUV ? `UV ${state.wavelengthNm} nm` : `${state.wavelengthNm} nm`,
      lampX,
      lampY + 2,
      {
        font: 'bold 11px Fira Code, monospace',
        color: state.intensityPercent > 0 ? '#f8fafc' : '#64748b'
      }
    );

    // 4. Draw Evacuated Quartz Glass Chamber
    ctx.save();
    const glassGrad = ctx.createLinearGradient(tubeX, tubeY, tubeX, tubeY + tubeH);
    glassGrad.addColorStop(0, 'rgba(30, 41, 59, 0.55)');
    glassGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.85)');
    glassGrad.addColorStop(1, 'rgba(30, 41, 59, 0.55)');
    this.r.drawRoundedRect(tubeX, tubeY, tubeW, tubeH, tubeH / 2.2, {
      fill: glassGrad,
      stroke: 'rgba(148, 163, 184, 0.45)',
      lineWidth: 2
    });

    // Subtle glass specular arc
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.moveTo(tubeX + 40, tubeY + 10);
    ctx.lineTo(tubeX + tubeW - 40, tubeY + 10);
    ctx.stroke();
    ctx.restore();

    // Vacuum Chamber Tag
    this.r.drawLabel('หลอดสุญญากาศ (Evacuated Phototube)', tubeX + tubeW / 2, tubeY + 16, {
      font: '10px Prompt, sans-serif',
      color: '#64748b'
    });

    // 5. Draw Incident Photon Wave Packets
    if (state.intensityPercent > 0) {
      ctx.save();
      for (const p of photons) {
        const targetY = tubeCy + p.lane * (plateH * 0.42);
        const px = lampX + (cathodeX + 6 - lampX) * p.progress;
        const py = lampY + 16 + (targetY - (lampY + 16)) * p.progress;
        const angle = Math.atan2(targetY - (lampY + 16), cathodeX + 6 - lampX);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.strokeStyle = hex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let t = -9; t <= 9; t += 2) {
          const wy = Math.sin((t + p.phase * 3) * 0.65) * 3.2;
          if (t === -9) ctx.moveTo(t, wy);
          else ctx.lineTo(t, wy);
        }
        ctx.stroke();

        // Glowing photon core dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(9, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    // 6. Draw Cathode (Metal Emitter Plate) & Anode (Collector Plate)
    // Cathode C
    this.r.drawRoundedRect(cathodeX - 6, plateTop, 12, plateH, 4, {
      fill: physics.metal.plateColor,
      stroke: '#f8fafc',
      lineWidth: 1.5
    });
    this.r.drawLabel(`แคโทด (${physics.metal.symbol})`, cathodeX + 4, tubeY + tubeH - 15, {
      font: 'bold 10px Prompt, sans-serif',
      color: '#e2e8f0',
      align: 'left'
    });

    // Anode A
    this.r.drawRoundedRect(anodeX - 5, plateTop, 10, plateH, 4, {
      fill: '#64748b',
      stroke: state.voltageV > 0 ? '#38bdf8' : state.voltageV < 0 ? '#f43f5e' : '#cbd5e1',
      lineWidth: 1.5
    });
    const anodeSign = state.voltageV > 0 ? '(+)' : state.voltageV < 0 ? '(-)' : '(0)';
    this.r.drawLabel(`แอโนด ${anodeSign}`, anodeX - 4, tubeY + tubeH - 15, {
      font: 'bold 10px Prompt, sans-serif',
      color: state.voltageV > 0 ? '#38bdf8' : state.voltageV < 0 ? '#fb7185' : '#cbd5e1',
      align: 'right'
    });

    // Electric field direction cue inside tube when ΔV != 0
    if (Math.abs(state.voltageV) > 0.05) {
      const eMidY = tubeY + tubeH - 30;
      const eColor = state.voltageV > 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(244, 63, 94, 0.5)';
      if (state.voltageV > 0) {
        this.r.drawArrow(tubeX + tubeW * 0.58, eMidY, tubeX + tubeW * 0.42, eMidY, eColor, 1.5, 5);
        this.r.drawLabel('แรงไฟฟ้าเร่ง e⁻ →', tubeX + tubeW * 0.5, eMidY - 10, {
          font: '9.5px Prompt, sans-serif',
          color: '#38bdf8'
        });
      } else {
        this.r.drawArrow(tubeX + tubeW * 0.42, eMidY, tubeX + tubeW * 0.58, eMidY, eColor, 1.5, 5);
        this.r.drawLabel('← แรงไฟฟ้าหน่วง e⁻', tubeX + tubeW * 0.5, eMidY - 10, {
          font: '9.5px Prompt, sans-serif',
          color: '#fb7185'
        });
      }
    }

    // 7. Draw Photoelectrons (e⁻)
    if (physics.activeEmission && electrons.length > 0) {
      const spanX = anodeX - 10 - (cathodeX + 10);
      ctx.save();
      for (const e of electrons) {
        const ex = cathodeX + 10 + e.x * spanX;
        const ey = tubeCy + e.yOffset * (plateH * 0.78);
        const eColor = e.turningBack ? '#fb7185' : '#38bdf8';

        // Motion tail
        ctx.beginPath();
        ctx.strokeStyle = e.turningBack ? 'rgba(251, 113, 133, 0.45)' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - Math.sign(e.vx || 1) * 10, ey);
        ctx.stroke();

        // Electron glow orb
        ctx.beginPath();
        ctx.fillStyle = eColor;
        ctx.shadowColor = eColor;
        ctx.shadowBlur = 8;
        ctx.arc(ex, ey, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Minus sign
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 8px Fira Code, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('−', ex, ey + 0.5);
      }
      ctx.restore();
    }

    // 8. Clear Status Banner inside Tube when f < f₀ or Stopped
    if (!physics.emitsElectrons) {
      const msg = isCompact
        ? `ไม่เกิดโฟโตอิเล็กตรอน (E < W)`
        : `⚠️ ไม่เกิดโฟโตอิเล็กตรอน เพราะ E (${physics.photonEnergyEV.toFixed(2)} eV) < W (${physics.workFunctionEV.toFixed(1)} eV)`;
      this.r.drawLabel(msg, tubeX + tubeW / 2, tubeCy, {
        font: `bold ${isCompact ? 11 : 12}px Prompt, sans-serif`,
        color: '#fecaca',
        bgColor: 'rgba(127, 29, 29, 0.92)',
        borderColor: '#f87171',
        padding: 7
      });
    } else if (state.intensityPercent === 0) {
      this.r.drawLabel('ความเข้มแสง = 0% (ปิดแหล่งกำเนิดแสง)', tubeX + tubeW / 2, tubeCy, {
        font: 'bold 11px Prompt, sans-serif',
        color: '#cbd5e1',
        bgColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#475569',
        padding: 6
      });
    } else if (physics.electronMotionMode === 'stopped') {
      const stopMsg = isCompact
        ? `หยุดยั้งสมบูรณ์ (ΔV ≤ -Vs)`
        : `🛑 หยุดยั้งโฟโตอิเล็กตรอนได้ทั้งหมด (ΔV ≤ -Vs = -${physics.stoppingPotentialV.toFixed(2)} V) → I = 0 µA`;
      this.r.drawLabel(stopMsg, tubeX + tubeW / 2, tubeY + 38, {
        font: 'bold 10.5px Prompt, sans-serif',
        color: '#fde68a',
        bgColor: 'rgba(120, 53, 15, 0.9)',
        borderColor: '#f59e0b',
        padding: 5
      });
    }

    // 9. External Electrical Circuit + Ammeter (µA) + Variable Power Supply + Voltmeter (V)
    const circuitY = tubeY + tubeH + (isCompact ? 68 : 76);
    const wireColor = physics.photocurrentMicroA > 0.1 ? '#22d3ee' : '#475569';

    // Left vertical wire (Cathode down to circuit)
    this.r.drawLine(cathodeX, tubeCy, tubeX - 10, tubeCy, wireColor, 2.2);
    this.r.drawLine(tubeX - 10, tubeCy, tubeX - 10, circuitY, wireColor, 2.2);
    // Right vertical wire (Anode down to circuit)
    this.r.drawLine(anodeX, tubeCy, tubeX + tubeW + 10, tubeCy, wireColor, 2.2);
    this.r.drawLine(tubeX + tubeW + 10, tubeCy, tubeX + tubeW + 10, circuitY, wireColor, 2.2);
    // Bottom horizontal bus
    this.r.drawLine(tubeX - 10, circuitY, tubeX + tubeW + 10, circuitY, wireColor, 2.2);

    // Ammeter Box (Left third)
    const meterW = isCompact ? 96 : 128;
    const meterH = 44;
    const ammX = tubeX + tubeW * 0.2 - meterW / 2;
    this.r.drawRoundedRect(ammX, circuitY - meterH / 2, meterW, meterH, 10, {
      fill: '#0f172a',
      stroke: physics.photocurrentMicroA > 0.1 ? '#10b981' : '#475569',
      lineWidth: 2
    });
    this.r.drawLabel('แอมมิเตอร์ (I)', ammX + meterW / 2, circuitY - 9, {
      font: '9.5px Prompt, sans-serif',
      color: '#94a3b8'
    });
    this.r.drawLabel(`${physics.photocurrentMicroA.toFixed(1)} µA`, ammX + meterW / 2, circuitY + 9, {
      font: `bold ${isCompact ? 11.5 : 13}px Fira Code, monospace`,
      color: physics.photocurrentMicroA > 0.1 ? '#4ade80' : '#64748b'
    });

    // Variable DC Power Supply (Center)
    const psuW = isCompact ? 82 : 114;
    const psuX = tubeX + tubeW * 0.5 - psuW / 2;
    this.r.drawRoundedRect(psuX, circuitY - meterH / 2, psuW, meterH, 10, {
      fill: '#1e293b',
      stroke: '#6366f1',
      lineWidth: 1.8
    });
    this.r.drawLabel('แหล่งจ่าย ΔV', psuX + psuW / 2, circuitY - 9, {
      font: '9.5px Prompt, sans-serif',
      color: '#c7d2fe'
    });
    const signStr = state.voltageV > 0 ? '−  | |  +' : state.voltageV < 0 ? '+  | |  −' : '0 V';
    this.r.drawLabel(signStr, psuX + psuW / 2, circuitY + 9, {
      font: 'bold 11px Fira Code, monospace',
      color: '#f8fafc'
    });

    // Voltmeter Box (Right third)
    const voltX = tubeX + tubeW * 0.8 - meterW / 2;
    this.r.drawRoundedRect(voltX, circuitY - meterH / 2, meterW, meterH, 10, {
      fill: '#0f172a',
      stroke: state.voltageV < 0 ? '#f43f5e' : '#38bdf8',
      lineWidth: 2
    });
    this.r.drawLabel('โวลต์มิเตอร์ (ΔV)', voltX + meterW / 2, circuitY - 9, {
      font: '9.5px Prompt, sans-serif',
      color: '#94a3b8'
    });
    const vPrefix = state.voltageV > 0 ? '+' : '';
    this.r.drawLabel(`${vPrefix}${state.voltageV.toFixed(2)} V`, voltX + meterW / 2, circuitY + 9, {
      font: `bold ${isCompact ? 11.5 : 13}px Fira Code, monospace`,
      color: state.voltageV < 0 ? '#fb7185' : '#38bdf8'
    });

    // Top-left Compact Info Badge (Metal + Spectrum color)
    if (!isCompact) {
      this.r.drawLabel(
        `${physics.metal.nameTh} (${physics.metal.symbol}) · W = ${physics.workFunctionEV.toFixed(1)} eV | ${labelTh}`,
        padX,
        24,
        {
          font: 'bold 11px Prompt, sans-serif',
          color: '#e2e8f0',
          align: 'left',
          bgColor: 'rgba(15, 23, 42, 0.85)',
          borderColor: '#334155',
          padding: 6
        }
      );
    }
  }
}
