/**
 * @file physics.test.js
 * @description Pure Node.js Physics Accuracy Audit for Unit 19.2: Photoelectric Effect.
 * Verifies E, W, f₀, λ₀, E_{k,max}, V_s, v_max, f < f₀ cutoff, I–ΔV curves, and E_{k,max}–f / V_s–f linear slopes.
 */

import {
  PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
  ELEMENTARY_CHARGE,
  ELECTRON_MASS
} from '../src/shared/constants.js';
import {
  electronVoltsToJoules,
  joulesToElectronVolts,
  calculatePhotonEnergyFromFrequency,
  calculatePhotonEnergyFromWavelength,
  calculateThresholdFrequency,
  calculateThresholdWavelength,
  calculateWorkFunctionFromThresholdFrequency,
  calculateWorkFunctionFromThresholdWavelength,
  canEmitPhotoelectrons,
  calculatePhotoelectricEffect,
  calculateStoppingPotential,
  calculateMaxElectronSpeed,
  calculateWavelengthForStoppingPotential,
  wavelengthToRGB
} from '../src/physics/photoelectric-solver.js';
import { METALS, getMetalById, createPhotoelectricTubeState } from '../src/physics/photoelectric-model.js';
import {
  calculateSaturationCurrent,
  calculatePhotocurrent,
  sampleIVCurve
} from '../src/physics/iv-curve-solver.js';
import { createIVCurveModel } from '../src/physics/iv-curve-model.js';
import {
  evaluateEkVsFrequency,
  calculateGraphSlope,
  calculatePlanckFromTwoPoints,
  calculatePlanckFromStoppingPotentialPoints,
  calculateWorkFunctionFromGraphPoint
} from '../src/physics/ek-frequency-solver.js';
import { createEkFrequencyModel } from '../src/physics/ek-frequency-model.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

