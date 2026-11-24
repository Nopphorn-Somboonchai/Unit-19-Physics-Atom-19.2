/**
 * @file ek-frequency-plotter.js
 * @description Canvas 2D Plotter for Simulator 3: E_{k,max}-f and V_s-f Multi-Metal Linear Graph.
 * Renders up to 3 parallel metal lines, dashed extrapolations to -W (or -W/e),
 * shaded f < f₀ non-emission zone, slope triangle (h or h/e), and interactive frequency probe.
 */

export class EkFrequencyPlotter {
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
   * Render E_{k,max}-f or V_s-f multi-metal comparison graph
   * @param {{ state: Object, model: Object }} snapshot
   */
  render(snapshot) {
    const w = this.r.width;
    const h = this.r.height;
    const ctx = this.ctx;
    const { model } = snapshot;

    const isCompact = w < 640;
    const padL = isCompact ? 48 : 66;
    const padR = isCompact ? 22 : 34;
    const padT = isCompact ? 42 : 48;
    const padB = isCompact ? 44 : 50;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const xForF = (f14) => padL + ((f14 - model.fMin14) / (model.fMax14 - model.fMin14)) * plotW;
    const yForVal = (val) => padT + ((model.yMax - val) / (model.yMax - model.yMin)) * plotH;
    const zeroY = yForVal(0);

    // 1. Clear Background
    this.r.clear('#090D16');

    // 2. Highlight Non-Emission Zone (f < lowest f₀) in upper quadrant
    const minF0 = model.series.length > 0 ? model.series[0].f0_14 : 5.0;
    const noEmitW = Math.max(0, xForF(minF0) - padL);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.fillRect(padL, padT, noEmitW, zeroY - padT);

    if (noEmitW > 56) {
      this.r.drawStackedLabel(
        isCompact ? ['f < f₀', 'ไม่เกิด e⁻'] : ['โซน f < f₀', 'ไม่เกิดโฟโตอิเล็กตรอน'],
        padL + noEmitW / 2,
        padT + (zeroY - padT) * 0.45,
        {
          font: `bold ${isCompact ? 9 : 10.5}px Prompt, sans-serif`,
          color: '#fda4af',
          bgColor: 'rgba(127, 29, 29, 0.45)',
          padding: 4
        }
      );
    }

    // 3. Coordinate Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let f = 2; f <= 20; f += 2) {
      const gx = xForF(f);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();
    }
    for (let yv = -6; yv <= 6; yv += 2) {
      const gy = yForVal(yv);
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + plotW, gy);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Coordinate Axes (Y at f=0, X at y=0)
    this.r.drawArrow(padL, zeroY, padL + plotW + 10, zeroY, '#cbd5e1', 1.6, 6);
    this.r.drawArrow(padL, padT + plotH + 4, padL, padT - 12, '#cbd5e1', 1.6, 6);

    // X ticks (f in × 10¹⁴ Hz)
    for (let f = 2; f <= 20; f += isCompact ? 4 : 2) {
      const tx = xForF(f);
      this.r.drawLine(tx, zeroY - 3, tx, zeroY + 4, '#94a3b8', 1);
      this.r.drawLabel(`${f}`, tx, zeroY + 14, {
        font: '9.5px Fira Code, monospace',
        color: '#94a3b8'
      });
    }

    // Y ticks (eV or V)
    for (let yv = -6; yv <= 6; yv += 2) {
      const ty = yForVal(yv);
      this.r.drawLine(padL - 4, ty, padL + 4, ty, '#94a3b8', 1);
      this.r.drawLabel(`${yv}`, padL - 10, ty, {
        font: '9.5px Fira Code, monospace',
        color: yv < 0 ? '#fca5a5' : '#94a3b8',
        align: 'right'
      });
    }

    // Axis Titles
    this.r.drawLabel('ความถี่แสง f (× 10¹⁴ Hz)', padL + plotW / 2, padT + plotH + 28, {
      font: 'bold 11.5px Prompt, sans-serif',
      color: '#cbd5e1'
    });
    this.r.drawLabel(model.yAxisLabel, padL + 8, padT - 18, {
      font: 'bold 11px Prompt, sans-serif',
      color: '#38bdf8',
      align: 'left'
    });

