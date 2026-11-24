/**
 * @file photocell-app-simulator.js
 * @description Orchestrator for Simulator 4: Wave vs Photon Comparison & Automatic Door Photocell Application.
 * Connects pure photoelectric physics (Cs photocell threshold) to an interactive doorway safety sensor & relay motor.
 */

import { getMetalById } from '../physics/photoelectric-model.js';
import { calculatePhotoelectricEffect, wavelengthToRGB } from '../physics/photoelectric-solver.js';

export class PhotocellAppSimulator {
  /**
   * @param {{ plotter?: Object, onUpdate?: Function }} [options={}]
   */
  constructor({ plotter = null, onUpdate = null } = {}) {
    this.plotter = plotter;
    this.onUpdate = onUpdate;

    this.state = {
      metalId: 'cs', // Cesium (W = 2.1 eV, λ₀ ≈ 591 nm) commonly used in photocells
      wavelengthNm: 450, // Blue sensor beam (emits electrons cleanly)
      manualBlock: false,
      isWalking: false,
      personProgress: -0.25, // -0.25 (left off-beam) -> 0.50 (blocking beam) -> 1.25 (past beam)
      doorOpenRatio: 0, // 0 = closed, 1 = fully open
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
    const photocurrentMicroA = beamReachesCell && solved.emitsElectrons ? 85.0 : 0.0;
    // Normally-closed safety relay: when photocurrent drops to 0 µA, relay opens door motor!
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
    const safeDt = Math.min(0.05, Math.max(0.001, dt));
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

    // Smoothly animate automatic sliding door based on relay state
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
    if (this._rafId !== null) return;
    if (typeof requestAnimationFrame !== 'function') return;

    this._lastTs = null;
    const tick = (ts) => {
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