function assertCloseTo(actual, expected, tolerance = 1e-2, message = '') {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${message} (Expected: ~${expected}, Got: ${actual})`);
}

console.log('=============== 🧪 RUNNING UNIT 19.2 PHYSICS ACCURACY AUDIT ===============\n');

// --- Suite 1: Universal Constants & Unit Conversions ---
console.log('--- Test Suite 1: Constants & eV <-> J Conversion ---');
assertCloseTo(PLANCK_CONSTANT, 6.626e-34, 1e-37, 'Planck constant h = 6.626e-34 J·s');
assertCloseTo(SPEED_OF_LIGHT, 3.00e8, 1e5, 'Speed of light c = 3.00e8 m/s');
assertCloseTo(ELEMENTARY_CHARGE, 1.602e-19, 1e-22, 'Elementary charge e = 1.602e-19 C');
assertCloseTo(ELECTRON_MASS, 9.109e-31, 1e-34, 'Electron mass me = 9.109e-31 kg');
assertCloseTo(electronVoltsToJoules(2.0), 3.204e-19, 1e-22, '2.0 eV -> 3.204e-19 J');
assertCloseTo(joulesToElectronVolts(3.204e-19), 2.0, 1e-6, '3.204e-19 J -> 2.0 eV');

// --- Suite 2: IPST 8-Metal Table & Thresholds ---
console.log('\n--- Test Suite 2: IPST Metal Catalog (W, f₀, λ₀) ---');
assert(METALS.length === 8, 'IPST metal table contains all 8 standard metals (Cs, K, Na, Ca, Al, Zn, Cu, Au)');
const cs = getMetalById('cs');
const na = getMetalById('na');
const zn = getMetalById('zn');
const au = getMetalById('au');

assertCloseTo(cs.workFunctionEV, 2.1, 1e-6, 'Cesium work function W = 2.1 eV');
assertCloseTo(cs.thresholdFrequency14, 5.08, 0.02, 'Cesium threshold frequency f₀ ≈ 5.08 × 10¹⁴ Hz');
assertCloseTo(cs.thresholdWavelengthNm, 590.9, 0.5, 'Cesium threshold wavelength λ₀ ≈ 590.9 nm');

assertCloseTo(na.workFunctionEV, 2.4, 1e-6, 'Sodium work function W = 2.4 eV');
assertCloseTo(na.thresholdFrequency14, 5.80, 0.02, 'Sodium threshold frequency f₀ ≈ 5.80 × 10¹⁴ Hz');
assertCloseTo(na.thresholdWavelengthNm, 517.0, 0.5, 'Sodium threshold wavelength λ₀ ≈ 517.0 nm');

assertCloseTo(zn.thresholdWavelengthNm, 288.6, 0.5, 'Zinc threshold wavelength λ₀ ≈ 288.6 nm (UV)');
assertCloseTo(au.workFunctionEV, 5.1, 1e-6, 'Gold work function W = 5.1 eV');

// Roundtrip W <-> f₀ and W <-> λ₀
const f0Na = calculateThresholdFrequency(2.4);
assertCloseTo(calculateWorkFunctionFromThresholdFrequency(f0Na).electronVolts, 2.4, 1e-6, 'Roundtrip W -> f₀ -> W exact');
const l0Cs = calculateThresholdWavelength(2.1);
assertCloseTo(calculateWorkFunctionFromThresholdWavelength(l0Cs.meters).electronVolts, 2.1, 1e-6, 'Roundtrip W -> λ₀ -> W exact');

// --- Suite 3: Photon Energy & Einstein Photoelectric Equation ---
console.log('\n--- Test Suite 3: Photon Energy, Ek,max, Vs, vmax & Below-Threshold Cutoff ---');
const p400 = calculatePhotonEnergyFromWavelength(400e-9);
assertCloseTo(p400.electronVolts, 3.10, 0.01, '400 nm photon energy E ≈ 3.10 eV');

const pFreq = calculatePhotonEnergyFromFrequency(8.00e14);
assertCloseTo(pFreq.electronVolts, 3.31, 0.01, '8.00 × 10¹⁴ Hz photon energy E ≈ 3.31 eV');

// Emitting case: Sodium (2.4 eV) + 300 nm UV
const emitNa = calculatePhotoelectricEffect({ wavelengthNm: 300, workFunctionEV: 2.4 });
assert(emitNa.emitsElectrons === true, 'Sodium under 300 nm emits photoelectrons');
assertCloseTo(emitNa.photonEnergyEV, 4.136, 0.01, '300 nm photon energy ≈ 4.14 eV');
assertCloseTo(emitNa.ekMaxEV, 1.736, 0.01, 'Ek,max = 4.136 - 2.40 ≈ 1.74 eV');
assertCloseTo(emitNa.stoppingPotentialV, 1.736, 0.01, 'Stopping potential Vs ≈ 1.74 V');
assertCloseTo(calculateStoppingPotential(emitNa.ekMaxEV), emitNa.stoppingPotentialV, 1e-6, 'Vs helper matches solver');
assertCloseTo(emitNa.vMaxMs / 1e5, 7.81, 0.05, 'vmax ≈ 7.81 × 10⁵ m/s');
assertCloseTo(calculateMaxElectronSpeed(emitNa.ekMaxJ), emitNa.vMaxMs, 1e-3, 'vmax helper matches solver');

// Non-emitting case: Sodium (2.4 eV) + 650 nm Red light (f < f₀)
const noEmitNa = calculatePhotoelectricEffect({ wavelengthNm: 650, workFunctionEV: 2.4 });
assert(noEmitNa.emitsElectrons === false, 'Sodium under 650 nm red light (f < f₀) does NOT emit photoelectrons');
assert(noEmitNa.ekMaxEV === 0 && noEmitNa.ekMaxJ === 0, 'When f < f₀, Ek,max = 0');
assert(noEmitNa.stoppingPotentialV === 0 && noEmitNa.vMaxMs === 0, 'When f < f₀, Vs = 0 and vmax = 0');
assert(canEmitPhotoelectrons(4.0e14, 2.4) === false, 'canEmitPhotoelectrons returns false for f < f₀');
assert(canEmitPhotoelectrons(6.0e14, 2.4) === true, 'canEmitPhotoelectrons returns true for f >= f₀');

// Reverse wavelength calculation for target stopping potential
const revZn = calculateWavelengthForStoppingPotential(4.3, 1.2);
assertCloseTo(revZn.nm, 225.6, 0.5, 'Zinc (4.3 eV) + Vs=1.2 V requires λ ≈ 225.6 nm');

// Wavelength to RGB mapping
const uvCol = wavelengthToRGB(280);
assert(uvCol.isUV === true && uvCol.region === 'ultraviolet', '280 nm classified as UV');
const redCol = wavelengthToRGB(650);
assert(redCol.isUV === false && redCol.r > 200 && redCol.g < 50, '650 nm maps to visible red');

// --- Suite 4: Photoelectric Tube & I–ΔV Characteristic Curves ---
console.log('\n--- Test Suite 4: I–ΔV Characteristic Curves (Intensity vs Frequency Modes) ---');
const tubeBelow = createPhotoelectricTubeState({ metalId: 'na', wavelengthNm: 650, intensityPercent: 100, voltageV: 5.0 });
assert(tubeBelow.photocurrentMicroA === 0 && tubeBelow.electronMotionMode === 'below-threshold', 'Below threshold gives I = 0 µA even at 100% intensity and +5V');

const iSat50 = calculateSaturationCurrent(50, true);
const iSat100 = calculateSaturationCurrent(100, true);
assertCloseTo(iSat100, 2 * iSat50, 1e-6, 'Saturation current Isat doubles when light intensity doubles');

const currAtCutoff = calculatePhotocurrent(-1.74, 1.74, 100, true);
const currBelowCutoff = calculatePhotocurrent(-2.5, 1.74, 100, true);
const currZeroV = calculatePhotocurrent(0, 1.74, 100, true);
const currPosV = calculatePhotocurrent(4.0, 1.74, 100, true);
assert(currAtCutoff === 0 && currBelowCutoff === 0, 'Photocurrent is strictly 0 for ΔV <= -Vs');
assert(currZeroV > 0 && currPosV > currZeroV && currPosV <= 100, 'Photocurrent increases monotonically from -Vs toward Isat');

const ivModeA = createIVCurveModel({ metalId: 'na', wavelengthNm: 350, intensityPercent: 60, comparisonMode: 'intensity' });
assert(ivModeA.curves.length >= 2, 'Mode A generates multiple intensity curves');
assert(
  ivModeA.curves.every((c) => Math.abs(c.stoppingPotentialV - ivModeA.primary.stoppingPotentialV) < 1e-6),
  'Mode A (intensity comparison): all curves share identical stopping potential -Vs'
);

const ivModeB = createIVCurveModel({ metalId: 'na', wavelengthNm: 350, intensityPercent: 70, comparisonMode: 'frequency' });
assert(ivModeB.curves.length === 3, 'Mode B generates 3 frequency comparison curves');
assert(
  ivModeB.curves[2].stoppingPotentialV > ivModeB.curves[1].stoppingPotentialV,
  'Mode B (frequency comparison): higher frequency shifts stopping potential |Vs| higher'
);

const sampledIV = sampleIVCurve({ stoppingPotentialV: 1.5, saturationCurrentMicroA: 80, emitsElectrons: true });
assert(sampledIV.some((p) => Math.abs(p.v + 1.5) < 1e-6 && p.current === 0), 'Sampled I-V curve explicitly contains exact (-Vs, 0) intercept');

// --- Suite 5: E_{k,max}–f and V_s–f Linear Graph Solvers ---
console.log('\n--- Test Suite 5: Ek,max–f & Vs–f Slopes (Parallel Metal Lines) ---');
const slopeEk = calculateGraphSlope('ek');
const slopeVs = calculateGraphSlope('vs');
assertCloseTo(slopeEk.valueSI, PLANCK_CONSTANT, 1e-37, 'Ek,max–f slope equals h = 6.626e-34 J·s');
assertCloseTo(slopeVs.valueSI, PLANCK_CONSTANT / ELEMENTARY_CHARGE, 1e-18, 'Vs–f slope equals h/e ≈ 4.136e-15 V·s');

const pt1 = evaluateEkVsFrequency(8e14, 2.4);
const pt2 = evaluateEkVsFrequency(14e14, 2.4);
const hRecovered = calculatePlanckFromTwoPoints(pt1.frequencyHz, pt1.ekMaxJ, pt2.frequencyHz, pt2.ekMaxJ);
assertCloseTo(hRecovered, PLANCK_CONSTANT, 1e-36, 'Two-point slope on Ek,max–f recovers exact Planck constant h');

const vsSlopeRes = calculatePlanckFromStoppingPotentialPoints(pt1.frequencyHz, pt1.stoppingPotentialV, pt2.frequencyHz, pt2.stoppingPotentialV);
assertCloseTo(vsSlopeRes.planckJouleSec, PLANCK_CONSTANT, 1e-36, 'Two-point slope on Vs–f times e recovers exact Planck constant h');

const wDeduced = calculateWorkFunctionFromGraphPoint(pt2.frequencyHz, pt2.ekMaxEV);
assertCloseTo(wDeduced.electronVolts, 2.4, 1e-6, 'Graph point (f, Ek,max) accurately deduces metal work function W = 2.4 eV');

const ekfModel = createEkFrequencyModel({ metalIds: ['cs', 'na', 'zn'], yAxisMode: 'ek', probeFrequency14: 12.0 });
assert(ekfModel.series.length === 3, 'Multi-metal Ek,max–f model supports 3 simultaneous metals');
assert(ekfModel.series[0].yIntercept === -2.1 && ekfModel.series[2].yIntercept === -4.3, 'Extrapolated Y-intercepts match -W for each metal');

console.log(`\n=======================================================`);
console.log(`📊 PHYSICS AUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log(`=======================================================`);

if (failed > 0) {
  process.exit(1);
}
