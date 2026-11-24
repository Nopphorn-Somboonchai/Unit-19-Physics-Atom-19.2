/**
 * @file ek-frequency-simulator.js
 * @description Orchestrator for Simulator 3: E_{k,max}-f and V_s-f Multi-Metal Graph.
 * Demonstrates identical slope h (or h/e) across up to 3 parallel metal lines,
 * threshold frequency f₀ (X-intercept), and work function -W or -W/e (Y-intercept).
 */

import { createEkFrequencyModel } from '../physics/ek-frequency-model.js';

export class EkFrequencySimulator {
  /**
   * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
   */
  constructor({ plotter = null, onUpdate = null } = {}) {
    this.plotter = plotter;
    this.onUpdate = onUpdate;

    this.state = {
      metalIds: ['cs', 'na', 'zn'],
      yAxisMode: 'ek', // 'ek' | 'vs'
      probeFrequency14: 12.0,
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
    this.state.yAxisMode = mode === 'vs' ? 'vs' : 'ek';
    this._recompute();
  }

  setProbeFrequency(freq14) {
    this.state.probeFrequency14 = Math.max(0.5, Math.min(20.0, Number(freq14) || 12.0));
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
    const id = String(metalId || '').toLowerCase();
    const exists = this.state.metalIds.includes(id);

    if (exists) {
      if (this.state.metalIds.length <= 1) {
        return [...this.state.metalIds];
      }
      this.state.metalIds = this.state.metalIds.filter((m) => m !== id);
    } else {
      if (this.state.metalIds.length >= 3) {
        // Keep max 3 metals by replacing the oldest entry
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
