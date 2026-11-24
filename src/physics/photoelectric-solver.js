/**
 * @file photoelectric-solver.js
 * @description Pure Physics Domain Solver for Unit 19.2: Photoelectric Effect.
 * Implements Einstein's photoelectric equation, threshold frequency/wavelength,
 * stopping potential, maximum photoelectron speed, and wavelength-to-RGB mapping.
 * Pure JS functions only — zero rendering or browser dependencies.
 */

import {
  PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
  ELEMENTARY_CHARGE,
  ELECTRON_MASS,
  EV_TO_JOULES,
  JOULES_TO_EV,
  HC_JOULE_METERS
} from '../shared/constants.js';

/**
 * Convert electron-volts (eV) to Joules (J)
 * @param {number} ev
 * @returns {number}
 */
export function electronVoltsToJoules(ev) {
  return Number(ev) * EV_TO_JOULES;
}

/**
 * Convert Joules (J) to electron-volts (eV)
 * @param {number} joules
 * @returns {number}
 */
export function joulesToElectronVolts(joules) {
  return Number(joules) * JOULES_TO_EV;
}

/**
 * Calculate frequency f = c / λ from wavelength in meters
 * @param {number} wavelengthMeters
 * @returns {number} Frequency in Hz
 */
export function frequencyFromWavelength(wavelengthMeters) {
  const lambda = Number(wavelengthMeters);
  if (!Number.isFinite(lambda) || lambda <= 0) {
    throw new Error('Wavelength must be a positive finite number');
  }
  return SPEED_OF_LIGHT / lambda;
}

/**
 * Calculate wavelength λ = c / f from frequency in Hz
 * @param {number} frequencyHz
 * @returns {number} Wavelength in meters
 */
export function wavelengthFromFrequency(frequencyHz) {
  const f = Number(frequencyHz);
  if (!Number.isFinite(f) || f <= 0) {
    throw new Error('Frequency must be a positive finite number');
  }
  return SPEED_OF_LIGHT / f;
}

/**
 * Calculate single photon energy E = hf from frequency (Hz)
 * @param {number} frequencyHz
 * @returns {{ joules: number, electronVolts: number, frequencyHz: number }}
 */
export function calculatePhotonEnergyFromFrequency(frequencyHz) {
  const f = Number(frequencyHz);
  if (!Number.isFinite(f) || f <= 0) {
    throw new Error('Photon frequency must be a positive finite number');
  }
  const joules = PLANCK_CONSTANT * f;
  return {
    joules,
    electronVolts: joulesToElectronVolts(joules),
    frequencyHz: f
  };
}

/**
 * Calculate single photon energy E = hc / λ from wavelength (meters)
 * @param {number} wavelengthMeters
 * @returns {{ joules: number, electronVolts: number, frequencyHz: number, wavelengthMeters: number, wavelengthNm: number }}
 */
export function calculatePhotonEnergyFromWavelength(wavelengthMeters) {
  const lambda = Number(wavelengthMeters);
  if (!Number.isFinite(lambda) || lambda <= 0) {
    throw new Error('Photon wavelength must be a positive finite number');
  }
  const frequencyHz = SPEED_OF_LIGHT / lambda;
  const joules = HC_JOULE_METERS / lambda;
  return {
    joules,
    electronVolts: joulesToElectronVolts(joules),
    frequencyHz,
    wavelengthMeters: lambda,
    wavelengthNm: lambda * 1e9
  };
}

/**
 * Calculate threshold frequency f₀ = W / h from work function W (eV)
 * @param {number} workFunctionEV
 * @returns {number} Threshold frequency in Hz
 */
export function calculateThresholdFrequency(workFunctionEV) {
  const wEV = Number(workFunctionEV);
  if (!Number.isFinite(wEV) || wEV <= 0) {
    throw new Error('Work function must be a positive finite number');
  }
  const wJoules = electronVoltsToJoules(wEV);
  return wJoules / PLANCK_CONSTANT;
}

/**
 * Calculate threshold wavelength λ₀ = hc / W from work function W (eV)
 * @param {number} workFunctionEV
 * @returns {{ meters: number, nm: number }}
 */
export function calculateThresholdWavelength(workFunctionEV) {
  const wEV = Number(workFunctionEV);
  if (!Number.isFinite(wEV) || wEV <= 0) {
    throw new Error('Work function must be a positive finite number');
  }
  const wJoules = electronVoltsToJoules(wEV);
  const meters = HC_JOULE_METERS / wJoules;
  return {
    meters,
    nm: meters * 1e9
  };
}

/**
 * Calculate work function W = h f₀ from threshold frequency f₀ (Hz)
 * @param {number} thresholdFrequencyHz
 * @returns {{ joules: number, electronVolts: number }}
 */
export function calculateWorkFunctionFromThresholdFrequency(thresholdFrequencyHz) {
  const f0 = Number(thresholdFrequencyHz);
  if (!Number.isFinite(f0) || f0 <= 0) {
    throw new Error('Threshold frequency must be positive');
  }
  const joules = PLANCK_CONSTANT * f0;
  return {
    joules,
    electronVolts: joulesToElectronVolts(joules)
  };
}

