/**
 * @file iv-curve-model.js
 * @description Pure Physics Domain Model for Interactive I vs ΔV Photoelectric Curve Simulator.
 * Supports IPST Mode A (Varying Light Intensity at fixed f) and Mode B (Varying Frequency at fixed Intensity).
 */

import { getMetalById } from './photoelectric-model.js';
import { calculatePhotoelectricEffect } from './photoelectric-solver.js';
import {
  calculateSaturationCurrent,
  calculatePhotocurrent,
  sampleIVCurve
} from './iv-curve-solver.js';

/**
 * Create a complete I-ΔV domain model ready for Canvas plotting and readout display.
 * @param {{
 *   metalId?: string,
 *   wavelengthNm?: number,
 *   intensityPercent?: number,
 *   operatingVoltageV?: number,
 *   comparisonMode?: 'intensity' | 'frequency'
 * }} params
 * @returns {Object}
 */
export function createIVCurveModel({
  metalId = 'na',
  wavelengthNm = 350,
  intensityPercent = 70,
  operatingVoltageV = 1.0,
  comparisonMode = 'intensity'
} = {}) {
  const metal = getMetalById(metalId);
  const lambdaNm = Math.max(150, Math.min(750, Number(wavelengthNm) || 350));
  const intensity = Math.max(10, Math.min(100, Number(intensityPercent) || 70));
  const voltageV = Math.max(-5.0, Math.min(5.0, Number(operatingVoltageV) || 0));
  const mode = comparisonMode === 'frequency' ? 'frequency' : 'intensity';

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

  if (mode === 'intensity') {
    // Mode A (IPST): Same frequency f, 3 distinct intensities -> different I_sat, SAME -V_s
    const lowInt = Math.max(15, Math.round(intensity * 0.45));
    const midInt = intensity;
    const highInt = Math.min(100, Math.max(intensity + 25, 95));

    const presets = [
      { label: `ความเข้มต่ำ (${lowInt}%)`, intensityPct: lowInt, color: '#38bdf8', isPrimary: false },
      { label: `ความเข้มปัจจุบัน (${midInt}%)`, intensityPct: midInt, color: '#22d3ee', isPrimary: true },
      { label: `ความเข้มสูง (${highInt}%)`, intensityPct: highInt, color: '#f59e0b', isPrimary: false }
    ];

    // Deduplicate intensities cleanly while keeping primary highlighted
    const usedInt = new Set();
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
    // Mode B (IPST): Same intensity, 3 distinct frequencies (f1 < f2 < f3) -> different -V_s, SAME I_sat (if emitting)
    const lambdaLong = Math.min(700, Math.round(lambdaNm + 85));
    const lambdaMid = lambdaNm;
    const lambdaShort = Math.max(180, Math.round(lambdaNm - 75));

    const freqPresets = [
      { tag: 'f₁ (ต่ำกว่า)', lambda: lambdaLong, color: '#f59e0b', isPrimary: false },
      { tag: 'f₂ (ปัจจุบัน)', lambda: lambdaMid, color: '#22d3ee', isPrimary: true },
      { tag: 'f₃ (สูงกว่า)', lambda: lambdaShort, color: '#a855f7', isPrimary: false }
    ];

    for (const fp of freqPresets) {
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: fp.lambda,
        workFunctionEV: metal.workFunctionEV
      });
      const iSat = calculateSaturationCurrent(intensity, solved.emitsElectrons);
      curves.push({
        id: `freq-${fp.lambda}`,
        label: `${fp.tag}: λ=${fp.lambda} nm (Vs=${solved.stoppingPotentialV.toFixed(2)} V)`,
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
    vMin: -5.0,
    vMax: 5.0,
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
