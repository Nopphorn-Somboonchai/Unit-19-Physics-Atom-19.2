/**
 * @file constants.js
 * @description Standard physical constants and IPST (สสวท.) metal work function reference table
 * for Unit 19.2: Photoelectric Effect.
 * Pure constants module - zero browser/DOM/rendering dependencies.
 */

/** Planck's constant h (J·s) — CODATA / IPST */
export const PLANCK_CONSTANT = 6.626e-34;

/** Speed of light in vacuum c (m/s) — CODATA / IPST */
export const SPEED_OF_LIGHT = 3.00e8;

/** Elementary charge e (C) — CODATA / IPST */
export const ELEMENTARY_CHARGE = 1.602e-19;

/** Electron rest mass m_e (kg) — CODATA / IPST */
export const ELECTRON_MASS = 9.109e-31;

/** 1 electron-volt in Joules (J/eV) */
export const EV_TO_JOULES = ELEMENTARY_CHARGE; // 1.602e-19 J

/** 1 Joule in electron-volts (eV/J) */
export const JOULES_TO_EV = 1 / ELEMENTARY_CHARGE; // ~6.2422e18 eV

/** Product hc in J·m */
export const HC_JOULE_METERS = PLANCK_CONSTANT * SPEED_OF_LIGHT; // 1.9878e-25 J·m

/** Product hc in eV·nm (~1240.824 eV·nm) */
export const HC_EV_NM = (HC_JOULE_METERS / EV_TO_JOULES) * 1e9;

/** Planck's constant in eV·s (~4.13608e-15 eV·s) */
export const PLANCK_CONSTANT_EV_S = PLANCK_CONSTANT / EV_TO_JOULES;

/**
 * Standard IPST (สสวท.) metal work functions (W in eV) for Photoelectric Effect
 * Ordered from lowest to highest work function.
 */
export const METAL_WORK_FUNCTIONS = Object.freeze([
  {
    id: 'cs',
    symbol: 'Cs',
    nameTh: 'ซีเซียม',
    nameEn: 'Cesium',
    workFunctionEV: 2.1,
    plateColor: '#eab308',
    lineColor: '#38bdf8'
  },
  {
    id: 'k',
    symbol: 'K',
    nameTh: 'โพแทสเซียม',
    nameEn: 'Potassium',
    workFunctionEV: 2.3,
    plateColor: '#c084fc',
    lineColor: '#a78bfa'
  },
  {
    id: 'na',
    symbol: 'Na',
    nameTh: 'โซเดียม',
    nameEn: 'Sodium',
    workFunctionEV: 2.4,
    plateColor: '#94a3b8',
    lineColor: '#4ade80'
  },
  {
    id: 'ca',
    symbol: 'Ca',
    nameTh: 'แคลเซียม',
    nameEn: 'Calcium',
    workFunctionEV: 2.9,
    plateColor: '#cbd5e1',
    lineColor: '#2dd4bf'
  },
  {
    id: 'al',
    symbol: 'Al',
    nameTh: 'อะลูมิเนียม',
    nameEn: 'Aluminum',
    workFunctionEV: 4.2,
    plateColor: '#d1d5db',
    lineColor: '#f59e0b'
  },
  {
    id: 'zn',
    symbol: 'Zn',
    nameTh: 'สังกะสี',
    nameEn: 'Zinc',
    workFunctionEV: 4.3,
    plateColor: '#64748b',
    lineColor: '#f43f5e'
  },
  {
    id: 'cu',
    symbol: 'Cu',
    nameTh: 'ทองแดง',
    nameEn: 'Copper',
    workFunctionEV: 4.8,
    plateColor: '#ea580c',
    lineColor: '#fb923c'
  },
  {
    id: 'au',
    symbol: 'Au',
    nameTh: 'ทองคำ',
    nameEn: 'Gold',
    workFunctionEV: 5.1,
    plateColor: '#facc15',
    lineColor: '#fde047'
  }
]);
