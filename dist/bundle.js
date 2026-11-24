(() => {
  // src/shared/config.js
  var APP_CONFIG = {
    appName: "Physics Unit 19.2: Photoelectric Effect",
    version: "1.0.0",
    standardVersion: "v1.13.0",
    courseCode: "\u0E2733206",
    courseName: "\u0E1F\u0E34\u0E2A\u0E34\u0E01\u0E2A\u0E4C 6 (\u0E21.6)",
    chapterNumber: 19,
    sectionNumber: "19.2",
    chapterTitleTh: "\u0E1F\u0E34\u0E2A\u0E34\u0E01\u0E2A\u0E4C\u0E2D\u0E30\u0E15\u0E2D\u0E21 (19.2 \u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01)",
    chapterTitleEn: "Atomic Physics: 19.2 Photoelectric Effect",
    schoolName: "\u0E42\u0E23\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19\u0E2B\u0E49\u0E2D\u0E07\u0E2A\u0E2D\u0E19\u0E28\u0E36\u0E01\u0E29\u0E32 \u0E43\u0E19\u0E1E\u0E23\u0E30\u0E2D\u0E38\u0E1B\u0E16\u0E31\u0E21\u0E20\u0E4C\u0E2F",
    author: "Nopphorn Somboonchai",
    minRollNumber: 1,
    maxRollNumber: 40,
    numericAnswerTolerance: 0.03,
    // ±3% tolerance
    exam: {
      durationMinutes: 15,
      totalQuestions: 5,
      maxScore: 10,
      scorePerQuestion: 2,
      passingScore: 6,
      // 60%
      tolerancePercent: 3
      // ±3% tolerance for numeric responses
    },
    storageKeys: {
      examResult: "u19_2_exam_latest_result",
      examSession: "u19_2_exam_active_session",
      userPreferences: "u19_2_user_prefs"
    }
  };

  // src/shared/constants.js
  var PLANCK_CONSTANT = 6626e-37;
  var SPEED_OF_LIGHT = 3e8;
  var ELEMENTARY_CHARGE = 1602e-22;
  var ELECTRON_MASS = 9109e-34;
  var EV_TO_JOULES = ELEMENTARY_CHARGE;
  var JOULES_TO_EV = 1 / ELEMENTARY_CHARGE;
  var HC_JOULE_METERS = PLANCK_CONSTANT * SPEED_OF_LIGHT;
  var HC_EV_NM = HC_JOULE_METERS / EV_TO_JOULES * 1e9;
  var PLANCK_CONSTANT_EV_S = PLANCK_CONSTANT / EV_TO_JOULES;
  var METAL_WORK_FUNCTIONS = Object.freeze([
    {
      id: "cs",
      symbol: "Cs",
      nameTh: "\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21",
      nameEn: "Cesium",
      workFunctionEV: 2.1,
      plateColor: "#eab308",
      lineColor: "#38bdf8"
    },
    {
      id: "k",
      symbol: "K",
      nameTh: "\u0E42\u0E1E\u0E41\u0E17\u0E2A\u0E40\u0E0B\u0E35\u0E22\u0E21",
      nameEn: "Potassium",
      workFunctionEV: 2.3,
      plateColor: "#c084fc",
      lineColor: "#a78bfa"
    },
    {
      id: "na",
      symbol: "Na",
      nameTh: "\u0E42\u0E0B\u0E40\u0E14\u0E35\u0E22\u0E21",
      nameEn: "Sodium",
      workFunctionEV: 2.4,
      plateColor: "#94a3b8",
      lineColor: "#4ade80"
    },
    {
      id: "ca",
      symbol: "Ca",
      nameTh: "\u0E41\u0E04\u0E25\u0E40\u0E0B\u0E35\u0E22\u0E21",
      nameEn: "Calcium",
      workFunctionEV: 2.9,
      plateColor: "#cbd5e1",
      lineColor: "#2dd4bf"
    },
    {
      id: "al",
      symbol: "Al",
      nameTh: "\u0E2D\u0E30\u0E25\u0E39\u0E21\u0E34\u0E40\u0E19\u0E35\u0E22\u0E21",
      nameEn: "Aluminum",
      workFunctionEV: 4.2,
      plateColor: "#d1d5db",
      lineColor: "#f59e0b"
    },
    {
      id: "zn",
      symbol: "Zn",
      nameTh: "\u0E2A\u0E31\u0E07\u0E01\u0E30\u0E2A\u0E35",
      nameEn: "Zinc",
      workFunctionEV: 4.3,
      plateColor: "#64748b",
      lineColor: "#f43f5e"
    },
    {
      id: "cu",
      symbol: "Cu",
      nameTh: "\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07",
      nameEn: "Copper",
      workFunctionEV: 4.8,
      plateColor: "#ea580c",
      lineColor: "#fb923c"
    },
    {
      id: "au",
      symbol: "Au",
      nameTh: "\u0E17\u0E2D\u0E07\u0E04\u0E33",
      nameEn: "Gold",
      workFunctionEV: 5.1,
      plateColor: "#facc15",
      lineColor: "#fde047"
    }
  ]);

  // src/adapters/canvas/canvas-renderer.js
  var CanvasRenderer = class {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error("[CanvasRenderer] Valid HTMLCanvasElement is required");
      }
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.dpr = typeof window !== "undefined" && window.devicePixelRatio || 1;
      this.onResize = null;
      this.resize();
      this._handleResize = () => {
        this.resize();
        if (typeof this.onResize === "function") {
          this.onResize();
        }
      };
      if (typeof window !== "undefined") {
        window.addEventListener("resize", this._handleResize);
      }
      if (typeof ResizeObserver !== "undefined") {
        this._resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              if (Math.abs(width - this.width) > 1 || Math.abs(height - this.height) > 1) {
                this.resize();
                if (typeof this.onResize === "function") {
                  this.onResize();
                }
              }
            }
          }
        });
        this._resizeObserver.observe(this.canvas);
      }
    }
    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const width = Math.round(rect.width) || this.canvas.clientWidth || 800;
      const height = Math.round(rect.height) || this.canvas.clientHeight || 380;
      this.width = width;
      this.height = height;
      const targetWidth = Math.floor(width * this.dpr);
      const targetHeight = Math.floor(height * this.dpr);
      if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;
      }
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    clear(bgColor = "#090D16") {
      this.ctx.fillStyle = bgColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    drawLine(x1, y1, x2, y2, color = "#FFFFFF", lineWidth = 1, dash = []) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth;
      if (dash.length > 0) this.ctx.setLineDash(dash);
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.restore();
    }
    drawArrow(x1, y1, x2, y2, color = "#3B82F6", lineWidth = 2, headSize = 7) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.fillStyle = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(
        x2 - headSize * Math.cos(angle - Math.PI / 6),
        y2 - headSize * Math.sin(angle - Math.PI / 6)
      );
      this.ctx.lineTo(
        x2 - headSize * Math.cos(angle + Math.PI / 6),
        y2 - headSize * Math.sin(angle + Math.PI / 6)
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
    drawRoundedRect(x, y, w, h, r = 8, { fill = null, stroke = null, lineWidth = 1 } = {}) {
      const radius = Math.min(r, w / 2, h / 2);
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      ctx.restore();
    }
    drawLabel(text, x, y, {
      font = "12px Prompt, Sarabun, sans-serif",
      color = "#F8FAFC",
      align = "center",
      bgColor = null,
      borderColor = null,
      padding = 4
    } = {}) {
      const ctx = this.ctx;
      ctx.save();
      ctx.font = font;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      if (bgColor || borderColor) {
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = 14;
        let rectX = x - textWidth / 2 - padding;
        if (align === "left") rectX = x - padding;
        if (align === "right") rectX = x - textWidth - padding;
        this.drawRoundedRect(
          rectX,
          y - textHeight / 2 - padding / 2,
          textWidth + padding * 2,
          textHeight + padding,
          5,
          { fill: bgColor, stroke: borderColor, lineWidth: 1 }
        );
      }
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.restore();
    }
    drawStackedLabel(lines, x, y, {
      font = "11px Prompt, Sarabun, sans-serif",
      color = "#F8FAFC",
      align = "center",
      lineHeight = 15,
      bgColor = null,
      padding = 4
    } = {}) {
      if (!lines || lines.length === 0) return;
      const ctx = this.ctx;
      ctx.save();
      ctx.font = font;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      const totalHeight = lines.length * lineHeight;
      const startY = y - totalHeight / 2 + lineHeight / 2;
      if (bgColor) {
        let maxWidth = 0;
        for (const line of lines) {
          const w = ctx.measureText(line).width;
          if (w > maxWidth) maxWidth = w;
        }
        let rectX = x - maxWidth / 2 - padding;
        if (align === "left") rectX = x - padding;
        if (align === "right") rectX = x - maxWidth - padding;
        this.drawRoundedRect(
          rectX,
          y - totalHeight / 2 - padding / 2,
          maxWidth + padding * 2,
          totalHeight + padding,
          6,
          { fill: bgColor }
        );
      }
      ctx.fillStyle = color;
      lines.forEach((line, idx) => {
        ctx.fillText(line, x, startY + idx * lineHeight);
      });
      ctx.restore();
    }
    destroy() {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", this._handleResize);
      }
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
      }
    }
  };

  // src/adapters/canvas/photoelectric-tube-plotter.js
  var PhotoelectricTubePlotter = class {
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
      this.r.clear("#090D16");
      ctx.save();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
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
      const beamAlpha = state.intensityPercent > 0 ? 0.08 + state.intensityPercent / 100 * 0.28 : 0;
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
      this.r.drawRoundedRect(lampX - 44, lampY - 12, 88, 28, 8, {
        fill: "#1e293b",
        stroke: state.intensityPercent > 0 ? hex : "#475569",
        lineWidth: 2
      });
      this.r.drawLabel(
        isUV ? `UV ${state.wavelengthNm} nm` : `${state.wavelengthNm} nm`,
        lampX,
        lampY + 2,
        {
          font: "bold 11px Fira Code, monospace",
          color: state.intensityPercent > 0 ? "#f8fafc" : "#64748b"
        }
      );
      ctx.save();
      const glassGrad = ctx.createLinearGradient(tubeX, tubeY, tubeX, tubeY + tubeH);
      glassGrad.addColorStop(0, "rgba(30, 41, 59, 0.55)");
      glassGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.85)");
      glassGrad.addColorStop(1, "rgba(30, 41, 59, 0.55)");
      this.r.drawRoundedRect(tubeX, tubeY, tubeW, tubeH, tubeH / 2.2, {
        fill: glassGrad,
        stroke: "rgba(148, 163, 184, 0.45)",
        lineWidth: 2
      });
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2;
      ctx.moveTo(tubeX + 40, tubeY + 10);
      ctx.lineTo(tubeX + tubeW - 40, tubeY + 10);
      ctx.stroke();
      ctx.restore();
      this.r.drawLabel("\u0E2B\u0E25\u0E2D\u0E14\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 (Evacuated Phototube)", tubeX + tubeW / 2, tubeY + 16, {
        font: "10px Prompt, sans-serif",
        color: "#64748b"
      });
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
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(9, 0, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
      this.r.drawRoundedRect(cathodeX - 6, plateTop, 12, plateH, 4, {
        fill: physics.metal.plateColor,
        stroke: "#f8fafc",
        lineWidth: 1.5
      });
      this.r.drawLabel(`\u0E41\u0E04\u0E42\u0E17\u0E14 (${physics.metal.symbol})`, cathodeX + 4, tubeY + tubeH - 15, {
        font: "bold 10px Prompt, sans-serif",
        color: "#e2e8f0",
        align: "left"
      });
      this.r.drawRoundedRect(anodeX - 5, plateTop, 10, plateH, 4, {
        fill: "#64748b",
        stroke: state.voltageV > 0 ? "#38bdf8" : state.voltageV < 0 ? "#f43f5e" : "#cbd5e1",
        lineWidth: 1.5
      });
      const anodeSign = state.voltageV > 0 ? "(+)" : state.voltageV < 0 ? "(-)" : "(0)";
      this.r.drawLabel(`\u0E41\u0E2D\u0E42\u0E19\u0E14 ${anodeSign}`, anodeX - 4, tubeY + tubeH - 15, {
        font: "bold 10px Prompt, sans-serif",
        color: state.voltageV > 0 ? "#38bdf8" : state.voltageV < 0 ? "#fb7185" : "#cbd5e1",
        align: "right"
      });
      if (Math.abs(state.voltageV) > 0.05) {
        const eMidY = tubeY + tubeH - 30;
        const eColor = state.voltageV > 0 ? "rgba(56, 189, 248, 0.45)" : "rgba(244, 63, 94, 0.5)";
        if (state.voltageV > 0) {
          this.r.drawArrow(tubeX + tubeW * 0.58, eMidY, tubeX + tubeW * 0.42, eMidY, eColor, 1.5, 5);
          this.r.drawLabel("\u0E41\u0E23\u0E07\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E40\u0E23\u0E48\u0E07 e\u207B \u2192", tubeX + tubeW * 0.5, eMidY - 10, {
            font: "9.5px Prompt, sans-serif",
            color: "#38bdf8"
          });
        } else {
          this.r.drawArrow(tubeX + tubeW * 0.42, eMidY, tubeX + tubeW * 0.58, eMidY, eColor, 1.5, 5);
          this.r.drawLabel("\u2190 \u0E41\u0E23\u0E07\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E2B\u0E19\u0E48\u0E27\u0E07 e\u207B", tubeX + tubeW * 0.5, eMidY - 10, {
            font: "9.5px Prompt, sans-serif",
            color: "#fb7185"
          });
        }
      }
      if (physics.activeEmission && electrons.length > 0) {
        const spanX = anodeX - 10 - (cathodeX + 10);
        ctx.save();
        for (const e of electrons) {
          const ex = cathodeX + 10 + e.x * spanX;
          const ey = tubeCy + e.yOffset * (plateH * 0.78);
          const eColor = e.turningBack ? "#fb7185" : "#38bdf8";
          ctx.beginPath();
          ctx.strokeStyle = e.turningBack ? "rgba(251, 113, 133, 0.45)" : "rgba(56, 189, 248, 0.45)";
          ctx.lineWidth = 2;
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - Math.sign(e.vx || 1) * 10, ey);
          ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = eColor;
          ctx.shadowColor = eColor;
          ctx.shadowBlur = 8;
          ctx.arc(ex, ey, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8px Fira Code, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("\u2212", ex, ey + 0.5);
        }
        ctx.restore();
      }
      if (!physics.emitsElectrons) {
        const msg = isCompact ? `\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (E < W)` : `\u26A0\uFE0F \u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30 E (${physics.photonEnergyEV.toFixed(2)} eV) < W (${physics.workFunctionEV.toFixed(1)} eV)`;
        this.r.drawLabel(msg, tubeX + tubeW / 2, tubeCy, {
          font: `bold ${isCompact ? 11 : 12}px Prompt, sans-serif`,
          color: "#fecaca",
          bgColor: "rgba(127, 29, 29, 0.92)",
          borderColor: "#f87171",
          padding: 7
        });
      } else if (state.intensityPercent === 0) {
        this.r.drawLabel("\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07 = 0% (\u0E1B\u0E34\u0E14\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14\u0E41\u0E2A\u0E07)", tubeX + tubeW / 2, tubeCy, {
          font: "bold 11px Prompt, sans-serif",
          color: "#cbd5e1",
          bgColor: "rgba(15, 23, 42, 0.9)",
          borderColor: "#475569",
          padding: 6
        });
      } else if (physics.electronMotionMode === "stopped") {
        const stopMsg = isCompact ? `\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C (\u0394V \u2264 -Vs)` : `\u{1F6D1} \u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 (\u0394V \u2264 -Vs = -${physics.stoppingPotentialV.toFixed(2)} V) \u2192 I = 0 \xB5A`;
        this.r.drawLabel(stopMsg, tubeX + tubeW / 2, tubeY + 38, {
          font: "bold 10.5px Prompt, sans-serif",
          color: "#fde68a",
          bgColor: "rgba(120, 53, 15, 0.9)",
          borderColor: "#f59e0b",
          padding: 5
        });
      }
      const circuitY = tubeY + tubeH + (isCompact ? 68 : 76);
      const wireColor = physics.photocurrentMicroA > 0.1 ? "#22d3ee" : "#475569";
      this.r.drawLine(cathodeX, tubeCy, tubeX - 10, tubeCy, wireColor, 2.2);
      this.r.drawLine(tubeX - 10, tubeCy, tubeX - 10, circuitY, wireColor, 2.2);
      this.r.drawLine(anodeX, tubeCy, tubeX + tubeW + 10, tubeCy, wireColor, 2.2);
      this.r.drawLine(tubeX + tubeW + 10, tubeCy, tubeX + tubeW + 10, circuitY, wireColor, 2.2);
      this.r.drawLine(tubeX - 10, circuitY, tubeX + tubeW + 10, circuitY, wireColor, 2.2);
      const meterW = isCompact ? 96 : 128;
      const meterH = 44;
      const ammX = tubeX + tubeW * 0.2 - meterW / 2;
      this.r.drawRoundedRect(ammX, circuitY - meterH / 2, meterW, meterH, 10, {
        fill: "#0f172a",
        stroke: physics.photocurrentMicroA > 0.1 ? "#10b981" : "#475569",
        lineWidth: 2
      });
      this.r.drawLabel("\u0E41\u0E2D\u0E21\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C (I)", ammX + meterW / 2, circuitY - 9, {
        font: "9.5px Prompt, sans-serif",
        color: "#94a3b8"
      });
      this.r.drawLabel(`${physics.photocurrentMicroA.toFixed(1)} \xB5A`, ammX + meterW / 2, circuitY + 9, {
        font: `bold ${isCompact ? 11.5 : 13}px Fira Code, monospace`,
        color: physics.photocurrentMicroA > 0.1 ? "#4ade80" : "#64748b"
      });
      const psuW = isCompact ? 82 : 114;
      const psuX = tubeX + tubeW * 0.5 - psuW / 2;
      this.r.drawRoundedRect(psuX, circuitY - meterH / 2, psuW, meterH, 10, {
        fill: "#1e293b",
        stroke: "#6366f1",
        lineWidth: 1.8
      });
      this.r.drawLabel("\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E08\u0E48\u0E32\u0E22 \u0394V", psuX + psuW / 2, circuitY - 9, {
        font: "9.5px Prompt, sans-serif",
        color: "#c7d2fe"
      });
      const signStr = state.voltageV > 0 ? "\u2212  | |  +" : state.voltageV < 0 ? "+  | |  \u2212" : "0 V";
      this.r.drawLabel(signStr, psuX + psuW / 2, circuitY + 9, {
        font: "bold 11px Fira Code, monospace",
        color: "#f8fafc"
      });
      const voltX = tubeX + tubeW * 0.8 - meterW / 2;
      this.r.drawRoundedRect(voltX, circuitY - meterH / 2, meterW, meterH, 10, {
        fill: "#0f172a",
        stroke: state.voltageV < 0 ? "#f43f5e" : "#38bdf8",
        lineWidth: 2
      });
      this.r.drawLabel("\u0E42\u0E27\u0E25\u0E15\u0E4C\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C (\u0394V)", voltX + meterW / 2, circuitY - 9, {
        font: "9.5px Prompt, sans-serif",
        color: "#94a3b8"
      });
      const vPrefix = state.voltageV > 0 ? "+" : "";
      this.r.drawLabel(`${vPrefix}${state.voltageV.toFixed(2)} V`, voltX + meterW / 2, circuitY + 9, {
        font: `bold ${isCompact ? 11.5 : 13}px Fira Code, monospace`,
        color: state.voltageV < 0 ? "#fb7185" : "#38bdf8"
      });
      if (!isCompact) {
        this.r.drawLabel(
          `${physics.metal.nameTh} (${physics.metal.symbol}) \xB7 W = ${physics.workFunctionEV.toFixed(1)} eV | ${labelTh}`,
          padX,
          24,
          {
            font: "bold 11px Prompt, sans-serif",
            color: "#e2e8f0",
            align: "left",
            bgColor: "rgba(15, 23, 42, 0.85)",
            borderColor: "#334155",
            padding: 6
          }
        );
      }
    }
  };

  // src/adapters/canvas/iv-curve-plotter.js
  var IVCurvePlotter = class {
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
      const xForV = (v) => padL + (v - model.vMin) / (model.vMax - model.vMin) * plotW;
      const yForI = (curr) => baseY - Math.max(0, Math.min(model.iMax, curr)) / model.iMax * plotH;
      const zeroX = xForV(0);
      this.r.clear("#090D16");
      ctx.save();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.09)";
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
      ctx.fillStyle = "rgba(244, 63, 94, 0.045)";
      ctx.fillRect(padL, padT, zeroX - padL, plotH);
      this.r.drawArrow(padL - 4, baseY, padL + plotW + 10, baseY, "#94a3b8", 1.5, 6);
      this.r.drawArrow(zeroX, baseY + 4, zeroX, padT - 12, "#94a3b8", 1.5, 6);
      for (let v = -5; v <= 5; v += isCompact ? 2 : 1) {
        const tx = xForV(v);
        this.r.drawLine(tx, baseY, tx, baseY + 5, "#94a3b8", 1);
        if (v !== 0) {
          this.r.drawLabel(`${v > 0 ? "+" : ""}${v}`, tx, baseY + 16, {
            font: "10px Fira Code, monospace",
            color: v < 0 ? "#fda4af" : "#94a3b8"
          });
        }
      }
      this.r.drawLabel("0", zeroX, baseY + 16, {
        font: "bold 10px Fira Code, monospace",
        color: "#e2e8f0"
      });
      for (let iVal = 20; iVal <= 100; iVal += 20) {
        const ty = yForI(iVal);
        this.r.drawLine(zeroX - 4, ty, zeroX + 4, ty, "#94a3b8", 1);
        this.r.drawLabel(`${iVal}`, padL - 10, ty, {
          font: "10px Fira Code, monospace",
          color: "#94a3b8",
          align: "right"
        });
      }
      this.r.drawLabel("\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C \u0394V (V)", padL + plotW / 2, baseY + 34, {
        font: "bold 11.5px Prompt, sans-serif",
        color: "#cbd5e1"
      });
      this.r.drawLabel("\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 I (\xB5A)", zeroX + 10, padT - 18, {
        font: "bold 11px Prompt, sans-serif",
        color: "#cbd5e1",
        align: "left"
      });
      for (const curve of model.curves) {
        if (!curve.points || curve.points.length === 0) continue;
        if (curve.isPrimary && curve.emitsElectrons) {
          ctx.save();
          const fillGrad = ctx.createLinearGradient(0, padT, 0, baseY);
          fillGrad.addColorStop(0, "rgba(34, 211, 238, 0.22)");
          fillGrad.addColorStop(1, "rgba(34, 211, 238, 0.01)");
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
        if (curve.emitsElectrons && curve.saturationCurrentMicroA > 0) {
          const satY = yForI(curve.saturationCurrentMicroA);
          this.r.drawLine(zeroX, satY, padL + plotW, satY, curve.color, 1, [2, 4]);
        }
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
      if (model.primary.emitsElectrons) {
        const cutV = -model.primary.stoppingPotentialV;
        if (cutV >= model.vMin && cutV <= 0) {
          const cx = xForV(cutV);
          const badgeX = Math.max(padL + 42, Math.min(zeroX - 38, cx));
          this.r.drawLabel(`-Vs = ${cutV.toFixed(2)} V`, badgeX, baseY - 22, {
            font: "bold 10.5px Fira Code, monospace",
            color: "#fde047",
            bgColor: "rgba(120, 53, 15, 0.9)",
            borderColor: "#fbbf24",
            padding: 4
          });
        }
        const satY = yForI(model.primarySaturationCurrentMicroA);
        this.r.drawLabel(`Isat = ${model.primarySaturationCurrentMicroA.toFixed(0)} \xB5A`, padL + plotW - 6, satY - 12, {
          font: "bold 10px Fira Code, monospace",
          color: "#67e8f9",
          align: "right",
          bgColor: "rgba(15, 23, 42, 0.85)",
          padding: 3
        });
      } else {
        this.r.drawLabel("f < f\u2080 \u2192 \u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 (I = 0 \xB5A)", padL + plotW / 2, padT + plotH * 0.45, {
          font: `bold ${isCompact ? 11 : 12.5}px Prompt, sans-serif`,
          color: "#fecaca",
          bgColor: "rgba(127, 29, 29, 0.92)",
          borderColor: "#f87171",
          padding: 7
        });
      }
      if (state.showOperatingPoint) {
        const opX = xForV(model.operatingPoint.voltageV);
        const opY = yForI(model.operatingPoint.currentMicroA);
        this.r.drawLine(opX, opY, opX, baseY, "#4ade80", 1.2, [3, 3]);
        this.r.drawLine(zeroX, opY, opX, opY, "#4ade80", 1.2, [3, 3]);
        ctx.save();
        ctx.beginPath();
        ctx.arc(opX, opY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#4ade80";
        ctx.shadowColor = "#4ade80";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.restore();
        const opLabel = `(${model.operatingPoint.voltageV >= 0 ? "+" : ""}${model.operatingPoint.voltageV.toFixed(1)} V, ${model.operatingPoint.currentMicroA.toFixed(1)} \xB5A)`;
        const lblX = Math.max(padL + 60, Math.min(padL + plotW - 60, opX));
        const lblY = Math.max(padT + 20, opY - 18);
        this.r.drawLabel(opLabel, lblX, lblY, {
          font: "bold 10px Fira Code, monospace",
          color: "#dcfce7",
          bgColor: "rgba(6, 78, 59, 0.92)",
          borderColor: "#34d399",
          padding: 4
        });
      }
      const modeTitle = model.comparisonMode === "intensity" ? `\u0E42\u0E2B\u0E21\u0E14 A: \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07 (f \u0E04\u0E07\u0E17\u0E35\u0E48 \u2192 -Vs \u0E08\u0E38\u0E14\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19)` : `\u0E42\u0E2B\u0E21\u0E14 B: \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 (\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E04\u0E07\u0E17\u0E35\u0E48 \u2192 -Vs \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E0B\u0E49\u0E32\u0E22\u0E40\u0E21\u0E37\u0E48\u0E2D f \u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19)`;
      this.r.drawLabel(modeTitle, padL + 6, 18, {
        font: `bold ${isCompact ? 9.5 : 11}px Prompt, sans-serif`,
        color: "#38bdf8",
        align: "left",
        bgColor: "rgba(15, 23, 42, 0.88)",
        borderColor: "#334155",
        padding: 5
      });
      const legX = padL + 8;
      let legY = padT + 14;
      model.curves.forEach((curve) => {
        this.r.drawLine(legX, legY, legX + 16, legY, curve.color, curve.isPrimary ? 3 : 2, curve.isPrimary ? [] : [4, 2]);
        const shortLbl = isCompact && curve.label.length > 22 ? `${curve.label.slice(0, 21)}\u2026` : curve.label;
        this.r.drawLabel(shortLbl, legX + 22, legY, {
          font: `${curve.isPrimary ? "bold " : ""}${isCompact ? 9 : 10}px Prompt, sans-serif`,
          color: curve.isPrimary ? "#f8fafc" : "#cbd5e1",
          align: "left"
        });
        legY += 16;
      });
    }
  };

  // src/adapters/canvas/ek-frequency-plotter.js
  var EkFrequencyPlotter = class {
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
      const xForF = (f14) => padL + (f14 - model.fMin14) / (model.fMax14 - model.fMin14) * plotW;
      const yForVal = (val) => padT + (model.yMax - val) / (model.yMax - model.yMin) * plotH;
      const zeroY = yForVal(0);
      this.r.clear("#090D16");
      const minF0 = model.series.length > 0 ? model.series[0].f0_14 : 5;
      const noEmitW = Math.max(0, xForF(minF0) - padL);
      ctx.fillStyle = "rgba(244, 63, 94, 0.08)";
      ctx.fillRect(padL, padT, noEmitW, zeroY - padT);
      if (noEmitW > 56) {
        this.r.drawStackedLabel(
          isCompact ? ["f < f\u2080", "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14 e\u207B"] : ["\u0E42\u0E0B\u0E19 f < f\u2080", "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19"],
          padL + noEmitW / 2,
          padT + (zeroY - padT) * 0.45,
          {
            font: `bold ${isCompact ? 9 : 10.5}px Prompt, sans-serif`,
            color: "#fda4af",
            bgColor: "rgba(127, 29, 29, 0.45)",
            padding: 4
          }
        );
      }
      ctx.save();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.09)";
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
      this.r.drawArrow(padL, zeroY, padL + plotW + 10, zeroY, "#cbd5e1", 1.6, 6);
      this.r.drawArrow(padL, padT + plotH + 4, padL, padT - 12, "#cbd5e1", 1.6, 6);
      for (let f = 2; f <= 20; f += isCompact ? 4 : 2) {
        const tx = xForF(f);
        this.r.drawLine(tx, zeroY - 3, tx, zeroY + 4, "#94a3b8", 1);
        this.r.drawLabel(`${f}`, tx, zeroY + 14, {
          font: "9.5px Fira Code, monospace",
          color: "#94a3b8"
        });
      }
      for (let yv = -6; yv <= 6; yv += 2) {
        const ty = yForVal(yv);
        this.r.drawLine(padL - 4, ty, padL + 4, ty, "#94a3b8", 1);
        this.r.drawLabel(`${yv}`, padL - 10, ty, {
          font: "9.5px Fira Code, monospace",
          color: yv < 0 ? "#fca5a5" : "#94a3b8",
          align: "right"
        });
      }
      this.r.drawLabel("\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 f (\xD7 10\xB9\u2074 Hz)", padL + plotW / 2, padT + plotH + 28, {
        font: "bold 11.5px Prompt, sans-serif",
        color: "#cbd5e1"
      });
      this.r.drawLabel(model.yAxisLabel, padL + 8, padT - 18, {
        font: "bold 11px Prompt, sans-serif",
        color: "#38bdf8",
        align: "left"
      });
      model.series.forEach((s, idx) => {
        const color = s.metal.lineColor;
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
          const yIntPy = yForVal(s.yIntercept);
          ctx.save();
          ctx.beginPath();
          ctx.arc(padL, yIntPy, 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.restore();
          this.r.drawLabel(
            `${s.metal.symbol}: ${s.yIntercept.toFixed(1)}`,
            padL + 8 + idx * (isCompact ? 0 : 0),
            Math.min(padT + plotH - 8, yIntPy + (idx === 1 ? 0 : idx === 0 ? -9 : 9)),
            {
              font: "bold 9px Fira Code, monospace",
              color,
              align: "left",
              bgColor: "rgba(9, 13, 22, 0.85)",
              padding: 2
            }
          );
        }
        const sx1 = xForF(s.solidSegment.x1);
        const sy1 = yForVal(s.solidSegment.y1);
        const sx2 = xForF(s.solidSegment.x2);
        const sy2 = yForVal(Math.min(model.yMax, s.solidSegment.y2));
        let endF = s.solidSegment.x2;
        let endY = s.solidSegment.y2;
        if (endY > model.yMax) {
          const slopePer14 = model.slope.valuePer10e14Hz;
          endF = s.f0_14 + model.yMax / slopePer14;
          endY = model.yMax;
        }
        this.r.drawLine(sx1, sy1, xForF(endF), yForVal(endY), color, 2.8);
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx1, zeroY, 4.8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
        const lblF = Math.min(endF - 1, s.f0_14 + 6.5);
        const lblYVal = (lblF - s.f0_14) * model.slope.valuePer10e14Hz;
        if (lblYVal > 0.4 && lblYVal < model.yMax - 0.5) {
          this.r.drawLabel(`${s.metal.symbol}`, xForF(lblF), yForVal(lblYVal) - 12, {
            font: "bold 10.5px Fira Code, monospace",
            color,
            bgColor: "rgba(15, 23, 42, 0.88)",
            borderColor: color,
            padding: 3
          });
        }
      });
      if (model.series.length > 0 && !isCompact) {
        const ref = model.series[0];
        const fA = Math.min(13, ref.f0_14 + 3);
        const fB = fA + 3.5;
        const yA = (fA - ref.f0_14) * model.slope.valuePer10e14Hz;
        const yB = (fB - ref.f0_14) * model.slope.valuePer10e14Hz;
        if (yB < model.yMax - 0.4) {
          const ax = xForF(fA);
          const ay = yForVal(yA);
          const bx = xForF(fB);
          const by = yForVal(yB);
          this.r.drawLine(ax, ay, bx, ay, "#fbbf24", 1.4, [3, 2]);
          this.r.drawLine(bx, ay, bx, by, "#fbbf24", 1.4, [3, 2]);
          this.r.drawLabel(`\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19 = ${model.slope.symbolText}`, bx + 8, (ay + by) / 2, {
            font: "bold 10px Prompt, sans-serif",
            color: "#fde047",
            align: "left",
            bgColor: "rgba(120, 53, 15, 0.88)",
            padding: 4
          });
        }
      }
      const probeX = xForF(model.probeFrequency14);
      this.r.drawLine(probeX, padT, probeX, padT + plotH, "rgba(250, 204, 21, 0.75)", 1.5, [4, 3]);
      this.r.drawLabel(`f = ${model.probeFrequency14.toFixed(1)}\xD710\xB9\u2074 Hz`, Math.max(padL + 56, Math.min(padL + plotW - 56, probeX)), padT + 12, {
        font: "bold 10px Fira Code, monospace",
        color: "#fef08a",
        bgColor: "rgba(15, 23, 42, 0.92)",
        borderColor: "#facc15",
        padding: 4
      });
      model.series.forEach((s) => {
        if (s.probe.emitsElectrons && s.probe.yValue <= model.yMax) {
          const py = yForVal(s.probe.yValue);
          ctx.save();
          ctx.beginPath();
          ctx.arc(probeX, py, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = s.metal.lineColor;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.8;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      });
      const slopeBadge = model.yAxisMode === "vs" ? `\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E02\u0E19\u0E32\u0E19\u0E17\u0E38\u0E01\u0E42\u0E25\u0E2B\u0E30 | \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19 = h/e = 4.14\xD710\u207B\xB9\u2075 V\xB7s` : `\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E02\u0E19\u0E32\u0E19\u0E17\u0E38\u0E01\u0E42\u0E25\u0E2B\u0E30 | \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19 = h = 6.626\xD710\u207B\xB3\u2074 J\xB7s`;
      this.r.drawLabel(isCompact ? `\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19 = ${model.slope.symbolText} (\u0E04\u0E07\u0E17\u0E35\u0E48)` : slopeBadge, padL + plotW, 18, {
        font: `bold ${isCompact ? 9.5 : 10.5}px Prompt, sans-serif`,
        color: "#a78bfa",
        align: "right",
        bgColor: "rgba(15, 23, 42, 0.88)",
        borderColor: "#4c1d95",
        padding: 5
      });
    }
  };

  // src/adapters/canvas/photocell-app-plotter.js
  var PhotocellAppPlotter = class {
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
      this.r.clear("#090D16");
      const sceneTop = 44;
      const floorY = Math.round(h * 0.68);
      const doorW = Math.min(w - padX * 2 - 40, isCompact ? 260 : 420);
      const doorH = floorY - sceneTop - 16;
      const doorX = Math.round((w - doorW) / 2);
      const doorY = sceneTop + 16;
      const statusText = !physics.emitsElectrons ? `\u26A0\uFE0F \u0E41\u0E2A\u0E07 \u03BB = ${state.wavelengthNm} nm \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 W \u0E02\u0E2D\u0E07 Cs (591 nm) \u2192 \u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E17\u0E33\u0E07\u0E32\u0E19!` : physics.beamBlocked ? `\u{1F6A8} \u0E25\u0E33\u0E41\u0E2A\u0E07\u0E16\u0E39\u0E01\u0E1A\u0E31\u0E07! \u0E01\u0E23\u0E30\u0E41\u0E2A I = 0 \xB5A \u2192 \u0E23\u0E35\u0E40\u0E25\u0E22\u0E4C\u0E2A\u0E31\u0E48\u0E07\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34` : `\u2705 \u0E25\u0E33\u0E41\u0E2A\u0E07\u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E1B\u0E01\u0E15\u0E34 (I = ${physics.photocurrentMicroA.toFixed(1)} \xB5A) \u2192 \u0E1B\u0E23\u0E30\u0E15\u0E39\u0E1B\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34`;
      this.r.drawLabel(isCompact ? statusText.slice(0, 44) : statusText, w / 2, 20, {
        font: `bold ${isCompact ? 9.5 : 11.5}px Prompt, sans-serif`,
        color: physics.relayTriggeredOpen ? "#fde68a" : "#86efac",
        bgColor: physics.relayTriggeredOpen ? "rgba(120, 53, 15, 0.88)" : "rgba(6, 78, 59, 0.85)",
        borderColor: physics.relayTriggeredOpen ? "#f59e0b" : "#10b981",
        padding: 5
      });
      this.r.drawLine(padX, floorY, w - padX, floorY, "#475569", 2);
      this.r.drawRoundedRect(doorX - 10, doorY - 12, doorW + 20, doorH + 12, 8, {
        fill: "#1e293b",
        stroke: "#475569",
        lineWidth: 2
      });
      ctx.fillStyle = "#020617";
      ctx.fillRect(doorX, doorY, doorW, doorH);
      this.r.drawLabel("\u0E17\u0E32\u0E07\u0E40\u0E02\u0E49\u0E32\u0E2D\u0E32\u0E04\u0E32\u0E23\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34", doorX + doorW / 2, doorY + 26, {
        font: "11px Prompt, sans-serif",
        color: "#475569"
      });
      const halfW = doorW / 2;
      const slideOffset = state.doorOpenRatio * (halfW * 0.86);
      this.r.drawRoundedRect(doorX - slideOffset, doorY + 2, halfW - 1, doorH - 2, 3, {
        fill: "rgba(56, 189, 248, 0.22)",
        stroke: "#38bdf8",
        lineWidth: 1.5
      });
      this.r.drawRoundedRect(doorX + halfW + 1 + slideOffset, doorY + 2, halfW - 1, doorH - 2, 3, {
        fill: "rgba(56, 189, 248, 0.22)",
        stroke: "#38bdf8",
        lineWidth: 1.5
      });
      const sensorY = floorY - 36;
      const emitX = doorX - 20;
      const recvX = doorX + doorW + 20;
      this.r.drawRoundedRect(emitX - 10, sensorY - 14, 20, 28, 5, {
        fill: "#1e293b",
        stroke: physics.colorInfo.hex,
        lineWidth: 2
      });
      this.r.drawLabel("\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E41\u0E2A\u0E07", emitX, sensorY - 26, {
        font: "9px Prompt, sans-serif",
        color: "#cbd5e1"
      });
      this.r.drawRoundedRect(recvX - 10, sensorY - 14, 20, 28, 5, {
        fill: "#1e293b",
        stroke: physics.photocurrentMicroA > 0 ? "#4ade80" : "#f43f5e",
        lineWidth: 2
      });
      this.r.drawLabel("Photocell (Cs)", recvX, sensorY - 26, {
        font: "9px Prompt, sans-serif",
        color: physics.photocurrentMicroA > 0 ? "#4ade80" : "#fda4af"
      });
      const personX = doorX + state.personProgress * doorW;
      const showPerson = state.manualBlock || state.isWalking;
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
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      const beamLen = Math.max(1, beamEndX - (emitX + 10));
      const numDots = Math.max(2, Math.floor(beamLen / 48));
      for (let i = 0; i < numDots; i++) {
        const frac = (i / numDots + time * 0.75) % 1;
        const dx = emitX + 10 + frac * beamLen;
        ctx.beginPath();
        ctx.arc(dx, sensorY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      if (showPerson) {
        ctx.save();
        const px = Math.max(padX + 12, Math.min(w - padX - 12, personX));
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(px, floorY - 76, 11, 0, Math.PI * 2);
        ctx.fill();
        this.r.drawRoundedRect(px - 12, floorY - 62, 24, 34, 8, {
          fill: "#fbbf24",
          stroke: "#fef08a",
          lineWidth: 1.5
        });
        const stride = state.isWalking ? Math.sin(time * 10) * 6 : 0;
        this.r.drawLine(px - 5, floorY - 28, px - 6 - stride, floorY - 2, "#f59e0b", 5);
        this.r.drawLine(px + 5, floorY - 28, px + 6 + stride, floorY - 2, "#f59e0b", 5);
        ctx.restore();
      }
      const stripY = floorY + 20;
      const stripH = Math.max(58, h - stripY - 16);
      const gap = isCompact ? 8 : 14;
      const cardW = (w - padX * 2 - gap * 2) / 3;
      const cards = [
        {
          title: "1. \u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01",
          value: `${physics.photocurrentMicroA.toFixed(1)} \xB5A`,
          color: physics.photocurrentMicroA > 0 ? "#4ade80" : "#fb7185",
          border: physics.photocurrentMicroA > 0 ? "#10b981" : "#f43f5e"
        },
        {
          title: "2. \u0E2A\u0E16\u0E32\u0E19\u0E30\u0E23\u0E35\u0E40\u0E25\u0E22\u0E4C\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21",
          value: physics.relayTriggeredOpen ? "\u0E2A\u0E31\u0E48\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E27\u0E07\u0E08\u0E23\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C" : "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E1B\u0E01\u0E15\u0E34",
          color: physics.relayTriggeredOpen ? "#fbbf24" : "#38bdf8",
          border: physics.relayTriggeredOpen ? "#f59e0b" : "#0284c7"
        },
        {
          title: "3. \u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34",
          value: state.doorOpenRatio > 0.25 ? `\u0E40\u0E1B\u0E34\u0E14 (${Math.round(state.doorOpenRatio * 100)}%)` : "\u0E1B\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34",
          color: state.doorOpenRatio > 0.25 ? "#34d399" : "#cbd5e1",
          border: state.doorOpenRatio > 0.25 ? "#10b981" : "#475569"
        }
      ];
      cards.forEach((c, idx) => {
        const cx = padX + idx * (cardW + gap);
        this.r.drawRoundedRect(cx, stripY, cardW, stripH, 10, {
          fill: "#0f172a",
          stroke: c.border,
          lineWidth: 1.5
        });
        this.r.drawLabel(c.title, cx + cardW / 2, stripY + stripH * 0.34, {
          font: `${isCompact ? 9 : 10.5}px Prompt, sans-serif`,
          color: "#94a3b8"
        });
        this.r.drawLabel(c.value, cx + cardW / 2, stripY + stripH * 0.7, {
          font: `bold ${isCompact ? 10 : 12}px Fira Code, Prompt, sans-serif`,
          color: c.color
        });
      });
    }
  };

  // src/physics/photoelectric-solver.js
  function electronVoltsToJoules(ev) {
    return Number(ev) * EV_TO_JOULES;
  }
  function joulesToElectronVolts(joules) {
    return Number(joules) * JOULES_TO_EV;
  }
  function frequencyFromWavelength(wavelengthMeters) {
    const lambda = Number(wavelengthMeters);
    if (!Number.isFinite(lambda) || lambda <= 0) {
      throw new Error("Wavelength must be a positive finite number");
    }
    return SPEED_OF_LIGHT / lambda;
  }
  function wavelengthFromFrequency(frequencyHz) {
    const f = Number(frequencyHz);
    if (!Number.isFinite(f) || f <= 0) {
      throw new Error("Frequency must be a positive finite number");
    }
    return SPEED_OF_LIGHT / f;
  }
  function calculatePhotonEnergyFromFrequency(frequencyHz) {
    const f = Number(frequencyHz);
    if (!Number.isFinite(f) || f <= 0) {
      throw new Error("Photon frequency must be a positive finite number");
    }
    const joules = PLANCK_CONSTANT * f;
    return {
      joules,
      electronVolts: joulesToElectronVolts(joules),
      frequencyHz: f
    };
  }
  function calculatePhotonEnergyFromWavelength(wavelengthMeters) {
    const lambda = Number(wavelengthMeters);
    if (!Number.isFinite(lambda) || lambda <= 0) {
      throw new Error("Photon wavelength must be a positive finite number");
    }
    const frequencyHz = SPEED_OF_LIGHT / lambda;
    const joules = HC_JOULE_METERS / lambda;
    return {
      joules,
      electronVolts: joulesToElectronVolts(joules),
      frequencyHz,
      wavelengthMeters: lambda,
      wavelengthNm: lambda * 1e9
    };
  }
  function calculateThresholdFrequency(workFunctionEV) {
    const wEV = Number(workFunctionEV);
    if (!Number.isFinite(wEV) || wEV <= 0) {
      throw new Error("Work function must be a positive finite number");
    }
    const wJoules = electronVoltsToJoules(wEV);
    return wJoules / PLANCK_CONSTANT;
  }
  function calculateThresholdWavelength(workFunctionEV) {
    const wEV = Number(workFunctionEV);
    if (!Number.isFinite(wEV) || wEV <= 0) {
      throw new Error("Work function must be a positive finite number");
    }
    const wJoules = electronVoltsToJoules(wEV);
    const meters = HC_JOULE_METERS / wJoules;
    return {
      meters,
      nm: meters * 1e9
    };
  }
  function calculateWorkFunctionFromThresholdFrequency(thresholdFrequencyHz) {
    const f0 = Number(thresholdFrequencyHz);
    if (!Number.isFinite(f0) || f0 <= 0) {
      throw new Error("Threshold frequency must be positive");
    }
    const joules = PLANCK_CONSTANT * f0;
    return {
      joules,
      electronVolts: joulesToElectronVolts(joules)
    };
  }
  function calculateStoppingPotentialFromJoules(ekMaxJoules) {
    const ek = Math.max(0, Number(ekMaxJoules) || 0);
    return ek / ELEMENTARY_CHARGE;
  }
  function calculateMaxElectronSpeed(ekMaxJoules) {
    const ek = Math.max(0, Number(ekMaxJoules) || 0);
    if (ek <= 0) return 0;
    return Math.sqrt(2 * ek / ELECTRON_MASS);
  }
  function calculateWavelengthForStoppingPotential(workFunctionEV, stoppingPotentialV) {
    const wEV = Number(workFunctionEV);
    const vs = Number(stoppingPotentialV);
    if (!Number.isFinite(wEV) || wEV <= 0 || !Number.isFinite(vs) || vs < 0) {
      throw new Error("Work function must be positive and stopping potential non-negative");
    }
    const photonEnergyEV = wEV + vs;
    const photonEnergyJ = electronVoltsToJoules(photonEnergyEV);
    const meters = HC_JOULE_METERS / photonEnergyJ;
    const frequencyHz = photonEnergyJ / PLANCK_CONSTANT;
    return {
      meters,
      nm: meters * 1e9,
      frequencyHz,
      photonEnergyEV
    };
  }
  function calculatePhotoelectricEffect({
    frequencyHz,
    wavelengthMeters,
    wavelengthNm,
    workFunctionEV
  }) {
    const wEV = Number(workFunctionEV);
    if (!Number.isFinite(wEV) || wEV <= 0) {
      throw new Error("Valid positive workFunctionEV is required");
    }
    let fHz;
    let lambdaM;
    if (frequencyHz !== void 0 && frequencyHz !== null) {
      fHz = Number(frequencyHz);
      lambdaM = wavelengthFromFrequency(fHz);
    } else if (wavelengthMeters !== void 0 && wavelengthMeters !== null) {
      lambdaM = Number(wavelengthMeters);
      fHz = frequencyFromWavelength(lambdaM);
    } else if (wavelengthNm !== void 0 && wavelengthNm !== null) {
      lambdaM = Number(wavelengthNm) * 1e-9;
      fHz = frequencyFromWavelength(lambdaM);
    } else {
      throw new Error("Either frequencyHz, wavelengthMeters, or wavelengthNm must be provided");
    }
    const photonEnergyJ = PLANCK_CONSTANT * fHz;
    const photonEnergyEV = joulesToElectronVolts(photonEnergyJ);
    const workFunctionJ = electronVoltsToJoules(wEV);
    const thresholdFrequencyHz = workFunctionJ / PLANCK_CONSTANT;
    const thresholdWavelength = calculateThresholdWavelength(wEV);
    const emitsElectrons = fHz >= thresholdFrequencyHz * (1 - 1e-12);
    const rawEkJ = photonEnergyJ - workFunctionJ;
    const ekMaxJ = emitsElectrons && rawEkJ > 0 ? rawEkJ : 0;
    const ekMaxEV = joulesToElectronVolts(ekMaxJ);
    const stoppingPotentialV = calculateStoppingPotentialFromJoules(ekMaxJ);
    const vMaxMs = calculateMaxElectronSpeed(ekMaxJ);
    return {
      frequencyHz: fHz,
      frequency14: fHz / 1e14,
      wavelengthMeters: lambdaM,
      wavelengthNm: lambdaM * 1e9,
      photonEnergyJ,
      photonEnergyEV,
      workFunctionJ,
      workFunctionEV: wEV,
      thresholdFrequencyHz,
      thresholdFrequency14: thresholdFrequencyHz / 1e14,
      thresholdWavelengthMeters: thresholdWavelength.meters,
      thresholdWavelengthNm: thresholdWavelength.nm,
      emitsElectrons,
      ekMaxJ,
      ekMaxEV,
      stoppingPotentialV,
      vMaxMs
    };
  }
  function calculateSpectralRegion(wavelengthNm) {
    const nm = Number(wavelengthNm);
    if (nm < 380) return "ultraviolet";
    if (nm <= 750) return "visible";
    return "infrared";
  }
  function wavelengthToRGB(wavelengthNm) {
    const nm = Number(wavelengthNm);
    if (nm < 380) {
      return {
        r: 168,
        g: 85,
        b: 247,
        hex: "#a855f7",
        labelTh: "\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 (UV)",
        region: "ultraviolet",
        isUV: true,
        isIR: false
      };
    }
    if (nm > 750) {
      return {
        r: 185,
        g: 28,
        b: 28,
        hex: "#b91c1c",
        labelTh: "\u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 (IR)",
        region: "infrared",
        isUV: false,
        isIR: true
      };
    }
    let r = 0;
    let g = 0;
    let b = 0;
    let labelTh = "\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E15\u0E32\u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19";
    if (nm >= 380 && nm < 440) {
      r = -(nm - 440) / (440 - 380);
      g = 0;
      b = 1;
      labelTh = nm < 420 ? "\u0E2A\u0E35\u0E21\u0E48\u0E27\u0E07" : "\u0E2A\u0E35\u0E04\u0E23\u0E32\u0E21-\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19";
    } else if (nm >= 440 && nm < 490) {
      r = 0;
      g = (nm - 440) / (490 - 440);
      b = 1;
      labelTh = nm < 470 ? "\u0E2A\u0E35\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19" : "\u0E2A\u0E35\u0E1F\u0E49\u0E32-\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19";
    } else if (nm >= 490 && nm < 510) {
      r = 0;
      g = 1;
      b = -(nm - 510) / (510 - 490);
      labelTh = "\u0E2A\u0E35\u0E40\u0E02\u0E35\u0E22\u0E27\u0E41\u0E01\u0E21\u0E1F\u0E49\u0E32";
    } else if (nm >= 510 && nm < 580) {
      r = (nm - 510) / (580 - 510);
      g = 1;
      b = 0;
      labelTh = nm < 560 ? "\u0E2A\u0E35\u0E40\u0E02\u0E35\u0E22\u0E27" : "\u0E2A\u0E35\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07\u0E41\u0E01\u0E21\u0E40\u0E02\u0E35\u0E22\u0E27";
    } else if (nm >= 580 && nm < 645) {
      r = 1;
      g = -(nm - 645) / (645 - 580);
      b = 0;
      labelTh = nm < 605 ? "\u0E2A\u0E35\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07-\u0E2A\u0E49\u0E21" : "\u0E2A\u0E35\u0E2A\u0E49\u0E21-\u0E41\u0E14\u0E07";
    } else {
      r = 1;
      g = 0;
      b = 0;
      labelTh = "\u0E2A\u0E35\u0E41\u0E14\u0E07";
    }
    let factor = 1;
    if (nm >= 380 && nm < 420) {
      factor = 0.45 + 0.55 * ((nm - 380) / (420 - 380));
    } else if (nm > 700 && nm <= 750) {
      factor = 0.45 + 0.55 * ((750 - nm) / (750 - 700));
    }
    const gamma = 0.8;
    const toChannel = (c) => c <= 0 ? 0 : Math.min(255, Math.round(255 * Math.pow(c * factor, gamma)));
    const R = toChannel(r);
    const G = toChannel(g);
    const B = toChannel(b);
    const toHex = (v) => v.toString(16).padStart(2, "0");
    return {
      r: R,
      g: G,
      b: B,
      hex: `#${toHex(R)}${toHex(G)}${toHex(B)}`,
      labelTh,
      region: "visible",
      isUV: false,
      isIR: false
    };
  }

  // src/physics/iv-curve-solver.js
  var MAX_SATURATION_CURRENT_MICRO_A = 100;
  function calculateSaturationCurrent(intensityPercent, emitsElectrons) {
    if (!emitsElectrons) return 0;
    const clamped = Math.max(0, Math.min(100, Number(intensityPercent) || 0));
    return clamped / 100 * MAX_SATURATION_CURRENT_MICRO_A;
  }
  function calculatePhotocurrent(voltageV, stoppingPotentialV, saturationCurrentMicroA, emitsElectrons) {
    if (!emitsElectrons || saturationCurrentMicroA <= 0) return 0;
    const v = Number(voltageV);
    const vs = Math.max(0, Number(stoppingPotentialV) || 0);
    if (vs <= 1e-9) {
      if (v <= 0) return 0;
      return saturationCurrentMicroA * (1 - Math.exp(-2.6 * v));
    }
    if (v <= -vs) {
      return 0;
    }
    const u = (v + vs) / (vs + 0.85);
    const current = saturationCurrentMicroA * (1 - Math.exp(-3.2 * Math.pow(u, 1.35)));
    return Math.max(0, Math.min(saturationCurrentMicroA, current));
  }
  function sampleIVCurve({
    stoppingPotentialV,
    saturationCurrentMicroA,
    emitsElectrons,
    vMin = -5,
    vMax = 5,
    steps = 160
  }) {
    const points = [];
    const dt = (vMax - vMin) / steps;
    const cutoffV = -Math.max(0, stoppingPotentialV);
    for (let i = 0; i <= steps; i++) {
      const v = vMin + i * dt;
      const current = calculatePhotocurrent(v, stoppingPotentialV, saturationCurrentMicroA, emitsElectrons);
      points.push({ v, current });
    }
    if (emitsElectrons && cutoffV >= vMin && cutoffV <= vMax) {
      points.push({ v: cutoffV, current: 0 });
      points.sort((a, b) => a.v - b.v);
    }
    return points;
  }

  // src/physics/photoelectric-model.js
  var METALS = Object.freeze(
    METAL_WORK_FUNCTIONS.map((m) => {
      const thresholdFrequencyHz = calculateThresholdFrequency(m.workFunctionEV);
      const thresholdWavelength = calculateThresholdWavelength(m.workFunctionEV);
      return Object.freeze({
        ...m,
        workFunctionJoules: electronVoltsToJoules(m.workFunctionEV),
        thresholdFrequencyHz,
        thresholdFrequency14: thresholdFrequencyHz / 1e14,
        thresholdWavelengthMeters: thresholdWavelength.meters,
        thresholdWavelengthNm: thresholdWavelength.nm,
        thresholdRegion: calculateSpectralRegion(thresholdWavelength.nm)
      });
    })
  );
  function getMetalById(metalId) {
    const key = String(metalId || "na").toLowerCase();
    return METALS.find((m) => m.id === key) || METALS.find((m) => m.id === "na");
  }
  function createPhotoelectricTubeState({
    metalId = "na",
    wavelengthNm = 350,
    intensityPercent = 70,
    voltageV = 1
  } = {}) {
    const metal = getMetalById(metalId);
    const clampedLambdaNm = Math.max(150, Math.min(750, Number(wavelengthNm) || 350));
    const clampedIntensity = Math.max(0, Math.min(100, Number(intensityPercent) || 0));
    const clampedVoltage = Math.max(-5, Math.min(5, Number(voltageV) || 0));
    const solved = calculatePhotoelectricEffect({
      wavelengthNm: clampedLambdaNm,
      workFunctionEV: metal.workFunctionEV
    });
    const activeEmission = solved.emitsElectrons && clampedIntensity > 0;
    const saturationCurrentMicroA = calculateSaturationCurrent(clampedIntensity, activeEmission);
    const photocurrentMicroA = calculatePhotocurrent(
      clampedVoltage,
      solved.stoppingPotentialV,
      saturationCurrentMicroA,
      activeEmission
    );
    const colorInfo = wavelengthToRGB(clampedLambdaNm);
    let electronMotionMode = "none";
    if (!solved.emitsElectrons) {
      electronMotionMode = "below-threshold";
    } else if (clampedIntensity <= 0) {
      electronMotionMode = "no-light";
    } else if (clampedVoltage <= -solved.stoppingPotentialV && solved.stoppingPotentialV > 0) {
      electronMotionMode = "stopped";
    } else if (clampedVoltage < 0) {
      electronMotionMode = "retarding";
    } else if (clampedVoltage > 0) {
      electronMotionMode = "accelerating";
    } else {
      electronMotionMode = "coasting";
    }
    return {
      metal,
      wavelengthNm: clampedLambdaNm,
      intensityPercent: clampedIntensity,
      voltageV: clampedVoltage,
      ...solved,
      activeEmission,
      saturationCurrentMicroA,
      photocurrentMicroA,
      colorInfo,
      electronMotionMode
    };
  }

  // src/application/photoelectric-tube-simulator.js
  var PhotoelectricTubeSimulator = class {
    /**
     * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
     */
    constructor({ plotter = null, onUpdate = null } = {}) {
      this.plotter = plotter;
      this.onUpdate = onUpdate;
      this.state = {
        metalId: "na",
        wavelengthNm: 350,
        intensityPercent: 70,
        voltageV: 1,
        isPlaying: true
      };
      this.physics = createPhotoelectricTubeState(this.state);
      this.photons = [];
      this.electrons = [];
      this.time = 0;
      this._photonSpawnAcc = 0;
      this._electronSpawnAcc = 0;
      this._rafId = null;
      this._lastTs = null;
      this._seedInitialParticles();
      this.render();
      this._emitUpdate();
    }
    setPlotter(plotter) {
      this.plotter = plotter;
      this.render();
    }
    setOnUpdate(callback) {
      this.onUpdate = callback;
      this._emitUpdate();
    }
    setMetal(metalId) {
      this.state.metalId = String(metalId || "na");
      this._recomputePhysics();
    }
    setWavelength(wavelengthNm) {
      this.state.wavelengthNm = Math.max(150, Math.min(750, Number(wavelengthNm) || 350));
      this._recomputePhysics();
    }
    setIntensity(intensityPercent) {
      this.state.intensityPercent = Math.max(0, Math.min(100, Number(intensityPercent) || 0));
      this._recomputePhysics();
    }
    setVoltage(voltageV) {
      this.state.voltageV = Math.max(-5, Math.min(5, Math.round((Number(voltageV) || 0) * 100) / 100));
      this._recomputePhysics();
    }
    /**
     * Jump applied potential difference directly to the exact stopping potential (-V_s)
     */
    setToStoppingPotential() {
      if (!this.physics.emitsElectrons) {
        this.setVoltage(0);
        return 0;
      }
      const targetV = -Math.min(5, Math.round(this.physics.stoppingPotentialV * 100) / 100);
      this.setVoltage(targetV);
      return targetV;
    }
    togglePlay() {
      this.state.isPlaying = !this.state.isPlaying;
      if (this.state.isPlaying) {
        this.startAnimationLoop();
      } else {
        this.stopAnimationLoop();
      }
      this._emitUpdate();
      return this.state.isPlaying;
    }
    _recomputePhysics() {
      this.physics = createPhotoelectricTubeState(this.state);
      if (!this.physics.activeEmission) {
        this.electrons = [];
      }
      this.render();
      this._emitUpdate();
    }
    _seedInitialParticles() {
      this.photons = [];
      this.electrons = [];
      for (let i = 0; i < 6; i++) {
        this.photons.push({
          progress: i / 6,
          lane: i % 3 - 1,
          phase: i * 1.1
        });
      }
      if (this.physics.activeEmission) {
        for (let i = 0; i < 5; i++) {
          this.electrons.push(this._createElectron(i / 5));
        }
      }
    }
    _createElectron(initialX = 0) {
      const keFraction = 0.35 + (this.electrons.length * 0.27 + this.time * 0.73 % 1) % 0.65;
      const ekEV = this.physics.ekMaxEV * Math.min(1, keFraction);
      const v0 = 0.32 + Math.sqrt(Math.max(0.02, ekEV)) * 0.28;
      const laneY = ((this.electrons.length * 37 + Math.floor(this.time * 100)) % 100 / 100 - 0.5) * 0.68;
      return {
        x: initialX,
        // Normalized 0 (cathode) -> 1 (anode)
        yOffset: laneY,
        vx: v0,
        ekEV,
        turningBack: false
      };
    }
    /**
     * Advance particle simulation by dt seconds
     * @param {number} dt
     */
    step(dt) {
      const safeDt = Math.min(0.05, Math.max(1e-3, dt));
      this.time += safeDt;
      const photonRate = this.state.intensityPercent / 100 * 14;
      if (photonRate > 0) {
        this._photonSpawnAcc += safeDt * photonRate;
        while (this._photonSpawnAcc >= 1) {
          this._photonSpawnAcc -= 1;
          if (this.photons.length < 26) {
            this.photons.push({
              progress: 0,
              lane: (Math.floor(this.time * 1e3 + this.photons.length * 17) % 5 - 2) * 0.36,
              phase: this.time * 6
            });
          }
        }
      }
      for (let i = this.photons.length - 1; i >= 0; i--) {
        const p = this.photons[i];
        p.progress += safeDt * 1.15;
        if (p.progress >= 1) {
          this.photons.splice(i, 1);
        }
      }
      if (this.physics.activeEmission) {
        const emitRate = this.state.intensityPercent / 100 * 11;
        this._electronSpawnAcc += safeDt * emitRate;
        while (this._electronSpawnAcc >= 1) {
          this._electronSpawnAcc -= 1;
          if (this.electrons.length < 28) {
            this.electrons.push(this._createElectron(0.01));
          }
        }
      }
      const voltage = this.state.voltageV;
      const vs = this.physics.stoppingPotentialV;
      for (let i = this.electrons.length - 1; i >= 0; i--) {
        const e = this.electrons[i];
        if (voltage < 0 && e.ekEV <= Math.abs(voltage)) {
          const turnX = Math.max(0.06, Math.min(0.92, e.ekEV / Math.max(0.05, Math.abs(voltage))));
          const decel = e.vx * e.vx / Math.max(0.08, 2 * turnX);
          const accel = -Math.max(0.65, decel * 1.15);
          e.vx += accel * safeDt;
          e.x += e.vx * safeDt;
          if (e.vx < 0) e.turningBack = true;
          if (e.x > turnX && !e.turningBack) {
            e.x = turnX;
            e.vx = -Math.abs(e.vx) * 0.6;
            e.turningBack = true;
          }
        } else {
          const accel = voltage >= 0 ? 0.35 * voltage : -0.25 * (Math.abs(voltage) / Math.max(0.2, vs + 0.1));
          e.vx = Math.max(0.14, e.vx + accel * safeDt);
          e.x += e.vx * safeDt;
        }
        if (e.x >= 1.02 || e.x < -0.02) {
          this.electrons.splice(i, 1);
        }
      }
    }
    getSnapshot() {
      return {
        state: { ...this.state },
        physics: this.physics,
        photons: this.photons,
        electrons: this.electrons,
        time: this.time
      };
    }
    render() {
      if (this.plotter && typeof this.plotter.render === "function") {
        this.plotter.render(this.getSnapshot());
      }
    }
    resize() {
      if (this.plotter && typeof this.plotter.resize === "function") {
        this.plotter.resize();
      }
      this.render();
    }
    startAnimationLoop() {
      if (this._rafId !== null || !this.state.isPlaying) return;
      if (typeof requestAnimationFrame !== "function") return;
      this._lastTs = null;
      const tick = (ts) => {
        if (!this.state.isPlaying) {
          this._rafId = null;
          return;
        }
        const dt = this._lastTs === null ? 0.016 : (ts - this._lastTs) / 1e3;
        this._lastTs = ts;
        this.step(dt);
        this.render();
        this._rafId = requestAnimationFrame(tick);
      };
      this._rafId = requestAnimationFrame(tick);
    }
    stopAnimationLoop() {
      if (this._rafId !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(this._rafId);
      }
      this._rafId = null;
      this._lastTs = null;
    }
    _emitUpdate() {
      if (typeof this.onUpdate === "function") {
        this.onUpdate(this.getSnapshot());
      }
    }
    destroy() {
      this.stopAnimationLoop();
      if (this.plotter && typeof this.plotter.destroy === "function") {
        this.plotter.destroy();
      }
    }
  };

  // src/physics/iv-curve-model.js
  function createIVCurveModel({
    metalId = "na",
    wavelengthNm = 350,
    intensityPercent = 70,
    operatingVoltageV = 1,
    comparisonMode = "intensity"
  } = {}) {
    const metal = getMetalById(metalId);
    const lambdaNm = Math.max(150, Math.min(750, Number(wavelengthNm) || 350));
    const intensity = Math.max(10, Math.min(100, Number(intensityPercent) || 70));
    const voltageV = Math.max(-5, Math.min(5, Number(operatingVoltageV) || 0));
    const mode = comparisonMode === "frequency" ? "frequency" : "intensity";
    const primarySolved = calculatePhotoelectricEffect({
      wavelengthNm: lambdaNm,
      workFunctionEV: metal.workFunctionEV
    });
    const primaryISat = calculateSaturationCurrent(intensity, primarySolved.emitsElectrons);
    const operatingCurrentMicroA = calculatePhotocurrent(
      voltageV,
      primarySolved.stoppingPotentialV,
      primaryISat,
      primarySolved.emitsElectrons
    );
    const curves = [];
    if (mode === "intensity") {
      const lowInt = Math.max(15, Math.round(intensity * 0.45));
      const midInt = intensity;
      const highInt = Math.min(100, Math.max(intensity + 25, 95));
      const presets = [
        { label: `\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E15\u0E48\u0E33 (${lowInt}%)`, intensityPct: lowInt, color: "#38bdf8", isPrimary: false },
        { label: `\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 (${midInt}%)`, intensityPct: midInt, color: "#22d3ee", isPrimary: true },
        { label: `\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E2A\u0E39\u0E07 (${highInt}%)`, intensityPct: highInt, color: "#f59e0b", isPrimary: false }
      ];
      const usedInt = /* @__PURE__ */ new Set();
      for (const p of presets) {
        if (usedInt.has(p.intensityPct) && !p.isPrimary) continue;
        usedInt.add(p.intensityPct);
        const iSat = calculateSaturationCurrent(p.intensityPct, primarySolved.emitsElectrons);
        curves.push({
          id: `int-${p.intensityPct}`,
          label: p.label,
          color: p.color,
          isPrimary: p.isPrimary,
          emitsElectrons: primarySolved.emitsElectrons,
          stoppingPotentialV: primarySolved.stoppingPotentialV,
          saturationCurrentMicroA: iSat,
          frequency14: primarySolved.frequency14,
          wavelengthNm: lambdaNm,
          points: sampleIVCurve({
            stoppingPotentialV: primarySolved.stoppingPotentialV,
            saturationCurrentMicroA: iSat,
            emitsElectrons: primarySolved.emitsElectrons
          })
        });
      }
    } else {
      const lambdaLong = Math.min(700, Math.round(lambdaNm + 85));
      const lambdaMid = lambdaNm;
      const lambdaShort = Math.max(180, Math.round(lambdaNm - 75));
      const freqPresets = [
        { tag: "f\u2081 (\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32)", lambda: lambdaLong, color: "#f59e0b", isPrimary: false },
        { tag: "f\u2082 (\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)", lambda: lambdaMid, color: "#22d3ee", isPrimary: true },
        { tag: "f\u2083 (\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32)", lambda: lambdaShort, color: "#a855f7", isPrimary: false }
      ];
      for (const fp of freqPresets) {
        const solved = calculatePhotoelectricEffect({
          wavelengthNm: fp.lambda,
          workFunctionEV: metal.workFunctionEV
        });
        const iSat = calculateSaturationCurrent(intensity, solved.emitsElectrons);
        curves.push({
          id: `freq-${fp.lambda}`,
          label: `${fp.tag}: \u03BB=${fp.lambda} nm (Vs=${solved.stoppingPotentialV.toFixed(2)} V)`,
          color: fp.color,
          isPrimary: fp.isPrimary,
          emitsElectrons: solved.emitsElectrons,
          stoppingPotentialV: solved.stoppingPotentialV,
          saturationCurrentMicroA: iSat,
          frequency14: solved.frequency14,
          wavelengthNm: fp.lambda,
          points: sampleIVCurve({
            stoppingPotentialV: solved.stoppingPotentialV,
            saturationCurrentMicroA: iSat,
            emitsElectrons: solved.emitsElectrons
          })
        });
      }
    }
    return {
      metal,
      wavelengthNm: lambdaNm,
      intensityPercent: intensity,
      comparisonMode: mode,
      vMin: -5,
      vMax: 5,
      iMax: 110,
      primary: primarySolved,
      primarySaturationCurrentMicroA: primaryISat,
      operatingPoint: {
        voltageV,
        currentMicroA: operatingCurrentMicroA
      },
      curves
    };
  }

  // src/application/iv-curve-simulator.js
  var IVCurveSimulator = class {
    /**
     * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
     */
    constructor({ plotter = null, onUpdate = null } = {}) {
      this.plotter = plotter;
      this.onUpdate = onUpdate;
      this.state = {
        metalId: "na",
        wavelengthNm: 350,
        intensityPercent: 70,
        operatingVoltageV: 1,
        comparisonMode: "intensity",
        // 'intensity' | 'frequency'
        showOperatingPoint: true
      };
      this.model = createIVCurveModel(this.state);
      this.render();
      this._emitUpdate();
    }
    setPlotter(plotter) {
      this.plotter = plotter;
      this.render();
    }
    setOnUpdate(callback) {
      this.onUpdate = callback;
      this._emitUpdate();
    }
    setMetal(metalId) {
      this.state.metalId = String(metalId || "na");
      this._recompute();
    }
    setWavelength(wavelengthNm) {
      this.state.wavelengthNm = Math.max(150, Math.min(750, Number(wavelengthNm) || 350));
      this._recompute();
    }
    setIntensity(intensityPercent) {
      this.state.intensityPercent = Math.max(10, Math.min(100, Number(intensityPercent) || 70));
      this._recompute();
    }
    setOperatingVoltage(voltageV) {
      this.state.operatingVoltageV = Math.max(-5, Math.min(5, Number(voltageV) || 0));
      this._recompute();
    }
    setComparisonMode(mode) {
      this.state.comparisonMode = mode === "frequency" ? "frequency" : "intensity";
      this._recompute();
    }
    setShowOperatingPoint(show) {
      this.state.showOperatingPoint = Boolean(show);
      this.render();
      this._emitUpdate();
    }
    _recompute() {
      this.model = createIVCurveModel(this.state);
      this.render();
      this._emitUpdate();
    }
    getSnapshot() {
      return {
        state: { ...this.state },
        model: this.model
      };
    }
    render() {
      if (this.plotter && typeof this.plotter.render === "function") {
        this.plotter.render(this.getSnapshot());
      }
    }
    resize() {
      if (this.plotter && typeof this.plotter.resize === "function") {
        this.plotter.resize();
      }
      this.render();
    }
    _emitUpdate() {
      if (typeof this.onUpdate === "function") {
        this.onUpdate(this.getSnapshot());
      }
    }
    destroy() {
      if (this.plotter && typeof this.plotter.destroy === "function") {
        this.plotter.destroy();
      }
    }
  };

  // src/physics/ek-frequency-solver.js
  function evaluateEkVsFrequency(frequencyHz, workFunctionEV) {
    const f = Number(frequencyHz);
    const wEV = Number(workFunctionEV);
    const f0 = calculateThresholdFrequency(wEV);
    const photonEV = PLANCK_CONSTANT_EV_S * f;
    const extrapolatedEkEV = photonEV - wEV;
    const emitsElectrons = f >= f0 * (1 - 1e-12);
    const ekMaxEV = emitsElectrons && extrapolatedEkEV > 0 ? extrapolatedEkEV : 0;
    const ekMaxJ = electronVoltsToJoules(ekMaxEV);
    const stoppingPotentialV = ekMaxEV;
    const extrapolatedVsV = extrapolatedEkEV;
    return {
      frequencyHz: f,
      frequency14: f / 1e14,
      thresholdFrequencyHz: f0,
      thresholdFrequency14: f0 / 1e14,
      emitsElectrons,
      ekMaxEV,
      ekMaxJ,
      stoppingPotentialV,
      extrapolatedEkEV,
      extrapolatedVsV
    };
  }
  function calculateGraphSlope(yAxisMode = "ek") {
    if (yAxisMode === "vs") {
      const hOverE = PLANCK_CONSTANT / ELEMENTARY_CHARGE;
      return {
        valueSI: hOverE,
        valuePer10e14Hz: hOverE * 1e14,
        // ~0.4136 V per 10^14 Hz
        unitSI: "V\xB7s",
        displayUnit: "V / (10\xB9\u2074 Hz)",
        symbolText: "h/e"
      };
    }
    return {
      valueSI: PLANCK_CONSTANT,
      // 6.626e-34 J·s
      valuePer10e14Hz: PLANCK_CONSTANT_EV_S * 1e14,
      // ~0.4136 eV per 10^14 Hz
      unitSI: "J\xB7s",
      displayUnit: "eV / (10\xB9\u2074 Hz)",
      symbolText: "h"
    };
  }
  function calculatePlanckFromTwoPoints(f1Hz, ek1Joules, f2Hz, ek2Joules) {
    const df = Number(f2Hz) - Number(f1Hz);
    if (Math.abs(df) < 1e-12) {
      throw new Error("Frequencies f1 and f2 must be distinct to determine slope");
    }
    return (Number(ek2Joules) - Number(ek1Joules)) / df;
  }
  function calculateWorkFunctionFromGraphPoint(frequencyHz, ekMaxEV) {
    const photonJ = PLANCK_CONSTANT * Number(frequencyHz);
    const ekJ = electronVoltsToJoules(ekMaxEV);
    const wJ = photonJ - ekJ;
    if (wJ <= 0) {
      throw new Error("Calculated work function must be positive");
    }
    return {
      joules: wJ,
      electronVolts: joulesToElectronVolts(wJ)
    };
  }

  // src/physics/ek-frequency-model.js
  function createEkFrequencyModel({
    metalIds = ["cs", "na", "zn"],
    yAxisMode = "ek",
    probeFrequency14 = 12,
    showExtrapolation = true
  } = {}) {
    const mode = yAxisMode === "vs" ? "vs" : "ek";
    const fMin14 = 0;
    const fMax14 = 20;
    const yMin = -6;
    const yMax = 6.5;
    const clampedProbe14 = Math.max(0.5, Math.min(fMax14, Number(probeFrequency14) || 12));
    const uniqueIds = Array.from(new Set(Array.isArray(metalIds) ? metalIds : ["cs", "na", "zn"])).slice(0, 3);
    if (uniqueIds.length === 0) uniqueIds.push("na");
    const slope = calculateGraphSlope(mode);
    const series = uniqueIds.map((id) => {
      const metal = getMetalById(id);
      const f0_14 = metal.thresholdFrequency14;
      const yIntercept = -metal.workFunctionEV;
      const endEval = evaluateEkVsFrequency(fMax14 * 1e14, metal.workFunctionEV);
      const probeEval = evaluateEkVsFrequency(clampedProbe14 * 1e14, metal.workFunctionEV);
      return {
        metal,
        f0_14,
        yIntercept,
        extrapolatedSegment: {
          x1: 0,
          y1: yIntercept,
          x2: f0_14,
          y2: 0
        },
        solidSegment: {
          x1: f0_14,
          y1: 0,
          x2: fMax14,
          y2: mode === "vs" ? endEval.stoppingPotentialV : endEval.ekMaxEV
        },
        probe: {
          frequency14: clampedProbe14,
          emitsElectrons: probeEval.emitsElectrons,
          yValue: mode === "vs" ? probeEval.stoppingPotentialV : probeEval.ekMaxEV,
          ekMaxEV: probeEval.ekMaxEV,
          stoppingPotentialV: probeEval.stoppingPotentialV
        }
      };
    });
    series.sort((a, b) => a.f0_14 - b.f0_14);
    return {
      yAxisMode: mode,
      yAxisLabel: mode === "vs" ? "\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 Vs (V)" : "\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 Ek,max (eV)",
      yUnit: mode === "vs" ? "V" : "eV",
      interceptSymbol: mode === "vs" ? "-W/e" : "-W",
      fMin14,
      fMax14,
      yMin,
      yMax,
      probeFrequency14: clampedProbe14,
      showExtrapolation: Boolean(showExtrapolation),
      slope,
      series
    };
  }

  // src/application/ek-frequency-simulator.js
  var EkFrequencySimulator = class {
    /**
     * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
     */
    constructor({ plotter = null, onUpdate = null } = {}) {
      this.plotter = plotter;
      this.onUpdate = onUpdate;
      this.state = {
        metalIds: ["cs", "na", "zn"],
        yAxisMode: "ek",
        // 'ek' | 'vs'
        probeFrequency14: 12,
        showExtrapolation: true
      };
      this.model = createEkFrequencyModel(this.state);
      this.render();
      this._emitUpdate();
    }
    setPlotter(plotter) {
      this.plotter = plotter;
      this.render();
    }
    setOnUpdate(callback) {
      this.onUpdate = callback;
      this._emitUpdate();
    }
    setYAxisMode(mode) {
      this.state.yAxisMode = mode === "vs" ? "vs" : "ek";
      this._recompute();
    }
    setProbeFrequency(freq14) {
      this.state.probeFrequency14 = Math.max(0.5, Math.min(20, Number(freq14) || 12));
      this._recompute();
    }
    setShowExtrapolation(show) {
      this.state.showExtrapolation = Boolean(show);
      this._recompute();
    }
    /**
     * Toggle a metal in the active comparison list (enforces 1..3 selected metals)
     * @param {string} metalId
     * @returns {string[]} Updated active metal IDs
     */
    toggleMetal(metalId) {
      const id = String(metalId || "").toLowerCase();
      const exists = this.state.metalIds.includes(id);
      if (exists) {
        if (this.state.metalIds.length <= 1) {
          return [...this.state.metalIds];
        }
        this.state.metalIds = this.state.metalIds.filter((m) => m !== id);
      } else {
        if (this.state.metalIds.length >= 3) {
          this.state.metalIds = [...this.state.metalIds.slice(1), id];
        } else {
          this.state.metalIds = [...this.state.metalIds, id];
        }
      }
      this._recompute();
      return [...this.state.metalIds];
    }
    setMetals(metalIds) {
      if (!Array.isArray(metalIds) || metalIds.length === 0) return;
      this.state.metalIds = Array.from(new Set(metalIds.map((m) => String(m).toLowerCase()))).slice(0, 3);
      this._recompute();
    }
    _recompute() {
      this.model = createEkFrequencyModel(this.state);
      this.render();
      this._emitUpdate();
    }
    getSnapshot() {
      return {
        state: { ...this.state },
        model: this.model
      };
    }
    render() {
      if (this.plotter && typeof this.plotter.render === "function") {
        this.plotter.render(this.getSnapshot());
      }
    }
    resize() {
      if (this.plotter && typeof this.plotter.resize === "function") {
        this.plotter.resize();
      }
      this.render();
    }
    _emitUpdate() {
      if (typeof this.onUpdate === "function") {
        this.onUpdate(this.getSnapshot());
      }
    }
    destroy() {
      if (this.plotter && typeof this.plotter.destroy === "function") {
        this.plotter.destroy();
      }
    }
  };

  // src/application/photocell-app-simulator.js
  var PhotocellAppSimulator = class {
    /**
     * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
     */
    constructor({ plotter = null, onUpdate = null } = {}) {
      this.plotter = plotter;
      this.onUpdate = onUpdate;
      this.state = {
        metalId: "cs",
        // Cesium (W = 2.1 eV, λ₀ ≈ 591 nm) commonly used in photocells
        wavelengthNm: 450,
        // Blue sensor beam (emits electrons cleanly)
        manualBlock: false,
        isWalking: false,
        personProgress: -0.25,
        // -0.25 (left off-beam) -> 0.50 (blocking beam) -> 1.25 (past beam)
        doorOpenRatio: 0,
        // 0 = closed, 1 = fully open
        passCount: 0,
        _wasBlocked: false
      };
      this._rafId = null;
      this._lastTs = null;
      this._time = 0;
      this.physics = this._solvePhysics();
      this.render();
      this._emitUpdate();
    }
    setPlotter(plotter) {
      this.plotter = plotter;
      this.render();
    }
    setOnUpdate(callback) {
      this.onUpdate = callback;
      this._emitUpdate();
    }
    setWavelength(wavelengthNm) {
      this.state.wavelengthNm = Math.max(250, Math.min(720, Number(wavelengthNm) || 450));
      this.physics = this._solvePhysics();
      this.render();
      this._emitUpdate();
    }
    setManualBlock(blocked) {
      this.state.manualBlock = Boolean(blocked);
      this.state.isWalking = false;
      this.state.personProgress = this.state.manualBlock ? 0.5 : -0.25;
      this.physics = this._solvePhysics();
      this.render();
      this._emitUpdate();
    }
    /**
     * Trigger a person walking through the photocell light beam
     */
    triggerPersonWalk() {
      this.state.manualBlock = false;
      this.state.isWalking = true;
      this.state.personProgress = -0.2;
      this.startAnimationLoop();
      this._emitUpdate();
    }
    resetSimulation() {
      this.state.manualBlock = false;
      this.state.isWalking = false;
      this.state.personProgress = -0.25;
      this.state.doorOpenRatio = 0;
      this.state.passCount = 0;
      this.state._wasBlocked = false;
      this.physics = this._solvePhysics();
      this.render();
      this._emitUpdate();
    }
    _isPersonBlockingBeam() {
      if (this.state.manualBlock) return true;
      return this.state.isWalking && this.state.personProgress >= 0.34 && this.state.personProgress <= 0.66;
    }
    _solvePhysics() {
      const metal = getMetalById(this.state.metalId);
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: this.state.wavelengthNm,
        workFunctionEV: metal.workFunctionEV
      });
      const beamBlocked = this._isPersonBlockingBeam();
      const beamReachesCell = !beamBlocked;
      const photocurrentMicroA = beamReachesCell && solved.emitsElectrons ? 85 : 0;
      const relayTriggeredOpen = photocurrentMicroA <= 0.1;
      return {
        metal,
        ...solved,
        colorInfo: wavelengthToRGB(this.state.wavelengthNm),
        beamBlocked,
        beamReachesCell,
        photocurrentMicroA,
        relayTriggeredOpen
      };
    }
    step(dt) {
      const safeDt = Math.min(0.05, Math.max(1e-3, dt));
      this._time += safeDt;
      if (this.state.isWalking) {
        this.state.personProgress += safeDt * 0.38;
        if (this.state.personProgress > 1.25) {
          this.state.isWalking = false;
          this.state.personProgress = -0.25;
        }
      }
      const blockedNow = this._isPersonBlockingBeam();
      if (blockedNow && !this.state._wasBlocked) {
        this.state.passCount += 1;
      }
      this.state._wasBlocked = blockedNow;
      this.physics = this._solvePhysics();
      const targetDoor = this.physics.relayTriggeredOpen ? 1 : 0;
      const speed = 1.6;
      if (this.state.doorOpenRatio < targetDoor) {
        this.state.doorOpenRatio = Math.min(1, this.state.doorOpenRatio + safeDt * speed);
      } else if (this.state.doorOpenRatio > targetDoor) {
        this.state.doorOpenRatio = Math.max(0, this.state.doorOpenRatio - safeDt * speed * 0.8);
      }
      this._emitUpdate();
    }
    getSnapshot() {
      return {
        state: { ...this.state },
        physics: this.physics,
        time: this._time
      };
    }
    render() {
      if (this.plotter && typeof this.plotter.render === "function") {
        this.plotter.render(this.getSnapshot());
      }
    }
    resize() {
      if (this.plotter && typeof this.plotter.resize === "function") {
        this.plotter.resize();
      }
      this.render();
    }
    startAnimationLoop() {
      if (this._rafId !== null) return;
      if (typeof requestAnimationFrame !== "function") return;
      this._lastTs = null;
      const tick = (ts) => {
        const dt = this._lastTs === null ? 0.016 : (ts - this._lastTs) / 1e3;
        this._lastTs = ts;
        this.step(dt);
        this.render();
        this._rafId = requestAnimationFrame(tick);
      };
      this._rafId = requestAnimationFrame(tick);
    }
    stopAnimationLoop() {
      if (this._rafId !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(this._rafId);
      }
      this._rafId = null;
      this._lastTs = null;
    }
    _emitUpdate() {
      if (typeof this.onUpdate === "function") {
        this.onUpdate(this.getSnapshot());
      }
    }
    destroy() {
      this.stopAnimationLoop();
      if (this.plotter && typeof this.plotter.destroy === "function") {
        this.plotter.destroy();
      }
    }
  };

  // src/utils/format.js
  function toSuperscriptExponent(exp) {
    const map = {
      "-": "\u207B",
      "0": "\u2070",
      "1": "\xB9",
      "2": "\xB2",
      "3": "\xB3",
      "4": "\u2074",
      "5": "\u2075",
      "6": "\u2076",
      "7": "\u2077",
      "8": "\u2078",
      "9": "\u2079"
    };
    return String(exp).split("").map((ch) => map[ch] || ch).join("");
  }
  function formatScientific(num, decimals = 2) {
    const val = Number(num);
    if (Number.isNaN(val) || val === 0) return "0";
    const absVal = Math.abs(val);
    if (absVal >= 0.01 && absVal < 1e4) {
      return val.toFixed(decimals);
    }
    const exp = Math.floor(Math.log10(absVal));
    const mantissa = val / Math.pow(10, exp);
    return `${mantissa.toFixed(decimals)} \xD7 10${toSuperscriptExponent(exp)}`;
  }
  function formatLatexScientific(num, decimals = 2) {
    const val = Number(num);
    if (Number.isNaN(val) || val === 0) return "0";
    const absVal = Math.abs(val);
    if (absVal >= 0.01 && absVal < 1e4) {
      return val.toFixed(decimals);
    }
    const exp = Math.floor(Math.log10(absVal));
    const mantissa = val / Math.pow(10, exp);
    return `${mantissa.toFixed(decimals)} \\times 10^{${exp}}`;
  }

  // src/adapters/ui/control-panel.js
  var ControlPanelAdapter = class {
    /**
     * Bind controls & readout updates for Simulator 1: Photoelectric Tube Lab
     * @param {Object} sim - PhotoelectricTubeSimulator instance
     */
    static bindPhotoelectricTubeControls(sim) {
      const selectMetal = document.getElementById("select-tube-metal");
      const sliderLambda = document.getElementById("slider-tube-lambda");
      const sliderIntensity = document.getElementById("slider-tube-intensity");
      const sliderVoltage = document.getElementById("slider-tube-voltage");
      const btnStopV = document.getElementById("btn-tube-stop-v");
      const btnPlay = document.getElementById("btn-tube-play");
      const renderReadouts = ({ state, physics }) => {
        const lblLambda = document.getElementById("lbl-tube-lambda");
        const lblIntensity = document.getElementById("lbl-tube-intensity");
        const lblVoltage = document.getElementById("lbl-tube-voltage");
        const valPhotonE = document.getElementById("tube-val-photon-e");
        const valWorkF0 = document.getElementById("tube-val-work-f0");
        const valEkVmax = document.getElementById("tube-val-ek-vmax");
        const valVsCurr = document.getElementById("tube-val-vs-current");
        const banner = document.getElementById("tube-status-banner");
        if (lblLambda) {
          lblLambda.textContent = `${state.wavelengthNm} nm (${physics.colorInfo.labelTh})`;
        }
        if (lblIntensity) {
          lblIntensity.textContent = `${state.intensityPercent}%`;
        }
        if (lblVoltage) {
          const prefix = state.voltageV > 0 ? "+" : "";
          lblVoltage.textContent = `${prefix}${state.voltageV.toFixed(2)} V`;
        }
        if (valPhotonE) {
          valPhotonE.innerHTML = `${physics.photonEnergyEV.toFixed(2)} eV <span class="block text-[10px] text-slate-400 font-normal">f = ${physics.frequency14.toFixed(2)} \xD7 10\xB9\u2074 Hz</span>`;
        }
        if (valWorkF0) {
          valWorkF0.innerHTML = `${physics.workFunctionEV.toFixed(1)} eV <span class="block text-[10px] text-slate-400 font-normal">f\u2080 = ${physics.thresholdFrequency14.toFixed(2)}\xD710\xB9\u2074 Hz \xB7 \u03BB\u2080 = ${physics.thresholdWavelengthNm.toFixed(0)} nm</span>`;
        }
        if (valEkVmax) {
          const vmaxStr = physics.vMaxMs > 0 ? `${formatScientific(physics.vMaxMs, 2)} m/s` : "0 m/s";
          valEkVmax.innerHTML = `${physics.ekMaxEV.toFixed(2)} eV <span class="block text-[10px] text-slate-400 font-normal">vmax = ${vmaxStr}</span>`;
        }
        if (valVsCurr) {
          valVsCurr.innerHTML = `${physics.stoppingPotentialV.toFixed(2)} V <span class="block text-[10px] text-slate-400 font-normal">\u0E01\u0E23\u0E30\u0E41\u0E2A I = ${physics.photocurrentMicroA.toFixed(1)} \xB5A</span>`;
        }
        if (banner) {
          if (!physics.emitsElectrons) {
            banner.className = "rounded-xl px-4 py-2.5 text-xs font-semibold border bg-red-50 border-red-300 text-red-900 flex items-center gap-2";
            banner.innerHTML = `<i class="fa-solid fa-circle-xmark text-red-600"></i> <span><strong>\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30 E &lt; W:</strong> \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19 (${physics.photonEnergyEV.toFixed(2)} eV) \u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07${physics.metal.nameTh} (${physics.workFunctionEV.toFixed(1)} eV) \u0E41\u0E21\u0E49\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E40\u0E1B\u0E47\u0E19 100% \u0E01\u0E47\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E2B\u0E25\u0E38\u0E14! (\u0E25\u0E2D\u0E07\u0E25\u0E14\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E43\u0E2B\u0E49 \u2264 ${physics.thresholdWavelengthNm.toFixed(0)} nm)</span>`;
          } else if (state.intensityPercent === 0) {
            banner.className = "rounded-xl px-4 py-2.5 text-xs font-semibold border bg-slate-100 border-slate-300 text-slate-700 flex items-center gap-2";
            banner.innerHTML = `<i class="fa-solid fa-power-off text-slate-500"></i> <span>\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E40\u0E1B\u0E47\u0E19 0% \u2014 \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E41\u0E04\u0E42\u0E17\u0E14</span>`;
          } else if (physics.electronMotionMode === "stopped") {
            banner.className = "rounded-xl px-4 py-2.5 text-xs font-semibold border bg-amber-50 border-amber-300 text-amber-900 flex items-center gap-2";
            banner.innerHTML = `<i class="fa-solid fa-hand text-amber-600"></i> <span><strong>\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C:</strong> \u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E19\u0E48\u0E27\u0E07 (${state.voltageV.toFixed(2)} V) \u0E21\u0E35\u0E02\u0E19\u0E32\u0E14 \u2265 \u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (Vs = ${physics.stoppingPotentialV.toFixed(2)} V) \u0E17\u0E33\u0E43\u0E2B\u0E49\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E41\u0E04\u0E42\u0E17\u0E14\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 (I = 0 \xB5A)</span>`;
          } else {
            banner.className = "rounded-xl px-4 py-2.5 text-xs font-semibold border bg-emerald-50 border-emerald-300 text-emerald-900 flex items-center gap-2";
            banner.innerHTML = `<i class="fa-solid fa-bolt text-emerald-600"></i> <span><strong>\u0E40\u0E01\u0E34\u0E14\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01!</strong> \u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19 ${physics.photonEnergyEV.toFixed(2)} eV \u2265 W (${physics.workFunctionEV.toFixed(1)} eV) \u0E1B\u0E25\u0E14\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E14\u0E49\u0E27\u0E22 Ek,max = ${physics.ekMaxEV.toFixed(2)} eV \u0E41\u0E25\u0E30\u0E01\u0E23\u0E30\u0E41\u0E2A I = ${physics.photocurrentMicroA.toFixed(1)} \xB5A</span>`;
          }
        }
      };
      sim.setOnUpdate(renderReadouts);
      if (selectMetal) {
        selectMetal.addEventListener("change", (e) => sim.setMetal(e.target.value));
      }
      if (sliderLambda) {
        sliderLambda.addEventListener("input", (e) => sim.setWavelength(parseFloat(e.target.value)));
      }
      if (sliderIntensity) {
        sliderIntensity.addEventListener("input", (e) => sim.setIntensity(parseFloat(e.target.value)));
      }
      if (sliderVoltage) {
        sliderVoltage.addEventListener("input", (e) => sim.setVoltage(parseFloat(e.target.value)));
      }
      if (btnStopV) {
        btnStopV.addEventListener("click", () => {
          const vStop = sim.setToStoppingPotential();
          if (sliderVoltage) sliderVoltage.value = String(vStop);
        });
      }
      if (btnPlay) {
        btnPlay.addEventListener("click", () => {
          const playing = sim.togglePlay();
          btnPlay.innerHTML = playing ? '<i class="fa-solid fa-pause mr-1"></i> \u0E1E\u0E31\u0E01\u0E41\u0E2D\u0E19\u0E34\u0E40\u0E21\u0E0A\u0E31\u0E19' : '<i class="fa-solid fa-play mr-1"></i> \u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D';
        });
      }
    }
    /**
     * Bind controls & readout updates for Simulator 2: I vs ΔV Graph
     * @param {Object} sim - IVCurveSimulator instance
     */
    static bindIVCurveControls(sim) {
      const selectMetal = document.getElementById("select-iv-metal");
      const sliderLambda = document.getElementById("slider-iv-lambda");
      const sliderIntensity = document.getElementById("slider-iv-intensity");
      const sliderVoltage = document.getElementById("slider-iv-voltage");
      const btnModeInt = document.getElementById("btn-iv-mode-intensity");
      const btnModeFreq = document.getElementById("btn-iv-mode-frequency");
      const cbOpPoint = document.getElementById("cb-iv-op-point");
      const updateModeButtons = (mode) => {
        if (btnModeInt) {
          btnModeInt.className = mode === "intensity" ? "flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-cyan-600 text-white shadow-sm cursor-pointer transition" : "flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition";
        }
        if (btnModeFreq) {
          btnModeFreq.className = mode === "frequency" ? "flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-sm cursor-pointer transition" : "flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition";
        }
      };
      const renderReadouts = ({ state, model }) => {
        updateModeButtons(state.comparisonMode);
        const lblLambda = document.getElementById("lbl-iv-lambda");
        const lblIntensity = document.getElementById("lbl-iv-intensity");
        const lblVoltage = document.getElementById("lbl-iv-voltage");
        const valVs = document.getElementById("iv-val-vs");
        const valIsat = document.getElementById("iv-val-isat");
        const valCurrent = document.getElementById("iv-val-current");
        const valSummary = document.getElementById("iv-val-summary");
        if (lblLambda) lblLambda.textContent = `${state.wavelengthNm} nm (f = ${model.primary.frequency14.toFixed(2)}\xD710\xB9\u2074 Hz)`;
        if (lblIntensity) lblIntensity.textContent = `${state.intensityPercent}%`;
        if (lblVoltage) lblVoltage.textContent = `${state.operatingVoltageV >= 0 ? "+" : ""}${state.operatingVoltageV.toFixed(2)} V`;
        if (valVs) valVs.textContent = model.primary.emitsElectrons ? `-${model.primary.stoppingPotentialV.toFixed(2)} V` : "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14 e\u207B";
        if (valIsat) valIsat.textContent = `${model.primarySaturationCurrentMicroA.toFixed(1)} \xB5A`;
        if (valCurrent) valCurrent.textContent = `${model.operatingPoint.currentMicroA.toFixed(1)} \xB5A`;
        if (valSummary) {
          valSummary.textContent = state.comparisonMode === "intensity" ? "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E40\u0E1E\u0E34\u0E48\u0E21 \u2192 Isat \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E41\u0E15\u0E48\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 -Vs \u0E40\u0E17\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21 (\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 f \u0E04\u0E07\u0E17\u0E35\u0E48)" : "\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07\u0E40\u0E1E\u0E34\u0E48\u0E21 \u2192 \u0E02\u0E19\u0E32\u0E14 |Vs| \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 (\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E0B\u0E49\u0E32\u0E22) \u0E2A\u0E48\u0E27\u0E19 Isat \u0E40\u0E17\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E04\u0E07\u0E17\u0E35\u0E48";
        }
      };
      sim.setOnUpdate(renderReadouts);
      if (selectMetal) selectMetal.addEventListener("change", (e) => sim.setMetal(e.target.value));
      if (sliderLambda) sliderLambda.addEventListener("input", (e) => sim.setWavelength(parseFloat(e.target.value)));
      if (sliderIntensity) sliderIntensity.addEventListener("input", (e) => sim.setIntensity(parseFloat(e.target.value)));
      if (sliderVoltage) sliderVoltage.addEventListener("input", (e) => sim.setOperatingVoltage(parseFloat(e.target.value)));
      if (btnModeInt) btnModeInt.addEventListener("click", () => sim.setComparisonMode("intensity"));
      if (btnModeFreq) btnModeFreq.addEventListener("click", () => sim.setComparisonMode("frequency"));
      if (cbOpPoint) cbOpPoint.addEventListener("change", (e) => sim.setShowOperatingPoint(e.target.checked));
    }
    /**
     * Bind controls & readout updates for Simulator 3: E_{k,max}-f and V_s-f Multi-Metal Graph
     * @param {Object} sim - EkFrequencySimulator instance
     */
    static bindEkFrequencyControls(sim) {
      const btnAxisEk = document.getElementById("btn-ekf-axis-ek");
      const btnAxisVs = document.getElementById("btn-ekf-axis-vs");
      const sliderFreq = document.getElementById("slider-ekf-freq");
      const cbExtrapolate = document.getElementById("cb-ekf-extrapolate");
      const metalIds = ["cs", "k", "na", "ca", "al", "zn", "cu", "au"];
      const renderReadouts = ({ state, model }) => {
        if (btnAxisEk) {
          btnAxisEk.className = state.yAxisMode === "ek" ? "flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm cursor-pointer transition" : "flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition";
        }
        if (btnAxisVs) {
          btnAxisVs.className = state.yAxisMode === "vs" ? "flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm cursor-pointer transition" : "flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition";
        }
        metalIds.forEach((id) => {
          const btn = document.getElementById(`btn-ekf-metal-${id}`);
          if (btn) {
            const isActive = state.metalIds.includes(id);
            btn.className = isActive ? "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-cyan-300 border border-cyan-400 shadow-sm cursor-pointer transition" : "px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition";
          }
        });
        const lblFreq = document.getElementById("lbl-ekf-freq");
        if (lblFreq) lblFreq.textContent = `${state.probeFrequency14.toFixed(1)} \xD7 10\xB9\u2074 Hz`;
        const valSlope = document.getElementById("ekf-val-slope");
        if (valSlope) {
          valSlope.textContent = model.yAxisMode === "vs" ? "h/e = 4.14 \xD7 10\u207B\xB9\u2075 V\xB7s (\u0E02\u0E19\u0E32\u0E19\u0E17\u0E38\u0E01\u0E42\u0E25\u0E2B\u0E30)" : "h = 6.626 \xD7 10\u207B\xB3\u2074 J\xB7s (\u0E02\u0E19\u0E32\u0E19\u0E17\u0E38\u0E01\u0E42\u0E25\u0E2B\u0E30)";
        }
        const cardsWrap = document.getElementById("ekf-readout-cards");
        if (cardsWrap) {
          cardsWrap.innerHTML = model.series.map((s) => {
            const valText = s.probe.emitsElectrons ? `${s.probe.yValue.toFixed(2)} ${model.yUnit}` : "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14 e\u207B (f < f\u2080)";
            const valClass = s.probe.emitsElectrons ? "text-emerald-600" : "text-red-500";
            return `
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-slate-800 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${s.metal.lineColor}"></span>
                    ${s.metal.nameTh} (${s.metal.symbol})
                  </span>
                  <span class="font-mono text-[11px] text-slate-500">W = ${s.metal.workFunctionEV.toFixed(1)} eV</span>
                </div>
                <div class="text-[11px] text-slate-500">\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E19\u0E2D\u0E19 f\u2080 = <strong class="font-mono text-slate-700">${s.f0_14.toFixed(2)}\xD710\xB9\u2074 Hz</strong></div>
                <div class="text-[11px] text-slate-500">\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48 f \u0E17\u0E14\u0E2A\u0E2D\u0E1A: <strong class="font-mono ${valClass}">${valText}</strong></div>
              </div>
            `;
          }).join("");
        }
      };
      sim.setOnUpdate(renderReadouts);
      if (btnAxisEk) btnAxisEk.addEventListener("click", () => sim.setYAxisMode("ek"));
      if (btnAxisVs) btnAxisVs.addEventListener("click", () => sim.setYAxisMode("vs"));
      if (sliderFreq) sliderFreq.addEventListener("input", (e) => sim.setProbeFrequency(parseFloat(e.target.value)));
      if (cbExtrapolate) cbExtrapolate.addEventListener("change", (e) => sim.setShowExtrapolation(e.target.checked));
      metalIds.forEach((id) => {
        const btn = document.getElementById(`btn-ekf-metal-${id}`);
        if (btn) btn.addEventListener("click", () => sim.toggleMetal(id));
      });
    }
    /**
     * Bind controls & readout updates for Simulator 4: Automatic Door Photocell Application
     * @param {Object} sim - PhotocellAppSimulator instance
     */
    static bindPhotocellAppControls(sim) {
      const btnWalk = document.getElementById("btn-cell-walk");
      const btnBlock = document.getElementById("btn-cell-block");
      const btnReset = document.getElementById("btn-cell-reset");
      const sliderLambda = document.getElementById("slider-cell-lambda");
      const renderReadouts = ({ state, physics }) => {
        const lblLambda = document.getElementById("lbl-cell-lambda");
        const valCurr = document.getElementById("cell-val-current");
        const valRelay = document.getElementById("cell-val-relay");
        const valDoor = document.getElementById("cell-val-door");
        const valCount = document.getElementById("cell-val-count");
        if (lblLambda) {
          lblLambda.textContent = `${state.wavelengthNm} nm (${physics.colorInfo.labelTh})`;
        }
        if (valCurr) {
          valCurr.textContent = `${physics.photocurrentMicroA.toFixed(1)} \xB5A`;
          valCurr.className = physics.photocurrentMicroA > 0 ? "font-bold font-mono text-emerald-600" : "font-bold font-mono text-red-600";
        }
        if (valRelay) {
          valRelay.textContent = physics.relayTriggeredOpen ? "\u0E2A\u0E31\u0E48\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E23\u0E30\u0E15\u0E39 (I = 0)" : "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E1B\u0E01\u0E15\u0E34";
        }
        if (valDoor) {
          valDoor.textContent = state.doorOpenRatio > 0.25 ? `\u0E40\u0E1B\u0E34\u0E14 (${Math.round(state.doorOpenRatio * 100)}%)` : "\u0E1B\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34";
        }
        if (valCount) {
          valCount.textContent = `${state.passCount} \u0E04\u0E23\u0E31\u0E49\u0E07`;
        }
        if (btnBlock) {
          btnBlock.innerHTML = state.manualBlock ? '<i class="fa-solid fa-eye mr-1"></i> \u0E40\u0E25\u0E34\u0E01\u0E1A\u0E31\u0E07\u0E25\u0E33\u0E41\u0E2A\u0E07' : '<i class="fa-solid fa-hand mr-1"></i> \u0E1A\u0E31\u0E07\u0E25\u0E33\u0E41\u0E2A\u0E07\u0E04\u0E49\u0E32\u0E07\u0E44\u0E27\u0E49';
        }
      };
      sim.setOnUpdate(renderReadouts);
      if (btnWalk) btnWalk.addEventListener("click", () => sim.triggerPersonWalk());
      if (btnBlock) btnBlock.addEventListener("click", () => sim.setManualBlock(!sim.state.manualBlock));
      if (btnReset) btnReset.addEventListener("click", () => sim.resetSimulation());
      if (sliderLambda) sliderLambda.addEventListener("input", (e) => sim.setWavelength(parseFloat(e.target.value)));
    }
  };

  // src/adapters/formula/katex-adapter.js
  var KaTeXAdapter = class {
    /**
     * Render LaTeX string into a target DOM element
     * @param {string} latex
     * @param {HTMLElement|string} elementOrId
     * @param {boolean} [displayMode=false]
     * @returns {boolean}
     */
    static render(latex, elementOrId, displayMode = false) {
      if (typeof document === "undefined") return false;
      const el = typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
      if (!el) {
        console.warn(`[KaTeXAdapter] Target element "${elementOrId}" not found in DOM`);
        return false;
      }
      if (typeof window.katex === "undefined") {
        el.textContent = latex;
        return false;
      }
      try {
        window.katex.render(latex, el, {
          displayMode,
          throwOnError: false,
          strict: false,
          output: "htmlAndMathml"
        });
        return true;
      } catch (err) {
        console.error("[KaTeXAdapter] KaTeX render error:", err);
        el.textContent = latex;
        return false;
      }
    }
    /**
     * Render LaTeX string to HTML string
     * @param {string} latex
     * @param {boolean} [displayMode=false]
     * @returns {string}
     */
    static renderToString(latex, displayMode = false) {
      if (typeof window === "undefined" || typeof window.katex === "undefined") {
        return latex;
      }
      try {
        return window.katex.renderToString(latex, {
          displayMode,
          throwOnError: false,
          strict: false,
          output: "htmlAndMathml"
        });
      } catch {
        return latex;
      }
    }
    /**
     * Safely scan and render all mathematical formulas in a container element
     * @param {HTMLElement|string} [container=document.body]
     */
    static renderAllMath(container = document.body) {
      if (typeof document === "undefined") return;
      const targetEl = typeof container === "string" ? document.getElementById(container) : container;
      if (!targetEl) return;
      if (typeof window !== "undefined" && typeof window.renderMathInElement === "function") {
        try {
          window.renderMathInElement(targetEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "\\[", right: "\\]", display: true },
              { left: "\\(", right: "\\)", display: false },
              { left: "$", right: "$", display: false }
            ],
            ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "input", "select", "option"],
            throwOnError: false,
            strict: false,
            errorColor: "#ef4444"
          });
        } catch (err) {
          console.warn("[KaTeXAdapter] renderMathInElement failed:", err);
        }
      }
    }
  };

  // src/adapters/ui/simulator-loader.js
  var SimulatorLoader = class _SimulatorLoader {
    static loadedState = {
      "19-2-tube": false,
      "19-2-iv": false,
      "19-2-ekf": false,
      "19-2-photocell": false
    };
    static prefixMap = {
      "19-2-tube": "tube",
      "19-2-iv": "iv",
      "19-2-ekf": "ekf",
      "19-2-photocell": "photocell"
    };
    static calibrationStages = {
      "19-2-tube": [
        { maxPct: 25, status: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E43\u0E19\u0E2B\u0E25\u0E2D\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01..." },
        { maxPct: 60, status: "\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (W) \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (f\u2080)..." },
        { maxPct: 90, status: "\u0E1B\u0E23\u0E31\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E41\u0E2D\u0E21\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C (\xB5A) \u0E41\u0E25\u0E30\u0E42\u0E27\u0E25\u0E15\u0E4C\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C (V)..." },
        { maxPct: 100, status: "\u0E2B\u0E25\u0E2D\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E40\u0E2A\u0E21\u0E37\u0E2D\u0E19\u0E08\u0E23\u0E34\u0E07\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C 100%" }
      ],
      "19-2-iv": [
        { maxPct: 25, status: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E01\u0E23\u0E32\u0E1F\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 I\u2013\u0394V..." },
        { maxPct: 60, status: "\u0E04\u0E33\u0E19\u0E27\u0E13\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (Isat) \u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (-Vs)..." },
        { maxPct: 90, status: "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E38\u0E14\u0E01\u0E23\u0E32\u0E1F\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48..." },
        { maxPct: 100, status: "\u0E23\u0E30\u0E1A\u0E1A\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F I\u2013\u0394V \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C 100%" }
      ],
      "19-2-ekf": [
        { maxPct: 25, status: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E41\u0E01\u0E19 Ek,max\u2013f \u0E41\u0E25\u0E30 Vs\u2013f..." },
        { maxPct: 60, status: "\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C (h \u0E41\u0E25\u0E30 h/e)..." },
        { maxPct: 90, status: "\u0E25\u0E32\u0E01\u0E40\u0E2A\u0E49\u0E19\u0E1B\u0E23\u0E30\u0E15\u0E48\u0E2D\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E15\u0E31\u0E49\u0E07 (-W) \u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E42\u0E25\u0E2B\u0E30..." },
        { maxPct: 100, status: "\u0E01\u0E23\u0E32\u0E1F\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E2B\u0E25\u0E32\u0E22\u0E42\u0E25\u0E2B\u0E30\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C 100%" }
      ],
      "19-2-photocell": [
        { maxPct: 25, status: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E40\u0E0B\u0E19\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 (Cs)..." },
        { maxPct: 60, status: "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E27\u0E07\u0E08\u0E23\u0E23\u0E35\u0E40\u0E25\u0E22\u0E4C\u0E41\u0E25\u0E30\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34..." },
        { maxPct: 90, status: "\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E25\u0E33\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E41\u0E25\u0E30\u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1A\u0E31\u0E07\u0E41\u0E2A\u0E07..." },
        { maxPct: 100, status: "\u0E41\u0E1A\u0E1A\u0E08\u0E33\u0E25\u0E2D\u0E07\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C 100%" }
      ]
    };
    static isLoaded(simId) {
      return Boolean(this.loadedState[simId]);
    }
    static markLoaded(simId) {
      this.loadedState[simId] = true;
    }
    static reset(simId) {
      if (simId) {
        this.loadedState[simId] = false;
      } else {
        Object.keys(this.loadedState).forEach((key) => {
          this.loadedState[key] = false;
        });
      }
    }
    static getStatusText(simId, pct) {
      const stages = this.calibrationStages[simId] || this.calibrationStages["19-2-tube"];
      const current = stages.find((s) => pct <= s.maxPct);
      return current ? current.status : stages[stages.length - 1].status;
    }
    static load(simId, options = {}) {
      const {
        force = false,
        duration = 650,
        onComplete = null,
        onProgress = null
      } = options;
      if (this.isLoaded(simId) && !force) {
        if (typeof onComplete === "function") onComplete();
        return Promise.resolve(true);
      }
      const prefix = this.prefixMap[simId] || simId;
      return new Promise((resolve) => {
        const isDOM = typeof document !== "undefined";
        const elOverlay = isDOM ? document.getElementById(`loader-${prefix}`) : null;
        const elPct = isDOM ? document.getElementById(`loader-${prefix}-pct`) : null;
        const elBar = isDOM ? document.getElementById(`loader-${prefix}-bar`) : null;
        const elStatus = isDOM ? document.getElementById(`loader-${prefix}-status`) : null;
        if (elOverlay) {
          elOverlay.classList.remove("opacity-0", "pointer-events-none");
          elOverlay.style.display = "flex";
        }
        const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
        const updateProgress = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(1, Math.max(0, elapsed / duration));
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentPct = Math.min(100, Math.round(ease * 100));
          const statusText = this.getStatusText(simId, currentPct);
          if (elPct) elPct.textContent = String(currentPct);
          if (elBar) elBar.style.width = `${currentPct}%`;
          if (elStatus) elStatus.textContent = statusText;
          if (typeof onProgress === "function") {
            onProgress(currentPct, statusText);
          }
          if (progress < 1) {
            if (typeof requestAnimationFrame !== "undefined") {
              requestAnimationFrame(updateProgress);
            } else {
              setTimeout(() => updateProgress(Date.now()), 16);
            }
          } else {
            this.markLoaded(simId);
            if (elPct) elPct.textContent = "100";
            if (elBar) elBar.style.width = "100%";
            if (elStatus) elStatus.textContent = this.getStatusText(simId, 100);
            if (elOverlay) {
              setTimeout(() => {
                elOverlay.classList.add("opacity-0", "pointer-events-none");
                setTimeout(() => {
                  if (elOverlay.classList.contains("opacity-0")) {
                    elOverlay.style.display = "none";
                  }
                }, 300);
              }, 120);
            }
            if (typeof onComplete === "function") {
              onComplete();
            }
            resolve(true);
          }
        };
        if (typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(updateProgress);
        } else {
          setTimeout(() => updateProgress(Date.now()), 16);
        }
      });
    }
    static reload(simId, onComplete = null) {
      return this.load(simId, { force: true, onComplete });
    }
    static initGlobalHandlers() {
      if (typeof window !== "undefined") {
        window.SimulatorLoader = _SimulatorLoader;
        window.reloadSimulator = (simId) => _SimulatorLoader.reload(simId);
      }
    }
  };

  // src/adapters/ui/tab-navigator.js
  var TabNavigatorAdapter = class {
    static currentSection = "home";
    static currentReviewTab = "19-2-tube";
    static isExamInProgress = false;
    static simulators = {};
    static setExamInProgress(inProgress) {
      this.isExamInProgress = Boolean(inProgress);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("exam-locked", this.isExamInProgress);
        if (document.body) {
          document.body.classList.toggle("exam-locked", this.isExamInProgress);
        }
      }
    }
    /**
     * Switch between primary sections
     * @param {'home'|'review'|'practice'|'exam-start'|'exam-live'|'exam-result'} targetSection
     */
    static showSection(targetSection) {
      if (this.isExamInProgress && !["exam-live", "exam-result"].includes(targetSection)) {
        if (typeof alert === "function") {
          alert("\u26A0\uFE0F \u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E08\u0E31\u0E1A\u0E40\u0E27\u0E25\u0E32 \u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E2D\u0E1A\u0E44\u0E14\u0E49\u0E08\u0E19\u0E01\u0E27\u0E48\u0E32\u0E08\u0E30\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A");
        }
        return;
      }
      this.currentSection = targetSection;
      const sections = ["home", "review", "practice", "exam-start", "exam-live", "exam-result"];
      if (typeof document !== "undefined") {
        sections.forEach((sec) => {
          const el = document.getElementById(`sec-${sec}`);
          if (el) {
            el.classList.toggle("hidden", sec !== targetSection);
          }
        });
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu) mobileMenu.classList.add("hidden");
      }
      if (targetSection !== "review") {
        if (this.simulators.tubeSim) this.simulators.tubeSim.stopAnimationLoop();
        if (this.simulators.photocellSim) this.simulators.photocellSim.stopAnimationLoop();
      } else {
        this.switchReviewTab(this.currentReviewTab);
      }
      if (typeof requestAnimationFrame !== "undefined" && typeof document !== "undefined") {
        requestAnimationFrame(() => {
          const activeContainer = document.getElementById(`sec-${targetSection}`);
          if (activeContainer) {
            KaTeXAdapter.renderAllMath(activeContainer);
          }
        });
      }
    }
    /**
     * Switch between 4 Review Sub-tabs
     * @param {'19-2-tube'|'19-2-iv'|'19-2-ekf'|'19-2-photocell'} tabId
     */
    static switchReviewTab(tabId) {
      this.currentReviewTab = tabId;
      const tabKeys = ["19-2-tube", "19-2-iv", "19-2-ekf", "19-2-photocell"];
      if (typeof document !== "undefined") {
        tabKeys.forEach((key) => {
          const btn = document.getElementById(`btn-tab-${key}`);
          const content = document.getElementById(`review-tab-${key}`);
          if (btn) {
            if (key === tabId) {
              btn.className = "flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 bg-white text-blue-600 shadow-sm cursor-pointer";
            } else {
              btn.className = "flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 cursor-pointer";
            }
          }
          if (content) {
            content.classList.toggle("hidden", key !== tabId);
          }
        });
      }
      this.handleSimulatorLifecycle(tabId);
      if (typeof requestAnimationFrame !== "undefined" && typeof document !== "undefined") {
        requestAnimationFrame(() => {
          const content = document.getElementById(`review-tab-${tabId}`);
          if (content) KaTeXAdapter.renderAllMath(content);
        });
      }
    }
    static handleSimulatorLifecycle(tabId) {
      const { tubeSim, ivSim, ekfSim, photocellSim } = this.simulators;
      SimulatorLoader.load(tabId, { duration: 550 });
      if (tubeSim && tabId !== "19-2-tube") tubeSim.stopAnimationLoop();
      if (photocellSim && tabId !== "19-2-photocell") photocellSim.stopAnimationLoop();
      if (tabId === "19-2-tube" && tubeSim) {
        tubeSim.resize();
        if (tubeSim.state.isPlaying) tubeSim.startAnimationLoop();
      }
      if (tabId === "19-2-iv" && ivSim) {
        ivSim.resize();
      }
      if (tabId === "19-2-ekf" && ekfSim) {
        ekfSim.resize();
      }
      if (tabId === "19-2-photocell" && photocellSim) {
        photocellSim.resize();
        photocellSim.startAnimationLoop();
      }
    }
    static toggleMobileMenu() {
      if (typeof document === "undefined") return;
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        mobileMenu.classList.toggle("hidden");
      }
    }
    static init(simulators = {}) {
      this.simulators = simulators;
      SimulatorLoader.initGlobalHandlers();
      if (typeof window !== "undefined") {
        window.showSection = (sectionId) => this.showSection(sectionId);
        window.switchReviewTab = (tabId) => this.switchReviewTab(tabId);
        window.toggleMobileMenu = () => this.toggleMobileMenu();
      }
      if (this.isExamInProgress) {
        this.showSection("exam-live");
      } else {
        this.showSection("home");
      }
    }
  };

  // src/utils/random.js
  function createSeededRNG(seed) {
    let s = seed >>> 0;
    return function() {
      let t = s += 1831565813;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function getSeededInt(rollNumber, questionIndex, min, max, attemptSeed = 0) {
    const seed = rollNumber * 10007 + questionIndex * 9973 + attemptSeed * 1013 + 12345 >>> 0;
    const rng = createSeededRNG(seed);
    return Math.floor(rng() * (max - min + 1)) + min;
  }
  function getSeededChoice(rollNumber, questionIndex, array, attemptSeed = 0) {
    if (!array || array.length === 0) return null;
    const idx = getSeededInt(rollNumber, questionIndex, 0, array.length - 1, attemptSeed);
    return array[idx];
  }
  function getSeededShuffle(rollNumber, questionIndex, array, attemptSeed = 0) {
    if (!Array.isArray(array)) return [];
    const shuffled = [...array];
    const seed = rollNumber * 10007 + questionIndex * 9973 + attemptSeed * 1013 + 24680 >>> 0;
    const rng = createSeededRNG(seed);
    for (let idx = shuffled.length - 1; idx > 0; idx--) {
      const swapIdx = Math.floor(rng() * (idx + 1));
      [shuffled[idx], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[idx]];
    }
    return shuffled;
  }
  function getDynamicParam(rollNumber, baseMin, baseStep, randomRange = 0, safetyBounds = {}, attemptSeed = void 0) {
    const R = Math.max(1, Math.min(40, Number(rollNumber) || 1));
    let randFloat = 0;
    if (attemptSeed !== void 0) {
      const seed = rollNumber * 10007 + attemptSeed * 9973 + 88888 >>> 0;
      const rng = createSeededRNG(seed);
      randFloat = rng();
    } else {
      randFloat = Math.random();
    }
    const randOffset = randomRange > 0 ? (randFloat - 0.5) * 2 * randomRange : 0;
    let val = baseMin + R * baseStep + randOffset;
    if (safetyBounds.min !== void 0 && val < safetyBounds.min) {
      val = safetyBounds.min;
    }
    if (safetyBounds.max !== void 0 && val > safetyBounds.max) {
      val = safetyBounds.max;
    }
    const decimals = safetyBounds.decimals !== void 0 ? safetyBounds.decimals : 2;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  // src/utils/validation.js
  function validateRollNumber(inputRollNumber) {
    const r = parseInt(inputRollNumber, 10);
    if (Number.isNaN(r) || r < APP_CONFIG.minRollNumber) {
      return APP_CONFIG.minRollNumber;
    }
    if (r > APP_CONFIG.maxRollNumber) {
      return APP_CONFIG.maxRollNumber;
    }
    return r;
  }
  function validateNumericAnswer(userAnswer, correctAnswer, tolerance = APP_CONFIG.numericAnswerTolerance) {
    const normalizedUser = typeof userAnswer === "string" ? userAnswer.replace(/,/g, "").trim() : userAnswer;
    const uVal = parseFloat(normalizedUser);
    const cVal = parseFloat(correctAnswer);
    if (Number.isNaN(uVal)) {
      return {
        isCorrect: false,
        relativeErrorPercent: 100,
        userVal: NaN,
        correctVal: cVal,
        message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A"
      };
    }
    if (Math.abs(cVal) < 1e-9) {
      const isZeroMatch = Math.abs(uVal) < 1e-3;
      return {
        isCorrect: isZeroMatch,
        relativeErrorPercent: isZeroMatch ? 0 : 100,
        userVal: uVal,
        correctVal: cVal,
        message: isZeroMatch ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" : "\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
      };
    }
    const absDiff = Math.abs(uVal - cVal);
    const relError = absDiff / Math.abs(cVal);
    const isCorrect = relError <= tolerance;
    const errorPercent = relError * 100;
    return {
      isCorrect,
      relativeErrorPercent: Math.round(errorPercent * 100) / 100,
      userVal: uVal,
      correctVal: cVal,
      message: isCorrect ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07!" : `\u0E04\u0E27\u0E32\u0E21\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19 ${errorPercent.toFixed(1)}% (\u0E40\u0E01\u0E34\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C ${(tolerance * 100).toFixed(0)}%)`
    };
  }

  // src/application/quiz-manager.js
  var QuizManager = class {
    /**
     * @param {number} [rollNumber=1] - Student roll number R (1..40)
     */
    constructor(rollNumber = 1) {
      this.rollNumber = validateRollNumber(rollNumber);
      this.currentQuestionIndex = 0;
      this.currentQuestion = null;
      this.scoreHistory = [];
      this.attemptSeed = 0;
      this.mode = "random";
      this.usedParamsByTemplate = /* @__PURE__ */ new Map();
      this._rngCounter = 0;
      this.maxRetries = 50;
    }
    setRollNumber(newRollNumber) {
      this.rollNumber = validateRollNumber(newRollNumber);
      return this.generateQuestion(this.currentQuestionIndex);
    }
    setMode(newMode) {
      this.mode = newMode === "standard" ? "standard" : "random";
      return this.generateQuestion(this.currentQuestionIndex);
    }
    resetUsedParameters() {
      this.usedParamsByTemplate.clear();
    }
    /**
     * Generate a unique dynamic parameter combining Roll Number R and Attempt Seed B
     * with strict 0% repeat guarantee against both standardValue and prior session picks.
     */
    _generateUniqueParam(templateKey, R, config, B, standardValue, trackHistory = true) {
      const { baseMin, baseStep, randomRange, min, max, decimals } = config;
      const factor = Math.pow(10, decimals);
      const roundVal = (v) => Math.round(v * factor) / factor;
      const stdVal = roundVal(standardValue);
      let usedSet = null;
      if (trackHistory) {
        if (!this.usedParamsByTemplate.has(templateKey)) {
          this.usedParamsByTemplate.set(templateKey, /* @__PURE__ */ new Set());
        }
        usedSet = this.usedParamsByTemplate.get(templateKey);
      }
      const isForbidden = (val) => Math.abs(val - stdVal) < 1e-9 || usedSet !== null && usedSet.has(val);
      for (let retry = 0; retry < this.maxRetries; retry++) {
        const retrySeed = retry === 0 ? B : B + Math.imul(retry, 7919) + Math.imul(R, 131) >>> 0;
        const candidate = roundVal(
          getDynamicParam(R, baseMin, baseStep, randomRange, { min, max, decimals }, retrySeed)
        );
        if (!isForbidden(candidate)) {
          if (usedSet) usedSet.add(candidate);
          return candidate;
        }
      }
      const minInt = Math.round(min * factor);
      const maxInt = Math.round(max * factor);
      const buildUnusedPool = () => {
        const pool = [];
        for (let i = minInt; i <= maxInt; i++) {
          const val = roundVal(i / factor);
          if (!isForbidden(val)) pool.push(val);
        }
        return pool;
      };
      let unusedPool = buildUnusedPool();
      if (unusedPool.length === 0 && usedSet) {
        const lastVal = Array.from(usedSet).pop();
        usedSet.clear();
        if (lastVal !== void 0) usedSet.add(lastVal);
        unusedPool = buildUnusedPool();
      }
      const fallbackSeed = Math.imul(R, 10007) + Math.imul(B, 9973) + 31337 >>> 0;
      const rng = createSeededRNG(fallbackSeed);
      const picked = unusedPool[Math.floor(rng() * unusedPool.length)];
      if (usedSet && picked !== void 0) usedSet.add(picked);
      return picked;
    }
    /**
     * Pick a discrete scenario item combining R and B with 0% repeat guarantee.
     */
    _generateUniqueChoice(templateKey, R, pool, B, standardKey, keyFn, trackHistory = true) {
      let usedSet = null;
      if (trackHistory) {
        if (!this.usedParamsByTemplate.has(templateKey)) {
          this.usedParamsByTemplate.set(templateKey, /* @__PURE__ */ new Set());
        }
        usedSet = this.usedParamsByTemplate.get(templateKey);
      }
      const isForbidden = (key) => key === standardKey || usedSet !== null && usedSet.has(key);
      let available = pool.filter((item) => !isForbidden(keyFn(item)));
      if (available.length === 0 && usedSet) {
        const lastKey = Array.from(usedSet).pop();
        usedSet.clear();
        if (lastKey !== void 0) usedSet.add(lastKey);
        available = pool.filter((item) => !isForbidden(keyFn(item)));
      }
      if (available.length === 0) {
        available = pool.filter((item) => keyFn(item) !== standardKey);
      }
      const seed = Math.imul(R, 10007) + Math.imul(B, 9973) + 42424 >>> 0;
      const rng = createSeededRNG(seed);
      const picked = available[Math.floor(rng() * available.length)] || pool[0];
      if (usedSet && picked !== void 0) usedSet.add(keyFn(picked));
      return picked;
    }
    /**
     * Generate question by category ('19.2.1', '19.2.2', '19.2.3', or 'mixed')
     * @param {number} [questionIndex=0]
     * @param {'19.2.1' | '19.2.2' | '19.2.3' | 'mixed'} [category='mixed']
     * @param {number|null} [customSeed=null]
     * @param {'standard' | 'random' | null} [mode=null]
     */
    generateQuestion(questionIndex = 0, category = "mixed", customSeed = null, mode = null) {
      this.currentQuestionIndex = questionIndex;
      const isDeterministicReplay = customSeed !== null;
      if (isDeterministicReplay) {
        this.attemptSeed = customSeed;
      } else {
        this._rngCounter += 1;
        this.attemptSeed = (Date.now() ^ Math.floor(Math.random() * 4294967295) ^ Math.imul(this._rngCounter, 2654435761)) >>> 0;
      }
      const R = this.rollNumber;
      const B = this.attemptSeed;
      const currentMode = mode || this.mode;
      const trackHistory = !isDeterministicReplay;
      let targetTopic = category;
      if (category === "mixed") {
        const topics = ["19.2.1", "19.2.2", "19.2.3"];
        targetTopic = getSeededChoice(R, questionIndex, topics, B);
      }
      switch (targetTopic) {
        case "19.2.1":
          this.currentQuestion = this._generateTopic1921Question(R, questionIndex, B, currentMode, trackHistory);
          break;
        case "19.2.2":
          this.currentQuestion = this._generateTopic1922Question(R, questionIndex, B, currentMode, trackHistory);
          break;
        case "19.2.3":
        default:
          this.currentQuestion = this._generateTopic1923Question(R, questionIndex, B, currentMode, trackHistory);
          break;
      }
      return this.currentQuestion;
    }
    /**
     * Topic 19.2.1: Photons, Threshold Frequency f₀ & Work Function W (5 Questions)
     * Q1: Photon energy E (eV) from wavelength λ (nm)
     * Q2: Threshold frequency f₀ (×10¹⁴ Hz) from work function W (eV)
     * Q3: Threshold wavelength λ₀ (nm) from work function W (eV)
     * Q4: Choice — Check whether photoelectric emission occurs (E vs W)
     * Q5: Multi-numeric — Find both f₀ (×10¹⁴ Hz) and λ₀ (nm) from W (eV)
     */
    _generateTopic1921Question(R, qIndex, B, mode = "random", trackHistory = true) {
      const isStandard = mode === "standard";
      const totalInTopic = 5;
      const subType = (qIndex % totalInTopic + totalInTopic) % totalInTopic + 1;
      const titleSuffix = isStandard ? "(\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 \u0E2A\u0E2A\u0E27\u0E17.)" : `(\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`;
      if (subType === 1) {
        const lambdaNm = isStandard ? 400 : this._generateUniqueParam(
          "19.2.1_Q1",
          R,
          { baseMin: 215, baseStep: 9.5, randomRange: 95, min: 200, max: 680, decimals: 0 },
          B,
          400,
          trackHistory
        );
        const energy = calculatePhotonEnergyFromWavelength(lambdaNm * 1e-9);
        const ansEV = Math.round(energy.electronVolts * 100) / 100;
        return {
          id: `q_19_2_1_Q1_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 1,
          totalInTopic,
          generatedParam: lambdaNm,
          topic: "19.2.1 \u0E42\u0E1F\u0E15\u0E2D\u0E19 \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19",
          title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 ${titleSuffix}`,
          problemText: `\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E40\u0E14\u0E35\u0E22\u0E27\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaNm} \\text{ nm}\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30 \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04 (\\(E\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C (\\(\\text{eV}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\), \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
          unit: "eV",
          correctAnswer: ansEV,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19 \\(E = \\frac{hc}{\\lambda}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E21\u0E15\u0E23: \\(\\lambda = ${lambdaNm} \\times 10^{-9} \\text{ m}\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E08\u0E39\u0E25: \\(E = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${lambdaNm} \\times 10^{-9}} = ${formatLatexScientific(energy.joules)} \\text{ J}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C: \\(E = \\frac{${formatLatexScientific(energy.joules)}}{1.602 \\times 10^{-19}} = ${ansEV.toFixed(2)} \\text{ eV}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansEV.toFixed(2)} eV**`
          ]
        };
      }
      if (subType === 2) {
        const workEV2 = isStandard ? 2.4 : this._generateUniqueParam(
          "19.2.1_Q2",
          R,
          { baseMin: 1.9, baseStep: 0.08, randomRange: 0.65, min: 1.8, max: 5.5, decimals: 2 },
          B,
          2.4,
          trackHistory
        );
        const wJ2 = electronVoltsToJoules(workEV2);
        const f0Hz2 = calculateThresholdFrequency(workEV2);
        const ansF02 = Math.round(f0Hz2 / 1e14 * 100) / 100;
        const metalLabel2 = isStandard ? "\u0E42\u0E25\u0E2B\u0E30\u0E42\u0E0B\u0E40\u0E14\u0E35\u0E22\u0E21 (\\(\\text{Na}\\))" : "\u0E42\u0E25\u0E2B\u0E30\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07";
        return {
          id: `q_19_2_1_Q2_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 2,
          totalInTopic,
          generatedParam: workEV2,
          topic: "19.2.1 \u0E42\u0E1F\u0E15\u0E2D\u0E19 \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19",
          title: `\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E08\u0E32\u0E01\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 ${titleSuffix}`,
          problemText: `${metalLabel2}\u0E21\u0E35\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = ${workEV2.toFixed(2)} \\text{ eV}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(f_0\\)) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49 (\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E0D\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{14} \\text{ Hz}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
          unit: "\xD7 10\xB9\u2074 Hz",
          correctAnswer: ansF02,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(W = hf_0 \\rightarrow f_0 = \\frac{W}{h}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E39\u0E25: \\(W = (${workEV2.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(wJ2)} \\text{ J}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21: \\(f_0 = \\frac{${formatLatexScientific(wJ2)}}{6.626 \\times 10^{-34}} = ${ansF02.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansF02.toFixed(2)} \xD7 10\xB9\u2074 Hz** (\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A: **${ansF02.toFixed(2)}**)`
          ]
        };
      }
      if (subType === 3) {
        const workEV2 = isStandard ? 2.1 : this._generateUniqueParam(
          "19.2.1_Q3",
          R,
          { baseMin: 1.95, baseStep: 0.075, randomRange: 0.65, min: 1.85, max: 5.4, decimals: 2 },
          B,
          2.1,
          trackHistory
        );
        const wJ2 = electronVoltsToJoules(workEV2);
        const lambda02 = calculateThresholdWavelength(workEV2);
        const ansNm = Math.round(lambda02.nm * 10) / 10;
        const metalLabel2 = isStandard ? "\u0E42\u0E25\u0E2B\u0E30\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (\\(\\text{Cs}\\))" : "\u0E42\u0E25\u0E2B\u0E30\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07";
        return {
          id: `q_19_2_1_Q3_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 3,
          totalInTopic,
          generatedParam: workEV2,
          topic: "19.2.1 \u0E42\u0E1F\u0E15\u0E2D\u0E19 \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19",
          title: `\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E08\u0E32\u0E01\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 ${titleSuffix}`,
          problemText: `${metalLabel2}\u0E21\u0E35\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = ${workEV2.toFixed(2)} \\text{ eV}\\) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(\\lambda_0\\)) \u0E2B\u0E23\u0E37\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49 \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E32\u0E42\u0E19\u0E40\u0E21\u0E15\u0E23 (\\(\\text{nm}\\))`,
          unit: "nm",
          correctAnswer: ansNm,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(W = \\frac{hc}{\\lambda_0} \\rightarrow \\lambda_0 = \\frac{hc}{W}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E39\u0E25: \\(W = (${workEV2.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(wJ2)} \\text{ J}\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21: \\(\\lambda_0 = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${formatLatexScientific(wJ2)}} = ${formatLatexScientific(lambda02.meters)} \\text{ m}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E19\u0E32\u0E42\u0E19\u0E40\u0E21\u0E15\u0E23: \\(\\lambda_0 = ${ansNm.toFixed(1)} \\text{ nm}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansNm.toFixed(1)} nm**`
          ]
        };
      }
      if (subType === 4) {
        const scenarios = [
          { key: "na-650", metalId: "na", lambdaNm: 650, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E41\u0E14\u0E07" },
          { key: "cs-450", metalId: "cs", lambdaNm: 450, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19" },
          { key: "cs-680", metalId: "cs", lambdaNm: 680, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E41\u0E14\u0E07" },
          { key: "k-400", metalId: "k", lambdaNm: 400, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E21\u0E48\u0E27\u0E07" },
          { key: "k-620", metalId: "k", lambdaNm: 620, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E2A\u0E49\u0E21" },
          { key: "na-360", metalId: "na", lambdaNm: 360, lightName: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 (UV)" },
          { key: "ca-350", metalId: "ca", lambdaNm: 350, lightName: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 (UV)" },
          { key: "ca-550", metalId: "ca", lambdaNm: 550, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E40\u0E02\u0E35\u0E22\u0E27" },
          { key: "al-240", metalId: "al", lambdaNm: 240, lightName: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 (UV)" },
          { key: "zn-420", metalId: "zn", lambdaNm: 420, lightName: "\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E21\u0E48\u0E27\u0E07" },
          { key: "cu-210", metalId: "cu", lambdaNm: 210, lightName: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 (UV)" },
          { key: "au-320", metalId: "au", lambdaNm: 320, lightName: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 (UV)" }
        ];
        const selected = isStandard ? scenarios[0] : this._generateUniqueChoice("19.2.1_Q4", R, scenarios, B, "na-650", (s) => s.key, trackHistory);
        const metal = getMetalById(selected.metalId);
        const solved = calculatePhotoelectricEffect({
          wavelengthNm: selected.lambdaNm,
          workFunctionEV: metal.workFunctionEV
        });
        const eStr = solved.photonEnergyEV.toFixed(2);
        const wStr = metal.workFunctionEV.toFixed(2);
        const rawOptions = solved.emitsElectrons ? [
          {
            text: `\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19 (${eStr} eV) \u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (${wStr} eV) \u0E08\u0E36\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 ${solved.ekMaxEV.toFixed(2)} eV`,
            isCorrect: true
          },
          {
            text: `\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 ${selected.lambdaNm} nm \u0E19\u0E49\u0E2D\u0E22\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B\u0E08\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E17\u0E30\u0E25\u0E38\u0E1C\u0E48\u0E32\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14`,
            isCorrect: false
          },
          {
            text: `\u0E08\u0E30\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E01\u0E47\u0E15\u0E48\u0E2D\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E43\u0E2B\u0E49\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19\u0E40\u0E01\u0E34\u0E19 80% \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19`,
            isCorrect: false
          },
          {
            text: `\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19 (${eStr} eV) \u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (${wStr} eV)`,
            isCorrect: false
          }
        ] : [
          {
            text: `\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19 (${eStr} eV) \u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (${wStr} eV) \u0E41\u0E21\u0E49\u0E08\u0E30\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E21\u0E32\u0E01\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E43\u0E14\u0E01\u0E47\u0E15\u0E32\u0E21`,
            isCorrect: true
          },
          {
            text: `\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E2B\u0E32\u0E01\u0E40\u0E1B\u0E34\u0E14\u0E44\u0E1F\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E19\u0E35\u0E49\u0E17\u0E34\u0E49\u0E07\u0E44\u0E27\u0E49\u0E19\u0E32\u0E19\u0E1E\u0E2D\u0E43\u0E2B\u0E49\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E2A\u0E30\u0E2A\u0E21\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E04\u0E23\u0E1A ${wStr} eV`,
            isCorrect: false
          },
          {
            text: `\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E2B\u0E32\u0E01\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E43\u0E2B\u0E49\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1B\u0E47\u0E19 2 \u0E40\u0E17\u0E48\u0E32`,
            isCorrect: false
          },
          {
            text: `\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 ${selected.lambdaNm} nm \u0E22\u0E32\u0E27\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (${metal.thresholdWavelengthNm.toFixed(1)} nm)`,
            isCorrect: false
          }
        ];
        const shuffled = isStandard ? rawOptions : getSeededShuffle(R, 19214 + qIndex, rawOptions, B);
        const correctChoiceIndex = shuffled.findIndex((o) => o.isCorrect);
        return {
          id: `q_19_2_1_Q4_${qIndex}_${B}`,
          type: "choice",
          questionNumber: 4,
          totalInTopic,
          generatedParam: selected.key,
          topic: "19.2.1 \u0E42\u0E1F\u0E15\u0E2D\u0E19 \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19",
          title: `\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E14\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 ${titleSuffix}`,
          problemText: `\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E09\u0E32\u0E22${selected.lightName}\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${selected.lambdaNm} \\text{ nm}\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30${metal.nameTh} (\\(\\text{${metal.symbol}}\\)) \u0E17\u0E35\u0E48\u0E21\u0E35\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = ${wStr} \\text{ eV}\\) \u0E02\u0E49\u0E2D\u0E43\u0E14\u0E2A\u0E23\u0E38\u0E1B\u0E1C\u0E25\u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14?`,
          choices: shuffled.map((o) => o.text),
          correctChoiceIndex,
          solutionSteps: [
            `**\u0E02\u0E31\u0E49\u0E19\u0E17\u0E35\u0E48 1**: \u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04 \\(E = \\frac{hc}{\\lambda} = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${selected.lambdaNm} \\times 10^{-9} \\times 1.602 \\times 10^{-19}} = ${eStr} \\text{ eV}\\)`,
            `**\u0E02\u0E31\u0E49\u0E19\u0E17\u0E35\u0E48 2**: \u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07${metal.nameTh} \\(W = ${wStr} \\text{ eV}\\) (\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \\(\\lambda_0 = ${metal.thresholdWavelengthNm.toFixed(1)} \\text{ nm}\\))`,
            solved.emitsElectrons ? `**\u0E2A\u0E23\u0E38\u0E1B**: \u0E40\u0E19\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E32\u0E01 \\(E = ${eStr} \\text{ eV} \\ge W = ${wStr} \\text{ eV}\\) (\u0E41\u0E25\u0E30 \\(\\lambda \\le \\lambda_0\\)) \u0E08\u0E36\u0E07 **\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19** \u0E42\u0E14\u0E22\u0E21\u0E35 \\(E_{k,\\max} = ${eStr} - ${wStr} = ${solved.ekMaxEV.toFixed(2)} \\text{ eV}\\)` : `**\u0E2A\u0E23\u0E38\u0E1B**: \u0E40\u0E19\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E32\u0E01 \\(E = ${eStr} \\text{ eV} < W = ${wStr} \\text{ eV}\\) (\u0E41\u0E25\u0E30 \\(\\lambda > \\lambda_0\\)) \u0E08\u0E36\u0E07 **\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E40\u0E25\u0E22** \u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E08\u0E30\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E09\u0E32\u0E22\u0E19\u0E32\u0E19\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E43\u0E14`
          ]
        };
      }
      const workEV = isStandard ? 2.3 : this._generateUniqueParam(
        "19.2.1_Q5",
        R,
        { baseMin: 1.9, baseStep: 0.08, randomRange: 0.65, min: 1.85, max: 5.3, decimals: 2 },
        B,
        2.3,
        trackHistory
      );
      const wJ = electronVoltsToJoules(workEV);
      const f0Hz = calculateThresholdFrequency(workEV);
      const lambda0 = calculateThresholdWavelength(workEV);
      const ansF0 = Math.round(f0Hz / 1e14 * 100) / 100;
      const ansLambda0 = Math.round(lambda0.nm * 10) / 10;
      const metalLabel = isStandard ? "\u0E42\u0E25\u0E2B\u0E30\u0E42\u0E1E\u0E41\u0E17\u0E2A\u0E40\u0E0B\u0E35\u0E22\u0E21 (\\(\\text{K}\\))" : "\u0E42\u0E25\u0E2B\u0E30\u0E41\u0E04\u0E42\u0E17\u0E14\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07";
      return {
        id: `q_19_2_1_Q5_${qIndex}_${B}`,
        type: "multi-numeric",
        questionNumber: 5,
        totalInTopic,
        generatedParam: workEV,
        topic: "19.2.1 \u0E42\u0E1F\u0E15\u0E2D\u0E19 \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19",
        title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 ${titleSuffix}`,
        problemText: `${metalLabel}\u0E21\u0E35\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = ${workEV.toFixed(2)} \\text{ eV}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13 1) \u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(f_0\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{14} \\text{ Hz}\\) \u0E41\u0E25\u0E30 2) \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(\\lambda_0\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E32\u0E42\u0E19\u0E40\u0E21\u0E15\u0E23 (\\(\\text{nm}\\))`,
        unit: "\xD7 10\xB9\u2074 Hz / nm",
        correctAnswer: ansF0,
        correctAnswers: [ansF0, ansLambda0],
        tolerance: 0.03,
        inputs: [
          {
            id: "f0",
            label: "\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (f\u2080)",
            unit: "\xD7 10\xB9\u2074 Hz",
            correctAnswer: ansF0,
            tolerance: 0.03
          },
          {
            id: "lambda0",
            label: "\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\u03BB\u2080)",
            unit: "nm",
            correctAnswer: ansLambda0,
            tolerance: 0.03
          }
        ],
        solutionSteps: [
          `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(W = hf_0 = \\frac{hc}{\\lambda_0}\\)`,
          `\u0E41\u0E1B\u0E25\u0E07\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E39\u0E25: \\(W = (${workEV.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(wJ)} \\text{ J}\\)`,
          `1) \u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21: \\(f_0 = \\frac{W}{h} = \\frac{${formatLatexScientific(wJ)}}{6.626 \\times 10^{-34}} = ${ansF0.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`,
          `2) \u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21: \\(\\lambda_0 = \\frac{c}{f_0} = \\frac{3.00 \\times 10^8}{${ansF0.toFixed(2)} \\times 10^{14}} = ${ansLambda0.toFixed(1)} \\text{ nm}\\)`,
          `**\u0E15\u0E2D\u0E1A**: \\(f_0 =\\) **${ansF0.toFixed(2)} \xD7 10\xB9\u2074 Hz** \u0E41\u0E25\u0E30 \\(\\lambda_0 =\\) **${ansLambda0.toFixed(1)} nm**`
        ]
      };
    }
    /**
     * Topic 19.2.2: Einstein's Photoelectric Equation & Stopping Potential (5 Questions)
     * Q1: E_{k,max} (eV) from frequency f and W
     * Q2: Stopping potential V_s (V) from wavelength λ and W
     * Q3: Work function W (eV) from frequency f and stopping potential V_s
     * Q4: Maximum electron speed v_max (×10⁵ m/s) from wavelength λ and W
     * Q5: Multi-numeric — Find both E_{k,max} (×10⁻¹⁹ J) and V_s (V)
     */
    _generateTopic1922Question(R, qIndex, B, mode = "random", trackHistory = true) {
      const isStandard = mode === "standard";
      const totalInTopic = 5;
      const subType = (qIndex % totalInTopic + totalInTopic) % totalInTopic + 1;
      const titleSuffix = isStandard ? "(\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 \u0E2A\u0E2A\u0E27\u0E17.)" : `(\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`;
      if (subType === 1) {
        const metal2 = getMetalById("na");
        const freqCoeff = isStandard ? 8 : this._generateUniqueParam(
          "19.2.2_Q1",
          R,
          { baseMin: 6.8, baseStep: 0.16, randomRange: 1.4, min: 6.5, max: 16, decimals: 2 },
          B,
          8,
          trackHistory
        );
        const solved2 = calculatePhotoelectricEffect({
          frequencyHz: freqCoeff * 1e14,
          workFunctionEV: metal2.workFunctionEV
        });
        const ansEk = Math.round(solved2.ekMaxEV * 100) / 100;
        return {
          id: `q_19_2_2_Q1_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 1,
          totalInTopic,
          generatedParam: freqCoeff,
          topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
          title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 ${titleSuffix}`,
          problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E42\u0E0B\u0E40\u0E14\u0E35\u0E22\u0E21 (\\(\\text{Na}\\)) \u0E17\u0E35\u0E48\u0E21\u0E35\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = 2.40 \\text{ eV}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (\\(E_{k,\\max}\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C (\\(\\text{eV}\\))`,
          unit: "eV",
          correctAnswer: ansEk,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C \\(E_{k,\\max} = hf - W\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19: \\(E = \\frac{hf}{e} = \\frac{(6.626 \\times 10^{-34})(${freqCoeff.toFixed(2)} \\times 10^{14})}{1.602 \\times 10^{-19}} = ${solved2.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = 2.40 \\text{ eV}\\): \\(E_{k,\\max} = ${solved2.photonEnergyEV.toFixed(2)} - 2.40 = ${ansEk.toFixed(2)} \\text{ eV}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansEk.toFixed(2)} eV**`
          ]
        };
      }
      if (subType === 2) {
        const metal2 = getMetalById("na");
        const lambdaNm2 = isStandard ? 300 : this._generateUniqueParam(
          "19.2.2_Q2",
          R,
          { baseMin: 185, baseStep: 5.5, randomRange: 55, min: 180, max: 450, decimals: 0 },
          B,
          300,
          trackHistory
        );
        const solved2 = calculatePhotoelectricEffect({
          wavelengthNm: lambdaNm2,
          workFunctionEV: metal2.workFunctionEV
        });
        const ansVs2 = Math.round(solved2.stoppingPotentialV * 100) / 100;
        return {
          id: `q_19_2_2_Q2_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 2,
          totalInTopic,
          generatedParam: lambdaNm2,
          topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
          title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 ${titleSuffix}`,
          problemText: `\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaNm2} \\text{ nm}\\) \u0E25\u0E07\u0E1A\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E42\u0E0B\u0E40\u0E14\u0E35\u0E22\u0E21 (\\(W = 2.40 \\text{ eV}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (\\(V_s\\)) \u0E17\u0E35\u0E48\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E40\u0E1B\u0E47\u0E19\u0E28\u0E39\u0E19\u0E22\u0E4C \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E42\u0E27\u0E25\u0E15\u0E4C (\\(\\text{V}\\))`,
          unit: "V",
          correctAnswer: ansVs2,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(eV_s = E_{k,\\max} = \\frac{hc}{\\lambda} - W\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19: \\(E = \\frac{hc}{\\lambda e} = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{(${lambdaNm2} \\times 10^{-9})(1.602 \\times 10^{-19})} = ${solved2.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
            `\u0E2B\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14: \\(E_{k,\\max} = ${solved2.photonEnergyEV.toFixed(2)} - 2.40 = ${solved2.ekMaxEV.toFixed(2)} \\text{ eV}\\)`,
            `\u0E08\u0E32\u0E01 \\(eV_s = E_{k,\\max}\\) \u0E08\u0E30\u0E44\u0E14\u0E49 \\(V_s = ${ansVs2.toFixed(2)} \\text{ V}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansVs2.toFixed(2)} V**`
          ]
        };
      }
      if (subType === 3) {
        const freqCoeff = isStandard ? 10 : this._generateUniqueParam(
          "19.2.2_Q3",
          R,
          { baseMin: 8.5, baseStep: 0.18, randomRange: 1.5, min: 8.2, max: 16.5, decimals: 2 },
          B,
          10,
          trackHistory
        );
        const photonEV = calculatePhotonEnergyFromFrequency(freqCoeff * 1e14).electronVolts;
        const vsVal = isStandard ? 1.84 : Math.round(Math.max(0.55, Math.min(photonEV - 1.85, 0.7 + R % 9 * 0.16)) * 100) / 100;
        const wResult = calculateWorkFunctionFromGraphPoint(freqCoeff * 1e14, vsVal);
        const ansW = Math.round(wResult.electronVolts * 100) / 100;
        return {
          id: `q_19_2_2_Q3_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 3,
          totalInTopic,
          generatedParam: freqCoeff,
          topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
          title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E08\u0E32\u0E01\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 ${titleSuffix}`,
          problemText: `\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E25\u0E07\u0E1A\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07 \u0E1E\u0E1A\u0E27\u0E48\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 \\(V_s = ${vsVal.toFixed(2)} \\text{ V}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (\\(W\\)) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{eV}\\)`,
          unit: "eV",
          correctAnswer: ansW,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(eV_s = hf - W \\rightarrow W = hf - eV_s\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19: \\(E = \\frac{hf}{e} = \\frac{(6.626 \\times 10^{-34})(${freqCoeff.toFixed(2)} \\times 10^{14})}{1.602 \\times 10^{-19}} = ${photonEV.toFixed(2)} \\text{ eV}\\)`,
            `\u0E08\u0E32\u0E01 \\(V_s = ${vsVal.toFixed(2)} \\text{ V}\\) \u0E08\u0E30\u0E44\u0E14\u0E49 \\(E_{k,\\max} = ${vsVal.toFixed(2)} \\text{ eV}\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19: \\(W = ${photonEV.toFixed(2)} - ${vsVal.toFixed(2)} = ${ansW.toFixed(2)} \\text{ eV}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansW.toFixed(2)} eV**`
          ]
        };
      }
      if (subType === 4) {
        const metal2 = getMetalById("cs");
        const lambdaNm2 = isStandard ? 400 : this._generateUniqueParam(
          "19.2.2_Q4",
          R,
          { baseMin: 215, baseStep: 6.2, randomRange: 65, min: 200, max: 495, decimals: 0 },
          B,
          400,
          trackHistory
        );
        const solved2 = calculatePhotoelectricEffect({
          wavelengthNm: lambdaNm2,
          workFunctionEV: metal2.workFunctionEV
        });
        const ansV5 = Math.round(solved2.vMaxMs / 1e5 * 100) / 100;
        return {
          id: `q_19_2_2_Q4_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 4,
          totalInTopic,
          generatedParam: lambdaNm2,
          topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
          title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 ${titleSuffix}`,
          problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaNm2} \\text{ nm}\\) \u0E25\u0E07\u0E1A\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (\\(W = 2.10 \\text{ eV}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (\\(v_{\\max}\\)) (\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E0D\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^5 \\text{ m/s}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E21\u0E27\u0E25\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \\(m_e = 9.109 \\times 10^{-31} \\text{ kg}\\)`,
          unit: "\xD7 10\u2075 m/s",
          correctAnswer: ansV5,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(E_{k,\\max} = \\frac{hc}{\\lambda} - W\\) \u0E41\u0E25\u0E30 \\(E_{k,\\max} = \\frac{1}{2} m_e v_{\\max}^2 \\rightarrow v_{\\max} = \\sqrt{\\frac{2 E_{k,\\max}}{m_e}}\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19: \\(E = ${solved2.photonEnergyEV.toFixed(2)} \\text{ eV}\\) \u0E08\u0E36\u0E07\u0E44\u0E14\u0E49 \\(E_{k,\\max} = ${solved2.photonEnergyEV.toFixed(2)} - 2.10 = ${solved2.ekMaxEV.toFixed(2)} \\text{ eV}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E39\u0E25: \\(E_{k,\\max} = ${formatLatexScientific(solved2.ekMaxJ)} \\text{ J}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E2B\u0E32\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14: \\(v_{\\max} = \\sqrt{\\frac{2(${formatLatexScientific(solved2.ekMaxJ)})}{9.109 \\times 10^{-31}}} = ${ansV5.toFixed(2)} \\times 10^5 \\text{ m/s}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansV5.toFixed(2)} \xD7 10\u2075 m/s** (\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A: **${ansV5.toFixed(2)}**)`
          ]
        };
      }
      const metal = getMetalById("k");
      const lambdaNm = isStandard ? 320 : this._generateUniqueParam(
        "19.2.2_Q5",
        R,
        { baseMin: 195, baseStep: 5.8, randomRange: 60, min: 190, max: 465, decimals: 0 },
        B,
        320,
        trackHistory
      );
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: lambdaNm,
        workFunctionEV: metal.workFunctionEV
      });
      const ansEkJ19 = Math.round(solved.ekMaxJ / 1e-19 * 100) / 100;
      const ansVs = Math.round(solved.stoppingPotentialV * 100) / 100;
      return {
        id: `q_19_2_2_Q5_${qIndex}_${B}`,
        type: "multi-numeric",
        questionNumber: 5,
        totalInTopic,
        generatedParam: lambdaNm,
        topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
        title: `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 ${titleSuffix}`,
        problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaNm} \\text{ nm}\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E42\u0E1E\u0E41\u0E17\u0E2A\u0E40\u0E0B\u0E35\u0E22\u0E21 (\\(W = 2.30 \\text{ eV}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13 1) \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (\\(E_{k,\\max}\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{-19} \\text{ J}\\) \u0E41\u0E25\u0E30 2) \u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (\\(V_s\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E42\u0E27\u0E25\u0E15\u0E4C (\\(\\text{V}\\))`,
        unit: "\xD7 10\u207B\xB9\u2079 J / V",
        correctAnswer: ansEkJ19,
        correctAnswers: [ansEkJ19, ansVs],
        tolerance: 0.03,
        inputs: [
          {
            id: "ekmaxJ",
            label: "\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (Ek,max)",
            unit: "\xD7 10\u207B\xB9\u2079 J",
            correctAnswer: ansEkJ19,
            tolerance: 0.03
          },
          {
            id: "vs",
            label: "\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (Vs)",
            unit: "V",
            correctAnswer: ansVs,
            tolerance: 0.03
          }
        ],
        solutionSteps: [
          `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(E_{k,\\max} = \\frac{hc}{\\lambda} - W\\) \u0E41\u0E25\u0E30 \\(V_s = \\frac{E_{k,\\max}}{e}\\)`,
          `\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19: \\(E = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${lambdaNm} \\times 10^{-9}} = ${formatLatexScientific(solved.photonEnergyJ)} \\text{ J} = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
          `1) \\(E_{k,\\max} = (${solved.photonEnergyEV.toFixed(2)} - 2.30) \\times 1.602 \\times 10^{-19} = ${ansEkJ19.toFixed(2)} \\times 10^{-19} \\text{ J}\\)`,
          `2) \\(V_s = \\frac{${ansEkJ19.toFixed(2)} \\times 10^{-19}}{1.602 \\times 10^{-19}} = ${ansVs.toFixed(2)} \\text{ V}\\)`,
          `**\u0E15\u0E2D\u0E1A**: \\(E_{k,\\max} =\\) **${ansEkJ19.toFixed(2)} \xD7 10\u207B\xB9\u2079 J** \u0E41\u0E25\u0E30 \\(V_s =\\) **${ansVs.toFixed(2)} V**`
        ]
      };
    }
    /**
     * Topic 19.2.3: Graph Analysis & Photocell Applications (5 Questions)
     * Q1: Determine experimental Planck's constant h (×10⁻³⁴ J·s) from slope of E_{k,max}-f graph
     * Q2: Determine work function W (eV) from X-intercept f₀ of V_s-f graph
     * Q3: Choice — Compare intensity vs frequency effects on I-ΔV graph & Wave vs Photon theory
     * Q4: Find required wavelength λ (nm) to achieve target stopping potential V_s
     * Q5: Multi-numeric — Photocell automatic door (λ₀ in nm & E_{k,max} in eV)
     */
    _generateTopic1923Question(R, qIndex, B, mode = "random", trackHistory = true) {
      const isStandard = mode === "standard";
      const totalInTopic = 5;
      const subType = (qIndex % totalInTopic + totalInTopic) % totalInTopic + 1;
      const titleSuffix = isStandard ? "(\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 \u0E2A\u0E2A\u0E27\u0E17.)" : `(\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`;
      if (subType === 1) {
        const hExp34 = isStandard ? 6.63 : this._generateUniqueParam(
          "19.2.3_Q1",
          R,
          { baseMin: 6.38, baseStep: 0.011, randomRange: 0.14, min: 6.35, max: 6.9, decimals: 2 },
          B,
          6.63,
          trackHistory
        );
        const f1 = 6;
        const df = isStandard ? 4 : 3 + R % 5 * 0.5;
        const f2 = Math.round((f1 + df) * 100) / 100;
        const ek1 = 0.66;
        const ek2 = Math.round((ek1 + hExp34 * 1e-34 * df * 1e14 / 1e-19) * 100) / 100;
        const hCalc = calculatePlanckFromTwoPoints(f1 * 1e14, ek1 * 1e-19, f2 * 1e14, ek2 * 1e-19);
        const ansH34 = Math.round(hCalc / 1e-34 * 100) / 100;
        return {
          id: `q_19_2_3_Q1_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 1,
          totalInTopic,
          generatedParam: hExp34,
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C",
          title: `\u0E2B\u0E32\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E01\u0E23\u0E32\u0E1F Ek,max\u2013f ${titleSuffix}`,
          problemText: `\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E40\u0E02\u0E35\u0E22\u0E19\u0E01\u0E23\u0E32\u0E1F\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (\\(E_{k,\\max}\\)) \u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 (\\(f\\)) \u0E44\u0E14\u0E49\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E08\u0E38\u0E14 \\((f_1 = ${f1.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k1} = ${ek1.toFixed(2)} \\times 10^{-19} \\text{ J})\\) \u0E41\u0E25\u0E30\u0E08\u0E38\u0E14 \\((f_2 = ${f2.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k2} = ${ek2.toFixed(2)} \\times 10^{-19} \\text{ J})\\) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E19\u0E35\u0E49 (\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E0D\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{-34} \\text{ J}\\cdot\\text{s}\\))`,
          unit: "\xD7 10\u207B\xB3\u2074 J\xB7s",
          correctAnswer: ansH34,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E01\u0E23\u0E32\u0E1F**: \u0E08\u0E32\u0E01\u0E2A\u0E21\u0E01\u0E32\u0E23 \\(E_{k,\\max} = hf - W\\) \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F \\(E_{k,\\max}\\) \u0E01\u0E31\u0E1A \\(f\\) \u0E21\u0E35\u0E04\u0E48\u0E32\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C \\(h\\)`,
            `**\u0E2A\u0E39\u0E15\u0E23\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19**: \\(h = \\frac{\\Delta E_{k,\\max}}{\\Delta f} = \\frac{E_{k2} - E_{k1}}{f_2 - f_1}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32: \\(h = \\frac{(${ek2.toFixed(2)} - ${ek1.toFixed(2)}) \\times 10^{-19}}{(${f2.toFixed(2)} - ${f1.toFixed(2)}) \\times 10^{14}} = \\frac{${(ek2 - ek1).toFixed(2)} \\times 10^{-19}}{${df.toFixed(2)} \\times 10^{14}}\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E44\u0E14\u0E49: \\(h = ${ansH34.toFixed(2)} \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansH34.toFixed(2)} \xD7 10\u207B\xB3\u2074 J\xB7s** (\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A: **${ansH34.toFixed(2)}**)`
          ]
        };
      }
      if (subType === 2) {
        const f0Coeff = isStandard ? 10.4 : this._generateUniqueParam(
          "19.2.3_Q2",
          R,
          { baseMin: 4.8, baseStep: 0.21, randomRange: 1.5, min: 4.5, max: 14, decimals: 2 },
          B,
          10.4,
          trackHistory
        );
        const wRes = calculateWorkFunctionFromThresholdFrequency(f0Coeff * 1e14);
        const ansW = Math.round(wRes.electronVolts * 100) / 100;
        return {
          id: `q_19_2_3_Q2_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 2,
          totalInTopic,
          generatedParam: f0Coeff,
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C",
          title: `\u0E2B\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E08\u0E32\u0E01\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F Vs\u2013f ${titleSuffix}`,
          problemText: `\u0E01\u0E23\u0E32\u0E1F\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (\\(V_s\\)) \u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 (\\(f\\)) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E21\u0E35\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E19\u0E2D\u0E19 (\u0E41\u0E01\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48) \u0E17\u0E35\u0E48 \\(f_0 = ${f0Coeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (\\(W\\)) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{eV}\\)`,
          unit: "eV",
          correctAnswer: ansW,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E01\u0E23\u0E32\u0E1F**: \u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E19\u0E2D\u0E19\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F \\(V_s\\)\u2013\\(f\\) \u0E04\u0E37\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \\(f_0\\) \u0E0B\u0E36\u0E48\u0E07\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E01\u0E31\u0E1A\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E15\u0E32\u0E21\u0E2A\u0E21\u0E01\u0E32\u0E23 \\(W = hf_0\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E08\u0E39\u0E25: \\(W = (6.626 \\times 10^{-34})(${f0Coeff.toFixed(2)} \\times 10^{14}) = ${formatLatexScientific(wRes.joules)} \\text{ J}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C: \\(W = \\frac{${formatLatexScientific(wRes.joules)}}{1.602 \\times 10^{-19}} = ${ansW.toFixed(2)} \\text{ eV}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${ansW.toFixed(2)} eV**`
          ]
        };
      }
      if (subType === 3) {
        const conceptPool = [
          {
            key: "iv-intensity",
            prompt: "\u0E43\u0E19\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E04\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(f > f_0\\)) \u0E41\u0E25\u0E49\u0E27<strong>\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E40\u0E1B\u0E47\u0E19 2 \u0E40\u0E17\u0E48\u0E32</strong> \u0E01\u0E23\u0E32\u0E1F\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 (\\(I\\)) \u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C (\\(\\Delta V\\)) \u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23?",
            correct: "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (I_sat) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E41\u0E15\u0E48\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E21\u0E35\u0E04\u0E48\u0E32\u0E04\u0E07\u0E40\u0E14\u0E34\u0E21",
            distractors: [
              "\u0E17\u0E31\u0E49\u0E07\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (I_sat) \u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (|V_s|) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1B\u0E47\u0E19 2 \u0E40\u0E17\u0E48\u0E32",
              "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (I_sat) \u0E04\u0E07\u0E40\u0E14\u0E34\u0E21 \u0E41\u0E15\u0E48\u0E02\u0E19\u0E32\u0E14\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (|V_s|) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1B\u0E47\u0E19 2 \u0E40\u0E17\u0E48\u0E32",
              "\u0E17\u0E31\u0E49\u0E07\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (I_sat) \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E21\u0E35\u0E04\u0E48\u0E32\u0E04\u0E07\u0E40\u0E14\u0E34\u0E21\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07"
            ],
            steps: [
              "\u0E01\u0E32\u0E23\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E04\u0E07\u0E17\u0E35\u0E48 \u0E04\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E40\u0E1E\u0E34\u0E48\u0E21 <strong>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E15\u0E48\u0E2D\u0E27\u0E34\u0E19\u0E32\u0E17\u0E35</strong> \u0E08\u0E36\u0E07\u0E1B\u0E25\u0E14\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19 \u0E2A\u0E48\u0E07\u0E1C\u0E25\u0E43\u0E2B\u0E49\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 \\(I_{\\text{sat}}\\) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19",
              "\u0E41\u0E15\u0E48\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E41\u0E15\u0E48\u0E25\u0E30\u0E15\u0E31\u0E27 (\\(E = hf\\)) \u0E22\u0E31\u0E07\u0E04\u0E07\u0E40\u0E17\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21 \u0E14\u0E31\u0E07\u0E19\u0E31\u0E49\u0E19 \\(E_{k,\\max} = hf - W\\) \u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 \\(V_s\\) \u0E08\u0E36\u0E07 <strong>\u0E04\u0E07\u0E40\u0E14\u0E34\u0E21</strong>"
            ]
          },
          {
            key: "iv-frequency",
            prompt: "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21<strong>\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07</strong>\u0E43\u0E2B\u0E49\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19 (\u0E42\u0E14\u0E22\u0E23\u0E31\u0E01\u0E29\u0E32\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E04\u0E07\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30 \\(f > f_0\\)) \u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E19\u0E2D\u0E19 (\\(-V_s\\)) \u0E1A\u0E19\u0E01\u0E23\u0E32\u0E1F \\(I\\)\u2013\\(\\Delta V\\) \u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23?",
            correct: "\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 -V_s \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E1B\u0E17\u0E32\u0E07\u0E0B\u0E49\u0E32\u0E22\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19 (\u0E02\u0E19\u0E32\u0E14 |V_s| \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19) \u0E40\u0E1E\u0E23\u0E32\u0E30 E_{k,max} \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19",
            distractors: [
              "\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 -V_s \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E40\u0E02\u0E49\u0E32\u0E43\u0E01\u0E25\u0E49\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19 (\u0E02\u0E19\u0E32\u0E14 |V_s| \u0E25\u0E14\u0E25\u0E07)",
              "\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 -V_s \u0E2D\u0E22\u0E39\u0E48\u0E17\u0E35\u0E48\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E40\u0E14\u0E34\u0E21\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E02\u0E36\u0E49\u0E19\u0E01\u0E31\u0E1A\u0E0A\u0E19\u0E34\u0E14\u0E42\u0E25\u0E2B\u0E30\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19",
              "\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 -V_s \u0E2B\u0E32\u0E22\u0E44\u0E1B\u0E41\u0E25\u0E30\u0E01\u0E23\u0E32\u0E1F\u0E15\u0E31\u0E14\u0E1C\u0E48\u0E32\u0E19\u0E08\u0E38\u0E14\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14 (0, 0)"
            ],
            steps: [
              "\u0E08\u0E32\u0E01\u0E2A\u0E21\u0E01\u0E32\u0E23 \\(eV_s = hf - W\\) \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f\\) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 \\(E_{k,\\max}\\) \u0E08\u0E30\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19",
              "\u0E08\u0E36\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E19\u0E48\u0E27\u0E07 (\\(|V_s|\\)) \u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2B\u0E22\u0E38\u0E14\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 \u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 \\(-V_s\\) \u0E08\u0E36\u0E07\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E1B\u0E17\u0E32\u0E07\u0E0B\u0E49\u0E32\u0E22\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19"
            ]
          },
          {
            key: "ekf-slope",
            prompt: "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E19\u0E33\u0E42\u0E25\u0E2B\u0E30 3 \u0E0A\u0E19\u0E34\u0E14\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19 (\u0E40\u0E0A\u0E48\u0E19 Cs, Na, Zn) \u0E21\u0E32\u0E40\u0E02\u0E35\u0E22\u0E19\u0E01\u0E23\u0E32\u0E1F\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 \\(E_{k,\\max}\\) \u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 \\(f\\) \u0E1A\u0E19\u0E41\u0E01\u0E19\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19 \u0E40\u0E2A\u0E49\u0E19\u0E01\u0E23\u0E32\u0E1F\u0E17\u0E31\u0E49\u0E07 3 \u0E40\u0E2A\u0E49\u0E19\u0E21\u0E35\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23?",
            correct: "\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E02\u0E19\u0E32\u0E19\u0E01\u0E31\u0E19\u0E17\u0E38\u0E01\u0E40\u0E2A\u0E49\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C (h) \u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19\u0E17\u0E38\u0E01\u0E42\u0E25\u0E2B\u0E30",
            distractors: [
              "\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E15\u0E31\u0E14\u0E01\u0E31\u0E19\u0E17\u0E35\u0E48\u0E08\u0E38\u0E14\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14 (0, 0) \u0E41\u0E15\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E44\u0E21\u0E48\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19\u0E15\u0E32\u0E21\u0E04\u0E48\u0E32 W",
              "\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 W \u0E21\u0E32\u0E01 \u0E08\u0E30\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E01\u0E23\u0E32\u0E1F\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E35\u0E48\u0E21\u0E35 W \u0E19\u0E49\u0E2D\u0E22",
              "\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E42\u0E04\u0E49\u0E07\u0E1E\u0E32\u0E23\u0E32\u0E42\u0E1A\u0E25\u0E32\u0E17\u0E35\u0E48\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19\u0E15\u0E32\u0E21\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07"
            ],
            steps: [
              "\u0E08\u0E32\u0E01\u0E2A\u0E21\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07 \\(E_{k,\\max} = hf - W\\) \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E04\u0E37\u0E2D \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) \u0E0B\u0E36\u0E48\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E2A\u0E32\u0E01\u0E25 \u0E44\u0E21\u0E48\u0E02\u0E36\u0E49\u0E19\u0E01\u0E31\u0E1A\u0E0A\u0E19\u0E34\u0E14\u0E42\u0E25\u0E2B\u0E30",
              "\u0E14\u0E31\u0E07\u0E19\u0E31\u0E49\u0E19\u0E01\u0E23\u0E32\u0E1F\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E38\u0E01\u0E0A\u0E19\u0E34\u0E14\u0E08\u0E36\u0E07\u0E02\u0E19\u0E32\u0E19\u0E01\u0E31\u0E19 \u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E19\u0E2D\u0E19 (\\(f_0\\)) \u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E15\u0E31\u0E49\u0E07 (\\(-W\\))"
            ]
          },
          {
            key: "vsf-slope",
            prompt: "\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07<strong>\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (\\(V_s\\))</strong> \u0E01\u0E31\u0E1A<strong>\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 (\\(f\\))</strong> \u0E21\u0E35\u0E04\u0E48\u0E32\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E43\u0E14?",
            correct: "\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E2A\u0E48\u0E27\u0E19 h / e (\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22\u0E1B\u0E23\u0E30\u0E08\u0E38\u0E02\u0E2D\u0E07\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19)",
            distractors: [
              "\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C h \u0E40\u0E1E\u0E35\u0E22\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27",
              "\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 W \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E41\u0E04\u0E42\u0E17\u0E14",
              "\u0E1C\u0E25\u0E04\u0E39\u0E13 h \xD7 e (\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C\u0E04\u0E39\u0E13\u0E14\u0E49\u0E27\u0E22\u0E1B\u0E23\u0E30\u0E08\u0E38\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19)"
            ],
            steps: [
              "\u0E08\u0E32\u0E01\u0E2A\u0E21\u0E01\u0E32\u0E23 \\(eV_s = hf - W\\) \u0E2B\u0E32\u0E23\u0E15\u0E25\u0E2D\u0E14\u0E14\u0E49\u0E27\u0E22 \\(e\\) \u0E08\u0E30\u0E44\u0E14\u0E49 \\(V_s = \\left(\\frac{h}{e}\\right)f - \\frac{W}{e}\\)",
              "\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07 \\(y = mx + c\\) \u0E08\u0E36\u0E07\u0E44\u0E14\u0E49\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19 \\(m = \\frac{h}{e} \\approx 4.14 \\times 10^{-15} \\text{ V}\\cdot\\text{s}\\)"
            ]
          },
          {
            key: "wave-failure",
            prompt: "\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E17\u0E35\u0E48 <strong>\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E44\u0E14\u0E49</strong>?",
            correct: "\u0E2B\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 f\u2080 \u0E08\u0E30\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E40\u0E25\u0E22 \u0E41\u0E21\u0E49\u0E08\u0E30\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E2A\u0E39\u0E07\u0E21\u0E32\u0E01\u0E01\u0E47\u0E15\u0E32\u0E21",
            distractors: [
              "\u0E41\u0E2A\u0E07\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E41\u0E17\u0E23\u0E01\u0E2A\u0E2D\u0E14\u0E41\u0E25\u0E30\u0E40\u0E25\u0E35\u0E49\u0E22\u0E27\u0E40\u0E1A\u0E19\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E25\u0E34\u0E15\u0E04\u0E39\u0E48\u0E44\u0E14\u0E49",
              "\u0E41\u0E2A\u0E07\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E14\u0E49\u0E27\u0E22\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E04\u0E07\u0E17\u0E35\u0E48 3.00 \xD7 10\u2078 m/s",
              "\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E43\u0E19\u0E2B\u0E25\u0E2D\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E44\u0E14\u0E49"
            ],
            steps: [
              "\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E17\u0E33\u0E19\u0E32\u0E22\u0E27\u0E48\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E36\u0E49\u0E19\u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21 (\u0E41\u0E2D\u0E21\u0E1E\u0E25\u0E34\u0E08\u0E39\u0E14) \u0E2B\u0E32\u0E01\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E2A\u0E39\u0E07\u0E1E\u0E2D\u0E01\u0E47\u0E04\u0E27\u0E23\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E2B\u0E25\u0E38\u0E14\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48",
              "\u0E41\u0E15\u0E48\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E08\u0E23\u0E34\u0E07\u0E1E\u0E1A\u0E27\u0E48\u0E32\u0E21\u0E35 <strong>\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 \\(f_0\\)</strong> \u0E17\u0E35\u0E48\u0E2B\u0E32\u0E01 \\(f < f_0\\) \u0E08\u0E30\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E40\u0E25\u0E22 \u0E0B\u0E36\u0E48\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C"
            ]
          },
          {
            key: "photocell-door",
            prompt: "\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49<strong>\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 (Photocell)</strong> \u0E40\u0E1B\u0E47\u0E19\u0E40\u0E0B\u0E19\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35\u0E04\u0E19\u0E40\u0E14\u0E34\u0E19\u0E1C\u0E48\u0E32\u0E19\u0E15\u0E31\u0E14\u0E25\u0E33\u0E41\u0E2A\u0E07 \u0E40\u0E2B\u0E15\u0E38\u0E43\u0E14\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E08\u0E36\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E2D\u0E2D\u0E01\u0E17\u0E31\u0E19\u0E17\u0E35?",
            correct: "\u0E25\u0E33\u0E41\u0E2A\u0E07\u0E16\u0E39\u0E01\u0E1A\u0E31\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E25\u0E14\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E28\u0E39\u0E19\u0E22\u0E4C \u0E27\u0E07\u0E08\u0E23\u0E23\u0E35\u0E40\u0E25\u0E22\u0E4C\u0E08\u0E36\u0E07\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E2A\u0E31\u0E48\u0E07\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E23\u0E30\u0E15\u0E39",
            distractors: [
              "\u0E23\u0E48\u0E32\u0E07\u0E01\u0E32\u0E22\u0E04\u0E19\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E01\u0E21\u0E21\u0E32\u0E44\u0E1B\u0E01\u0E23\u0E30\u0E15\u0E38\u0E49\u0E19\u0E43\u0E2B\u0E49\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E1E\u0E38\u0E48\u0E07\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19",
              "\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E2A\u0E07\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2A\u0E31\u0E49\u0E19\u0E25\u0E07\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E15\u0E31\u0E27\u0E04\u0E19\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E28\u0E39\u0E19\u0E22\u0E4C",
              "\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E43\u0E19\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E25\u0E14\u0E25\u0E07\u0E08\u0E19\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E16\u0E39\u0E01\u0E1A\u0E31\u0E07\u0E41\u0E2A\u0E07"
            ],
            steps: [
              "\u0E43\u0E19\u0E20\u0E32\u0E27\u0E30\u0E1B\u0E01\u0E15\u0E34 \u0E25\u0E33\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35 \\(f > f_0\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E21\u0E35\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E44\u0E2B\u0E25\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E27\u0E07\u0E08\u0E23\u0E23\u0E35\u0E40\u0E25\u0E22\u0E4C\u0E15\u0E25\u0E2D\u0E14\u0E40\u0E27\u0E25\u0E32",
              "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E19\u0E40\u0E14\u0E34\u0E19\u0E1A\u0E31\u0E07\u0E25\u0E33\u0E41\u0E2A\u0E07 \u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E08\u0E30\u0E2B\u0E22\u0E38\u0E14\u0E44\u0E2B\u0E25\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E27\u0E07\u0E08\u0E23\u0E23\u0E35\u0E40\u0E25\u0E22\u0E4C\u0E08\u0E36\u0E07\u0E2A\u0E31\u0E48\u0E07\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34"
            ]
          },
          {
            key: "instant-emission",
            prompt: "\u0E40\u0E2B\u0E15\u0E38\u0E43\u0E14\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(f > f_0\\)) \u0E41\u0E21\u0E49\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E08\u0E30\u0E15\u0E48\u0E33\u0E21\u0E32\u0E01 \u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E36\u0E07\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E44\u0E14\u0E49<strong>\u0E40\u0E01\u0E37\u0E2D\u0E1A\u0E08\u0E30\u0E17\u0E31\u0E19\u0E17\u0E35</strong> (\\(< 10^{-9}\\text{ s}\\))?",
            correct: "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04\u0E16\u0E48\u0E32\u0E22\u0E42\u0E2D\u0E19\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E17\u0E31\u0E49\u0E07\u0E01\u0E49\u0E2D\u0E19 (hf) \u0E43\u0E2B\u0E49\u0E41\u0E01\u0E48\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 1 \u0E15\u0E31\u0E27\u0E17\u0E31\u0E19\u0E17\u0E35\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E2D\u0E2A\u0E30\u0E2A\u0E21\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19",
            distractors: [
              "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E43\u0E19\u0E42\u0E25\u0E2B\u0E30\u0E16\u0E39\u0E01\u0E40\u0E23\u0E48\u0E07\u0E14\u0E49\u0E27\u0E22\u0E2A\u0E19\u0E32\u0E21\u0E42\u0E19\u0E49\u0E21\u0E16\u0E48\u0E27\u0E07\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E01\u0E48\u0E2D\u0E19\u0E41\u0E25\u0E49\u0E27",
              "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E15\u0E48\u0E33\u0E08\u0E30\u0E41\u0E1C\u0E48\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E01\u0E23\u0E30\u0E08\u0E32\u0E22\u0E17\u0E31\u0E48\u0E27\u0E17\u0E31\u0E49\u0E07\u0E41\u0E1C\u0E48\u0E19\u0E42\u0E25\u0E2B\u0E30\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E01\u0E31\u0E19",
              "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E2B\u0E25\u0E2D\u0E14\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E21\u0E35\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34\u0E2A\u0E39\u0E07\u0E21\u0E32\u0E01\u0E08\u0E19\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E14\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01\u0E21\u0E32\u0E40\u0E2D\u0E07"
            ],
            steps: [
              "\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E27\u0E48\u0E32\u0E41\u0E2A\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E49\u0E2D\u0E19 \\(E = hf\\)",
              "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E15\u0E31\u0E27\u0E0A\u0E19\u0E01\u0E31\u0E1A\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 1 \u0E15\u0E31\u0E27\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D (\\(hf \\ge W\\)) \u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E30\u0E14\u0E39\u0E14\u0E01\u0E25\u0E37\u0E19\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E2B\u0E19\u0E48\u0E27\u0E07"
            ]
          },
          {
            key: "metal-compare",
            prompt: "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (Cs = 2.1 eV) \u0E41\u0E25\u0E30\u0E2A\u0E31\u0E07\u0E01\u0E30\u0E2A\u0E35 (Zn = 4.3 eV) \u0E2B\u0E32\u0E01\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19 (\\(E = 5.0\\text{ eV}\\)) \u0E25\u0E07\u0E1A\u0E19\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07 \u0E02\u0E49\u0E2D\u0E43\u0E14\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07?",
            correct: "\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E32\u0E01\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (Cs) \u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E08\u0E32\u0E01\u0E2A\u0E31\u0E07\u0E01\u0E30\u0E2A\u0E35 (Zn)",
            distractors: [
              "\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E32\u0E01\u0E2A\u0E31\u0E07\u0E01\u0E30\u0E2A\u0E35 (Zn) \u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E08\u0E32\u0E01\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (Cs)",
              "\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E43\u0E2B\u0E49\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E43\u0E0A\u0E49\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19",
              "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E41\u0E2A\u0E07\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E1C\u0E25\u0E23\u0E27\u0E21\u0E02\u0E2D\u0E07\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19"
            ],
            steps: [
              "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21: \\(E_{k,\\max}(\\text{Cs}) = 5.0 - 2.1 = 2.9 \\text{ eV}\\) (\\(V_s = 2.9 \\text{ V}\\))",
              "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E31\u0E07\u0E01\u0E30\u0E2A\u0E35: \\(E_{k,\\max}(\\text{Zn}) = 5.0 - 4.3 = 0.7 \\text{ eV}\\) (\\(V_s = 0.7 \\text{ V}\\)) \u0E14\u0E31\u0E07\u0E19\u0E31\u0E49\u0E19 Cs \u0E08\u0E36\u0E07\u0E21\u0E35 \\(E_{k,\\max}\\) \u0E41\u0E25\u0E30 \\(V_s\\) \u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32"
            ]
          }
        ];
        const chosen = isStandard ? conceptPool[0] : this._generateUniqueChoice("19.2.3_Q3", R, conceptPool, B, "iv-intensity", (c) => c.key, trackHistory);
        const rawOptions = [
          { text: chosen.correct, isCorrect: true },
          ...chosen.distractors.map((d) => ({ text: d, isCorrect: false }))
        ];
        const shuffled = isStandard ? rawOptions : getSeededShuffle(R, 19233 + qIndex, rawOptions, B);
        const correctChoiceIndex = shuffled.findIndex((o) => o.isCorrect);
        return {
          id: `q_19_2_3_Q3_${qIndex}_${B}`,
          type: "choice",
          questionNumber: 3,
          totalInTopic,
          generatedParam: chosen.key,
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C",
          title: `\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F\u0E41\u0E25\u0E30\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 ${titleSuffix}`,
          problemText: chosen.prompt,
          choices: shuffled.map((o) => o.text),
          correctChoiceIndex,
          solutionSteps: chosen.steps
        };
      }
      if (subType === 4) {
        const metal2 = getMetalById("zn");
        const targetVs = isStandard ? 1.2 : this._generateUniqueParam(
          "19.2.3_Q4",
          R,
          { baseMin: 0.55, baseStep: 0.055, randomRange: 0.55, min: 0.5, max: 3.2, decimals: 2 },
          B,
          1.2,
          trackHistory
        );
        const res = calculateWavelengthForStoppingPotential(metal2.workFunctionEV, targetVs);
        const ansNm = Math.round(res.nm * 10) / 10;
        return {
          id: `q_19_2_3_Q4_${qIndex}_${B}`,
          type: "numeric",
          questionNumber: 4,
          totalInTopic,
          generatedParam: targetVs,
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C",
          title: `\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E2A\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E44\u0E14\u0E49\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E15\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 ${titleSuffix}`,
          problemText: `\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E1A\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E2A\u0E31\u0E07\u0E01\u0E30\u0E2A\u0E35 (\\(W = 4.30 \\text{ eV}\\)) \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 \\(V_s = ${targetVs.toFixed(2)} \\text{ V}\\) \u0E08\u0E30\u0E15\u0E49\u0E2D\u0E07\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 (\\(\\lambda\\)) \u0E40\u0E17\u0E48\u0E32\u0E43\u0E14\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E32\u0E42\u0E19\u0E40\u0E21\u0E15\u0E23 (\\(\\text{nm}\\))`,
          unit: "nm",
          correctAnswer: ansNm,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(\\frac{hc}{\\lambda} = W + eV_s \\rightarrow \\lambda = \\frac{hc}{W + eV_s}\\)`,
            `\u0E2B\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23: \\(E = 4.30 + ${targetVs.toFixed(2)} = ${res.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
            `\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E39\u0E25: \\(E = (${res.photonEnergyEV.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(electronVoltsToJoules(res.photonEnergyEV))} \\text{ J}\\)`,
            `\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19: \\(\\lambda = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${formatLatexScientific(electronVoltsToJoules(res.photonEnergyEV))}} = ${ansNm.toFixed(1)} \\text{ nm}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 **${ansNm.toFixed(1)} nm**`
          ]
        };
      }
      const metal = getMetalById("cs");
      const lambdaNm = isStandard ? 450 : this._generateUniqueParam(
        "19.2.3_Q5",
        R,
        { baseMin: 260, baseStep: 5.8, randomRange: 65, min: 250, max: 525, decimals: 0 },
        B,
        450,
        trackHistory
      );
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: lambdaNm,
        workFunctionEV: metal.workFunctionEV
      });
      const ansLambda0 = Math.round(solved.thresholdWavelengthNm * 10) / 10;
      const ansEkEV = Math.round(solved.ekMaxEV * 100) / 100;
      return {
        id: `q_19_2_3_Q5_${qIndex}_${B}`,
        type: "multi-numeric",
        questionNumber: 5,
        totalInTopic,
        generatedParam: lambdaNm,
        topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C",
        title: `\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E43\u0E19\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 ${titleSuffix}`,
        problemText: `\u0E40\u0E0B\u0E19\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E43\u0E0A\u0E49\u0E41\u0E04\u0E42\u0E17\u0E14\u0E42\u0E25\u0E2B\u0E30\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (\\(W = 2.10 \\text{ eV}\\)) \u0E23\u0E31\u0E1A\u0E25\u0E33\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaNm} \\text{ nm}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13 1) \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (\\(\\lambda_0\\)) \u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E17\u0E33\u0E07\u0E32\u0E19\u0E44\u0E14\u0E49 \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{nm}\\) \u0E41\u0E25\u0E30 2) \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (\\(E_{k,\\max}\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{eV}\\)`,
        unit: "nm / eV",
        correctAnswer: ansLambda0,
        correctAnswers: [ansLambda0, ansEkEV],
        tolerance: 0.03,
        inputs: [
          {
            id: "lambda0",
            label: "\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\u03BB\u2080)",
            unit: "nm",
            correctAnswer: ansLambda0,
            tolerance: 0.03
          },
          {
            id: "ekmaxEV",
            label: "\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (Ek,max)",
            unit: "eV",
            correctAnswer: ansEkEV,
            tolerance: 0.03
          }
        ],
        solutionSteps: [
          `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(\\lambda_0 = \\frac{hc}{W}\\) \u0E41\u0E25\u0E30 \\(E_{k,\\max} = \\frac{hc}{\\lambda} - W\\)`,
          `1) \u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E02\u0E2D\u0E07\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21: \\(\\lambda_0 = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{(2.10)(1.602 \\times 10^{-19})} = ${ansLambda0.toFixed(1)} \\text{ nm}\\)`,
          `2) \u0E2B\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48 \\(\\lambda = ${lambdaNm} \\text{ nm}\\): \\(E = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
          `\u0E08\u0E30\u0E44\u0E14\u0E49\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14: \\(E_{k,\\max} = ${solved.photonEnergyEV.toFixed(2)} - 2.10 = ${ansEkEV.toFixed(2)} \\text{ eV}\\)`,
          `**\u0E15\u0E2D\u0E1A**: \\(\\lambda_0 =\\) **${ansLambda0.toFixed(1)} nm** \u0E41\u0E25\u0E30 \\(E_{k,\\max} =\\) **${ansEkEV.toFixed(2)} eV**`
        ]
      };
    }
    /**
     * Evaluate student answer for current question (supports numeric & multi-numeric)
     */
    evaluateAnswer(studentAnswer) {
      if (!this.currentQuestion) {
        return { isCorrect: false, message: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19" };
      }
      if (this.currentQuestion.type === "multi-numeric" || Array.isArray(studentAnswer)) {
        return this.evaluateMultiAnswer(Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]);
      }
      const evalResult = validateNumericAnswer(
        studentAnswer,
        this.currentQuestion.correctAnswer,
        this.currentQuestion.tolerance
      );
      this.scoreHistory.push({
        questionId: this.currentQuestion.id,
        topic: this.currentQuestion.topic,
        isCorrect: evalResult.isCorrect,
        userAnswer: evalResult.userVal,
        correctAnswer: evalResult.correctVal,
        relativeErrorPercent: evalResult.relativeErrorPercent,
        timestamp: Date.now()
      });
      return evalResult;
    }
    /**
     * Evaluate 2-part multi-numeric answers
     */
    evaluateMultiAnswer(studentAnswers = []) {
      if (!this.currentQuestion || !Array.isArray(this.currentQuestion.inputs)) {
        return { isCorrect: false, results: [], message: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E2B\u0E25\u0E32\u0E22\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E43\u0E19\u0E02\u0E13\u0E30\u0E19\u0E35\u0E49" };
      }
      const results = this.currentQuestion.inputs.map((inputSpec, idx) => {
        const rawAns = studentAnswers[idx];
        const evalRes = validateNumericAnswer(
          rawAns,
          inputSpec.correctAnswer,
          inputSpec.tolerance ?? this.currentQuestion.tolerance
        );
        return {
          id: inputSpec.id,
          label: inputSpec.label,
          unit: inputSpec.unit || this.currentQuestion.unit || "",
          ...evalRes
        };
      });
      const isCorrect = results.every((r) => r.isCorrect);
      this.scoreHistory.push({
        questionId: this.currentQuestion.id,
        topic: this.currentQuestion.topic,
        isCorrect,
        userAnswer: results.map((r) => r.userVal),
        correctAnswer: results.map((r) => r.correctVal),
        relativeErrorPercent: Math.max(...results.map((r) => r.relativeErrorPercent)),
        timestamp: Date.now()
      });
      return {
        isCorrect,
        results,
        message: isCorrect ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E04\u0E33\u0E15\u0E2D\u0E1A!" : "\u0E22\u0E31\u0E07\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E1A\u0E32\u0E07\u0E0A\u0E48\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
      };
    }
  };

  // src/adapters/ui/quiz-ui.js
  var QuizUIAdapter = class {
    constructor() {
      this.quizManager = new QuizManager(1);
      this.currentTopic = "19.2.1";
      this.currentMode = "standard";
      this.currentQuestion = null;
      this.questionIndex = 0;
      this.init();
    }
    init() {
      if (typeof document === "undefined") return;
      if (typeof window !== "undefined") {
        window.currentPracticeTopic = this.currentTopic;
        window.startPracticeMode = (topic) => this.startPracticeMode(topic);
        window.regeneratePractice = () => this.nextQuestion();
        window.checkPracticeAnswer = () => this.checkNumericAnswer();
        window.checkPracticeChoice = (cIdx) => this.checkChoiceAnswer(cIdx);
      }
      const rollInput = document.getElementById("prac-student-roll");
      if (rollInput) {
        rollInput.addEventListener("change", (e) => {
          const roll = parseInt(e.target.value, 10);
          this.quizManager.setRollNumber(roll);
          rollInput.value = String(this.quizManager.rollNumber);
          this.generateQuestion();
        });
      }
      const modeSelect = document.getElementById("prac-mode-select");
      if (modeSelect) {
        modeSelect.value = this.currentMode;
        modeSelect.addEventListener("change", (e) => {
          this.currentMode = e.target.value;
          this.quizManager.setMode(this.currentMode);
          this.generateQuestion();
        });
      }
      const inputVal1 = document.getElementById("prac-input-val1");
      if (inputVal1) {
        inputVal1.addEventListener("keyup", (e) => {
          if (e.key === "Enter") this.checkNumericAnswer();
        });
      }
      const multiInput1 = document.getElementById("prac-multi-input-1");
      const multiInput2 = document.getElementById("prac-multi-input-2");
      if (multiInput1) {
        multiInput1.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            if (multiInput2) multiInput2.focus();
            else this.checkNumericAnswer();
          }
        });
      }
      if (multiInput2) {
        multiInput2.addEventListener("keyup", (e) => {
          if (e.key === "Enter") this.checkNumericAnswer();
        });
      }
      this.startPracticeMode("19.2.1");
    }
    startPracticeMode(topic) {
      this.currentTopic = topic;
      this.questionIndex = 0;
      if (typeof window !== "undefined") window.currentPracticeTopic = topic;
      const topics = ["19.2.1", "19.2.2", "19.2.3"];
      topics.forEach((t) => {
        const btn = document.getElementById(`btn-prac-${t.replace(/\./g, "-")}`);
        if (btn) {
          if (t === topic) {
            btn.className = "p-4 bg-blue-50/50 text-slate-800 rounded-xl border-2 border-blue-500 ring-2 ring-blue-500/20 flex items-center gap-3 transition text-left shadow-md cursor-pointer";
          } else {
            btn.className = "p-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 flex items-center gap-3 transition text-left shadow-sm hover:shadow cursor-pointer";
          }
        }
      });
      this.generateQuestion();
    }
    nextQuestion() {
      this.questionIndex++;
      this.generateQuestion();
    }
    generateQuestion() {
      this.currentQuestion = this.quizManager.generateQuestion(
        this.questionIndex,
        this.currentTopic,
        null,
        this.currentMode
      );
      if (!this.currentQuestion) return;
      const titleEl = document.getElementById("prac-question-title");
      const textEl = document.getElementById("prac-question-text");
      const choiceZone = document.getElementById("prac-choice-zone");
      const numericZone = document.getElementById("prac-numeric-zone");
      const singleInputWrap = document.getElementById("prac-single-input-wrap");
      const multiNumericZone = document.getElementById("prac-multi-numeric-zone");
      const feedbackBox = document.getElementById("prac-feedback");
      const explBox = document.getElementById("prac-explanation-box");
      const inputVal1 = document.getElementById("prac-input-val1");
      const unitBadge1 = document.getElementById("prac-unit-badge-1");
      const multiInput1 = document.getElementById("prac-multi-input-1");
      const multiInput2 = document.getElementById("prac-multi-input-2");
      if (feedbackBox) {
        feedbackBox.classList.add("hidden");
        feedbackBox.innerHTML = "";
      }
      if (explBox) explBox.classList.add("hidden");
      if (inputVal1) inputVal1.value = "";
      if (multiInput1) multiInput1.value = "";
      if (multiInput2) multiInput2.value = "";
      if (titleEl) {
        const seqLabel = this.currentQuestion.questionNumber && this.currentQuestion.totalInTopic ? `\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${this.currentQuestion.questionNumber} / ${this.currentQuestion.totalInTopic}` : "\u0E02\u0E49\u0E2D\u0E04\u0E33\u0E16\u0E32\u0E21";
        titleEl.textContent = `\u{1F4CB} ${seqLabel} (${this.currentQuestion.topic}) - ${this.currentQuestion.title}:`;
      }
      if (textEl) {
        textEl.innerHTML = this.currentQuestion.problemText;
      }
      if (this.currentQuestion.type === "choice") {
        if (choiceZone) choiceZone.classList.remove("hidden");
        if (numericZone) numericZone.classList.add("hidden");
        this.renderChoices();
      } else if (this.currentQuestion.type === "multi-numeric" && Array.isArray(this.currentQuestion.inputs)) {
        if (choiceZone) choiceZone.classList.add("hidden");
        if (numericZone) numericZone.classList.remove("hidden");
        if (singleInputWrap) singleInputWrap.classList.add("hidden");
        if (multiNumericZone) multiNumericZone.classList.remove("hidden");
        const [spec1, spec2] = this.currentQuestion.inputs;
        const lblMulti1 = document.getElementById("lbl-prac-multi-1");
        const unitMulti1 = document.getElementById("prac-multi-unit-1");
        const lblMulti2 = document.getElementById("lbl-prac-multi-2");
        const unitMulti2 = document.getElementById("prac-multi-unit-2");
        if (lblMulti1 && spec1) lblMulti1.textContent = `1) ${spec1.label}:`;
        if (unitMulti1 && spec1) unitMulti1.textContent = spec1.unit || "";
        if (lblMulti2 && spec2) lblMulti2.textContent = `2) ${spec2.label}:`;
        if (unitMulti2 && spec2) unitMulti2.textContent = spec2.unit || "";
      } else {
        if (choiceZone) choiceZone.classList.add("hidden");
        if (numericZone) numericZone.classList.remove("hidden");
        if (singleInputWrap) singleInputWrap.classList.remove("hidden");
        if (multiNumericZone) multiNumericZone.classList.add("hidden");
        const lblInput = document.getElementById("lbl-prac-input-1");
        if (lblInput) {
          lblInput.textContent = `\u0E04\u0E33\u0E15\u0E2D\u0E1A (${this.currentQuestion.unit || "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02"}):`;
        }
        if (unitBadge1) {
          const unitText = this.currentQuestion.unit || "";
          unitBadge1.textContent = unitText;
          unitBadge1.classList.toggle("hidden", !unitText);
        }
      }
      this.renderMathExpressions();
    }
    renderChoices() {
      const choiceZone = document.getElementById("prac-choice-zone");
      if (!choiceZone || !this.currentQuestion.choices) return;
      choiceZone.innerHTML = this.currentQuestion.choices.map(
        (choice, idx) => `
        <button onclick="checkPracticeChoice(${idx})"
          class="prac-choice-btn w-full p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-left font-medium text-sm transition-all flex items-center gap-3 cursor-pointer">
          <span class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
            ${["\u0E01", "\u0E02", "\u0E04", "\u0E07"][idx] || idx + 1}
          </span>
          <span class="choice-text flex-1">${choice}</span>
        </button>
      `
      ).join("");
    }
    checkChoiceAnswer(choiceIdx) {
      if (!this.currentQuestion) return;
      const isCorrect = choiceIdx === this.currentQuestion.correctChoiceIndex;
      this.displayFeedback(
        isCorrect,
        isCorrect ? "\u0E22\u0E2D\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E21\u0E32\u0E01! \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E32\u0E21\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E17\u0E32\u0E07\u0E1F\u0E34\u0E2A\u0E34\u0E01\u0E2A\u0E4C" : "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u0E25\u0E2D\u0E07\u0E28\u0E36\u0E01\u0E29\u0E32\u0E17\u0E1A\u0E17\u0E27\u0E19\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E41\u0E25\u0E30\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E08\u0E32\u0E01\u0E40\u0E09\u0E25\u0E22\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07"
      );
    }
    checkNumericAnswer() {
      if (!this.currentQuestion) return;
      if (this.currentQuestion.type === "multi-numeric" && Array.isArray(this.currentQuestion.inputs)) {
        const input1 = document.getElementById("prac-multi-input-1");
        const input2 = document.getElementById("prac-multi-input-2");
        const val1 = input1 ? input1.value.trim() : "";
        const val2 = input2 ? input2.value.trim() : "";
        if (!val1 || !val2) {
          alert("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E17\u0E31\u0E49\u0E07 2 \u0E0A\u0E48\u0E2D\u0E07\u0E01\u0E48\u0E2D\u0E19\u0E01\u0E14\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A");
          return;
        }
        const evalResult2 = this.quizManager.evaluateMultiAnswer([val1, val2]);
        const lines = evalResult2.results.map((r, idx) => {
          const icon = r.isCorrect ? "\u2705" : "\u274C";
          const detail = r.isCorrect ? `\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13 ${r.userVal} ${r.unit} \u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (Error: ${r.relativeErrorPercent}%)` : `\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E04\u0E37\u0E2D ${r.correctVal} ${r.unit} (${r.message || "\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E40\u0E01\u0E34\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C \xB13%"})`;
          return `<div>${icon} <strong>${idx + 1}) ${r.label}</strong>: ${detail}</div>`;
        });
        this.displayFeedback(evalResult2.isCorrect, lines.join(""));
        return;
      }
      const inputVal1 = document.getElementById("prac-input-val1");
      const userVal = inputVal1 ? inputVal1.value.trim() : "";
      if (!userVal) {
        alert("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E01\u0E14\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A");
        return;
      }
      const evalResult = this.quizManager.evaluateAnswer(userVal);
      const msg = evalResult.isCorrect ? `\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13 (${evalResult.userVal} ${this.currentQuestion.unit || ""}) \u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E32\u0E21\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E04\u0E27\u0E32\u0E21\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19 \xB13% (Error: ${evalResult.relativeErrorPercent}%)` : `\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E04\u0E33\u0E19\u0E27\u0E13\u0E44\u0E14\u0E49\u0E04\u0E37\u0E2D ${this.currentQuestion.correctAnswer} ${this.currentQuestion.unit || ""} (${evalResult.message || "\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E40\u0E01\u0E34\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C \xB13%"})`;
      this.displayFeedback(evalResult.isCorrect, msg);
    }
    formatStepHtml(step) {
      return String(step || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    }
    displayFeedback(isCorrect, message) {
      const feedbackBox = document.getElementById("prac-feedback");
      const explBox = document.getElementById("prac-explanation-box");
      const explText = document.getElementById("prac-explanation-text");
      if (feedbackBox) {
        feedbackBox.classList.remove("hidden");
        if (isCorrect) {
          feedbackBox.className = "p-5 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-900 transition-all shimmer-success";
          feedbackBox.innerHTML = `
          <div class="flex items-center gap-3 font-bold text-base text-emerald-800 mb-1">
            <i class="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
            <span>\u0E22\u0E34\u0E19\u0E14\u0E35\u0E14\u0E49\u0E27\u0E22! \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u{1F389}</span>
          </div>
          <div class="text-xs text-emerald-700 space-y-1">${message}</div>
        `;
        } else {
          feedbackBox.className = "p-5 rounded-2xl border bg-red-50 border-red-200 text-red-900 transition-all";
          feedbackBox.innerHTML = `
          <div class="flex items-center gap-3 font-bold text-base text-red-800 mb-1">
            <i class="fa-solid fa-circle-xmark text-2xl text-red-600"></i>
            <span>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u274C</span>
          </div>
          <div class="text-xs text-red-700 space-y-1">${message}</div>
        `;
        }
      }
      if (explBox && this.currentQuestion.solutionSteps) {
        explBox.classList.remove("hidden");
        if (explText) {
          explText.innerHTML = `
          <ol class="list-decimal pl-5 space-y-2">
            ${this.currentQuestion.solutionSteps.map((step) => `<li class="py-0.5">${this.formatStepHtml(step)}</li>`).join("")}
          </ol>
        `;
        }
      }
      this.renderMathExpressions();
    }
    renderMathExpressions() {
      const container = document.getElementById("sec-practice");
      if (container && !container.classList.contains("hidden")) {
        KaTeXAdapter.renderAllMath(container);
      }
    }
  };

  // src/adapters/storage/local-storage.js
  var LocalStorageAdapter = class {
    static saveExamResult(result) {
      try {
        const key = APP_CONFIG.storageKeys.examResult;
        const serialized = JSON.stringify({
          ...result,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        localStorage.setItem(key, serialized);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to save exam result:", err);
        return false;
      }
    }
    static loadExamResult() {
      try {
        const key = APP_CONFIG.storageKeys.examResult;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to load exam result:", err);
        return null;
      }
    }
    static clearExamResult() {
      try {
        localStorage.removeItem(APP_CONFIG.storageKeys.examResult);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to clear exam result:", err);
        return false;
      }
    }
    static saveExamSession(sessionData) {
      try {
        const key = APP_CONFIG.storageKeys.examSession;
        localStorage.setItem(key, JSON.stringify(sessionData));
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to save exam session:", err);
        return false;
      }
    }
    static loadExamSession() {
      try {
        const key = APP_CONFIG.storageKeys.examSession;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to load exam session:", err);
        return null;
      }
    }
    static clearExamSession() {
      try {
        localStorage.removeItem(APP_CONFIG.storageKeys.examSession);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to clear exam session:", err);
        return false;
      }
    }
    static saveUserPreferences(prefs) {
      try {
        localStorage.setItem(APP_CONFIG.storageKeys.userPreferences, JSON.stringify(prefs));
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to save user preferences:", err);
        return false;
      }
    }
    static loadUserPreferences() {
      try {
        const item = localStorage.getItem(APP_CONFIG.storageKeys.userPreferences);
        return item ? JSON.parse(item) : null;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to load user preferences:", err);
        return null;
      }
    }
  };

  // src/application/exam-manager.js
  var EXAM_STATES = {
    IDLE: "IDLE",
    IN_PROGRESS: "IN_PROGRESS",
    SUBMITTED: "SUBMITTED"
  };
  var ExamManager = class {
    /**
     * @param {number} [rollNumber=1]
     * @param {Object} [storageAdapter=LocalStorageAdapter]
     */
    constructor(rollNumber = 1, storageAdapter = LocalStorageAdapter) {
      this.rollNumber = validateRollNumber(rollNumber);
      this.storage = storageAdapter;
      this.fullName = "";
      this.className = "";
      this.state = EXAM_STATES.IDLE;
      this.durationSeconds = APP_CONFIG.exam.durationMinutes * 60;
      this.timeRemaining = this.durationSeconds;
      this.startTime = null;
      this.endTime = null;
      this.attemptId = null;
      this.attemptSeed = 0;
      this._seedCounter = 0;
      this.questions = [];
      this.userAnswers = {};
      this.tabSwitchCount = 0;
      this.examResult = null;
      this.timerInterval = null;
      this.onTimerTick = null;
      this.onTimeExpired = null;
      this.onAutoSubmitted = null;
      this.onCheatDetected = null;
      this.restoredActiveQuestionIdx = 0;
    }
    setIdentity(fullName, className, rollNumber) {
      this.fullName = String(fullName || "").trim();
      this.className = String(className || "").trim();
      this.rollNumber = validateRollNumber(rollNumber);
    }
    /**
     * Start a new timed exam session
     * @param {number|null} [customSeed=null]
     * @returns {Array<Object>} Generated 5 exam questions
     */
    startExam(customSeed = null) {
      this.state = EXAM_STATES.IN_PROGRESS;
      if (customSeed !== null) {
        this.attemptSeed = customSeed;
      } else {
        this._seedCounter += 1;
        this.attemptSeed = (Date.now() ^ Math.floor(Math.random() * 4294967295) ^ Math.imul(this._seedCounter, 2654435761)) >>> 0;
      }
      this.timeRemaining = this.durationSeconds;
      this.startTime = Date.now();
      this.endTime = this.startTime + this.durationSeconds * 1e3;
      this.attemptId = `u19_2_exam_${this.rollNumber}_${this.attemptSeed}_${this.startTime}`;
      this.tabSwitchCount = 0;
      this.userAnswers = {};
      this.examResult = null;
      this.questions = this._generateExamPaper(this.rollNumber, this.attemptSeed);
      this._saveSessionState(0);
      this._startTimer();
      return this.questions;
    }
    /**
     * Generate 5 balanced IPST 19.2 Photoelectric Effect exam questions (1 Choice + 4 Numeric)
     */
    _generateExamPaper(R, seed) {
      const paper = [];
      const rawChoicePool = [
        {
          questionText: "\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E01\u0E25\u0E48\u0E32\u0E27\u0E16\u0E36\u0E07\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E14\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E15\u0E32\u0E21\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C\u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14?",
          correctText: "\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30 (f \u2265 f\u2080) \u0E08\u0E36\u0E07\u0E08\u0E30\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49",
          distractors: [
            "\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E08\u0E30\u0E43\u0E0A\u0E49\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E43\u0E14 \u0E2B\u0E32\u0E01\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E43\u0E2B\u0E49\u0E2A\u0E39\u0E07\u0E1E\u0E2D\u0E01\u0E47\u0E08\u0E30\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E40\u0E2A\u0E21\u0E2D",
            "\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E15\u0E49\u0E2D\u0E07\u0E22\u0E32\u0E27\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\u03BB > \u03BB\u2080) \u0E08\u0E36\u0E07\u0E08\u0E30\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49",
            "\u0E15\u0E49\u0E2D\u0E07\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E15\u0E48\u0E33\u0E17\u0E34\u0E49\u0E07\u0E44\u0E27\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E27\u0E25\u0E32\u0E19\u0E32\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E04\u0E48\u0E2D\u0E22\u0E46 \u0E2A\u0E30\u0E2A\u0E21\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E19\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01"
          ],
          explanation: "\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E30\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E44\u0E14\u0E49\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E15\u0E31\u0E27\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (hf \u2265 W \u0E2B\u0E23\u0E37\u0E2D f \u2265 f\u2080 \u0E41\u0E25\u0E30 \u03BB \u2264 \u03BB\u2080)"
        },
        {
          questionText: "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E04\u0E07\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (f > f\u2080) \u0E41\u0E25\u0E49\u0E27\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E40\u0E1B\u0E47\u0E19 2 \u0E40\u0E17\u0E48\u0E32 \u0E1C\u0E25\u0E43\u0E14\u0E08\u0E30\u0E40\u0E01\u0E34\u0E14\u0E02\u0E36\u0E49\u0E19?",
          correctText: "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (I_sat) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E41\u0E15\u0E48\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (E_{k,max}) \u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E04\u0E07\u0E40\u0E14\u0E34\u0E21",
          distractors: [
            "\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (E_{k,max}) \u0E41\u0E25\u0E30\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1B\u0E47\u0E19 2 \u0E40\u0E17\u0E48\u0E32",
            "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 (I_sat) \u0E04\u0E07\u0E40\u0E14\u0E34\u0E21 \u0E41\u0E15\u0E48\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19",
            "\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (f\u2080) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E25\u0E14\u0E25\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E04\u0E23\u0E36\u0E48\u0E07\u0E2B\u0E19\u0E36\u0E48\u0E07"
          ],
          explanation: "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E08\u0E33\u0E19\u0E27\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E15\u0E48\u0E2D\u0E27\u0E34\u0E19\u0E32\u0E17\u0E35 \u0E08\u0E36\u0E07\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27 I_sat \u0E41\u0E15\u0E48\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E15\u0E48\u0E2D\u0E42\u0E1F\u0E15\u0E2D\u0E19 (hf) \u0E40\u0E17\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21 \u0E17\u0E33\u0E43\u0E2B\u0E49 E_{k,max} \u0E41\u0E25\u0E30 V_s \u0E04\u0E07\u0E40\u0E14\u0E34\u0E21"
        },
        {
          questionText: "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E43\u0E2B\u0E49\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19 (\u0E42\u0E14\u0E22\u0E23\u0E31\u0E01\u0E29\u0E32\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E04\u0E07\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30 f > f\u2080) \u0E02\u0E49\u0E2D\u0E43\u0E14\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E01\u0E23\u0E32\u0E1F I\u2013\u0394V?",
          correctText: "\u0E02\u0E19\u0E32\u0E14\u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (|V_s|) \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E17\u0E33\u0E43\u0E2B\u0E49\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14 -V_s \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E1B\u0E17\u0E32\u0E07\u0E0B\u0E49\u0E32\u0E22\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19",
          distractors: [
            "\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E25\u0E14\u0E25\u0E07\u0E08\u0E19\u0E40\u0E02\u0E49\u0E32\u0E43\u0E01\u0E25\u0E49\u0E28\u0E39\u0E19\u0E22\u0E4C",
            "\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C (-V_s) \u0E04\u0E07\u0E17\u0E35\u0E48\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E40\u0E14\u0E34\u0E21\u0E15\u0E25\u0E2D\u0E14\u0E40\u0E27\u0E25\u0E32",
            "\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E01\u0E25\u0E32\u0E22\u0E40\u0E1B\u0E47\u0E19\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E17\u0E31\u0E19\u0E17\u0E35\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19"
          ],
          explanation: "\u0E08\u0E32\u0E01 eV_s = hf - W \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 f \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E36\u0E49\u0E19 \u0E08\u0E36\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 |V_s| \u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19"
        },
        {
          questionText: "\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 (E_{k,max}) \u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 (f) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E42\u0E25\u0E2B\u0E30\u0E15\u0E48\u0E32\u0E07\u0E0A\u0E19\u0E34\u0E14\u0E01\u0E31\u0E19\u0E21\u0E35\u0E2A\u0E21\u0E1A\u0E31\u0E15\u0E34\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23?",
          correctText: "\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E02\u0E19\u0E32\u0E19\u0E01\u0E31\u0E19\u0E17\u0E38\u0E01\u0E0A\u0E19\u0E34\u0E14 \u0E42\u0E14\u0E22\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C (h) \u0E40\u0E2A\u0E21\u0E2D",
          distractors: [
            "\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E41\u0E15\u0E01\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E15\u0E32\u0E21\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 W \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E41\u0E15\u0E48\u0E25\u0E30\u0E0A\u0E19\u0E34\u0E14",
            "\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E2A\u0E07 c \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28",
            "\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E21\u0E35\u0E04\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E1A\u0E41\u0E25\u0E30\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E19\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21"
          ],
          explanation: "\u0E08\u0E32\u0E01\u0E2A\u0E21\u0E01\u0E32\u0E23 E_{k,max} = hf - W \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A h = 6.626 \xD7 10\u207B\xB3\u2074 J\xB7s \u0E0B\u0E36\u0E48\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E2A\u0E32\u0E01\u0E25 \u0E01\u0E23\u0E32\u0E1F\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E38\u0E01\u0E0A\u0E19\u0E34\u0E14\u0E08\u0E36\u0E07\u0E02\u0E19\u0E32\u0E19\u0E01\u0E31\u0E19"
        },
        {
          questionText: "\u0E2B\u0E32\u0E01\u0E40\u0E02\u0E35\u0E22\u0E19\u0E01\u0E23\u0E32\u0E1F\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (V_s) \u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07 (f) \u0E41\u0E25\u0E49\u0E27\u0E15\u0E48\u0E2D\u0E40\u0E2A\u0E49\u0E19\u0E1B\u0E23\u0E30\u0E25\u0E07\u0E44\u0E1B\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E15\u0E31\u0E49\u0E07 \u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E15\u0E31\u0E49\u0E07\u0E21\u0E35\u0E04\u0E48\u0E32\u0E40\u0E17\u0E48\u0E32\u0E43\u0E14?",
          correctText: "\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A -W / e (\u0E25\u0E1A\u0E02\u0E2D\u0E07\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22\u0E1B\u0E23\u0E30\u0E08\u0E38\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19)",
          distractors: [
            "\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 f\u2080 \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30",
            "\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C h",
            "\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E28\u0E39\u0E19\u0E22\u0E4C (0 V) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E42\u0E25\u0E2B\u0E30\u0E17\u0E38\u0E01\u0E0A\u0E19\u0E34\u0E14"
          ],
          explanation: "\u0E08\u0E32\u0E01\u0E2A\u0E21\u0E01\u0E32\u0E23 V_s = (h/e)f - W/e \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E41\u0E17\u0E19 f = 0 \u0E08\u0E30\u0E44\u0E14\u0E49\u0E08\u0E38\u0E14\u0E15\u0E31\u0E14\u0E41\u0E01\u0E19\u0E15\u0E31\u0E49\u0E07\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A -W/e \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A h/e"
        },
        {
          questionText: "\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E04\u0E37\u0E2D\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E02\u0E2D\u0E07\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01?",
          correctText: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E44\u0E14\u0E49\u0E27\u0E48\u0E32\u0E40\u0E2B\u0E15\u0E38\u0E43\u0E14\u0E08\u0E36\u0E07\u0E21\u0E35\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 f\u2080 \u0E41\u0E25\u0E30\u0E40\u0E2B\u0E15\u0E38\u0E43\u0E14 E_{k,max} \u0E08\u0E36\u0E07\u0E44\u0E21\u0E48\u0E02\u0E36\u0E49\u0E19\u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07",
          distractors: [
            "\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E17\u0E33\u0E19\u0E32\u0E22\u0E27\u0E48\u0E32\u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28",
            "\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E23\u0E30\u0E1A\u0E38\u0E27\u0E48\u0E32\u0E42\u0E25\u0E2B\u0E30\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E19\u0E33\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E44\u0E14\u0E49\u0E43\u0E19\u0E2B\u0E25\u0E2D\u0E14\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28",
            "\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E01\u0E32\u0E23\u0E41\u0E17\u0E23\u0E01\u0E2A\u0E2D\u0E14\u0E41\u0E25\u0E30\u0E40\u0E25\u0E35\u0E49\u0E22\u0E27\u0E40\u0E1A\u0E19\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E44\u0E14\u0E49"
          ],
          explanation: "\u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E17\u0E32\u0E22\u0E27\u0E48\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E36\u0E49\u0E19\u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07 \u0E44\u0E21\u0E48\u0E04\u0E27\u0E23\u0E21\u0E35 f\u2080 \u0E41\u0E25\u0E30\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E2A\u0E30\u0E2A\u0E21\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19 \u0E0B\u0E36\u0E48\u0E07\u0E02\u0E31\u0E14\u0E41\u0E22\u0E49\u0E07\u0E01\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E17\u0E31\u0E49\u0E07 3 \u0E1B\u0E23\u0E30\u0E40\u0E14\u0E47\u0E19"
        },
        {
          questionText: "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E40\u0E2B\u0E15\u0E38\u0E43\u0E14\u0E08\u0E36\u0E07\u0E19\u0E34\u0E22\u0E21\u0E43\u0E0A\u0E49\u0E42\u0E25\u0E2B\u0E30\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21 (Cs, W = 2.1 eV) \u0E17\u0E33\u0E41\u0E04\u0E42\u0E17\u0E14\u0E43\u0E19\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34?",
          correctText: "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E21\u0E35\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E15\u0E48\u0E33 \u0E08\u0E36\u0E07\u0E15\u0E2D\u0E1A\u0E2A\u0E19\u0E2D\u0E07\u0E15\u0E48\u0E2D\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E15\u0E32\u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19\u0E44\u0E14\u0E49 (\u03BB \u2264 591 nm) \u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E23\u0E31\u0E07\u0E2A\u0E35 UV \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E2A\u0E39\u0E07",
          distractors: [
            "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E21\u0E35\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E2A\u0E39\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E08\u0E36\u0E07\u0E17\u0E19\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14",
            "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E41\u0E21\u0E49\u0E44\u0E21\u0E48\u0E21\u0E35\u0E41\u0E2A\u0E07\u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E40\u0E25\u0E22",
            "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32\u0E17\u0E2D\u0E07\u0E04\u0E33\u0E41\u0E25\u0E30\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07"
          ],
          explanation: "\u0E0B\u0E35\u0E40\u0E0B\u0E35\u0E22\u0E21\u0E21\u0E35 W = 2.1 eV (\u03BB\u2080 \u2248 591 nm) \u0E08\u0E36\u0E07\u0E40\u0E01\u0E34\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E44\u0E14\u0E49\u0E07\u0E48\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E15\u0E32\u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19 \u0E40\u0E0A\u0E48\u0E19 \u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E1F\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E02\u0E35\u0E22\u0E27"
        },
        {
          questionText: "\u0E2B\u0E32\u0E01\u0E15\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E19\u0E48\u0E27\u0E07 \u0394V \u0E17\u0E35\u0E48\u0E21\u0E35\u0E02\u0E19\u0E32\u0E14\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (\u0394V < -V_s) \u0E43\u0E19\u0E2B\u0E25\u0E2D\u0E14\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 \u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E25\u0E38\u0E14\u0E08\u0E32\u0E01\u0E41\u0E04\u0E42\u0E17\u0E14\u0E08\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23?",
          correctText: "\u0E16\u0E39\u0E01\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E2B\u0E19\u0E48\u0E27\u0E07\u0E08\u0E19\u0E2B\u0E22\u0E38\u0E14\u0E01\u0E48\u0E2D\u0E19\u0E16\u0E36\u0E07\u0E41\u0E2D\u0E42\u0E19\u0E14\u0E41\u0E25\u0E49\u0E27\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E41\u0E04\u0E42\u0E17\u0E14 \u0E17\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E43\u0E19\u0E41\u0E2D\u0E21\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E1B\u0E47\u0E19 0 \xB5A",
          distractors: [
            "\u0E16\u0E39\u0E01\u0E40\u0E23\u0E48\u0E07\u0E43\u0E2B\u0E49\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E47\u0E27\u0E02\u0E36\u0E49\u0E19\u0E0A\u0E19\u0E41\u0E2D\u0E42\u0E19\u0E14\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E1E\u0E38\u0E48\u0E07\u0E2A\u0E39\u0E07\u0E40\u0E01\u0E34\u0E19\u0E01\u0E23\u0E30\u0E41\u0E2A\u0E2D\u0E34\u0E48\u0E21\u0E15\u0E31\u0E27",
            "\u0E2B\u0E22\u0E38\u0E14\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30\u0E41\u0E04\u0E42\u0E17\u0E14\u0E17\u0E31\u0E19\u0E17\u0E35\u0E41\u0E21\u0E49\u0E41\u0E2A\u0E07\u0E22\u0E31\u0E07\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E2A\u0E39\u0E07\u0E01\u0E27\u0E48\u0E32 f\u2080",
            "\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E1B\u0E23\u0E30\u0E08\u0E38\u0E40\u0E1B\u0E47\u0E19\u0E1B\u0E23\u0E30\u0E08\u0E38\u0E1A\u0E27\u0E01\u0E41\u0E25\u0E49\u0E27\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E40\u0E02\u0E49\u0E32\u0E2B\u0E32\u0E02\u0E31\u0E49\u0E27\u0E25\u0E1A\u0E02\u0E2D\u0E07\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E08\u0E48\u0E32\u0E22\u0E44\u0E1F"
          ],
          explanation: "\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E22\u0E31\u0E07\u0E04\u0E07\u0E2B\u0E25\u0E38\u0E14\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E41\u0E04\u0E42\u0E17\u0E14\u0E40\u0E21\u0E37\u0E48\u0E2D f \u2265 f\u2080 \u0E41\u0E15\u0E48\u0E40\u0E21\u0E37\u0E48\u0E2D \u0394V \u2264 -V_s \u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E2B\u0E19\u0E48\u0E27\u0E07\u0E08\u0E30\u0E22\u0E31\u0E1A\u0E22\u0E31\u0E49\u0E07\u0E44\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E41\u0E21\u0E49\u0E41\u0E15\u0E48\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E21\u0E35 E_{k,max} \u0E44\u0E1B\u0E16\u0E36\u0E07\u0E41\u0E2D\u0E42\u0E19\u0E14 \u0E01\u0E23\u0E30\u0E41\u0E2A\u0E08\u0E36\u0E07\u0E40\u0E1B\u0E47\u0E19 0"
        }
      ];
      const choicePickIdx = getSeededInt(R, 100, 0, rawChoicePool.length - 1, seed);
      const chosenConcept = rawChoicePool[choicePickIdx];
      const originalChoices = [
        { text: chosenConcept.correctText, isCorrect: true },
        ...chosenConcept.distractors.map((d) => ({ text: d, isCorrect: false }))
      ];
      const shuffledChoices = getSeededShuffle(R, 101, originalChoices, seed);
      const correctIdx = shuffledChoices.findIndex((c) => c.isCorrect);
      paper.push({
        index: 0,
        type: "choice",
        topic: "19.2 \u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01",
        title: "\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 (\u0E1B\u0E23\u0E19\u0E31\u0E22 4 \u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01)",
        score: 2,
        problemText: chosenConcept.questionText,
        choices: shuffledChoices.map((c) => c.text),
        correctChoiceIndex: correctIdx,
        explanation: chosenConcept.explanation
      });
      const q2Variant = getSeededInt(R, 200, 0, 1, seed);
      const q2WorkEV = getDynamicParam(R, 1.95, 0.08, 0.65, { min: 1.9, max: 5.3, decimals: 2 }, seed + 201);
      if (q2Variant === 0) {
        const f0Hz = calculateThresholdFrequency(q2WorkEV);
        const ansF0 = Math.round(f0Hz / 1e14 * 100) / 100;
        paper.push({
          index: 1,
          type: "numeric",
          topic: "19.2.1 \u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21",
          title: "\u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30",
          score: 2,
          problemText: `\u0E42\u0E25\u0E2B\u0E30\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E21\u0E35\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = ${q2WorkEV.toFixed(2)} \\text{ eV}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(f_0\\)) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49 (\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E0D\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{14} \\text{ Hz}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
          unit: "\xD7 10\xB9\u2074 Hz",
          correctAnswer: ansF0,
          tolerance: 0.03,
          explanation: `\\(f_0 = \\frac{W}{h} = \\frac{(${q2WorkEV.toFixed(2)})(1.602 \\times 10^{-19})}{6.626 \\times 10^{-34}} = ${ansF0.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`
        });
      } else {
        const lambda0 = calculateThresholdWavelength(q2WorkEV);
        const ansNm = Math.round(lambda0.nm * 10) / 10;
        paper.push({
          index: 1,
          type: "numeric",
          topic: "19.2.1 \u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21",
          title: "\u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30",
          score: 2,
          problemText: `\u0E42\u0E25\u0E2B\u0E30\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E21\u0E35\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 \\(W = ${q2WorkEV.toFixed(2)} \\text{ eV}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E02\u0E35\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21 (\\(\\lambda_0\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E32\u0E42\u0E19\u0E40\u0E21\u0E15\u0E23 (\\(\\text{nm}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\), \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
          unit: "nm",
          correctAnswer: ansNm,
          tolerance: 0.03,
          explanation: `\\(\\lambda_0 = \\frac{hc}{W} = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{(${q2WorkEV.toFixed(2)})(1.602 \\times 10^{-19})} = ${ansNm.toFixed(1)} \\text{ nm}\\)`
        });
      }
      const q3Metals = ["cs", "k", "na", "ca"];
      const q3Metal = getMetalById(q3Metals[getSeededInt(R, 300, 0, q3Metals.length - 1, seed)]);
      const q3Variant = getSeededInt(R, 301, 0, 1, seed);
      if (q3Variant === 0) {
        const minFreq14 = Math.ceil((q3Metal.thresholdFrequency14 + 1.5) * 10) / 10;
        const freqCoeff = getDynamicParam(R, minFreq14 + 0.5, 0.14, 1.1, { min: minFreq14, max: 17, decimals: 2 }, seed + 302);
        const solved = calculatePhotoelectricEffect({
          frequencyHz: freqCoeff * 1e14,
          workFunctionEV: q3Metal.workFunctionEV
        });
        const ansEk = Math.round(solved.ekMaxEV * 100) / 100;
        paper.push({
          index: 2,
          type: "numeric",
          topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C",
          title: "\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E41\u0E2A\u0E07",
          score: 2,
          problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30${q3Metal.nameTh} (\\(W = ${q3Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (\\(E_{k,\\max}\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{eV}\\)`,
          unit: "eV",
          correctAnswer: ansEk,
          tolerance: 0.03,
          explanation: `\\(E_{k,\\max} = \\frac{hf}{e} - W = ${solved.photonEnergyEV.toFixed(2)} - ${q3Metal.workFunctionEV.toFixed(1)} = ${ansEk.toFixed(2)} \\text{ eV}\\)`
        });
      } else {
        const maxSafeLambda = Math.min(380, Math.floor(q3Metal.thresholdWavelengthNm - 70));
        const lambdaNm = getDynamicParam(R, 195, 4.2, 45, { min: 185, max: maxSafeLambda, decimals: 0 }, seed + 303);
        const solved = calculatePhotoelectricEffect({
          wavelengthNm: lambdaNm,
          workFunctionEV: q3Metal.workFunctionEV
        });
        const ansEk = Math.round(solved.ekMaxEV * 100) / 100;
        paper.push({
          index: 2,
          type: "numeric",
          topic: "19.2.2 \u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01\u0E02\u0E2D\u0E07\u0E44\u0E2D\u0E19\u0E4C\u0E2A\u0E44\u0E15\u0E19\u0E4C",
          title: "\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E2A\u0E07",
          score: 2,
          problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaNm} \\text{ nm}\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30${q3Metal.nameTh} (\\(W = ${q3Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E08\u0E25\u0E19\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (\\(E_{k,\\max}\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{eV}\\)`,
          unit: "eV",
          correctAnswer: ansEk,
          tolerance: 0.03,
          explanation: `\\(E_{k,\\max} = \\frac{hc}{\\lambda e} - W = ${solved.photonEnergyEV.toFixed(2)} - ${q3Metal.workFunctionEV.toFixed(1)} = ${ansEk.toFixed(2)} \\text{ eV}\\)`
        });
      }
      const q4Variant = getSeededInt(R, 400, 0, 1, seed);
      const q4Metal = getMetalById(["cs", "k", "na"][getSeededInt(R, 401, 0, 2, seed)]);
      const q4LambdaNm = getDynamicParam(R, 210, 5.2, 55, { min: 190, max: 430, decimals: 0 }, seed + 402);
      const q4Solved = calculatePhotoelectricEffect({
        wavelengthNm: q4LambdaNm,
        workFunctionEV: q4Metal.workFunctionEV
      });
      if (q4Variant === 0) {
        const ansVs = Math.round(q4Solved.stoppingPotentialV * 100) / 100;
        paper.push({
          index: 3,
          type: "numeric",
          topic: "19.2.2 \u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (Stopping Potential)",
          title: "\u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
          score: 2,
          problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${q4LambdaNm} \\text{ nm}\\) \u0E25\u0E07\u0E1A\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30${q4Metal.nameTh} (\\(W = ${q4Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 (\\(V_s\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E42\u0E27\u0E25\u0E15\u0E4C (\\(\\text{V}\\))`,
          unit: "V",
          correctAnswer: ansVs,
          tolerance: 0.03,
          explanation: `\\(eV_s = \\frac{hc}{\\lambda} - W = ${q4Solved.photonEnergyEV.toFixed(2)} - ${q4Metal.workFunctionEV.toFixed(1)} = ${ansVs.toFixed(2)} \\text{ eV} \\rightarrow V_s = ${ansVs.toFixed(2)} \\text{ V}\\)`
        });
      } else {
        const ansV5 = Math.round(q4Solved.vMaxMs / 1e5 * 100) / 100;
        paper.push({
          index: 3,
          type: "numeric",
          topic: "19.2.2 \u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19",
          title: "\u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19",
          score: 2,
          problemText: `\u0E09\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${q4LambdaNm} \\text{ nm}\\) \u0E25\u0E07\u0E1A\u0E19\u0E1C\u0E34\u0E27\u0E42\u0E25\u0E2B\u0E30${q4Metal.nameTh} (\\(W = ${q4Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) \u0E08\u0E07\u0E2B\u0E32\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19 (\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E0D\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^5 \\text{ m/s}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14 \\(m_e = 9.109 \\times 10^{-31} \\text{ kg}\\)`,
          unit: "\xD7 10\u2075 m/s",
          correctAnswer: ansV5,
          tolerance: 0.03,
          explanation: `\\(E_{k,\\max} = ${q4Solved.ekMaxEV.toFixed(2)} \\text{ eV} = ${formatLatexScientific(q4Solved.ekMaxJ)} \\text{ J} \\rightarrow v_{\\max} = \\sqrt{\\frac{2 E_{k,\\max}}{m_e}} = ${ansV5.toFixed(2)} \\times 10^5 \\text{ m/s}\\)`
        });
      }
      const q5Variant = getSeededInt(R, 500, 0, 2, seed);
      if (q5Variant === 0) {
        const freqCoeff = getDynamicParam(R, 9, 0.16, 1.3, { min: 8.5, max: 16, decimals: 2 }, seed + 501);
        const photonEV = calculatePhotonEnergyFromFrequency(freqCoeff * 1e14).electronVolts;
        const vsVal = Math.round(Math.max(0.6, Math.min(photonEV - 2, 0.8 + R % 7 * 0.22)) * 100) / 100;
        const wRes = calculateWorkFunctionFromGraphPoint(freqCoeff * 1e14, vsVal);
        const ansW = Math.round(wRes.electronVolts * 100) / 100;
        paper.push({
          index: 4,
          type: "numeric",
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F Vs\u2013f \u0E41\u0E25\u0E30\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19",
          title: "\u0E2B\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19\u0E08\u0E32\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E23\u0E32\u0E1F\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07",
          score: 2,
          problemText: `\u0E08\u0E32\u0E01\u0E01\u0E23\u0E32\u0E1F\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 \\(V_s\\) \u0E01\u0E31\u0E1A \\(f\\) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E0A\u0E19\u0E34\u0E14\u0E2B\u0E19\u0E36\u0E48\u0E07 \u0E1E\u0E1A\u0E08\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E41\u0E25\u0E30 \\(V_s = ${vsVal.toFixed(2)} \\text{ V}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E48\u0E32\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E07\u0E32\u0E19 (\\(W\\)) \u0E02\u0E2D\u0E07\u0E42\u0E25\u0E2B\u0E30\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{eV}\\)`,
          unit: "eV",
          correctAnswer: ansW,
          tolerance: 0.03,
          explanation: `\\(W = \\frac{hf}{e} - V_s = ${photonEV.toFixed(2)} - ${vsVal.toFixed(2)} = ${ansW.toFixed(2)} \\text{ eV}\\)`
        });
      } else if (q5Variant === 1) {
        const hExp34 = getDynamicParam(R, 6.45, 8e-3, 0.12, { min: 6.4, max: 6.85, decimals: 2 }, seed + 502);
        const f1 = 6;
        const df = 3 + R % 5 * 0.5;
        const f2 = Math.round((f1 + df) * 100) / 100;
        const ek1 = 0.7;
        const ek2 = Math.round((ek1 + hExp34 * 1e-34 * df * 1e14 / 1e-19) * 100) / 100;
        const hCalc = calculatePlanckFromTwoPoints(f1 * 1e14, ek1 * 1e-19, f2 * 1e14, ek2 * 1e-19);
        const ansH34 = Math.round(hCalc / 1e-34 * 100) / 100;
        paper.push({
          index: 4,
          type: "numeric",
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E01\u0E23\u0E32\u0E1F Ek,max\u2013f",
          title: "\u0E2B\u0E32\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E31\u0E19\u0E01\u0E23\u0E32\u0E1F Ek,max\u2013f",
          score: 2,
          problemText: `\u0E01\u0E23\u0E32\u0E1F\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 \\(E_{k,\\max}\\) \u0E01\u0E31\u0E1A \\(f\\) \u0E1C\u0E48\u0E32\u0E19\u0E08\u0E38\u0E14 \\((f_1 = ${f1.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k1} = ${ek1.toFixed(2)} \\times 10^{-19} \\text{ J})\\) \u0E41\u0E25\u0E30 \\((f_2 = ${f2.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k2} = ${ek2.toFixed(2)} \\times 10^{-19} \\text{ J})\\) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E48\u0E32\u0E04\u0E07\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E1E\u0E25\u0E31\u0E07\u0E04\u0E4C (\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E0D\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{-34} \\text{ J}\\cdot\\text{s}\\))`,
          unit: "\xD7 10\u207B\xB3\u2074 J\xB7s",
          correctAnswer: ansH34,
          tolerance: 0.03,
          explanation: `\\(h = \\frac{E_{k2} - E_{k1}}{f_2 - f_1} = \\frac{(${ek2.toFixed(2)} - ${ek1.toFixed(2)}) \\times 10^{-19}}{${df.toFixed(2)} \\times 10^{14}} = ${ansH34.toFixed(2)} \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\)`
        });
      } else {
        const metal = getMetalById(["al", "zn", "cu"][getSeededInt(R, 503, 0, 2, seed)]);
        const targetVs = getDynamicParam(R, 0.7, 0.045, 0.45, { min: 0.6, max: 2.8, decimals: 2 }, seed + 504);
        const res = calculateWavelengthForStoppingPotential(metal.workFunctionEV, targetVs);
        const ansNm = Math.round(res.nm * 10) / 10;
        paper.push({
          index: 4,
          type: "numeric",
          topic: "19.2.3 \u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C\u0E2A\u0E21\u0E01\u0E32\u0E23\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01",
          title: "\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E2A\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E44\u0E14\u0E49\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07\u0E15\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23",
          score: 2,
          problemText: `\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E42\u0E25\u0E2B\u0E30${metal.nameTh} (\\(W = ${metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) \u0E40\u0E01\u0E34\u0E14\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E28\u0E31\u0E01\u0E22\u0E4C\u0E2B\u0E22\u0E38\u0E14\u0E22\u0E31\u0E49\u0E07 \\(V_s = ${targetVs.toFixed(2)} \\text{ V}\\) \u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 (\\(\\lambda\\)) \u0E40\u0E17\u0E48\u0E32\u0E43\u0E14\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E32\u0E42\u0E19\u0E40\u0E21\u0E15\u0E23 (\\(\\text{nm}\\))`,
          unit: "nm",
          correctAnswer: ansNm,
          tolerance: 0.03,
          explanation: `\\(E = W + eV_s = ${metal.workFunctionEV.toFixed(1)} + ${targetVs.toFixed(2)} = ${res.photonEnergyEV.toFixed(2)} \\text{ eV} \\rightarrow \\lambda = \\frac{hc}{E} = ${ansNm.toFixed(1)} \\text{ nm}\\)`
        });
      }
      return paper;
    }
    recordAnswer(questionIndex, answer) {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      this.userAnswers[questionIndex] = answer;
      this._saveSessionState(questionIndex);
    }
    setActiveQuestion(questionIndex) {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      this._saveSessionState(questionIndex);
    }
    recordTabSwitch() {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      this.tabSwitchCount++;
      this._saveSessionState(this.restoredActiveQuestionIdx);
      if (typeof this.onCheatDetected === "function") {
        this.onCheatDetected(this.tabSwitchCount);
      }
    }
    _startTimer() {
      this._stopTimer();
      this.timerInterval = setInterval(() => {
        const now = Date.now();
        const remainMs = Math.max(0, this.endTime - now);
        this.timeRemaining = Math.ceil(remainMs / 1e3);
        if (typeof this.onTimerTick === "function") {
          this.onTimerTick(this.timeRemaining, this.formatTimerString());
        }
        if (this.timeRemaining <= 0) {
          this._stopTimer();
          const result = this.submitExam(true, "timeout");
          if (typeof this.onTimeExpired === "function") {
            this.onTimeExpired(result);
          }
          if (typeof this.onAutoSubmitted === "function") {
            this.onAutoSubmitted(result);
          }
        }
      }, 1e3);
    }
    _stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
    formatTimerString() {
      const mins = Math.floor(this.timeRemaining / 60);
      const secs = this.timeRemaining % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    _saveSessionState(activeQuestionIdx = 0) {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      this.restoredActiveQuestionIdx = activeQuestionIdx;
      if (this.storage && typeof this.storage.saveExamSession === "function") {
        this.storage.saveExamSession({
          attemptId: this.attemptId,
          fullName: this.fullName,
          className: this.className,
          rollNumber: this.rollNumber,
          attemptSeed: this.attemptSeed,
          startTime: this.startTime,
          endTime: this.endTime,
          questions: this.questions,
          userAnswers: this.userAnswers,
          tabSwitchCount: this.tabSwitchCount,
          activeQuestionIdx,
          lastSavedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    resumeExamSession(savedSession) {
      if (!savedSession || !savedSession.endTime) return false;
      const now = Date.now();
      const remainMs = savedSession.endTime - now;
      this.attemptId = savedSession.attemptId || `u19_2_exam_${savedSession.rollNumber}_${savedSession.attemptSeed}_${savedSession.startTime}`;
      this.fullName = savedSession.fullName;
      this.className = savedSession.className;
      this.rollNumber = validateRollNumber(savedSession.rollNumber);
      this.attemptSeed = savedSession.attemptSeed;
      this.startTime = savedSession.startTime;
      this.endTime = savedSession.endTime;
      this.questions = savedSession.questions || [];
      this.userAnswers = savedSession.userAnswers || {};
      this.tabSwitchCount = savedSession.tabSwitchCount || 0;
      this.restoredActiveQuestionIdx = savedSession.activeQuestionIdx || 0;
      if (remainMs <= 0) {
        this.timeRemaining = 0;
        const result = this.submitExam(true, "timeout-on-recovery");
        if (typeof this.onAutoSubmitted === "function") {
          this.onAutoSubmitted(result);
        }
        return false;
      }
      this.timeRemaining = Math.ceil(remainMs / 1e3);
      this.state = EXAM_STATES.IN_PROGRESS;
      this._startTimer();
      return true;
    }
    submitExam(isAutoSubmit = false, autoSubmitReason = null) {
      this._stopTimer();
      this.state = EXAM_STATES.SUBMITTED;
      let totalScore = 0;
      const gradedQuestions = this.questions.map((q, idx) => {
        const userAns = this.userAnswers[idx];
        let isCorrect = false;
        if (q.type === "choice") {
          isCorrect = parseInt(userAns, 10) === q.correctChoiceIndex;
        } else {
          const valRes = validateNumericAnswer(userAns, q.correctAnswer, q.tolerance);
          isCorrect = valRes.isCorrect;
        }
        const earnedScore = isCorrect ? q.score : 0;
        totalScore += earnedScore;
        return {
          ...q,
          userAnswer: userAns !== void 0 && userAns !== "" ? userAns : null,
          isCorrect,
          earnedScore
        };
      });
      const percentage = Math.round(totalScore / APP_CONFIG.exam.maxScore * 100);
      const isPassed = totalScore >= APP_CONFIG.exam.passingScore;
      let gradeLevel = "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07";
      if (percentage >= 80) gradeLevel = "\u0E14\u0E35\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21 (Excellent)";
      else if (percentage >= 70) gradeLevel = "\u0E14\u0E35\u0E21\u0E32\u0E01 (Very Good)";
      else if (percentage >= 60) gradeLevel = "\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C (Passed)";
      const submissionStatus = isAutoSubmit ? "auto-submitted" : "submitted";
      const resolvedReason = isAutoSubmit ? autoSubmitReason || "timeout" : null;
      this.examResult = {
        attemptId: this.attemptId,
        examId: "unit-19-2-timed-exam",
        examTitle: "\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19\u0E1A\u0E17\u0E17\u0E35\u0E48 19: \u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E42\u0E1F\u0E42\u0E15\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E34\u0E01 (19.2)",
        fullName: this.fullName,
        className: this.className,
        rollNumber: this.rollNumber,
        durationMinutes: APP_CONFIG.exam.durationMinutes,
        totalScore,
        maxScore: APP_CONFIG.exam.maxScore,
        percentage,
        isPassed,
        gradeLevel,
        tabSwitchCount: this.tabSwitchCount,
        isAutoSubmit,
        submissionStatus,
        autoSubmitReason: resolvedReason,
        syncStatus: "local-only",
        startedAt: this.startTime ? new Date(this.startTime).toISOString() : null,
        submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
        gradedQuestions
      };
      if (this.storage && typeof this.storage.saveExamResult === "function") {
        this.storage.saveExamResult(this.examResult);
      }
      if (this.storage && typeof this.storage.clearExamSession === "function") {
        this.storage.clearExamSession();
      }
      return this.examResult;
    }
  };

  // src/adapters/ui/exam-ui.js
  var ExamUIAdapter = class {
    constructor() {
      this.examManager = new ExamManager(1, LocalStorageAdapter);
      this.currentQuestionIdx = 0;
      this._isAwayFromExam = false;
      this._suppressAntiCheat = false;
      this._isUnloading = false;
      this.init();
    }
    init() {
      if (typeof document === "undefined") return;
      if (typeof window !== "undefined") {
        window.startLiveExam = () => this.startLiveExam();
        window.goToExamQuestion = (idx) => this.goToQuestion(idx);
        window.prevExamQuestion = () => this.goToQuestion(this.currentQuestionIdx - 1);
        window.nextExamQuestion = () => this.goToQuestion(this.currentQuestionIdx + 1);
        window.selectExamChoice = (cIdx) => this.selectChoice(cIdx);
        window.recordExamNumericInput = (val) => this.recordNumericInput(val);
        window.confirmSubmitExam = () => this.confirmSubmitExam();
        window.retakeExam = () => this.retakeExam();
        window.showLatestResultModal = () => this.showLatestResultModal();
        window.closeLatestResultModal = () => this.closeLatestResultModal();
      }
      this.examManager.onTimerTick = (timeRemaining, timerStr) => {
        this.updateTimerDisplay(timeRemaining, timerStr);
      };
      this.examManager.onAutoSubmitted = (result) => {
        this.handleAutoSubmitted(result);
      };
      this.examManager.onCheatDetected = (switchCount) => {
        this.showCheatWarning(switchCount);
      };
      this.setupStartFormValidation();
      this.setupAntiCheatListeners();
      const lastResult = LocalStorageAdapter.loadExamResult();
      if (lastResult) {
        this.updateHomeLastScore(lastResult.totalScore);
      }
      this.checkSessionRecovery();
    }
    setupStartFormValidation() {
      const nameInput = document.getElementById("exam-input-name");
      const classInput = document.getElementById("exam-input-class");
      const rollInput = document.getElementById("exam-input-roll");
      const startBtn = document.getElementById("btn-exam-start-submit");
      const nameErr = document.getElementById("exam-err-name");
      const rollErr = document.getElementById("exam-err-roll");
      const validateForm = (showMessages = false) => {
        const nameVal = nameInput ? nameInput.value.trim() : "";
        const classVal = classInput ? classInput.value.trim() : "";
        const rollRaw = rollInput ? rollInput.value.trim() : "";
        const rollNum = Number(rollRaw);
        const isNameValid = nameVal.length > 0;
        const isClassValid = classVal.length > 0;
        const isRollValid = Number.isInteger(rollNum) && rollNum >= 1 && rollNum <= 40;
        if (nameErr) nameErr.classList.toggle("hidden", !showMessages || isNameValid);
        if (rollErr) rollErr.classList.toggle("hidden", !showMessages || isRollValid);
        if (startBtn) startBtn.disabled = !(isNameValid && isClassValid && isRollValid);
        return isNameValid && isClassValid && isRollValid;
      };
      [nameInput, classInput, rollInput].forEach((el) => {
        if (el) {
          el.addEventListener("input", () => validateForm(true));
          el.addEventListener("blur", () => validateForm(true));
        }
      });
      validateForm(false);
    }
    setupAntiCheatListeners() {
      if (typeof document === "undefined") return;
      const handleLeave = () => {
        if (this.examManager.state !== EXAM_STATES.IN_PROGRESS) return;
        if (this._isUnloading || this._suppressAntiCheat || this._isAwayFromExam) return;
        this._isAwayFromExam = true;
        this.examManager.recordTabSwitch();
      };
      const handleReturn = () => {
        if (typeof document !== "undefined" && document.hidden) return;
        this._isAwayFromExam = false;
      };
      window.addEventListener("beforeunload", () => {
        this._isUnloading = true;
      });
      window.addEventListener("pagehide", () => {
        this._isUnloading = true;
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) handleLeave();
        else handleReturn();
      });
      window.addEventListener("blur", handleLeave);
      window.addEventListener("focus", handleReturn);
    }
    checkSessionRecovery() {
      const savedSession = LocalStorageAdapter.loadExamSession();
      if (!savedSession || !savedSession.endTime) return;
      if (savedSession.endTime <= Date.now()) {
        this.examManager.resumeExamSession(savedSession);
        const result = this.examManager.examResult;
        TabNavigatorAdapter.setExamInProgress(false);
        if (result) {
          TabNavigatorAdapter.showSection("exam-result");
          this.renderResultScreen(result);
          this.updateHomeLastScore(result.totalScore);
        }
        return;
      }
      const confirmResume = confirm(
        `\u0E1E\u0E1A\u0E40\u0E0B\u0E2A\u0E0A\u0E31\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E04\u0E49\u0E32\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E02\u0E2D\u0E07 ${savedSession.fullName} (\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 ${savedSession.rollNumber})
\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E15\u0E48\u0E2D\u0E08\u0E32\u0E01\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?`
      );
      if (confirmResume) {
        this._isAwayFromExam = false;
        this.examManager.resumeExamSession(savedSession);
        TabNavigatorAdapter.setExamInProgress(true);
        TabNavigatorAdapter.showSection("exam-live");
        this.renderLiveExamScreen();
        this.updateTimerDisplay(this.examManager.timeRemaining, this.examManager.formatTimerString());
        this.goToQuestion(this.examManager.restoredActiveQuestionIdx || 0);
      } else {
        LocalStorageAdapter.clearExamSession();
      }
    }
    startLiveExam() {
      const nameInput = document.getElementById("exam-input-name");
      const classInput = document.getElementById("exam-input-class");
      const rollInput = document.getElementById("exam-input-roll");
      const fullName = nameInput ? nameInput.value.trim() : "";
      const className = classInput ? classInput.value.trim() : "";
      const rollNumber = rollInput ? Number(rollInput.value) : 1;
      if (!fullName) {
        const nameErr = document.getElementById("exam-err-name");
        if (nameErr) nameErr.classList.remove("hidden");
        if (nameInput) nameInput.focus();
        return;
      }
      if (!Number.isInteger(rollNumber) || rollNumber < 1 || rollNumber > 40) {
        const rollErr = document.getElementById("exam-err-roll");
        if (rollErr) rollErr.classList.remove("hidden");
        if (rollInput) rollInput.focus();
        return;
      }
      this._isAwayFromExam = false;
      this._isUnloading = false;
      this.examManager.setIdentity(fullName, className, rollNumber);
      this.examManager.startExam();
      TabNavigatorAdapter.setExamInProgress(true);
      TabNavigatorAdapter.showSection("exam-live");
      this.currentQuestionIdx = 0;
      this.renderLiveExamScreen();
      this.updateTimerDisplay(this.examManager.timeRemaining, this.examManager.formatTimerString());
      this.goToQuestion(0);
    }
    renderLiveExamScreen() {
      const nameBadge = document.getElementById("exam-live-student-info");
      if (nameBadge) {
        nameBadge.textContent = `${this.examManager.fullName} (${this.examManager.className || "\u0E21.6"}) \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 ${this.examManager.rollNumber}`;
      }
      this.renderQuestionPagination();
    }
    renderQuestionPagination() {
      const pager = document.getElementById("exam-question-pager");
      if (!pager) return;
      pager.innerHTML = this.examManager.questions.map((_, idx) => {
        const isAnswered = this.examManager.userAnswers[idx] !== void 0 && this.examManager.userAnswers[idx] !== "";
        const isCurrent = idx === this.currentQuestionIdx;
        let btnClass = "w-10 h-10 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ";
        if (isCurrent) {
          btnClass += "bg-blue-600 text-white shadow-md ring-2 ring-blue-300";
        } else if (isAnswered) {
          btnClass += "bg-emerald-100 text-emerald-800 border border-emerald-300";
        } else {
          btnClass += "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200";
        }
        return `<button onclick="goToExamQuestion(${idx})" class="${btnClass}">${idx + 1}</button>`;
      }).join("");
    }
    goToQuestion(idx) {
      if (idx < 0 || idx >= this.examManager.questions.length) return;
      this.currentQuestionIdx = idx;
      this.examManager.setActiveQuestion(idx);
      const q = this.examManager.questions[idx];
      const titleEl = document.getElementById("exam-q-title");
      const textEl = document.getElementById("exam-q-text");
      const choiceZone = document.getElementById("exam-zone-choice");
      const numericZone = document.getElementById("exam-zone-numeric");
      const btnPrev = document.getElementById("btn-exam-prev");
      const btnNext = document.getElementById("btn-exam-next");
      if (titleEl) {
        titleEl.textContent = `\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1}: ${q.title} (${q.score} \u0E04\u0E30\u0E41\u0E19\u0E19)`;
      }
      if (textEl) {
        textEl.innerHTML = q.problemText;
      }
      if (btnPrev) btnPrev.disabled = idx === 0;
      if (btnNext) {
        if (idx === this.examManager.questions.length - 1) {
          btnNext.innerHTML = '<span>\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A</span> <i class="fa-solid fa-check ml-1"></i>';
          btnNext.className = "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-1.5";
          btnNext.onclick = () => this.confirmSubmitExam();
        } else {
          btnNext.innerHTML = '<span>\u0E02\u0E49\u0E2D\u0E16\u0E31\u0E14\u0E44\u0E1B</span> <i class="fa-solid fa-chevron-right ml-1"></i>';
          btnNext.className = "px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-1.5";
          btnNext.onclick = () => this.goToQuestion(this.currentQuestionIdx + 1);
        }
      }
      if (q.type === "choice") {
        if (choiceZone) {
          choiceZone.classList.remove("hidden");
          choiceZone.innerHTML = q.choices.map((ch, cIdx) => {
            const isSelected = this.examManager.userAnswers[idx] === cIdx;
            const borderClass = isSelected ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-slate-50 hover:bg-slate-100";
            return `
              <button onclick="selectExamChoice(${cIdx})"
                class="w-full text-left p-4 rounded-xl border ${borderClass} transition flex items-start gap-3 cursor-pointer">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}">
                  ${String.fromCharCode(65 + cIdx)}
                </span>
                <span class="text-xs md:text-sm text-slate-800 leading-relaxed">${ch}</span>
              </button>
            `;
          }).join("");
        }
        if (numericZone) numericZone.classList.add("hidden");
      } else {
        if (choiceZone) choiceZone.classList.add("hidden");
        if (numericZone) {
          numericZone.classList.remove("hidden");
          const numInput = document.getElementById("exam-input-numeric");
          const unitLabel = document.getElementById("exam-lbl-numeric-unit");
          const unitBadge = document.getElementById("exam-unit-badge");
          if (unitLabel) unitLabel.textContent = q.unit || "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02";
          if (unitBadge) unitBadge.textContent = q.unit || "-";
          if (numInput) {
            numInput.value = this.examManager.userAnswers[idx] ?? "";
            numInput.oninput = (e) => this.recordNumericInput(e.target.value);
          }
        }
      }
      this.renderQuestionPagination();
      this.renderMathExpressions();
    }
    selectChoice(cIdx) {
      this.examManager.recordAnswer(this.currentQuestionIdx, cIdx);
      this.goToQuestion(this.currentQuestionIdx);
    }
    recordNumericInput(val) {
      this.examManager.recordAnswer(this.currentQuestionIdx, val.trim());
      this.renderQuestionPagination();
    }
    updateTimerDisplay(timeRemaining, timerStr) {
      const el = document.getElementById("exam-timer-display");
      if (el) {
        el.textContent = timerStr;
        if (timeRemaining <= 180) {
          el.classList.add("text-red-600", "timer-urgent");
        } else {
          el.classList.remove("timer-urgent");
        }
      }
    }
    showCheatWarning(count) {
      const banner = document.getElementById("cheat-warning-banner");
      const msg = document.getElementById("cheat-warning-msg");
      if (banner && msg) {
        msg.textContent = `\u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E23\u0E27\u0E08\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E2A\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48 ${count}! \u0E42\u0E1B\u0E23\u0E14\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E0B\u0E37\u0E48\u0E2D\u0E2A\u0E31\u0E15\u0E22\u0E4C`;
        banner.classList.remove("hidden");
        banner.classList.add("cheat-shake");
        setTimeout(() => {
          banner.classList.remove("cheat-shake");
        }, 500);
        setTimeout(() => {
          banner.classList.add("hidden");
        }, 4500);
      }
    }
    confirmSubmitExam() {
      const totalQ = this.examManager.questions.length;
      const answeredCount = Object.keys(this.examManager.userAnswers).filter(
        (k) => this.examManager.userAnswers[k] !== void 0 && this.examManager.userAnswers[k] !== ""
      ).length;
      const unanswered = totalQ - answeredCount;
      const msg = unanswered > 0 ? `\u0E04\u0E38\u0E13\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A\u0E2D\u0E35\u0E01 ${unanswered} \u0E02\u0E49\u0E2D \u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2A\u0E48\u0E07\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?` : "\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?";
      this._suppressAntiCheat = true;
      try {
        if (confirm(msg)) {
          this.submitExam();
        }
      } finally {
        this._suppressAntiCheat = false;
        this._isAwayFromExam = false;
      }
    }
    submitExam() {
      const result = this.examManager.submitExam(false);
      this._isAwayFromExam = false;
      TabNavigatorAdapter.setExamInProgress(false);
      TabNavigatorAdapter.showSection("exam-result");
      this.renderResultScreen(result);
      this.updateHomeLastScore(result.totalScore);
    }
    handleAutoSubmitted(result) {
      this._isAwayFromExam = false;
      TabNavigatorAdapter.setExamInProgress(false);
      TabNavigatorAdapter.showSection("exam-result");
      if (result) {
        this.renderResultScreen(result);
        this.updateHomeLastScore(result.totalScore);
      }
    }
    formatStudentAnswer(q) {
      if (q.userAnswer === null || q.userAnswer === void 0 || q.userAnswer === "") {
        return "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A";
      }
      if (q.type === "choice") {
        const idx = Number(q.userAnswer);
        const choiceText = Array.isArray(q.choices) && q.choices[idx] ? q.choices[idx] : null;
        return choiceText ? `${String.fromCharCode(65 + idx)}. ${choiceText}` : "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A";
      }
      return `${q.userAnswer} ${q.unit || ""}`.trim();
    }
    formatCorrectAnswer(q) {
      if (q.type === "choice") {
        const idx = Number(q.correctChoiceIndex);
        const choiceText = Array.isArray(q.choices) && q.choices[idx] ? q.choices[idx] : "-";
        return `${String.fromCharCode(65 + idx)}. ${choiceText}`;
      }
      return `${q.correctAnswer} ${q.unit || ""}`.trim();
    }
    renderResultScreen(res) {
      const scoreVal = document.getElementById("res-score-value");
      const scorePct = document.getElementById("res-score-pct");
      const badgeGrade = document.getElementById("res-badge-grade");
      const studentInfo = document.getElementById("res-student-info");
      const tabSwitchBadge = document.getElementById("res-tab-switches");
      const autoBanner = document.getElementById("res-auto-submit-banner");
      const breakdownList = document.getElementById("res-breakdown-list");
      if (scoreVal) scoreVal.textContent = `${res.totalScore} / ${res.maxScore}`;
      if (scorePct) scorePct.textContent = `${res.percentage}%`;
      if (badgeGrade) {
        badgeGrade.textContent = res.gradeLevel;
        badgeGrade.className = res.isPassed ? "px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" : "px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300";
      }
      if (studentInfo) {
        studentInfo.textContent = `${res.fullName} (${res.className || "\u0E21.6"}) \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 ${res.rollNumber}`;
      }
      if (tabSwitchBadge) {
        tabSwitchBadge.textContent = res.tabSwitchCount > 0 ? `\u0E2A\u0E25\u0E31\u0E1A\u0E08\u0E2D ${res.tabSwitchCount} \u0E04\u0E23\u0E31\u0E49\u0E07` : "\u0E04\u0E27\u0E32\u0E21\u0E42\u0E1B\u0E23\u0E48\u0E07\u0E43\u0E2A 100%";
      }
      if (autoBanner) {
        if (res.isAutoSubmit) {
          autoBanner.classList.remove("hidden");
          autoBanner.textContent = res.autoSubmitReason === "timeout-on-recovery" ? "\u23F0 \u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A\u0E02\u0E13\u0E30\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D \u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E43\u0E2B\u0E49\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E41\u0E25\u0E49\u0E27" : "\u23F0 \u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A 15 \u0E19\u0E32\u0E17\u0E35 \u0E23\u0E30\u0E1A\u0E1A\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A\u0E2A\u0E48\u0E07\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E41\u0E25\u0E30\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E30\u0E41\u0E19\u0E19\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E41\u0E25\u0E49\u0E27";
        } else {
          autoBanner.classList.add("hidden");
        }
      }
      if (breakdownList) {
        breakdownList.innerHTML = res.gradedQuestions.map(
          (q, idx) => `
          <div class="p-4 rounded-xl border ${q.isCorrect ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"} space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-xs ${q.isCorrect ? "text-emerald-700" : "text-red-700"}">
                \u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1}: ${q.title}
              </span>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${q.isCorrect ? "bg-emerald-200 text-emerald-900" : "bg-red-200 text-red-900"}">
                ${q.earnedScore} / ${q.score} \u0E04\u0E30\u0E41\u0E19\u0E19
              </span>
            </div>
            <p class="text-xs text-slate-700">${q.problemText}</p>
            <div class="text-xs space-y-1">
              <div><strong class="text-slate-600">\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13:</strong> <span class="${q.isCorrect ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}">${this.formatStudentAnswer(q)}</span></div>
              <div><strong class="text-slate-600">\u0E40\u0E09\u0E25\u0E22:</strong> <span class="text-emerald-700 font-bold">${this.formatCorrectAnswer(q)}</span></div>
              <div class="text-[11px] text-slate-600 mt-1 bg-white/80 p-2 rounded-lg border border-slate-200">${q.explanation}</div>
            </div>
          </div>
        `
        ).join("");
      }
      this.renderMathExpressions();
    }
    retakeExam() {
      TabNavigatorAdapter.showSection("exam-start");
    }
    updateHomeLastScore(score) {
      const el = document.getElementById("lbl-last-score");
      if (el) el.textContent = `${score} / 10 \u0E04\u0E30\u0E41\u0E19\u0E19`;
    }
    showLatestResultModal() {
      const modal = document.getElementById("latest-result-modal");
      const content = document.getElementById("modal-latest-result-content");
      const res = LocalStorageAdapter.loadExamResult();
      if (!res) {
        alert("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A \u0E01\u0E23\u0E38\u0E13\u0E32\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19\u0E01\u0E48\u0E2D\u0E19");
        return;
      }
      if (content) {
        content.innerHTML = `
        <div class="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="text-4xl font-extrabold text-blue-600 font-mono">${res.totalScore} / 10</div>
          <div class="text-xs text-slate-500 mt-1">\u0E04\u0E30\u0E41\u0E19\u0E19\u0E23\u0E27\u0E21 (${res.percentage}%) - ${res.gradeLevel}</div>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E2D\u0E1A:</span>
            <span class="font-bold text-slate-800">${res.fullName} (${res.className}) \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 ${res.rollNumber}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19:</span>
            <span class="font-bold ${res.isPassed ? "text-emerald-600" : "text-amber-600"}">${res.isPassed ? "\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C" : "\u0E04\u0E27\u0E23\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07"}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E04\u0E27\u0E32\u0E21\u0E42\u0E1B\u0E23\u0E48\u0E07\u0E43\u0E2A:</span>
            <span class="font-bold text-slate-800">${res.tabSwitchCount > 0 ? `\u0E2A\u0E25\u0E31\u0E1A\u0E08\u0E2D ${res.tabSwitchCount} \u0E04\u0E23\u0E31\u0E49\u0E07` : "\u0E04\u0E27\u0E32\u0E21\u0E42\u0E1B\u0E23\u0E48\u0E07\u0E43\u0E2A 100%"}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E40\u0E21\u0E37\u0E48\u0E2D:</span>
            <span class="font-bold text-slate-800">${new Date(res.submittedAt).toLocaleString("th-TH")}</span>
          </div>
        </div>
      `;
      }
      if (modal) modal.classList.remove("hidden");
    }
    closeLatestResultModal() {
      const modal = document.getElementById("latest-result-modal");
      if (modal) modal.classList.add("hidden");
    }
    renderMathExpressions() {
      const liveContainer = document.getElementById("sec-exam-live");
      if (liveContainer && !liveContainer.classList.contains("hidden")) {
        KaTeXAdapter.renderAllMath(liveContainer);
      }
      const resultContainer = document.getElementById("sec-exam-result");
      if (resultContainer && !resultContainer.classList.contains("hidden")) {
        KaTeXAdapter.renderAllMath(resultContainer);
      }
    }
  };

  // src/main.js
  setupErrorBoundary();
  document.addEventListener("DOMContentLoaded", () => {
    console.log(`[Physics Portal] Initializing ${APP_CONFIG.appName} v${APP_CONFIG.version} (${APP_CONFIG.standardVersion})`);
    console.log(
      `[Physics Constants] h = ${PLANCK_CONSTANT.toExponential(3)} J\xB7s, c = ${SPEED_OF_LIGHT.toExponential(2)} m/s, e = ${ELEMENTARY_CHARGE.toExponential(3)} C, me = ${ELECTRON_MASS.toExponential(3)} kg`
    );
    verifyKaTeXLoaded();
    try {
      const canvasTube = document.getElementById("canvas-tube");
      let tubeSim = null;
      if (canvasTube) {
        const tubeRenderer = new CanvasRenderer(canvasTube);
        const tubePlotter = new PhotoelectricTubePlotter(tubeRenderer);
        tubeSim = new PhotoelectricTubeSimulator({ plotter: tubePlotter });
        tubeRenderer.onResize = () => tubeSim.render();
        ControlPanelAdapter.bindPhotoelectricTubeControls(tubeSim);
      }
      const canvasIV = document.getElementById("canvas-iv");
      let ivSim = null;
      if (canvasIV) {
        const ivRenderer = new CanvasRenderer(canvasIV);
        const ivPlotter = new IVCurvePlotter(ivRenderer);
        ivSim = new IVCurveSimulator({ plotter: ivPlotter });
        ivRenderer.onResize = () => ivSim.render();
        ControlPanelAdapter.bindIVCurveControls(ivSim);
      }
      const canvasEkf = document.getElementById("canvas-ekf");
      let ekfSim = null;
      if (canvasEkf) {
        const ekfRenderer = new CanvasRenderer(canvasEkf);
        const ekfPlotter = new EkFrequencyPlotter(ekfRenderer);
        ekfSim = new EkFrequencySimulator({ plotter: ekfPlotter });
        ekfRenderer.onResize = () => ekfSim.render();
        ControlPanelAdapter.bindEkFrequencyControls(ekfSim);
      }
      const canvasCell = document.getElementById("canvas-photocell");
      let photocellSim = null;
      if (canvasCell) {
        const cellRenderer = new CanvasRenderer(canvasCell);
        const cellPlotter = new PhotocellAppPlotter(cellRenderer);
        photocellSim = new PhotocellAppSimulator({ plotter: cellPlotter });
        cellRenderer.onResize = () => photocellSim.render();
        ControlPanelAdapter.bindPhotocellAppControls(photocellSim);
      }
      TabNavigatorAdapter.init({
        tubeSim,
        ivSim,
        ekfSim,
        photocellSim
      });
      new QuizUIAdapter();
      new ExamUIAdapter();
      renderAllMathFormulas();
      console.log("[Physics Portal] Unit 19.2 Photoelectric Effect portal initialized successfully.");
    } catch (err) {
      console.error("[Physics Portal Error] Failed to initialize portal modules:", err);
    }
  });
  function renderAllMathFormulas() {
    let attempts = 0;
    const maxAttempts = 20;
    const tryRender = () => {
      attempts++;
      if (typeof window.katex !== "undefined") {
        KaTeXAdapter.renderAllMath(document.body);
      } else if (attempts < maxAttempts) {
        setTimeout(tryRender, 80);
      }
    };
    tryRender();
    if (document.readyState !== "complete") {
      window.addEventListener("load", () => {
        KaTeXAdapter.renderAllMath(document.body);
      });
    }
  }
  function verifyKaTeXLoaded() {
    if (typeof window.katex !== "undefined") {
      console.log("[KaTeX Adapter] Local offline KaTeX engine loaded successfully.");
    } else {
      console.warn("[KaTeX Adapter] KaTeX not yet ready in global context. Retrying...");
    }
  }
  function setupErrorBoundary() {
    window.addEventListener("error", (evt) => {
      console.error("[Global Error Boundary]", evt.message, evt.filename, evt.lineno);
    });
    window.addEventListener("unhandledrejection", (evt) => {
      console.error("[Unhandled Rejection Boundary]", evt.reason);
    });
  }
})();
