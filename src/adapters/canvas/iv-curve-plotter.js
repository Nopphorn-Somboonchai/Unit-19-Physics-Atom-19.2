/**
 * @file iv-curve-plotter.js
 * @description Canvas 2D Plotter for Simulator 2: Photoelectric Current (I) vs Potential Difference (ΔV).
 * Plots multi-curve IPST comparisons (Mode A: Varying Intensity vs Mode B: Varying Frequency),
 * exact stopping potential intercept (-V_s), saturation current guides (I_sat), and operating point.
 */

export class IVCurvePlotter {
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
   * Render I vs ΔV coordinate system and comparison curves
   * @param {{ state: Object, model: Object }} snapshot
   */
  render(snapshot) {
    const w = this.r.width;
    const h = this.r.height;
    const ctx = this.ctx;
    const { state, model } = snapshot;

    const isCompact = w < 640;
    const padL = isCompact ? 46 : 64;
    const padR = isCompact ? 22 : 34;
    const padT = isCompact ? 42 : 48;
    const padB = isCompact ? 46 : 54;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const baseY = padT + plotH;

    const xForV = (v) => padL + ((v - model.vMin) / (model.vMax - model.vMin)) * plotW;
    const yForI = (curr) => baseY - (Math.max(0, Math.min(model.iMax, curr)) / model.iMax) * plotH;
    const zeroX = xForV(0);

    // 1. Background
    this.r.clear('#090D16');

    // 2. Grid lines
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let v = -4; v <= 4; v += 1) {
      const gx = xForV(v);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, baseY);
      ctx.stroke();
    }
    for (let iVal = 20; iVal <= 100; iVal += 20) {
      const gy = yForI(iVal);
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + plotW, gy);
      ctx.stroke();
    }
    ctx.restore();

    // Retarding Potential Region Tint (ΔV < 0)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.045)';
    ctx.fillRect(padL, padT, zeroX - padL, plotH);

    // 3. Axes (X at I=0, Y at ΔV=0)
    this.r.drawArrow(padL - 4, baseY, padL + plotW + 10, baseY, '#94a3b8', 1.5, 6);
    this.r.drawArrow(zeroX, baseY + 4, zeroX, padT - 12, '#94a3b8', 1.5, 6);

    // Tick Labels
    for (let v = -5; v <= 5; v += isCompact ? 2 : 1) {
      const tx = xForV(v);
      this.r.drawLine(tx, baseY, tx, baseY + 5, '#94a3b8', 1);
      if (v !== 0) {
        this.r.drawLabel(`${v > 0 ? '+' : ''}${v}`, tx, baseY + 16, {
          font: '10px Fira Code, monospace',
          color: v < 0 ? '#fda4af' : '#94a3b8'
        });
      }
    }
    this.r.drawLabel('0', zeroX, baseY + 16, {
      font: 'bold 10px Fira Code, monospace',
      color: '#e2e8f0'
    });

    for (let iVal = 20; iVal <= 100; iVal += 20) {
      const ty = yForI(iVal);
      this.r.drawLine(zeroX - 4, ty, zeroX + 4, ty, '#94a3b8', 1);
      this.r.drawLabel(`${iVal}`, padL - 10, ty, {
        font: '10px Fira Code, monospace',
        color: '#94a3b8',
        align: 'right'
      });
    }

    // Axis Titles
    this.r.drawLabel('ความต่างศักย์ ΔV (V)', padL + plotW / 2, baseY + 34, {
      font: 'bold 11.5px Prompt, sans-serif',
      color: '#cbd5e1'
    });
    this.r.drawLabel('กระแสโฟโตอิเล็กทริก I (µA)', zeroX + 10, padT - 18, {
      font: 'bold 11px Prompt, sans-serif',
      color: '#cbd5e1',
      align: 'left'
    });

    // 4. Plot All Comparison Curves
    for (const curve of model.curves) {
      if (!curve.points || curve.points.length === 0) continue;

      // Subtle fill under primary curve
      if (curve.isPrimary && curve.emitsElectrons) {
        ctx.save();
        const fillGrad = ctx.createLinearGradient(0, padT, 0, baseY);
        fillGrad.addColorStop(0, 'rgba(34, 211, 238, 0.22)');
        fillGrad.addColorStop(1, 'rgba(34, 211, 238, 0.01)');
        ctx.beginPath();
        curve.points.forEach((pt, idx) => {
          const px = xForV(pt.v);
          const py = yForI(pt.current);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.lineTo(xForV(model.vMax), baseY);
        ctx.lineTo(xForV(model.vMin), baseY);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();
        ctx.restore();
      }

      // Curve stroke
      ctx.save();
      ctx.beginPath();
      curve.points.forEach((pt, idx) => {
        const px = xForV(pt.v);
        const py = yForI(pt.current);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = curve.isPrimary ? 3 : 2;
      if (!curve.isPrimary) ctx.setLineDash([5, 3]);
      ctx.stroke();
      ctx.restore();

      // Horizontal I_sat guide line at right edge
      if (curve.emitsElectrons && curve.saturationCurrentMicroA > 0) {
        const satY = yForI(curve.saturationCurrentMicroA);
        this.r.drawLine(zeroX, satY, padL + plotW, satY, curve.color, 1, [2, 4]);
      }

      // -V_s Intercept Marker Dot
      if (curve.emitsElectrons && curve.stoppingPotentialV > 0) {
        const cutoffV = -curve.stoppingPotentialV;
        if (cutoffV >= model.vMin && cutoffV <= 0) {
          const cx = xForV(cutoffV);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, baseY, curve.isPrimary ? 5.5 : 4, 0, Math.PI * 2);
          ctx.fillStyle = curve.color;
          ctx.shadowColor = curve.color;
          ctx.shadowBlur = curve.isPrimary ? 10 : 4;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // 5. Annotate Primary -V_s Cutoff & I_sat
    if (model.primary.emitsElectrons) {
      const cutV = -model.primary.stoppingPotentialV;
      if (cutV >= model.vMin && cutV <= 0) {
        const cx = xForV(cutV);
        const badgeX = Math.max(padL + 42, Math.min(zeroX - 38, cx));
        this.r.drawLabel(`-Vs = ${cutV.toFixed(2)} V`, badgeX, baseY - 22, {
          font: 'bold 10.5px Fira Code, monospace',
          color: '#fde047',
          bgColor: 'rgba(120, 53, 15, 0.9)',
          borderColor: '#fbbf24',
          padding: 4
        });
      }

      const satY = yForI(model.primarySaturationCurrentMicroA);
      this.r.drawLabel(`Isat = ${model.primarySaturationCurrentMicroA.toFixed(0)} µA`, padL + plotW - 6, satY - 12, {
        font: 'bold 10px Fira Code, monospace',
        color: '#67e8f9',
        align: 'right',
        bgColor: 'rgba(15, 23, 42, 0.85)',
        padding: 3
      });
    } else {
      this.r.drawLabel('f < f₀ → ไม่เกิดกระแสโฟโตอิเล็กทริก (I = 0 µA)', padL + plotW / 2, padT + plotH * 0.45, {
        font: `bold ${isCompact ? 11 : 12.5}px Prompt, sans-serif`,
        color: '#fecaca',
        bgColor: 'rgba(127, 29, 29, 0.92)',
        borderColor: '#f87171',
        padding: 7
      });
    }

    // 6. Interactive Operating Point (ΔV, I)
    if (state.showOperatingPoint) {
      const opX = xForV(model.operatingPoint.voltageV);
      const opY = yForI(model.operatingPoint.currentMicroA);

      this.r.drawLine(opX, opY, opX, baseY, '#4ade80', 1.2, [3, 3]);
      this.r.drawLine(zeroX, opY, opX, opY, '#4ade80', 1.2, [3, 3]);

      ctx.save();
      ctx.beginPath();
      ctx.arc(opX, opY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      const opLabel = `(${model.operatingPoint.voltageV >= 0 ? '+' : ''}${model.operatingPoint.voltageV.toFixed(1)} V, ${model.operatingPoint.currentMicroA.toFixed(1)} µA)`;
      const lblX = Math.max(padL + 60, Math.min(padL + plotW - 60, opX));
      const lblY = Math.max(padT + 20, opY - 18);
      this.r.drawLabel(opLabel, lblX, lblY, {
        font: 'bold 10px Fira Code, monospace',
        color: '#dcfce7',
        bgColor: 'rgba(6, 78, 59, 0.92)',
        borderColor: '#34d399',
        padding: 4
      });
    }

    // 7. Compact Top Legend Banner
    const modeTitle =
      model.comparisonMode === 'intensity'
        ? `โหมด A: เปลี่ยนความเข้มแสง (f คงที่ → -Vs จุดเดียวกัน)`
        : `โหมด B: เปลี่ยนความถี่แสง (ความเข้มคงที่ → -Vs เลื่อนซ้ายเมื่อ f สูงขึ้น)`;
    this.r.drawLabel(modeTitle, padL + 6, 18, {
      font: `bold ${isCompact ? 9.5 : 11}px Prompt, sans-serif`,
      color: '#38bdf8',
      align: 'left',
      bgColor: 'rgba(15, 23, 42, 0.88)',
      borderColor: '#334155',
      padding: 5
    });

    // Multi-curve Legend Box (Top-Left inside Plot)
    const legX = padL + 8;
    let legY = padT + 14;
    model.curves.forEach((curve) => {
      this.r.drawLine(legX, legY, legX + 16, legY, curve.color, curve.isPrimary ? 3 : 2, curve.isPrimary ? [] : [4, 2]);
      const shortLbl = isCompact && curve.label.length > 22 ? `${curve.label.slice(0, 21)}…` : curve.label;
      this.r.drawLabel(shortLbl, legX + 22, legY, {
        font: `${curve.isPrimary ? 'bold ' : ''}${isCompact ? 9 : 10}px Prompt, sans-serif`,
        color: curve.isPrimary ? '#f8fafc' : '#cbd5e1',
        align: 'left'
      });
      legY += 16;
    });
  }
}
