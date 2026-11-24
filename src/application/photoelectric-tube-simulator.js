/**
 * @file photoelectric-tube-simulator.js
 * @description Orchestrator for Simulator 1: Virtual Photoelectric Tube Lab.
 * Manages simulation state, photon & photoelectron particle kinematics, and delegates rendering
 * to an injected Canvas Plotter adapter. Zero concrete DOM or storage references.
 */

import { createPhotoelectricTubeState } from '../physics/photoelectric-model.js';

export class PhotoelectricTubeSimulator {
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
      voltageV: 1.0,
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
    this.state.metalId = String(metalId || 'na');
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
    this.state.voltageV = Math.max(-5.0, Math.min(5.0, Math.round((Number(voltageV) || 0) * 100) / 100));
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
    const targetV = -Math.min(5.0, Math.round(this.physics.stoppingPotentialV * 100) / 100);
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
        lane: (i % 3) - 1,
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
    // Electrons emerge with kinetic energy distributed in [0.35, 1.0] * E_{k,max}
    const keFraction = 0.35 + ((this.electrons.length * 0.27 + (this.time * 0.73) % 1) % 0.65);
    const ekEV = this.physics.ekMaxEV * Math.min(1.0, keFraction);
    const v0 = 0.32 + Math.sqrt(Math.max(0.02, ekEV)) * 0.28;
    const laneY = (((this.electrons.length * 37 + Math.floor(this.time * 100)) % 100) / 100 - 0.5) * 0.68;

    return {
      x: initialX, // Normalized 0 (cathode) -> 1 (anode)
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
    const safeDt = Math.min(0.05, Math.max(0.001, dt));
    this.time += safeDt;

    // 1. Spawn and advance incident photon wave packets
    const photonRate = (this.state.intensityPercent / 100) * 14; // photons/sec
    if (photonRate > 0) {
      this._photonSpawnAcc += safeDt * photonRate;
      while (this._photonSpawnAcc >= 1) {
        this._photonSpawnAcc -= 1;
        if (this.photons.length < 26) {
          this.photons.push({
            progress: 0,
            lane: ((Math.floor(this.time * 1000 + this.photons.length * 17) % 5) - 2) * 0.36,
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

    // 2. Spawn and advance photoelectrons under uniform electric field proportional to ΔV
    if (this.physics.activeEmission) {
      const emitRate = (this.state.intensityPercent / 100) * 11;
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
        // Retarding field exceeds this electron's kinetic energy -> decelerates and turns back to cathode!
        const turnX = Math.max(0.06, Math.min(0.92, e.ekEV / Math.max(0.05, Math.abs(voltage))));
        const decel = (e.vx * e.vx) / Math.max(0.08, 2 * turnX);
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
        // Accelerating (V > 0), coasting (V = 0), or overcoming weak retarding potential (-V_s < V < 0)
        const accel = voltage >= 0
          ? 0.35 * voltage
          : -0.25 * (Math.abs(voltage) / Math.max(0.2, vs + 0.1));
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

  startAnimationLoop() {
    if (this._rafId !== null || !this.state.isPlaying) return;
    if (typeof requestAnimationFrame !== 'function') return;

    this._lastTs = null;
    const tick = (ts) => {
      if (!this.state.isPlaying) {
        this._rafId = null;
        return;
      }
      const dt = this._lastTs === null ? 0.016 : (ts - this._lastTs) / 1000;
      this._lastTs = ts;
      this.step(dt);
      this.render();
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  stopAnimationLoop() {
    if (this._rafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this._rafId);
    }
    this._rafId = null;
    this._lastTs = null;
  }

  _emitUpdate() {
    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this.getSnapshot());
    }
  }

  destroy() {
    this.stopAnimationLoop();
    if (this.plotter && typeof this.plotter.destroy === 'function') {
      this.plotter.destroy();
    }
  }
}