/**
 * Calculate work function W = hc / λ₀ from threshold wavelength λ₀ (meters)
 * @param {number} thresholdWavelengthMeters
 * @returns {{ joules: number, electronVolts: number }}
 */
export function calculateWorkFunctionFromThresholdWavelength(thresholdWavelengthMeters) {
  const lambda0 = Number(thresholdWavelengthMeters);
  if (!Number.isFinite(lambda0) || lambda0 <= 0) {
    throw new Error('Threshold wavelength must be positive');
  }
  const joules = HC_JOULE_METERS / lambda0;
  return {
    joules,
    electronVolts: joulesToElectronVolts(joules)
  };
}

/**
 * Check whether incident frequency f satisfies photoelectric emission condition f >= f₀
 * @param {number} frequencyHz
 * @param {number} workFunctionEV
 * @returns {boolean}
 */
export function canEmitPhotoelectrons(frequencyHz, workFunctionEV) {
  const f0 = calculateThresholdFrequency(workFunctionEV);
  return Number(frequencyHz) >= f0 * (1 - 1e-12);
}

/**
 * Calculate stopping potential V_s = E_{k,max} / e from E_{k,max} in Joules
 * @param {number} ekMaxJoules
 * @returns {number} Stopping potential magnitude in Volts (>= 0)
 */
export function calculateStoppingPotentialFromJoules(ekMaxJoules) {
  const ek = Math.max(0, Number(ekMaxJoules) || 0);
  return ek / ELEMENTARY_CHARGE;
}

/**
 * Calculate stopping potential V_s from E_{k,max} in eV
 * @param {number} ekMaxEV
 * @returns {number} Stopping potential magnitude in Volts (>= 0)
 */
export function calculateStoppingPotential(ekMaxEV) {
  return Math.max(0, Number(ekMaxEV) || 0);
}

/**
 * Calculate maximum photoelectron speed v_max = sqrt(2 * E_{k,max} / m_e)
 * @param {number} ekMaxJoules
 * @returns {number} Speed in m/s (>= 0)
 */
export function calculateMaxElectronSpeed(ekMaxJoules) {
  const ek = Math.max(0, Number(ekMaxJoules) || 0);
  if (ek <= 0) return 0;
  return Math.sqrt((2 * ek) / ELECTRON_MASS);
}

/**
 * Calculate required incident wavelength λ to achieve a target stopping potential V_s
 * on a metal with work function W (eV): hc/λ = W + e V_s
 * @param {number} workFunctionEV
 * @param {number} stoppingPotentialV
 * @returns {{ meters: number, nm: number, frequencyHz: number, photonEnergyEV: number }}
 */
export function calculateWavelengthForStoppingPotential(workFunctionEV, stoppingPotentialV) {
  const wEV = Number(workFunctionEV);
  const vs = Number(stoppingPotentialV);
  if (!Number.isFinite(wEV) || wEV <= 0 || !Number.isFinite(vs) || vs < 0) {
    throw new Error('Work function must be positive and stopping potential non-negative');
  }
  const photonEnergyEV = wEV + vs;
  const photonEnergyJ = electronVoltsToJoules(photonEnergyEV);
  const meters = HC_JOULE_METERS / photonEnergyJ;
  const frequencyHz = photonEnergyJ / PLANCK_CONSTANT;
  return {
    meters,
    nm: meters * 1e9,
    frequencyHz,
    photonEnergyEV
  };
}

/**
 * Solve full Einstein photoelectric effect state for either frequencyHz or wavelengthMeters
 * @param {{ frequencyHz?: number, wavelengthMeters?: number, wavelengthNm?: number, workFunctionEV: number }} params
 * @returns {Object} Complete photoelectric solution
 */
