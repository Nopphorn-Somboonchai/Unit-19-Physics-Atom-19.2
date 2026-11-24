/**
 * @file canvas-renderer.js
 * @description Base Canvas 2D Rendering Adapter for Unit 19.2.
 * High-DPI support, ResizeObserver responsiveness, and reusable scientific drawing primitives.
 * Conforms to Physics Learning Standard (v1.13.0) & Canvas-Guidelines.md.
 */

export class CanvasRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('[CanvasRenderer] Valid HTMLCanvasElement is required');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    this.onResize = null;

    this.resize();

    this._handleResize = () => {
      this.resize();
      if (typeof this.onResize === 'function') {
        this.onResize();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._handleResize);
    }

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            if (Math.abs(width - this.width) > 1 || Math.abs(height - this.height) > 1) {
              this.resize();
              if (typeof this.onResize === 'function') {
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

  clear(bgColor = '#090D16') {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawLine(x1, y1, x2, y2, color = '#FFFFFF', lineWidth = 1, dash = []) {
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

  drawArrow(x1, y1, x2, y2, color = '#3B82F6', lineWidth = 2, headSize = 7) {
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

  drawLabel(
    text,
    x,
    y,
    {
      font = '12px Prompt, Sarabun, sans-serif',
      color = '#F8FAFC',
      align = 'center',
      bgColor = null,
      borderColor = null,
      padding = 4
    } = {}
  ) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';

    if (bgColor || borderColor) {
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = 14;
      let rectX = x - textWidth / 2 - padding;
      if (align === 'left') rectX = x - padding;
      if (align === 'right') rectX = x - textWidth - padding;

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

  drawStackedLabel(
    lines,
    x,
    y,
    {
      font = '11px Prompt, Sarabun, sans-serif',
      color = '#F8FAFC',
      align = 'center',
      lineHeight = 15,
      bgColor = null,
      padding = 4
    } = {}
  ) {
    if (!lines || lines.length === 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';

    const totalHeight = lines.length * lineHeight;
    const startY = y - totalHeight / 2 + lineHeight / 2;

    if (bgColor) {
      let maxWidth = 0;
      for (const line of lines) {
        const w = ctx.measureText(line).width;
        if (w > maxWidth) maxWidth = w;
      }
      let rectX = x - maxWidth / 2 - padding;
      if (align === 'left') rectX = x - padding;
      if (align === 'right') rectX = x - maxWidth - padding;

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
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._handleResize);
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
}
