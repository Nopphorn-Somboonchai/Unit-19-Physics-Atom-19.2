/**
 * @file iv-curve-solver.js
 * @description Pure Physics Domain Solver for Photoelectric Current (I) vs Potential Difference (ΔV).
 * Computes saturation current I_sat proportional to light intensity and smooth I(ΔV) with exact cutoff at -V_s.
 */

/** Maximum reference saturation current at 100% light intensity (µA) */
export const MAX_SATURATION_CURRENT_MICRO_A = 100;

/**
 * Calculate saturation photocurrent I_sat (µA), proportional to light intensity when f >= f₀
 * @param {number} intensityPercent - Light intensity in [0, 100]
 * @param {boolean} emitsElectrons - Whether photon energy meets threshold (f >= f₀)
 * @returns {number} Saturation current in µA
 */
export function calculateSaturationCurrent(intensityPercent, emitsElectrons) {
  if (!emitsElectrons) return 0;
  const clamped = Math.max(0, Math.min(100, Number(intensityPercent) || 0));
  return (clamped / 100) * MAX_SATURATION_CURRENT_MICRO_A;
}

/**
 * Calculate photoelectric current I(ΔV) in microamperes (µA).
 * - Strictly 0 when !emitsElectrons or I_sat == 0 or ΔV <= -V_s
 * - Smoothly rises for ΔV > -V_s and saturates toward I_sat for positive accelerating potential.
 * @param {number} voltageV - Applied anode-to-cathode potential difference ΔV (V)
 * @param {number} stoppingPotentialV - Magnitude of stopping potential V_s (>= 0 V)
 * @param {number} saturationCurrentMicroA - Saturation current I_sat (µA)
 * @param {boolean} emitsElectrons - Whether f >= f₀
 * @returns {number} Photocurrent in µA
 */
export function calculatePhotocurrent(
  voltageV,
  stoppingPotentialV,
  saturationCurrentMicroA,
  emitsElectrons
) {
  if (!emitsElectrons || saturationCurrentMicroA <= 0) return 0;

  const v = Number(voltageV);
  const vs = Math.max(0, Number(stoppingPotentialV) || 0);

  if (vs <= 1e-9) {
    // At exact threshold f = f₀, photoelectrons emerge with ~0 kinetic energy
    if (v <= 0) return 0;
    return saturationCurrentMicroA * (1 - Math.exp(-2.6 * v));
  }

  if (v <= -vs) {
    return 0;
  }

  // Smooth C1 monotonic rise from I(-V_s) = 0 to I_sat for positive ΔV
  const u = (v + vs) / (vs + 0.85);
  const current = saturationCurrentMicroA * (1 - Math.exp(-3.2 * Math.pow(u, 1.35)));
  return Math.max(0, Math.min(saturationCurrentMicroA, current));
}

/**
 * Sample I(ΔV) points across [vMin, vMax] ensuring the exact cutoff point (-V_s, 0) is included.
 * @param {{ stoppingPotentialV: number, saturationCurrentMicroA: number, emitsElectrons: boolean, vMin?: number, vMax?: number, steps?: number }} params
 * @returns {Array<{ v: number, current: number }>}
 */
export function sampleIVCurve({
  stoppingPotentialV,
  saturationCurrentMicroA,
  emitsElectrons,
  vMin = -5.0,
  vMax = 5.0,
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

  // Ensure exact cutoff point is represented for sharp intercept plotting
  if (emitsElectrons && cutoffV >= vMin && cutoffV <= vMax) {
    points.push({ v: cutoffV, current: 0 });
    points.sort((a, b) => a.v - b.v);
  }

  return points;
}
