/**
 * @file ek-frequency-solver.js
 * @description Pure Physics Domain Solver for E_{k,max}-f and V_s-f linear graphs.
 * Proves identical slope h (or h/e) for all metals, X-intercept = f₀, Y-intercept = -W (or -W/e).
 */

import {
  PLANCK_CONSTANT,
  ELEMENTARY_CHARGE,
  PLANCK_CONSTANT_EV_S
} from '../shared/constants.js';
import {
  electronVoltsToJoules,
  joulesToElectronVolts,
  calculateThresholdFrequency
} from './photoelectric-solver.js';

/**
 * Evaluate E_{k,max}(f) and V_s(f) at a given frequency f (Hz) for a metal with work function W (eV).
 * Includes both physical (clamped at 0 for f < f₀) and linearly extrapolated values for dashed line plotting.
 * @param {number} frequencyHz
 * @param {number} workFunctionEV
 * @returns {Object}
 */
export function evaluateEkVsFrequency(frequencyHz, workFunctionEV) {
  const f = Number(frequencyHz);
  const wEV = Number(workFunctionEV);
  const f0 = calculateThresholdFrequency(wEV);
  const photonEV = PLANCK_CONSTANT_EV_S * f;
  const extrapolatedEkEV = photonEV - wEV;
  const emitsElectrons = f >= f0 * (1 - 1e-12);
  const ekMaxEV = emitsElectrons && extrapolatedEkEV > 0 ? extrapolatedEkEV : 0;
  const ekMaxJ = electronVoltsToJoules(ekMaxEV);
  const stoppingPotentialV = ekMaxEV; // E_k(eV) numerically equals V_s(V)
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

/**
 * Return theoretical slope metadata for E_{k,max}-f or V_s-f graph
 * @param {'ek' | 'vs'} yAxisMode
 * @returns {{ valueSI: number, valuePer10e14Hz: number, unitSI: string, displayUnit: string, symbolText: string }}
 */
export function calculateGraphSlope(yAxisMode = 'ek') {
  if (yAxisMode === 'vs') {
    const hOverE = PLANCK_CONSTANT / ELEMENTARY_CHARGE; // ~4.136e-15 V·s
    return {
      valueSI: hOverE,
      valuePer10e14Hz: hOverE * 1e14, // ~0.4136 V per 10^14 Hz
      unitSI: 'V·s',
      displayUnit: 'V / (10¹⁴ Hz)',
      symbolText: 'h/e'
    };
  }
  return {
    valueSI: PLANCK_CONSTANT, // 6.626e-34 J·s
    valuePer10e14Hz: PLANCK_CONSTANT_EV_S * 1e14, // ~0.4136 eV per 10^14 Hz
    unitSI: 'J·s',
    displayUnit: 'eV / (10¹⁴ Hz)',
    symbolText: 'h'
  };
}

/**
 * Calculate experimental Planck's constant h from two points on E_{k,max}-f graph:
 * h = (E_{k2} - E_{k1}) / (f_2 - f_1)
 * @param {number} f1Hz
 * @param {number} ek1Joules
 * @param {number} f2Hz
 * @param {number} ek2Joules
 * @returns {number} Planck's constant in J·s
 */
export function calculatePlanckFromTwoPoints(f1Hz, ek1Joules, f2Hz, ek2Joules) {
  const df = Number(f2Hz) - Number(f1Hz);
  if (Math.abs(df) < 1e-12) {
    throw new Error('Frequencies f1 and f2 must be distinct to determine slope');
  }
  return (Number(ek2Joules) - Number(ek1Joules)) / df;
}

/**
 * Calculate experimental Planck's constant h from two points on V_s-f graph:
 * slope = (V_{s2} - V_{s1}) / (f_2 - f_1) = h/e  =>  h = e * slope
 * @param {number} f1Hz
 * @param {number} vs1Volts
 * @param {number} f2Hz
 * @param {number} vs2Volts
 * @returns {{ slopeVsPerHz: number, planckJouleSec: number }}
 */
export function calculatePlanckFromStoppingPotentialPoints(f1Hz, vs1Volts, f2Hz, vs2Volts) {
  const df = Number(f2Hz) - Number(f1Hz);
  if (Math.abs(df) < 1e-12) {
    throw new Error('Frequencies f1 and f2 must be distinct');
  }
  const slopeVsPerHz = (Number(vs2Volts) - Number(vs1Volts)) / df;
  return {
    slopeVsPerHz,
    planckJouleSec: slopeVsPerHz * ELEMENTARY_CHARGE
  };
}

/**
 * Deduce metal work function W (eV) from a single emitting graph point (f, E_{k,max}) or (f, V_s)
 * W = hf - E_{k,max}
 * @param {number} frequencyHz
 * @param {number} ekMaxEV
 * @returns {{ joules: number, electronVolts: number }}
 */
export function calculateWorkFunctionFromGraphPoint(frequencyHz, ekMaxEV) {
  const photonJ = PLANCK_CONSTANT * Number(frequencyHz);
  const ekJ = electronVoltsToJoules(ekMaxEV);
  const wJ = photonJ - ekJ;
  if (wJ <= 0) {
    throw new Error('Calculated work function must be positive');
  }
  return {
    joules: wJ,
    electronVolts: joulesToElectronVolts(wJ)
  };
}
