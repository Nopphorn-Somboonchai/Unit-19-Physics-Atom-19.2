/**
 * @file iv-curve-simulator.js
 * @description Orchestrator for Simulator 2: Interactive Photoelectric Current (I) vs Potential Difference (ΔV).
 * Supports Mode A (Compare Light Intensities at constant f) and Mode B (Compare Frequencies at constant Intensity).
 */

import { createIVCurveModel } from '../physics/iv-curve-model.js';

export class IVCurveSimulator {
  /**
   * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
   */
  constructor({ plotter = null, onUpdate = null } = {}) {
    this.plotter = plotter;
    this.onUpdate = onUpdate;

    this.state = {
      metalId: 'na',
      wavelengthNm: 350,
      intensityPercent: 70,
      operatingVoltageV: 1.0,
      comparisonMode: 'intensity', // 'intensity' | 'frequency'
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
    this.state.metalId = String(metalId || 'na');
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
    this.state.operatingVoltageV = Math.max(-5.0, Math.min(5.0, Number(voltageV) || 0));
    this._recompute();
  }

  setComparisonMode(mode) {
    this.state.comparisonMode = mode === 'frequency' ? 'frequency' : 'intensity';
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
    if (this.plotter && typeof this.plotter.render === 'function') {
      this.plotter.render(this.getSnapshot());
    }
  }

  resize() {
    if (this.plotter && typeof this.plotter.resize === 'function') {
      this.plotter.resize();
    }
    this.render();
  }

  _emitUpdate() {
    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this.getSnapshot());
    }
  }

  destroy() {
    if (this.plotter && typeof this.plotter.destroy === 'function') {
      this.plotter.destroy();
    }
  }
}
