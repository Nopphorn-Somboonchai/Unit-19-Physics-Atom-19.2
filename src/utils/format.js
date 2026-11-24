/**
 * @file format.js
 * @description Number formatting, SI unit display, and LaTeX scientific notation helpers for Unit 19.2.
 */

/**
 * Convert exponent integer to Unicode superscript (e.g. 14 -> ¹⁴, -19 -> ⁻¹⁹)
 * @param {number} exp
 * @returns {string}
 */
function toSuperscriptExponent(exp) {
  const map = {
    '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
    '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return String(exp).split('').map((ch) => map[ch] || ch).join('');
}

/**
 * Format a number into clean scientific notation (e.g. 5.80 × 10¹⁴)
 * @param {number} num
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatScientific(num, decimals = 2) {
  const val = Number(num);
  if (Number.isNaN(val) || val === 0) return '0';

  const absVal = Math.abs(val);
  if (absVal >= 0.01 && absVal < 10000) {
    return val.toFixed(decimals);
  }

  const exp = Math.floor(Math.log10(absVal));
  const mantissa = val / Math.pow(10, exp);
  return `${mantissa.toFixed(decimals)} × 10${toSuperscriptExponent(exp)}`;
}

/**
 * Format a number into standard LaTeX scientific notation (e.g. 5.80 \times 10^{14})
 * Suitable for KaTeX math environments without Unicode superscripts.
 * @param {number} num
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatLatexScientific(num, decimals = 2) {
  const val = Number(num);
  if (Number.isNaN(val) || val === 0) return '0';

  const absVal = Math.abs(val);
  if (absVal >= 0.01 && absVal < 10000) {
    return val.toFixed(decimals);
  }

  const exp = Math.floor(Math.log10(absVal));
  const mantissa = val / Math.pow(10, exp);
  return `${mantissa.toFixed(decimals)} \\times 10^{${exp}}`;
}

/**
 * Format wavelength in meters into readable SI unit string
 * @param {number} waveMeters
 * @returns {string}
 */
export function formatWavelength(waveMeters) {
  const w = Number(waveMeters);
  if (!Number.isFinite(w) || w <= 0) return '0 nm';
  if (w >= 1) return `${w.toFixed(2)} m`;
  if (w >= 1e-2) return `${(w * 1e2).toFixed(2)} cm`;
  if (w >= 1e-3) return `${(w * 1e3).toFixed(2)} mm`;
  if (w >= 1e-6) return `${(w * 1e6).toFixed(2)} µm`;
  if (w >= 1e-9) return `${(w * 1e9).toFixed(1)} nm`;
  return `${(w * 1e10).toFixed(2)} Å`;
}

/**
 * Format energy in electron-volts
 * @param {number} eV
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatEnergyEV(eV, decimals = 2) {
  return `${Number(eV).toFixed(decimals)} eV`;
}

/**
 * Format frequency in Hz into × 10¹⁴ Hz display string
 * @param {number} freqHz
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatFrequency14(freqHz, decimals = 2) {
  const val14 = Number(freqHz) / 1e14;
  return `${val14.toFixed(decimals)} × 10¹⁴ Hz`;
}

/**
 * Format voltage in Volts with sign option
 * @param {number} volts
 * @param {boolean} [showPlus=false]
 * @returns {string}
 */
export function formatVoltage(volts, showPlus = false) {
  const v = Number(volts);
  const prefix = showPlus && v > 0 ? '+' : '';
  return `${prefix}${v.toFixed(2)} V`;
}

/**
 * Format photocurrent in microamperes (µA)
 * @param {number} microA
 * @returns {string}
 */
export function formatCurrentMicroA(microA) {
  return `${Number(microA).toFixed(1)} µA`;
}
