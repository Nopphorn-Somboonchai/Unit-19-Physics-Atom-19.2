/**
 * @file ek-frequency-model.js
 * @description Pure Physics Domain Model for E_{k,max}-f and V_s-f Multi-Metal Comparison Graph.
 * Supports comparing up to 3 metals simultaneously to demonstrate parallel lines with slope h (or h/e).
 */

import { getMetalById } from './photoelectric-model.js';
import { evaluateEkVsFrequency, calculateGraphSlope } from './ek-frequency-solver.js';

/**
 * Create multi-metal E_{k,max}-f / V_s-f domain model
 * @param {{
 *   metalIds?: string[],
 *   yAxisMode?: 'ek' | 'vs',
 *   probeFrequency14?: number,
 *   showExtrapolation?: boolean
 * }} params
 * @returns {Object}
 */
export function createEkFrequencyModel({
  metalIds = ['cs', 'na', 'zn'],
  yAxisMode = 'ek',
  probeFrequency14 = 12.0,
  showExtrapolation = true
} = {}) {
  const mode = yAxisMode === 'vs' ? 'vs' : 'ek';
  const fMin14 = 0;
  const fMax14 = 20;
  const yMin = -6.0;
  const yMax = 6.5;

  const clampedProbe14 = Math.max(0.5, Math.min(fMax14, Number(probeFrequency14) || 12.0));
  const uniqueIds = Array.from(new Set((Array.isArray(metalIds) ? metalIds : ['cs', 'na', 'zn']))).slice(0, 3);
  if (uniqueIds.length === 0) uniqueIds.push('na');

  const slope = calculateGraphSlope(mode);

  const series = uniqueIds.map((id) => {
    const metal = getMetalById(id);
    const f0_14 = metal.thresholdFrequency14;
    const yIntercept = -metal.workFunctionEV; // -W in eV or -W/e in V (numerically equal)
    const endEval = evaluateEkVsFrequency(fMax14 * 1e14, metal.workFunctionEV);
    const probeEval = evaluateEkVsFrequency(clampedProbe14 * 1e14, metal.workFunctionEV);

    return {
      metal,
      f0_14,
      yIntercept,
      extrapolatedSegment: {
        x1: 0,
        y1: yIntercept,
        x2: f0_14,
        y2: 0
      },
      solidSegment: {
        x1: f0_14,
        y1: 0,
        x2: fMax14,
        y2: mode === 'vs' ? endEval.stoppingPotentialV : endEval.ekMaxEV
      },
      probe: {
        frequency14: clampedProbe14,
        emitsElectrons: probeEval.emitsElectrons,
        yValue: mode === 'vs' ? probeEval.stoppingPotentialV : probeEval.ekMaxEV,
        ekMaxEV: probeEval.ekMaxEV,
        stoppingPotentialV: probeEval.stoppingPotentialV
      }
    };
  });

  // Sort by threshold frequency so legend & labels appear cleanly left-to-right
  series.sort((a, b) => a.f0_14 - b.f0_14);

  return {
    yAxisMode: mode,
    yAxisLabel: mode === 'vs' ? 'ความต่างศักย์หยุดยั้ง Vs (V)' : 'พลังงานจลน์สูงสุด Ek,max (eV)',
    yUnit: mode === 'vs' ? 'V' : 'eV',
    interceptSymbol: mode === 'vs' ? '-W/e' : '-W',
    fMin14,
    fMax14,
    yMin,
    yMax,
    probeFrequency14: clampedProbe14,
    showExtrapolation: Boolean(showExtrapolation),
    slope,
    series
  };
}
