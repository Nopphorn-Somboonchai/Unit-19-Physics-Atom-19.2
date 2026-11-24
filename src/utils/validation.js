/**
 * @file validation.js
 * @description Input validation and numeric answer evaluation for Unit 19.2 quiz & exam systems.
 * Enforces ±3% numerical error tolerance for physics calculations.
 */

import { APP_CONFIG } from '../shared/config.js';

/**
 * Validate student roll number R (must be integer in range [1, 40])
 * @param {any} inputRollNumber
 * @returns {number}
 */
export function validateRollNumber(inputRollNumber) {
  const r = parseInt(inputRollNumber, 10);
  if (Number.isNaN(r) || r < APP_CONFIG.minRollNumber) {
    return APP_CONFIG.minRollNumber;
  }
  if (r > APP_CONFIG.maxRollNumber) {
    return APP_CONFIG.maxRollNumber;
  }
  return r;
}

/**
 * Evaluate student's numeric answer against expected answer within allowed tolerance.
 * @param {number|string} userAnswer
 * @param {number} correctAnswer
 * @param {number} [tolerance=APP_CONFIG.numericAnswerTolerance]
 * @returns {{ isCorrect: boolean, relativeErrorPercent: number, userVal: number, correctVal: number, message: string }}
 */
export function validateNumericAnswer(
  userAnswer,
  correctAnswer,
  tolerance = APP_CONFIG.numericAnswerTolerance
) {
  const normalizedUser = typeof userAnswer === 'string' ? userAnswer.replace(/,/g, '').trim() : userAnswer;
  const uVal = parseFloat(normalizedUser);
  const cVal = parseFloat(correctAnswer);

  if (Number.isNaN(uVal)) {
    return {
      isCorrect: false,
      relativeErrorPercent: 100,
      userVal: NaN,
      correctVal: cVal,
      message: 'กรุณากรอกตัวเลขคำตอบ'
    };
  }

  if (Math.abs(cVal) < 1e-9) {
    const isZeroMatch = Math.abs(uVal) < 1e-3;
    return {
      isCorrect: isZeroMatch,
      relativeErrorPercent: isZeroMatch ? 0 : 100,
      userVal: uVal,
      correctVal: cVal,
      message: isZeroMatch ? 'ถูกต้อง' : 'คำตอบไม่ถูกต้อง'
    };
  }

  const absDiff = Math.abs(uVal - cVal);
  const relError = absDiff / Math.abs(cVal);
  const isCorrect = relError <= tolerance;
  const errorPercent = relError * 100;

  return {
    isCorrect,
    relativeErrorPercent: Math.round(errorPercent * 100) / 100,
    userVal: uVal,
    correctVal: cVal,
    message: isCorrect
      ? 'ถูกต้อง!'
      : `ความคลาดเคลื่อน ${errorPercent.toFixed(1)}% (เกินเกณฑ์ ${(tolerance * 100).toFixed(0)}%)`
  };
}
