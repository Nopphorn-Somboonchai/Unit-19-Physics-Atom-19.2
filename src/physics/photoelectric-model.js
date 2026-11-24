/**
 * @file photoelectric-model.js
 * @description Pure Physics Domain Model for IPST metal cathodes and photoelectric tube states.
 * Computes threshold frequency f₀ and threshold wavelength λ₀ automatically from the Physics Solver.
 */

import { METAL_WORK_FUNCTIONS } from '../shared/constants.js';
import {
  electronVoltsToJoules,
  calculateThresholdFrequency,
  calculateThresholdWavelength,
  calculatePhotoelectricEffect,
  calculateSpectralRegion,
  wavelengthToRGB
} from './photoelectric-solver.js';
import { calculateSaturationCurrent, calculatePhotocurrent } from './iv-curve-solver.js';

/**
 * Enriched IPST metal catalog with derived W (J), f₀ (Hz), and λ₀ (nm)
 */
export const METALS = Object.freeze(
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

/**
 * Retrieve metal specification by ID (defaults to Sodium 'na' if unknown)
 * @param {string} metalId
 * @returns {Object}
 */
export function getMetalById(metalId) {
  const key = String(metalId || 'na').toLowerCase();
  return METALS.find((m) => m.id === key) || METALS.find((m) => m.id === 'na');
}

/**
 * Return all standard metals
 * @returns {readonly Object[]}
 */
export function getAllMetals() {
  return METALS;
}

/**
 * Create a complete immutable snapshot of the virtual photoelectric tube physical state.
 * @param {{ metalId?: string, wavelengthNm?: number, intensityPercent?: number, voltageV?: number }} params
 * @returns {Object}
 */
export function createPhotoelectricTubeState({
  metalId = 'na',
  wavelengthNm = 350,
  intensityPercent = 70,
  voltageV = 1.0
} = {}) {
  const metal = getMetalById(metalId);
  const clampedLambdaNm = Math.max(150, Math.min(750, Number(wavelengthNm) || 350));
  const clampedIntensity = Math.max(0, Math.min(100, Number(intensityPercent) || 0));
  const clampedVoltage = Math.max(-5.0, Math.min(5.0, Number(voltageV) || 0));

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

  let electronMotionMode = 'none';
  if (!solved.emitsElectrons) {
    electronMotionMode = 'below-threshold';
  } else if (clampedIntensity <= 0) {
    electronMotionMode = 'no-light';
  } else if (clampedVoltage <= -solved.stoppingPotentialV && solved.stoppingPotentialV > 0) {
    electronMotionMode = 'stopped';
  } else if (clampedVoltage < 0) {
    electronMotionMode = 'retarding';
  } else if (clampedVoltage > 0) {
    electronMotionMode = 'accelerating';
  } else {
    electronMotionMode = 'coasting';
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