export function calculatePhotoelectricEffect({
  frequencyHz,
  wavelengthMeters,
  wavelengthNm,
  workFunctionEV
}) {
  const wEV = Number(workFunctionEV);
  if (!Number.isFinite(wEV) || wEV <= 0) {
    throw new Error('Valid positive workFunctionEV is required');
  }

  let fHz;
  let lambdaM;
  if (frequencyHz !== undefined && frequencyHz !== null) {
    fHz = Number(frequencyHz);
    lambdaM = wavelengthFromFrequency(fHz);
  } else if (wavelengthMeters !== undefined && wavelengthMeters !== null) {
    lambdaM = Number(wavelengthMeters);
    fHz = frequencyFromWavelength(lambdaM);
  } else if (wavelengthNm !== undefined && wavelengthNm !== null) {
    lambdaM = Number(wavelengthNm) * 1e-9;
    fHz = frequencyFromWavelength(lambdaM);
  } else {
    throw new Error('Either frequencyHz, wavelengthMeters, or wavelengthNm must be provided');
  }

  const photonEnergyJ = PLANCK_CONSTANT * fHz;
  const photonEnergyEV = joulesToElectronVolts(photonEnergyJ);
  const workFunctionJ = electronVoltsToJoules(wEV);
  const thresholdFrequencyHz = workFunctionJ / PLANCK_CONSTANT;
  const thresholdWavelength = calculateThresholdWavelength(wEV);

  const emitsElectrons = fHz >= thresholdFrequencyHz * (1 - 1e-12);
  const rawEkJ = photonEnergyJ - workFunctionJ;
  const ekMaxJ = emitsElectrons && rawEkJ > 0 ? rawEkJ : 0;
  const ekMaxEV = joulesToElectronVolts(ekMaxJ);
  const stoppingPotentialV = calculateStoppingPotentialFromJoules(ekMaxJ);
  const vMaxMs = calculateMaxElectronSpeed(ekMaxJ);

  return {
    frequencyHz: fHz,
    frequency14: fHz / 1e14,
    wavelengthMeters: lambdaM,
    wavelengthNm: lambdaM * 1e9,
    photonEnergyJ,
    photonEnergyEV,
    workFunctionJ,
    workFunctionEV: wEV,
    thresholdFrequencyHz,
    thresholdFrequency14: thresholdFrequencyHz / 1e14,
    thresholdWavelengthMeters: thresholdWavelength.meters,
    thresholdWavelengthNm: thresholdWavelength.nm,
    emitsElectrons,
    ekMaxJ,
    ekMaxEV,
    stoppingPotentialV,
    vMaxMs
  };
}

/**
 * Determine electromagnetic spectrum region for a given wavelength (nm)
 * @param {number} wavelengthNm
 * @returns {'ultraviolet' | 'visible' | 'infrared'}
 */
export function calculateSpectralRegion(wavelengthNm) {
  const nm = Number(wavelengthNm);
  if (nm < 380) return 'ultraviolet';
  if (nm <= 750) return 'visible';
  return 'infrared';
}

/**
 * Convert wavelength in nanometers (150 - 900 nm) into visually accurate RGB & hex representation
 * UV (<380 nm) renders as soft ultraviolet violet with explicit isUV flag; IR (>750 nm) as deep red with isIR flag.
 * @param {number} wavelengthNm
 * @returns {{ r: number, g: number, b: number, hex: string, labelTh: string, region: string, isUV: boolean, isIR: boolean }}
 */
export function wavelengthToRGB(wavelengthNm) {
  const nm = Number(wavelengthNm);

  if (nm < 380) {
    return {
      r: 168,
      g: 85,
      b: 247,
      hex: '#a855f7',
      labelTh: 'อัลตราไวโอเลต (UV)',
      region: 'ultraviolet',
      isUV: true,
      isIR: false
    };
  }

  if (nm > 750) {
    return {
      r: 185,
      g: 28,
      b: 28,
      hex: '#b91c1c',
      labelTh: 'อินฟราเรด (IR)',
      region: 'infrared',
      isUV: false,
      isIR: true
    };
  }

  let r = 0;
  let g = 0;
  let b = 0;
  let labelTh = 'แสงที่ตามองเห็น';

  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380);
    g = 0;
    b = 1;
    labelTh = nm < 420 ? 'สีม่วง' : 'สีคราม-น้ำเงิน';
  } else if (nm >= 440 && nm < 490) {
    r = 0;
    g = (nm - 440) / (490 - 440);
    b = 1;
    labelTh = nm < 470 ? 'สีน้ำเงิน' : 'สีฟ้า-น้ำเงิน';
  } else if (nm >= 490 && nm < 510) {
    r = 0;
    g = 1;
    b = -(nm - 510) / (510 - 490);
    labelTh = 'สีเขียวแกมฟ้า';
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1;
    b = 0;
    labelTh = nm < 560 ? 'สีเขียว' : 'สีเหลืองแกมเขียว';
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = -(nm - 645) / (645 - 580);
    b = 0;
    labelTh = nm < 605 ? 'สีเหลือง-ส้ม' : 'สีส้ม-แดง';
  } else {
    r = 1;
    g = 0;
    b = 0;
    labelTh = 'สีแดง';
  }

  // Edge intensity attenuation near 380 nm and 750 nm
  let factor = 1.0;
  if (nm >= 380 && nm < 420) {
    factor = 0.45 + 0.55 * ((nm - 380) / (420 - 380));
  } else if (nm > 700 && nm <= 750) {
    factor = 0.45 + 0.55 * ((750 - nm) / (750 - 700));
  }

  const gamma = 0.8;
  const toChannel = (c) => (c <= 0 ? 0 : Math.min(255, Math.round(255 * Math.pow(c * factor, gamma))));
  const R = toChannel(r);
  const G = toChannel(g);
  const B = toChannel(b);
  const toHex = (v) => v.toString(16).padStart(2, '0');

  return {
    r: R,
    g: G,
    b: B,
    hex: `#${toHex(R)}${toHex(G)}${toHex(B)}`,
    labelTh,
    region: 'visible',
    isUV: false,
    isIR: false
  };
}