    // 5. Plot Multi-Metal Parallel Lines
    model.series.forEach((s, idx) => {
      const color = s.metal.lineColor;

      // Dashed extrapolated line below f₀ down to Y-intercept (-W or -W/e)
      if (model.showExtrapolation) {
        this.r.drawLine(
          xForF(s.extrapolatedSegment.x1),
          yForVal(s.extrapolatedSegment.y1),
          xForF(s.extrapolatedSegment.x2),
          yForVal(s.extrapolatedSegment.y2),
          color,
          1.8,
          [5, 4]
        );

        // Y-intercept dot
        const yIntPy = yForVal(s.yIntercept);
        ctx.save();
        ctx.beginPath();
        ctx.arc(padL, yIntPy, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();

        // Compact Y-intercept label right next to Y axis
        this.r.drawLabel(
          `${s.metal.symbol}: ${s.yIntercept.toFixed(1)}`,
          padL + 8 + idx * (isCompact ? 0 : 0),
          Math.min(padT + plotH - 8, yIntPy + (idx === 1 ? 0 : idx === 0 ? -9 : 9)),
          {
            font: 'bold 9px Fira Code, monospace',
            color,
            align: 'left',
            bgColor: 'rgba(9, 13, 22, 0.85)',
            padding: 2
          }
        );
      }

      // Solid physical emission ray (f >= f₀)
      const sx1 = xForF(s.solidSegment.x1);
      const sy1 = yForVal(s.solidSegment.y1);
      const sx2 = xForF(s.solidSegment.x2);
      const sy2 = yForVal(Math.min(model.yMax, s.solidSegment.y2));

      // Clip at top edge yMax if line exceeds yMax
      let endF = s.solidSegment.x2;
      let endY = s.solidSegment.y2;
      if (endY > model.yMax) {
        const slopePer14 = model.slope.valuePer10e14Hz;
        endF = s.f0_14 + model.yMax / slopePer14;
        endY = model.yMax;
      }

      this.r.drawLine(sx1, sy1, xForF(endF), yForVal(endY), color, 2.8);

      // X-intercept f₀ marker dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx1, zeroY, 4.8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      // Metal label near upper end of its line
      const lblF = Math.min(endF - 1.0, s.f0_14 + 6.5);
      const lblYVal = (lblF - s.f0_14) * model.slope.valuePer10e14Hz;
      if (lblYVal > 0.4 && lblYVal < model.yMax - 0.5) {
        this.r.drawLabel(`${s.metal.symbol}`, xForF(lblF), yForVal(lblYVal) - 12, {
          font: 'bold 10.5px Fira Code, monospace',
          color,
          bgColor: 'rgba(15, 23, 42, 0.88)',
          borderColor: color,
          padding: 3
        });
      }
    });

    // 6. Draw Slope Triangle Annotation on First Metal Line
    if (model.series.length > 0 && !isCompact) {
      const ref = model.series[0];
      const fA = Math.min(13, ref.f0_14 + 3.0);
      const fB = fA + 3.5;
      const yA = (fA - ref.f0_14) * model.slope.valuePer10e14Hz;
      const yB = (fB - ref.f0_14) * model.slope.valuePer10e14Hz;

      if (yB < model.yMax - 0.4) {
        const ax = xForF(fA);
        const ay = yForVal(yA);
        const bx = xForF(fB);
        const by = yForVal(yB);

        this.r.drawLine(ax, ay, bx, ay, '#fbbf24', 1.4, [3, 2]);
        this.r.drawLine(bx, ay, bx, by, '#fbbf24', 1.4, [3, 2]);
        this.r.drawLabel(`ความชัน = ${model.slope.symbolText}`, bx + 8, (ay + by) / 2, {
          font: 'bold 10px Prompt, sans-serif',
          color: '#fde047',
          align: 'left',
          bgColor: 'rgba(120, 53, 15, 0.88)',
          padding: 4
        });
      }
    }

    // 7. Interactive Frequency Probe Vertical Line & Real-time Readout Dots
    const probeX = xForF(model.probeFrequency14);
    this.r.drawLine(probeX, padT, probeX, padT + plotH, 'rgba(250, 204, 21, 0.75)', 1.5, [4, 3]);
    this.r.drawLabel(`f = ${model.probeFrequency14.toFixed(1)}×10¹⁴ Hz`, Math.max(padL + 56, Math.min(padL + plotW - 56, probeX)), padT + 12, {
      font: 'bold 10px Fira Code, monospace',
      color: '#fef08a',
      bgColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: '#facc15',
      padding: 4
    });

    model.series.forEach((s) => {
      if (s.probe.emitsElectrons && s.probe.yValue <= model.yMax) {
        const py = yForVal(s.probe.yValue);
        ctx.save();
        ctx.beginPath();
        ctx.arc(probeX, py, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = s.metal.lineColor;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });

    // 8. Top-Right Universal Slope Pill
    const slopeBadge =
      model.yAxisMode === 'vs'
        ? `เส้นตรงขนานทุกโลหะ | ความชัน = h/e = 4.14×10⁻¹⁵ V·s`
        : `เส้นตรงขนานทุกโลหะ | ความชัน = h = 6.626×10⁻³⁴ J·s`;
    this.r.drawLabel(isCompact ? `ความชัน = ${model.slope.symbolText} (คงที่)` : slopeBadge, padL + plotW, 18, {
      font: `bold ${isCompact ? 9.5 : 10.5}px Prompt, sans-serif`,
      color: '#a78bfa',
      align: 'right',
      bgColor: 'rgba(15, 23, 42, 0.88)',
      borderColor: '#4c1d95',
      padding: 5
    });
  }
}
