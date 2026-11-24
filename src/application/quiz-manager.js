/**
 * @file quiz-manager.js
 * @description Dynamic Quiz Orchestrator for Unit 19.2 (Photoelectric Effect).
 * 15-Question IPST Bank (3 Topics × 5 Questions) with Roll-Number Seeded RNG (R ∈ [1, 40]),
 * 0% Anti-Repeat Guarantee, ±3% Numeric Tolerance Grading, and Step-by-Step KaTeX Solutions.
 * Conforms to Dynamic Quiz System Rules (Physics Learning Standard v1.13.0).
 */

import {
  createSeededRNG,
  getSeededChoice,
  getSeededShuffle,
  getDynamicParam
} from '../utils/random.js';
import { validateRollNumber, validateNumericAnswer } from '../utils/validation.js';
import { formatLatexScientific } from '../utils/format.js';
import {
  electronVoltsToJoules,
  calculatePhotonEnergyFromFrequency,
  calculatePhotonEnergyFromWavelength,
  calculateThresholdFrequency,
  calculateThresholdWavelength,
  calculateWorkFunctionFromThresholdFrequency,
  calculatePhotoelectricEffect,
  calculateWavelengthForStoppingPotential
} from '../physics/photoelectric-solver.js';
import {
  calculatePlanckFromTwoPoints,
  calculateWorkFunctionFromGraphPoint
} from '../physics/ek-frequency-solver.js';
import { getMetalById } from '../physics/photoelectric-model.js';

export class QuizManager {
  /**
   * @param {number} [rollNumber=1] - Student roll number R (1..40)
   */
  constructor(rollNumber = 1) {
    this.rollNumber = validateRollNumber(rollNumber);
    this.currentQuestionIndex = 0;
    this.currentQuestion = null;
    this.scoreHistory = [];
    this.attemptSeed = 0;
    this.mode = 'random'; // 'standard' | 'random'
    this.usedParamsByTemplate = new Map();
    this._rngCounter = 0;
    this.maxRetries = 50;
  }

  setRollNumber(newRollNumber) {
    this.rollNumber = validateRollNumber(newRollNumber);
    return this.generateQuestion(this.currentQuestionIndex);
  }

  setMode(newMode) {
    this.mode = newMode === 'standard' ? 'standard' : 'random';
    return this.generateQuestion(this.currentQuestionIndex);
  }

  resetUsedParameters() {
    this.usedParamsByTemplate.clear();
  }

  /**
   * Generate a unique dynamic parameter combining Roll Number R and Attempt Seed B
   * with strict 0% repeat guarantee against both standardValue and prior session picks.
   */
  _generateUniqueParam(templateKey, R, config, B, standardValue, trackHistory = true) {
    const { baseMin, baseStep, randomRange, min, max, decimals } = config;
    const factor = Math.pow(10, decimals);
    const roundVal = (v) => Math.round(v * factor) / factor;
    const stdVal = roundVal(standardValue);

    let usedSet = null;
    if (trackHistory) {
      if (!this.usedParamsByTemplate.has(templateKey)) {
        this.usedParamsByTemplate.set(templateKey, new Set());
      }
      usedSet = this.usedParamsByTemplate.get(templateKey);
    }

    const isForbidden = (val) =>
      Math.abs(val - stdVal) < 1e-9 || (usedSet !== null && usedSet.has(val));

    // Pass 1: Dynamic formula R + B with retry salts
    for (let retry = 0; retry < this.maxRetries; retry++) {
      const retrySeed =
        retry === 0
          ? B
          : ((B + Math.imul(retry, 7919) + Math.imul(R, 131)) >>> 0);
      const candidate = roundVal(
        getDynamicParam(R, baseMin, baseStep, randomRange, { min, max, decimals }, retrySeed)
      );
      if (!isForbidden(candidate)) {
        if (usedSet) usedSet.add(candidate);
        return candidate;
      }
    }

    // Pass 2: Deterministic exhaustive unused-pool fallback (0% repeat guarantee)
    const minInt = Math.round(min * factor);
    const maxInt = Math.round(max * factor);
    const buildUnusedPool = () => {
      const pool = [];
      for (let i = minInt; i <= maxInt; i++) {
        const val = roundVal(i / factor);
        if (!isForbidden(val)) pool.push(val);
      }
      return pool;
    };

    let unusedPool = buildUnusedPool();
    if (unusedPool.length === 0 && usedSet) {
      const lastVal = Array.from(usedSet).pop();
      usedSet.clear();
      if (lastVal !== undefined) usedSet.add(lastVal);
      unusedPool = buildUnusedPool();
    }

    const fallbackSeed = (Math.imul(R, 10007) + Math.imul(B, 9973) + 31337) >>> 0;
    const rng = createSeededRNG(fallbackSeed);
    const picked = unusedPool[Math.floor(rng() * unusedPool.length)];
    if (usedSet && picked !== undefined) usedSet.add(picked);
    return picked;
  }

  /**
   * Pick a discrete scenario item combining R and B with 0% repeat guarantee.
   */
  _generateUniqueChoice(templateKey, R, pool, B, standardKey, keyFn, trackHistory = true) {
    let usedSet = null;
    if (trackHistory) {
      if (!this.usedParamsByTemplate.has(templateKey)) {
        this.usedParamsByTemplate.set(templateKey, new Set());
      }
      usedSet = this.usedParamsByTemplate.get(templateKey);
    }

    const isForbidden = (key) => key === standardKey || (usedSet !== null && usedSet.has(key));
    let available = pool.filter((item) => !isForbidden(keyFn(item)));

    if (available.length === 0 && usedSet) {
      const lastKey = Array.from(usedSet).pop();
      usedSet.clear();
      if (lastKey !== undefined) usedSet.add(lastKey);
      available = pool.filter((item) => !isForbidden(keyFn(item)));
    }
    if (available.length === 0) {
      available = pool.filter((item) => keyFn(item) !== standardKey);
    }

    const seed = (Math.imul(R, 10007) + Math.imul(B, 9973) + 42424) >>> 0;
    const rng = createSeededRNG(seed);
    const picked = available[Math.floor(rng() * available.length)] || pool[0];
    if (usedSet && picked !== undefined) usedSet.add(keyFn(picked));
    return picked;
  }

  /**
   * Generate question by category ('19.2.1', '19.2.2', '19.2.3', or 'mixed')
   * @param {number} [questionIndex=0]
   * @param {'19.2.1' | '19.2.2' | '19.2.3' | 'mixed'} [category='mixed']
   * @param {number|null} [customSeed=null]
   * @param {'standard' | 'random' | null} [mode=null]
   */
  generateQuestion(questionIndex = 0, category = 'mixed', customSeed = null, mode = null) {
    this.currentQuestionIndex = questionIndex;
    const isDeterministicReplay = customSeed !== null;

    if (isDeterministicReplay) {
      this.attemptSeed = customSeed;
    } else {
      this._rngCounter += 1;
      this.attemptSeed = (
        Date.now() ^
        Math.floor(Math.random() * 0xffffffff) ^
        Math.imul(this._rngCounter, 2654435761)
      ) >>> 0;
    }

    const R = this.rollNumber;
    const B = this.attemptSeed;
    const currentMode = mode || this.mode;
    const trackHistory = !isDeterministicReplay;

    let targetTopic = category;
    if (category === 'mixed') {
      const topics = ['19.2.1', '19.2.2', '19.2.3'];
      targetTopic = getSeededChoice(R, questionIndex, topics, B);
    }

    switch (targetTopic) {
      case '19.2.1':
        this.currentQuestion = this._generateTopic1921Question(R, questionIndex, B, currentMode, trackHistory);
        break;
      case '19.2.2':
        this.currentQuestion = this._generateTopic1922Question(R, questionIndex, B, currentMode, trackHistory);
        break;
      case '19.2.3':
      default:
        this.currentQuestion = this._generateTopic1923Question(R, questionIndex, B, currentMode, trackHistory);
        break;
    }

    return this.currentQuestion;
  }

  /**
   * Topic 19.2.1: Photons, Threshold Frequency f₀ & Work Function W (5 Questions)
   * Q1: Photon energy E (eV) from wavelength λ (nm)
   * Q2: Threshold frequency f₀ (×10¹⁴ Hz) from work function W (eV)
   * Q3: Threshold wavelength λ₀ (nm) from work function W (eV)
   * Q4: Choice — Check whether photoelectric emission occurs (E vs W)
   * Q5: Multi-numeric — Find both f₀ (×10¹⁴ Hz) and λ₀ (nm) from W (eV)
   */
  _generateTopic1921Question(R, qIndex, B, mode = 'random', trackHistory = true) {
    const isStandard = mode === 'standard';
    const totalInTopic = 5;
    const subType = (((qIndex % totalInTopic) + totalInTopic) % totalInTopic) + 1;
    const titleSuffix = isStandard ? '(โจทย์ตัวเลขมาตรฐาน สสวท.)' : `(เลขที่ #${R})`;

    if (subType === 1) {
      const lambdaNm = isStandard
        ? 400
        : this._generateUniqueParam(
          '19.2.1_Q1',
          R,
          { baseMin: 215, baseStep: 9.5, randomRange: 95, min: 200, max: 680, decimals: 0 },
          B,
          400,
          trackHistory
        );
      const energy = calculatePhotonEnergyFromWavelength(lambdaNm * 1e-9);
      const ansEV = Math.round(energy.electronVolts * 100) / 100;

      return {
        id: `q_19_2_1_Q1_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 1,
        totalInTopic,
        generatedParam: lambdaNm,
        topic: '19.2.1 โฟตอน ความถี่ขีดเริ่ม และฟังก์ชันงาน',
        title: `คำนวณพลังงานของโฟตอนจากความยาวคลื่น ${titleSuffix}`,
        problemText: `แสงความถี่เดียวมีความยาวคลื่น \\(\\lambda = ${lambdaNm} \\text{ nm}\\) ตกกระทบผิวโลหะ จงคำนวณพลังงานของโฟตอน 1 อนุภาค (\\(E\\)) ในหน่วยอิเล็กตรอนโวลต์ (\\(\\text{eV}\\)) กำหนด \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\), \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
        unit: 'eV',
        correctAnswer: ansEV,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: พลังงานของโฟตอน \\(E = \\frac{hc}{\\lambda}\\)`,
          `แปลงความยาวคลื่นเป็นเมตร: \\(\\lambda = ${lambdaNm} \\times 10^{-9} \\text{ m}\\)`,
          `คำนวณในหน่วยจูล: \\(E = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${lambdaNm} \\times 10^{-9}} = ${formatLatexScientific(energy.joules)} \\text{ J}\\)`,
          `แปลงเป็นอิเล็กตรอนโวลต์: \\(E = \\frac{${formatLatexScientific(energy.joules)}}{1.602 \\times 10^{-19}} = ${ansEV.toFixed(2)} \\text{ eV}\\)`,
          `**ตอบ**: พลังงานของโฟตอน 1 อนุภาคเท่ากับ **${ansEV.toFixed(2)} eV**`
        ]
      };
    }

    if (subType === 2) {
      const workEV = isStandard
        ? 2.40
        : this._generateUniqueParam(
          '19.2.1_Q2',
          R,
          { baseMin: 1.90, baseStep: 0.08, randomRange: 0.65, min: 1.80, max: 5.50, decimals: 2 },
          B,
          2.40,
          trackHistory
        );
      const wJ = electronVoltsToJoules(workEV);
      const f0Hz = calculateThresholdFrequency(workEV);
      const ansF0 = Math.round((f0Hz / 1e14) * 100) / 100;
      const metalLabel = isStandard ? 'โลหะโซเดียม (\\(\\text{Na}\\))' : 'โลหะชนิดหนึ่ง';

      return {
        id: `q_19_2_1_Q2_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 2,
        totalInTopic,
        generatedParam: workEV,
        topic: '19.2.1 โฟตอน ความถี่ขีดเริ่ม และฟังก์ชันงาน',
        title: `หาความถี่ขีดเริ่มจากฟังก์ชันงาน ${titleSuffix}`,
        problemText: `${metalLabel}มีค่าฟังก์ชันงาน \\(W = ${workEV.toFixed(2)} \\text{ eV}\\) จงคำนวณความถี่ขีดเริ่ม (\\(f_0\\)) ของโลหะนี้ (กรอกเฉพาะตัวเลขหน้าสัญกรณ์ในหน่วย \\(\\times 10^{14} \\text{ Hz}\\)) กำหนด \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
        unit: '× 10¹⁴ Hz',
        correctAnswer: ansF0,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(W = hf_0 \\rightarrow f_0 = \\frac{W}{h}\\)`,
          `แปลงฟังก์ชันงานเป็นจูล: \\(W = (${workEV.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(wJ)} \\text{ J}\\)`,
          `แทนค่าคำนวณความถี่ขีดเริ่ม: \\(f_0 = \\frac{${formatLatexScientific(wJ)}}{6.626 \\times 10^{-34}} = ${ansF0.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`,
          `**ตอบ**: ความถี่ขีดเริ่มเท่ากับ **${ansF0.toFixed(2)} × 10¹⁴ Hz** (ตัวเลขคำตอบ: **${ansF0.toFixed(2)}**)`
        ]
      };
    }

    if (subType === 3) {
      const workEV = isStandard
        ? 2.10
        : this._generateUniqueParam(
          '19.2.1_Q3',
          R,
          { baseMin: 1.95, baseStep: 0.075, randomRange: 0.65, min: 1.85, max: 5.40, decimals: 2 },
          B,
          2.10,
          trackHistory
        );
      const wJ = electronVoltsToJoules(workEV);
      const lambda0 = calculateThresholdWavelength(workEV);
      const ansNm = Math.round(lambda0.nm * 10) / 10;
      const metalLabel = isStandard ? 'โลหะซีเซียม (\\(\\text{Cs}\\))' : 'โลหะเป้าหมายชนิดหนึ่ง';

      return {
        id: `q_19_2_1_Q3_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 3,
        totalInTopic,
        generatedParam: workEV,
        topic: '19.2.1 โฟตอน ความถี่ขีดเริ่ม และฟังก์ชันงาน',
        title: `หาความยาวคลื่นขีดเริ่มจากฟังก์ชันงาน ${titleSuffix}`,
        problemText: `${metalLabel}มีค่าฟังก์ชันงาน \\(W = ${workEV.toFixed(2)} \\text{ eV}\\) จงหาความยาวคลื่นขีดเริ่ม (\\(\\lambda_0\\)) หรือความยาวคลื่นสูงสุดของแสงที่ยังสามารถทำให้เกิดโฟโตอิเล็กตรอนได้ ในหน่วยนาโนเมตร (\\(\\text{nm}\\))`,
        unit: 'nm',
        correctAnswer: ansNm,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(W = \\frac{hc}{\\lambda_0} \\rightarrow \\lambda_0 = \\frac{hc}{W}\\)`,
          `แปลงฟังก์ชันงานเป็นจูล: \\(W = (${workEV.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(wJ)} \\text{ J}\\)`,
          `คำนวณความยาวคลื่นขีดเริ่ม: \\(\\lambda_0 = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${formatLatexScientific(wJ)}} = ${formatLatexScientific(lambda0.meters)} \\text{ m}\\)`,
          `แปลงเป็นนาโนเมตร: \\(\\lambda_0 = ${ansNm.toFixed(1)} \\text{ nm}\\)`,
          `**ตอบ**: ความยาวคลื่นขีดเริ่มเท่ากับ **${ansNm.toFixed(1)} nm**`
        ]
      };
    }

    if (subType === 4) {
      // Choice question: Verify whether photoelectric emission occurs (E vs W)
      const scenarios = [
        { key: 'na-650', metalId: 'na', lambdaNm: 650, lightName: 'แสงสีแดง' },
        { key: 'cs-450', metalId: 'cs', lambdaNm: 450, lightName: 'แสงสีน้ำเงิน' },
        { key: 'cs-680', metalId: 'cs', lambdaNm: 680, lightName: 'แสงสีแดง' },
        { key: 'k-400', metalId: 'k', lambdaNm: 400, lightName: 'แสงสีม่วง' },
        { key: 'k-620', metalId: 'k', lambdaNm: 620, lightName: 'แสงสีส้ม' },
        { key: 'na-360', metalId: 'na', lambdaNm: 360, lightName: 'รังสีอัลตราไวโอเลต (UV)' },
        { key: 'ca-350', metalId: 'ca', lambdaNm: 350, lightName: 'รังสีอัลตราไวโอเลต (UV)' },
        { key: 'ca-550', metalId: 'ca', lambdaNm: 550, lightName: 'แสงสีเขียว' },
        { key: 'al-240', metalId: 'al', lambdaNm: 240, lightName: 'รังสีอัลตราไวโอเลต (UV)' },
        { key: 'zn-420', metalId: 'zn', lambdaNm: 420, lightName: 'แสงสีม่วง' },
        { key: 'cu-210', metalId: 'cu', lambdaNm: 210, lightName: 'รังสีอัลตราไวโอเลต (UV)' },
        { key: 'au-320', metalId: 'au', lambdaNm: 320, lightName: 'รังสีอัลตราไวโอเลต (UV)' }
      ];

      const selected = isStandard
        ? scenarios[0]
        : this._generateUniqueChoice('19.2.1_Q4', R, scenarios, B, 'na-650', (s) => s.key, trackHistory);
      const metal = getMetalById(selected.metalId);
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: selected.lambdaNm,
        workFunctionEV: metal.workFunctionEV
      });
      const eStr = solved.photonEnergyEV.toFixed(2);
      const wStr = metal.workFunctionEV.toFixed(2);

      const rawOptions = solved.emitsElectrons
        ? [
          {
            text: `เกิดโฟโตอิเล็กตรอน เพราะพลังงานโฟตอน (${eStr} eV) มากกว่าฟังก์ชันงาน (${wStr} eV) จึงเหลือพลังงานจลน์สูงสุด ${solved.ekMaxEV.toFixed(2)} eV`,
            isCorrect: true
          },
          {
            text: `ไม่เกิดโฟโตอิเล็กตรอน เพราะความยาวคลื่น ${selected.lambdaNm} nm น้อยเกินไปจนโฟตอนทะลุผ่านผิวโลหะทั้งหมด`,
            isCorrect: false
          },
          {
            text: `จะเกิดโฟโตอิเล็กตรอนได้ก็ต่อเมื่อเพิ่มความเข้มแสงให้สูงขึ้นเกิน 80% เท่านั้น`,
            isCorrect: false
          },
          {
            text: `ไม่เกิดโฟโตอิเล็กตรอน เพราะพลังงานโฟตอน (${eStr} eV) น้อยกว่าฟังก์ชันงาน (${wStr} eV)`,
            isCorrect: false
          }
        ]
        : [
          {
            text: `ไม่เกิดโฟโตอิเล็กตรอน เพราะพลังงานโฟตอน (${eStr} eV) น้อยกว่าฟังก์ชันงาน (${wStr} eV) แม้จะเพิ่มความเข้มแสงมากเพียงใดก็ตาม`,
            isCorrect: true
          },
          {
            text: `เกิดโฟโตอิเล็กตรอนทันที หากเปิดไฟฉายแสงนี้ทิ้งไว้นานพอให้อิเล็กตรอนสะสมพลังงานครบ ${wStr} eV`,
            isCorrect: false
          },
          {
            text: `เกิดโฟโตอิเล็กตรอนทันที หากเพิ่มความเข้มแสงให้สูงขึ้นเป็น 2 เท่า`,
            isCorrect: false
          },
          {
            text: `เกิดโฟโตอิเล็กตรอน เพราะความยาวคลื่น ${selected.lambdaNm} nm ยาวกว่าความยาวคลื่นขีดเริ่ม (${metal.thresholdWavelengthNm.toFixed(1)} nm)`,
            isCorrect: false
          }
        ];

      const shuffled = isStandard
        ? rawOptions
        : getSeededShuffle(R, 19214 + qIndex, rawOptions, B);
      const correctChoiceIndex = shuffled.findIndex((o) => o.isCorrect);

      return {
        id: `q_19_2_1_Q4_${qIndex}_${B}`,
        type: 'choice',
        questionNumber: 4,
        totalInTopic,
        generatedParam: selected.key,
        topic: '19.2.1 โฟตอน ความถี่ขีดเริ่ม และฟังก์ชันงาน',
        title: `วิเคราะห์เงื่อนไขการเกิดปรากฏการณ์โฟโตอิเล็กทริก ${titleSuffix}`,
        problemText: `เมื่อฉาย${selected.lightName}ความยาวคลื่น \\(\\lambda = ${selected.lambdaNm} \\text{ nm}\\) ตกกระทบผิวโลหะ${metal.nameTh} (\\(\\text{${metal.symbol}}\\)) ที่มีฟังก์ชันงาน \\(W = ${wStr} \\text{ eV}\\) ข้อใดสรุปผลได้ถูกต้องที่สุด?`,
        choices: shuffled.map((o) => o.text),
        correctChoiceIndex,
        solutionSteps: [
          `**ขั้นที่ 1**: คำนวณพลังงานของโฟตอน 1 อนุภาค \\(E = \\frac{hc}{\\lambda} = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${selected.lambdaNm} \\times 10^{-9} \\times 1.602 \\times 10^{-19}} = ${eStr} \\text{ eV}\\)`,
          `**ขั้นที่ 2**: เปรียบเทียบกับฟังก์ชันงานของ${metal.nameTh} \\(W = ${wStr} \\text{ eV}\\) (ความยาวคลื่นขีดเริ่ม \\(\\lambda_0 = ${metal.thresholdWavelengthNm.toFixed(1)} \\text{ nm}\\))`,
          solved.emitsElectrons
            ? `**สรุป**: เนื่องจาก \\(E = ${eStr} \\text{ eV} \\ge W = ${wStr} \\text{ eV}\\) (และ \\(\\lambda \\le \\lambda_0\\)) จึง **เกิดโฟโตอิเล็กตรอน** โดยมี \\(E_{k,\\max} = ${eStr} - ${wStr} = ${solved.ekMaxEV.toFixed(2)} \\text{ eV}\\)`
            : `**สรุป**: เนื่องจาก \\(E = ${eStr} \\text{ eV} < W = ${wStr} \\text{ eV}\\) (และ \\(\\lambda > \\lambda_0\\)) จึง **ไม่เกิดโฟโตอิเล็กตรอนเลย** ไม่ว่าจะเพิ่มความเข้มแสงหรือฉายนานเพียงใด`
        ]
      };
    }

    // Q5: Multi-numeric — Find both f₀ (×10¹⁴ Hz) and λ₀ (nm) from W (eV)
    const workEV = isStandard
      ? 2.30
      : this._generateUniqueParam(
        '19.2.1_Q5',
        R,
        { baseMin: 1.90, baseStep: 0.08, randomRange: 0.65, min: 1.85, max: 5.30, decimals: 2 },
        B,
        2.30,
        trackHistory
      );
    const wJ = electronVoltsToJoules(workEV);
    const f0Hz = calculateThresholdFrequency(workEV);
    const lambda0 = calculateThresholdWavelength(workEV);
    const ansF0 = Math.round((f0Hz / 1e14) * 100) / 100;
    const ansLambda0 = Math.round(lambda0.nm * 10) / 10;
    const metalLabel = isStandard ? 'โลหะโพแทสเซียม (\\(\\text{K}\\))' : 'โลหะแคโทดชนิดหนึ่ง';

    return {
      id: `q_19_2_1_Q5_${qIndex}_${B}`,
      type: 'multi-numeric',
      questionNumber: 5,
      totalInTopic,
      generatedParam: workEV,
      topic: '19.2.1 โฟตอน ความถี่ขีดเริ่ม และฟังก์ชันงาน',
      title: `คำนวณความถี่ขีดเริ่มและความยาวคลื่นขีดเริ่ม ${titleSuffix}`,
      problemText: `${metalLabel}มีค่าฟังก์ชันงาน \\(W = ${workEV.toFixed(2)} \\text{ eV}\\) จงคำนวณ 1) ความถี่ขีดเริ่ม (\\(f_0\\)) ในหน่วย \\(\\times 10^{14} \\text{ Hz}\\) และ 2) ความยาวคลื่นขีดเริ่ม (\\(\\lambda_0\\)) ในหน่วยนาโนเมตร (\\(\\text{nm}\\))`,
      unit: '× 10¹⁴ Hz / nm',
      correctAnswer: ansF0,
      correctAnswers: [ansF0, ansLambda0],
      tolerance: 0.03,
      inputs: [
        {
          id: 'f0',
          label: 'ความถี่ขีดเริ่ม (f₀)',
          unit: '× 10¹⁴ Hz',
          correctAnswer: ansF0,
          tolerance: 0.03
        },
        {
          id: 'lambda0',
          label: 'ความยาวคลื่นขีดเริ่ม (λ₀)',
          unit: 'nm',
          correctAnswer: ansLambda0,
          tolerance: 0.03
        }
      ],
      solutionSteps: [
        `**สูตรที่ใช้**: \\(W = hf_0 = \\frac{hc}{\\lambda_0}\\)`,
        `แปลงฟังก์ชันงานเป็นจูล: \\(W = (${workEV.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(wJ)} \\text{ J}\\)`,
        `1) หาความถี่ขีดเริ่ม: \\(f_0 = \\frac{W}{h} = \\frac{${formatLatexScientific(wJ)}}{6.626 \\times 10^{-34}} = ${ansF0.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`,
        `2) หาความยาวคลื่นขีดเริ่ม: \\(\\lambda_0 = \\frac{c}{f_0} = \\frac{3.00 \\times 10^8}{${ansF0.toFixed(2)} \\times 10^{14}} = ${ansLambda0.toFixed(1)} \\text{ nm}\\)`,
        `**ตอบ**: \\(f_0 =\\) **${ansF0.toFixed(2)} × 10¹⁴ Hz** และ \\(\\lambda_0 =\\) **${ansLambda0.toFixed(1)} nm**`
      ]
    };
  }

  /**
   * Topic 19.2.2: Einstein's Photoelectric Equation & Stopping Potential (5 Questions)
   * Q1: E_{k,max} (eV) from frequency f and W
   * Q2: Stopping potential V_s (V) from wavelength λ and W
   * Q3: Work function W (eV) from frequency f and stopping potential V_s
   * Q4: Maximum electron speed v_max (×10⁵ m/s) from wavelength λ and W
   * Q5: Multi-numeric — Find both E_{k,max} (×10⁻¹⁹ J) and V_s (V)
   */
  _generateTopic1922Question(R, qIndex, B, mode = 'random', trackHistory = true) {
    const isStandard = mode === 'standard';
    const totalInTopic = 5;
    const subType = (((qIndex % totalInTopic) + totalInTopic) % totalInTopic) + 1;
    const titleSuffix = isStandard ? '(โจทย์ตัวเลขมาตรฐาน สสวท.)' : `(เลขที่ #${R})`;

    if (subType === 1) {
      const metal = getMetalById('na'); // W = 2.40 eV
      const freqCoeff = isStandard
        ? 8.00
        : this._generateUniqueParam(
          '19.2.2_Q1',
          R,
          { baseMin: 6.80, baseStep: 0.16, randomRange: 1.40, min: 6.50, max: 16.00, decimals: 2 },
          B,
          8.00,
          trackHistory
        );
      const solved = calculatePhotoelectricEffect({
        frequencyHz: freqCoeff * 1e14,
        workFunctionEV: metal.workFunctionEV
      });
      const ansEk = Math.round(solved.ekMaxEV * 100) / 100;

      return {
        id: `q_19_2_2_Q1_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 1,
        totalInTopic,
        generatedParam: freqCoeff,
        topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์และศักย์หยุดยั้ง',
        title: `คำนวณพลังงานจลน์สูงสุดของโฟโตอิเล็กตรอน ${titleSuffix}`,
        problemText: `ฉายแสงความถี่ \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) ตกกระทบผิวโลหะโซเดียม (\\(\\text{Na}\\)) ที่มีฟังก์ชันงาน \\(W = 2.40 \\text{ eV}\\) จงคำนวณพลังงานจลน์สูงสุดของโฟโตอิเล็กตรอน (\\(E_{k,\\max}\\)) ในหน่วยอิเล็กตรอนโวลต์ (\\(\\text{eV}\\))`,
        unit: 'eV',
        correctAnswer: ansEk,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: สมการโฟโตอิเล็กทริกของไอน์สไตน์ \\(E_{k,\\max} = hf - W\\)`,
          `คำนวณพลังงานของโฟตอน: \\(E = \\frac{hf}{e} = \\frac{(6.626 \\times 10^{-34})(${freqCoeff.toFixed(2)} \\times 10^{14})}{1.602 \\times 10^{-19}} = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
          `แทนค่าฟังก์ชันงาน \\(W = 2.40 \\text{ eV}\\): \\(E_{k,\\max} = ${solved.photonEnergyEV.toFixed(2)} - 2.40 = ${ansEk.toFixed(2)} \\text{ eV}\\)`,
          `**ตอบ**: พลังงานจลน์สูงสุดเท่ากับ **${ansEk.toFixed(2)} eV**`
        ]
      };
    }

    if (subType === 2) {
      const metal = getMetalById('na'); // W = 2.40 eV
      const lambdaNm = isStandard
        ? 300
        : this._generateUniqueParam(
          '19.2.2_Q2',
          R,
          { baseMin: 185, baseStep: 5.5, randomRange: 55, min: 180, max: 450, decimals: 0 },
          B,
          300,
          trackHistory
        );
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: lambdaNm,
        workFunctionEV: metal.workFunctionEV
      });
      const ansVs = Math.round(solved.stoppingPotentialV * 100) / 100;

      return {
        id: `q_19_2_2_Q2_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 2,
        totalInTopic,
        generatedParam: lambdaNm,
        topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์และศักย์หยุดยั้ง',
        title: `คำนวณความต่างศักย์หยุดยั้งจากความยาวคลื่น ${titleSuffix}`,
        problemText: `เมื่อฉายแสงความยาวคลื่น \\(\\lambda = ${lambdaNm} \\text{ nm}\\) ลงบนผิวโลหะโซเดียม (\\(W = 2.40 \\text{ eV}\\)) จงคำนวณความต่างศักย์หยุดยั้ง (\\(V_s\\)) ที่ทำให้กระแสโฟโตอิเล็กทริกเป็นศูนย์ ในหน่วยโวลต์ (\\(\\text{V}\\))`,
        unit: 'V',
        correctAnswer: ansVs,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(eV_s = E_{k,\\max} = \\frac{hc}{\\lambda} - W\\)`,
          `คำนวณพลังงานโฟตอน: \\(E = \\frac{hc}{\\lambda e} = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{(${lambdaNm} \\times 10^{-9})(1.602 \\times 10^{-19})} = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
          `หาพลังงานจลน์สูงสุด: \\(E_{k,\\max} = ${solved.photonEnergyEV.toFixed(2)} - 2.40 = ${solved.ekMaxEV.toFixed(2)} \\text{ eV}\\)`,
          `จาก \\(eV_s = E_{k,\\max}\\) จะได้ \\(V_s = ${ansVs.toFixed(2)} \\text{ V}\\)`,
          `**ตอบ**: ความต่างศักย์หยุดยั้งเท่ากับ **${ansVs.toFixed(2)} V**`
        ]
      };
    }

    if (subType === 3) {
      // Find work function W (eV) from frequency f and stopping potential V_s
      const freqCoeff = isStandard
        ? 10.00
        : this._generateUniqueParam(
          '19.2.2_Q3',
          R,
          { baseMin: 8.50, baseStep: 0.18, randomRange: 1.50, min: 8.20, max: 16.50, decimals: 2 },
          B,
          10.00,
          trackHistory
        );
      const photonEV = calculatePhotonEnergyFromFrequency(freqCoeff * 1e14).electronVolts;
      const vsVal = isStandard
        ? 1.84
        : Math.round(Math.max(0.55, Math.min(photonEV - 1.85, 0.70 + (R % 9) * 0.16)) * 100) / 100;
      const wResult = calculateWorkFunctionFromGraphPoint(freqCoeff * 1e14, vsVal);
      const ansW = Math.round(wResult.electronVolts * 100) / 100;

      return {
        id: `q_19_2_2_Q3_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 3,
        totalInTopic,
        generatedParam: freqCoeff,
        topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์และศักย์หยุดยั้ง',
        title: `คำนวณฟังก์ชันงานของโลหะจากศักย์หยุดยั้ง ${titleSuffix}`,
        problemText: `จากการทดลองโฟโตอิเล็กทริก เมื่อฉายแสงความถี่ \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) ลงบนผิวโลหะชนิดหนึ่ง พบว่าต้องใช้ความต่างศักย์หยุดยั้ง \\(V_s = ${vsVal.toFixed(2)} \\text{ V}\\) จงคำนวณค่าฟังก์ชันงาน (\\(W\\)) ของโลหะนี้ในหน่วย \\(\\text{eV}\\)`,
        unit: 'eV',
        correctAnswer: ansW,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(eV_s = hf - W \\rightarrow W = hf - eV_s\\)`,
          `คำนวณพลังงานโฟตอน: \\(E = \\frac{hf}{e} = \\frac{(6.626 \\times 10^{-34})(${freqCoeff.toFixed(2)} \\times 10^{14})}{1.602 \\times 10^{-19}} = ${photonEV.toFixed(2)} \\text{ eV}\\)`,
          `จาก \\(V_s = ${vsVal.toFixed(2)} \\text{ V}\\) จะได้ \\(E_{k,\\max} = ${vsVal.toFixed(2)} \\text{ eV}\\)`,
          `คำนวณฟังก์ชันงาน: \\(W = ${photonEV.toFixed(2)} - ${vsVal.toFixed(2)} = ${ansW.toFixed(2)} \\text{ eV}\\)`,
          `**ตอบ**: ฟังก์ชันงานของโลหะนี้เท่ากับ **${ansW.toFixed(2)} eV**`
        ]
      };
    }

    if (subType === 4) {
      // Find v_max (× 10⁵ m/s) from wavelength λ on Cesium (W = 2.10 eV)
      const metal = getMetalById('cs'); // W = 2.10 eV
      const lambdaNm = isStandard
        ? 400
        : this._generateUniqueParam(
          '19.2.2_Q4',
          R,
          { baseMin: 215, baseStep: 6.2, randomRange: 65, min: 200, max: 495, decimals: 0 },
          B,
          400,
          trackHistory
        );
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: lambdaNm,
        workFunctionEV: metal.workFunctionEV
      });
      const ansV5 = Math.round((solved.vMaxMs / 1e5) * 100) / 100;

      return {
        id: `q_19_2_2_Q4_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 4,
        totalInTopic,
        generatedParam: lambdaNm,
        topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์และศักย์หยุดยั้ง',
        title: `คำนวณอัตราเร็วสูงสุดของโฟโตอิเล็กตรอน ${titleSuffix}`,
        problemText: `ฉายแสงความยาวคลื่น \\(\\lambda = ${lambdaNm} \\text{ nm}\\) ลงบนผิวโลหะซีเซียม (\\(W = 2.10 \\text{ eV}\\)) จงคำนวณอัตราเร็วสูงสุดของโฟโตอิเล็กตรอน (\\(v_{\\max}\\)) (กรอกเฉพาะตัวเลขหน้าสัญกรณ์ในหน่วย \\(\\times 10^5 \\text{ m/s}\\)) กำหนดมวลอิเล็กตรอน \\(m_e = 9.109 \\times 10^{-31} \\text{ kg}\\)`,
        unit: '× 10⁵ m/s',
        correctAnswer: ansV5,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(E_{k,\\max} = \\frac{hc}{\\lambda} - W\\) และ \\(E_{k,\\max} = \\frac{1}{2} m_e v_{\\max}^2 \\rightarrow v_{\\max} = \\sqrt{\\frac{2 E_{k,\\max}}{m_e}}\\)`,
          `คำนวณพลังงานโฟตอน: \\(E = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\) จึงได้ \\(E_{k,\\max} = ${solved.photonEnergyEV.toFixed(2)} - 2.10 = ${solved.ekMaxEV.toFixed(2)} \\text{ eV}\\)`,
          `แปลงเป็นจูล: \\(E_{k,\\max} = ${formatLatexScientific(solved.ekMaxJ)} \\text{ J}\\)`,
          `แทนค่าหาอัตราเร็วสูงสุด: \\(v_{\\max} = \\sqrt{\\frac{2(${formatLatexScientific(solved.ekMaxJ)})}{9.109 \\times 10^{-31}}} = ${ansV5.toFixed(2)} \\times 10^5 \\text{ m/s}\\)`,
          `**ตอบ**: อัตราเร็วสูงสุดเท่ากับ **${ansV5.toFixed(2)} × 10⁵ m/s** (ตัวเลขคำตอบ: **${ansV5.toFixed(2)}**)`
        ]
      };
    }

    // Q5: Multi-numeric — Find both E_{k,max} (×10⁻¹⁹ J) and V_s (V)
    const metal = getMetalById('k'); // W = 2.30 eV
    const lambdaNm = isStandard
      ? 320
      : this._generateUniqueParam(
        '19.2.2_Q5',
        R,
        { baseMin: 195, baseStep: 5.8, randomRange: 60, min: 190, max: 465, decimals: 0 },
        B,
        320,
        trackHistory
      );
    const solved = calculatePhotoelectricEffect({
      wavelengthNm: lambdaNm,
      workFunctionEV: metal.workFunctionEV
    });
    const ansEkJ19 = Math.round((solved.ekMaxJ / 1e-19) * 100) / 100;
    const ansVs = Math.round(solved.stoppingPotentialV * 100) / 100;

    return {
      id: `q_19_2_2_Q5_${qIndex}_${B}`,
      type: 'multi-numeric',
      questionNumber: 5,
      totalInTopic,
      generatedParam: lambdaNm,
      topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์และศักย์หยุดยั้ง',
      title: `คำนวณพลังงานจลน์สูงสุดและศักย์หยุดยั้ง ${titleSuffix}`,
      problemText: `ฉายแสงความยาวคลื่น \\(\\lambda = ${lambdaNm} \\text{ nm}\\) ตกกระทบผิวโลหะโพแทสเซียม (\\(W = 2.30 \\text{ eV}\\)) จงคำนวณ 1) พลังงานจลน์สูงสุด (\\(E_{k,\\max}\\)) ในหน่วย \\(\\times 10^{-19} \\text{ J}\\) และ 2) ความต่างศักย์หยุดยั้ง (\\(V_s\\)) ในหน่วยโวลต์ (\\(\\text{V}\\))`,
      unit: '× 10⁻¹⁹ J / V',
      correctAnswer: ansEkJ19,
      correctAnswers: [ansEkJ19, ansVs],
      tolerance: 0.03,
      inputs: [
        {
          id: 'ekmaxJ',
          label: 'พลังงานจลน์สูงสุด (Ek,max)',
          unit: '× 10⁻¹⁹ J',
          correctAnswer: ansEkJ19,
          tolerance: 0.03
        },
        {
          id: 'vs',
          label: 'ความต่างศักย์หยุดยั้ง (Vs)',
          unit: 'V',
          correctAnswer: ansVs,
          tolerance: 0.03
        }
      ],
      solutionSteps: [
        `**สูตรที่ใช้**: \\(E_{k,\\max} = \\frac{hc}{\\lambda} - W\\) และ \\(V_s = \\frac{E_{k,\\max}}{e}\\)`,
        `พลังงานโฟตอน: \\(E = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${lambdaNm} \\times 10^{-9}} = ${formatLatexScientific(solved.photonEnergyJ)} \\text{ J} = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
        `1) \\(E_{k,\\max} = (${solved.photonEnergyEV.toFixed(2)} - 2.30) \\times 1.602 \\times 10^{-19} = ${ansEkJ19.toFixed(2)} \\times 10^{-19} \\text{ J}\\)`,
        `2) \\(V_s = \\frac{${ansEkJ19.toFixed(2)} \\times 10^{-19}}{1.602 \\times 10^{-19}} = ${ansVs.toFixed(2)} \\text{ V}\\)`,
        `**ตอบ**: \\(E_{k,\\max} =\\) **${ansEkJ19.toFixed(2)} × 10⁻¹⁹ J** และ \\(V_s =\\) **${ansVs.toFixed(2)} V**`
      ]
    };
  }

  /**
   * Topic 19.2.3: Graph Analysis & Photocell Applications (5 Questions)
   * Q1: Determine experimental Planck's constant h (×10⁻³⁴ J·s) from slope of E_{k,max}-f graph
   * Q2: Determine work function W (eV) from X-intercept f₀ of V_s-f graph
   * Q3: Choice — Compare intensity vs frequency effects on I-ΔV graph & Wave vs Photon theory
   * Q4: Find required wavelength λ (nm) to achieve target stopping potential V_s
   * Q5: Multi-numeric — Photocell automatic door (λ₀ in nm & E_{k,max} in eV)
   */
  _generateTopic1923Question(R, qIndex, B, mode = 'random', trackHistory = true) {
    const isStandard = mode === 'standard';
    const totalInTopic = 5;
    const subType = (((qIndex % totalInTopic) + totalInTopic) % totalInTopic) + 1;
    const titleSuffix = isStandard ? '(โจทย์ตัวเลขมาตรฐาน สสวท.)' : `(เลขที่ #${R})`;

    if (subType === 1) {
      const hExp34 = isStandard
        ? 6.63
        : this._generateUniqueParam(
          '19.2.3_Q1',
          R,
          { baseMin: 6.38, baseStep: 0.011, randomRange: 0.14, min: 6.35, max: 6.90, decimals: 2 },
          B,
          6.63,
          trackHistory
        );
      const f1 = 6.00;
      const df = isStandard ? 4.00 : (3.00 + (R % 5) * 0.50);
      const f2 = Math.round((f1 + df) * 100) / 100;
      const ek1 = 0.66; // ×10^-19 J
      const ek2 = Math.round((ek1 + (hExp34 * 1e-34 * df * 1e14) / 1e-19) * 100) / 100;

      const hCalc = calculatePlanckFromTwoPoints(f1 * 1e14, ek1 * 1e-19, f2 * 1e14, ek2 * 1e-19);
      const ansH34 = Math.round((hCalc / 1e-34) * 100) / 100;

      return {
        id: `q_19_2_3_Q1_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 1,
        totalInTopic,
        generatedParam: hExp34,
        topic: '19.2.3 การวิเคราะห์กราฟและการประยุกต์',
        title: `หาค่าคงตัวของพลังค์จากความชันกราฟ Ek,max–f ${titleSuffix}`,
        problemText: `จากการทดลองเขียนกราฟความสัมพันธ์ระหว่างพลังงานจลน์สูงสุด (\\(E_{k,\\max}\\)) กับความถี่แสง (\\(f\\)) ได้เส้นตรงผ่านจุด \\((f_1 = ${f1.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k1} = ${ek1.toFixed(2)} \\times 10^{-19} \\text{ J})\\) และจุด \\((f_2 = ${f2.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k2} = ${ek2.toFixed(2)} \\times 10^{-19} \\text{ J})\\) จงหาค่าคงตัวของพลังค์จากการทดลองนี้ (กรอกเฉพาะตัวเลขหน้าสัญกรณ์ในหน่วย \\(\\times 10^{-34} \\text{ J}\\cdot\\text{s}\\))`,
        unit: '× 10⁻³⁴ J·s',
        correctAnswer: ansH34,
        tolerance: 0.03,
        solutionSteps: [
          `**หลักการกราฟ**: จากสมการ \\(E_{k,\\max} = hf - W\\) ความชันของกราฟ \\(E_{k,\\max}\\) กับ \\(f\\) มีค่าเท่ากับค่าคงตัวของพลังค์ \\(h\\)`,
          `**สูตรความชัน**: \\(h = \\frac{\\Delta E_{k,\\max}}{\\Delta f} = \\frac{E_{k2} - E_{k1}}{f_2 - f_1}\\)`,
          `แทนค่า: \\(h = \\frac{(${ek2.toFixed(2)} - ${ek1.toFixed(2)}) \\times 10^{-19}}{(${f2.toFixed(2)} - ${f1.toFixed(2)}) \\times 10^{14}} = \\frac{${(ek2 - ek1).toFixed(2)} \\times 10^{-19}}{${df.toFixed(2)} \\times 10^{14}}\\)`,
          `คำนวณได้: \\(h = ${ansH34.toFixed(2)} \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\)`,
          `**ตอบ**: ค่าคงตัวของพลังค์เท่ากับ **${ansH34.toFixed(2)} × 10⁻³⁴ J·s** (ตัวเลขคำตอบ: **${ansH34.toFixed(2)}**)`
        ]
      };
    }

    if (subType === 2) {
      const f0Coeff = isStandard
        ? 10.40
        : this._generateUniqueParam(
          '19.2.3_Q2',
          R,
          { baseMin: 4.80, baseStep: 0.21, randomRange: 1.50, min: 4.50, max: 14.00, decimals: 2 },
          B,
          10.40,
          trackHistory
        );
      const wRes = calculateWorkFunctionFromThresholdFrequency(f0Coeff * 1e14);
      const ansW = Math.round(wRes.electronVolts * 100) / 100;

      return {
        id: `q_19_2_3_Q2_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 2,
        totalInTopic,
        generatedParam: f0Coeff,
        topic: '19.2.3 การวิเคราะห์กราฟและการประยุกต์',
        title: `หาฟังก์ชันงานจากจุดตัดแกนความถี่ของกราฟ Vs–f ${titleSuffix}`,
        problemText: `กราฟความสัมพันธ์ระหว่างความต่างศักย์หยุดยั้ง (\\(V_s\\)) กับความถี่แสง (\\(f\\)) ของโลหะชนิดหนึ่งมีจุดตัดแกนนอน (แกนความถี่) ที่ \\(f_0 = ${f0Coeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) จงคำนวณค่าฟังก์ชันงาน (\\(W\\)) ของโลหะนี้ในหน่วย \\(\\text{eV}\\)`,
        unit: 'eV',
        correctAnswer: ansW,
        tolerance: 0.03,
        solutionSteps: [
          `**หลักการกราฟ**: จุดตัดแกนนอนของกราฟ \\(V_s\\)–\\(f\\) คือความถี่ขีดเริ่ม \\(f_0\\) ซึ่งสัมพันธ์กับฟังก์ชันงานตามสมการ \\(W = hf_0\\)`,
          `คำนวณในหน่วยจูล: \\(W = (6.626 \\times 10^{-34})(${f0Coeff.toFixed(2)} \\times 10^{14}) = ${formatLatexScientific(wRes.joules)} \\text{ J}\\)`,
          `แปลงเป็นอิเล็กตรอนโวลต์: \\(W = \\frac{${formatLatexScientific(wRes.joules)}}{1.602 \\times 10^{-19}} = ${ansW.toFixed(2)} \\text{ eV}\\)`,
          `**ตอบ**: ฟังก์ชันงานของโลหะนี้เท่ากับ **${ansW.toFixed(2)} eV**`
        ]
      };
    }

    if (subType === 3) {
      const conceptPool = [
        {
          key: 'iv-intensity',
          prompt: 'ในการทดลองปรากฏการณ์โฟโตอิเล็กทริก เมื่อใช้แสงที่มีความถี่คงที่สูงกว่าความถี่ขีดเริ่ม (\\(f > f_0\\)) แล้ว<strong>เพิ่มความเข้มของแสงเป็น 2 เท่า</strong> กราฟระหว่างกระแสโฟโตอิเล็กทริก (\\(I\\)) กับความต่างศักย์ (\\(\\Delta V\\)) จะเปลี่ยนแปลงอย่างไร?',
          correct: 'กระแสอิ่มตัว (I_sat) เพิ่มขึ้น แต่ความต่างศักย์หยุดยั้ง (V_s) มีค่าคงเดิม',
          distractors: [
            'ทั้งกระแสอิ่มตัว (I_sat) และขนาดความต่างศักย์หยุดยั้ง (|V_s|) เพิ่มขึ้นเป็น 2 เท่า',
            'กระแสอิ่มตัว (I_sat) คงเดิม แต่ขนาดความต่างศักย์หยุดยั้ง (|V_s|) เพิ่มขึ้นเป็น 2 เท่า',
            'ทั้งกระแสอิ่มตัว (I_sat) และความต่างศักย์หยุดยั้ง (V_s) มีค่าคงเดิมไม่เปลี่ยนแปลง'
          ],
          steps: [
            'การเพิ่มความเข้มแสงที่ความถี่คงที่ คือการเพิ่ม <strong>จำนวนโฟตอนต่อวินาที</strong> จึงปลดปล่อยโฟโตอิเล็กตรอนได้มากขึ้น ส่งผลให้กระแสอิ่มตัว \\(I_{\\text{sat}}\\) เพิ่มขึ้น',
            'แต่พลังงานของโฟตอนแต่ละตัว (\\(E = hf\\)) ยังคงเท่าเดิม ดังนั้น \\(E_{k,\\max} = hf - W\\) และศักย์หยุดยั้ง \\(V_s\\) จึง <strong>คงเดิม</strong>'
          ]
        },
        {
          key: 'iv-frequency',
          prompt: 'เมื่อเพิ่ม<strong>ความถี่ของแสง</strong>ให้สูงขึ้น (โดยรักษาความเข้มแสงคงที่และ \\(f > f_0\\)) จุดตัดแกนนอน (\\(-V_s\\)) บนกราฟ \\(I\\)–\\(\\Delta V\\) จะเปลี่ยนแปลงอย่างไร?',
          correct: 'จุดตัด -V_s เลื่อนไปทางซ้ายมากขึ้น (ขนาด |V_s| เพิ่มขึ้น) เพราะ E_{k,max} เพิ่มขึ้น',
          distractors: [
            'จุดตัด -V_s เลื่อนเข้าใกล้ศูนย์มากขึ้น (ขนาด |V_s| ลดลง)',
            'จุดตัด -V_s อยู่ที่ตำแหน่งเดิมไม่เปลี่ยนแปลง เพราะขึ้นกับชนิดโลหะเท่านั้น',
            'จุดตัด -V_s หายไปและกราฟตัดผ่านจุดกำเนิด (0, 0)'
          ],
          steps: [
            'จากสมการ \\(eV_s = hf - W\\) เมื่อความถี่ \\(f\\) เพิ่มขึ้น พลังงานจลน์สูงสุด \\(E_{k,\\max}\\) จะเพิ่มขึ้น',
            'จึงต้องใช้ความต่างศักย์หน่วง (\\(|V_s|\\)) มากขึ้นเพื่อหยุดอิเล็กตรอน จุดตัด \\(-V_s\\) จึงเลื่อนไปทางซ้ายมากขึ้น'
          ]
        },
        {
          key: 'ekf-slope',
          prompt: 'เมื่อนำโลหะ 3 ชนิดที่มีฟังก์ชันงานต่างกัน (เช่น Cs, Na, Zn) มาเขียนกราฟระหว่าง \\(E_{k,\\max}\\) กับความถี่แสง \\(f\\) บนแกนเดียวกัน เส้นกราฟทั้ง 3 เส้นมีลักษณะอย่างไร?',
          correct: 'เป็นเส้นตรงขนานกันทุกเส้น เพราะมีความชันเท่ากับค่าคงตัวของพลังค์ (h) เท่ากันทุกโลหะ',
          distractors: [
            'เป็นเส้นตรงตัดกันที่จุดกำเนิด (0, 0) แต่มีความชันไม่เท่ากันตามค่า W',
            'โลหะที่มีฟังก์ชันงาน W มาก จะมีความชันกราฟสูงกว่าโลหะที่มี W น้อย',
            'เป็นเส้นโค้งพาราโบลาที่เพิ่มขึ้นตามกำลังสองของความถี่แสง'
          ],
          steps: [
            'จากสมการเส้นตรง \\(E_{k,\\max} = hf - W\\) ความชันคือ \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) ซึ่งเป็นค่าคงตัวสากล ไม่ขึ้นกับชนิดโลหะ',
            'ดังนั้นกราฟของโลหะทุกชนิดจึงขนานกัน ต่างกันเฉพาะจุดตัดแกนนอน (\\(f_0\\)) และจุดตัดแกนตั้ง (\\(-W\\))'
          ]
        },
        {
          key: 'vsf-slope',
          prompt: 'ความชันของกราฟความสัมพันธ์ระหว่าง<strong>ความต่างศักย์หยุดยั้ง (\\(V_s\\))</strong> กับ<strong>ความถี่แสง (\\(f\\))</strong> มีค่าตรงกับข้อใด?',
          correct: 'อัตราส่วน h / e (ค่าคงตัวของพลังค์หารด้วยประจุของอิเล็กตรอน)',
          distractors: [
            'ค่าคงตัวของพลังค์ h เพียงอย่างเดียว',
            'ฟังก์ชันงาน W ของโลหะแคโทด',
            'ผลคูณ h × e (ค่าคงตัวของพลังค์คูณด้วยประจุอิเล็กตรอน)'
          ],
          steps: [
            'จากสมการ \\(eV_s = hf - W\\) หารตลอดด้วย \\(e\\) จะได้ \\(V_s = \\left(\\frac{h}{e}\\right)f - \\frac{W}{e}\\)',
            'เทียบกับรูปเส้นตรง \\(y = mx + c\\) จึงได้ความชัน \\(m = \\frac{h}{e} \\approx 4.14 \\times 10^{-15} \\text{ V}\\cdot\\text{s}\\)'
          ]
        },
        {
          key: 'wave-failure',
          prompt: 'ผลการทดลองปรากฏการณ์โฟโตอิเล็กทริกข้อใดที่ <strong>ทฤษฎีคลื่นแม่เหล็กไฟฟ้าดั้งเดิมไม่สามารถอธิบายได้</strong>?',
          correct: 'หากความถี่แสงต่ำกว่าความถี่ขีดเริ่ม f₀ จะไม่เกิดโฟโตอิเล็กตรอนเลย แม้จะเพิ่มความเข้มแสงสูงมากก็ตาม',
          distractors: [
            'แสงสามารถแทรกสอดและเลี้ยวเบนผ่านสลิตคู่ได้',
            'แสงเคลื่อนที่ในสุญญากาศด้วยอัตราเร็วคงที่ 3.00 × 10⁸ m/s',
            'คลื่นแม่เหล็กไฟฟ้าสามารถเคลื่อนที่ผ่านสุญญากาศในหลอดโฟโตอิเล็กทริกได้'
          ],
          steps: [
            'ทฤษฎีคลื่นดั้งเดิมทำนายว่าพลังงานคลื่นขึ้นกับความเข้ม (แอมพลิจูด) หากฉายแสงความเข้มสูงพอก็ควรทำให้อิเล็กตรอนหลุดได้ทุกความถี่',
            'แต่ผลการทดลองจริงพบว่ามี <strong>ความถี่ขีดเริ่ม \\(f_0\\)</strong> ที่หาก \\(f < f_0\\) จะไม่เกิดโฟโตอิเล็กตรอนเลย ซึ่งเป็นหลักฐานยืนยันทฤษฎีโฟตอนของไอน์สไตน์'
          ]
        },
        {
          key: 'photocell-door',
          prompt: 'ในระบบประตูอัตโนมัติที่ใช้<strong>เซลล์โฟโตอิเล็กทริก (Photocell)</strong> เป็นเซนเซอร์ตรวจจับ เมื่อมีคนเดินผ่านตัดลำแสง เหตุใดประตูจึงเปิดออกทันที?',
          correct: 'ลำแสงถูกบังทำให้กระแสโฟโตอิเล็กทริกลดลงเป็นศูนย์ วงจรรีเลย์จึงเปลี่ยนสถานะสั่งมอเตอร์เปิดประตู',
          distractors: [
            'ร่างกายคนปล่อยรังสีแกมมาไปกระตุ้นให้กระแสโฟโตอิเล็กทริกพุ่งสูงขึ้น',
            'ความยาวคลื่นแสงเปลี่ยนสั้นลงเมื่อกระทบตัวคนทำให้ศักย์หยุดยั้งเป็นศูนย์',
            'ฟังก์ชันงานของโลหะในเซลล์โฟโตอิเล็กทริกลดลงจนเหลือศูนย์เมื่อถูกบังแสง'
          ],
          steps: [
            'ในภาวะปกติ ลำแสงที่มี \\(f > f_0\\) ตกกระทบเซลล์โฟโตอิเล็กทริกทำให้มีกระแสไฟฟ้าไหลเลี้ยงวงจรรีเลย์ตลอดเวลา',
            'เมื่อคนเดินบังลำแสง กระแสโฟโตอิเล็กทริกจะหยุดไหลทันที วงจรรีเลย์จึงสั่งมอเตอร์เปิดประตูอัตโนมัติ'
          ]
        },
        {
          key: 'instant-emission',
          prompt: 'เหตุใดเมื่อฉายแสงที่มีความถี่สูงกว่าความถี่ขีดเริ่ม (\\(f > f_0\\)) แม้ความเข้มแสงจะต่ำมาก อิเล็กตรอนจึงหลุดออกจากผิวโลหะได้<strong>เกือบจะทันที</strong> (\\(< 10^{-9}\\text{ s}\\))?',
          correct: 'เพราะโฟตอน 1 อนุภาคถ่ายโอนพลังงานทั้งก้อน (hf) ให้แก่อิเล็กตรอน 1 ตัวทันทีโดยไม่ต้องรอสะสมพลังงาน',
          distractors: [
            'เพราะอิเล็กตรอนในโลหะถูกเร่งด้วยสนามโน้มถ่วงของโลกอยู่ก่อนแล้ว',
            'เพราะคลื่นแสงความเข้มต่ำจะแผ่พลังงานกระจายทั่วทั้งแผ่นโลหะพร้อมกัน',
            'เพราะหลอดสุญญากาศมีอุณหภูมิสูงมากจนอิเล็กตรอนเดือดหลุดออกมาเอง'
          ],
          steps: [
            'ไอน์สไตน์อธิบายว่าแสงประกอบด้วยอนุภาคโฟตอนที่มีพลังงานเป็นก้อน \\(E = hf\\)',
            'เมื่อโฟตอน 1 ตัวชนกับอิเล็กตรอน 1 ตัวที่มีพลังงานเพียงพอ (\\(hf \\ge W\\)) อิเล็กตรอนจะดูดกลืนพลังงานและหลุดออกได้ทันทีโดยไม่เกิดช่วงเวลาหน่วง'
          ]
        },
        {
          key: 'metal-compare',
          prompt: 'กำหนดฟังก์ชันงานของซีเซียม (Cs = 2.1 eV) และสังกะสี (Zn = 4.3 eV) หากฉายแสงอัลตราไวโอเลตความถี่เดียวกัน (\\(E = 5.0\\text{ eV}\\)) ลงบนโลหะทั้งสอง ข้อใดถูกต้อง?',
          correct: 'โฟโตอิเล็กตรอนจากซีเซียม (Cs) มีพลังงานจลน์สูงสุดและศักย์หยุดยั้งมากกว่าจากสังกะสี (Zn)',
          distractors: [
            'โฟโตอิเล็กตรอนจากสังกะสี (Zn) มีพลังงานจลน์สูงสุดมากกว่าจากซีเซียม (Cs)',
            'โลหะทั้งสองให้โฟโตอิเล็กตรอนที่มีพลังงานจลน์สูงสุดเท่ากัน เพราะใช้แสงความถี่เดียวกัน',
            'ไม่เกิดโฟโตอิเล็กตรอนทั้งสองโลหะ เพราะพลังงานแสงน้อยกว่าผลรวมของฟังก์ชันงาน'
          ],
          steps: [
            'สำหรับซีเซียม: \\(E_{k,\\max}(\\text{Cs}) = 5.0 - 2.1 = 2.9 \\text{ eV}\\) (\\(V_s = 2.9 \\text{ V}\\))',
            'สำหรับสังกะสี: \\(E_{k,\\max}(\\text{Zn}) = 5.0 - 4.3 = 0.7 \\text{ eV}\\) (\\(V_s = 0.7 \\text{ V}\\)) ดังนั้น Cs จึงมี \\(E_{k,\\max}\\) และ \\(V_s\\) สูงกว่า'
          ]
        }
      ];

      const chosen = isStandard
        ? conceptPool[0]
        : this._generateUniqueChoice('19.2.3_Q3', R, conceptPool, B, 'iv-intensity', (c) => c.key, trackHistory);
      const rawOptions = [
        { text: chosen.correct, isCorrect: true },
        ...chosen.distractors.map((d) => ({ text: d, isCorrect: false }))
      ];
      const shuffled = isStandard ? rawOptions : getSeededShuffle(R, 19233 + qIndex, rawOptions, B);
      const correctChoiceIndex = shuffled.findIndex((o) => o.isCorrect);

      return {
        id: `q_19_2_3_Q3_${qIndex}_${B}`,
        type: 'choice',
        questionNumber: 3,
        totalInTopic,
        generatedParam: chosen.key,
        topic: '19.2.3 การวิเคราะห์กราฟและการประยุกต์',
        title: `วิเคราะห์กราฟและทฤษฎีโฟโตอิเล็กทริก ${titleSuffix}`,
        problemText: chosen.prompt,
        choices: shuffled.map((o) => o.text),
        correctChoiceIndex,
        solutionSteps: chosen.steps
      };
    }

    if (subType === 4) {
      // Find required wavelength λ (nm) to obtain target stopping potential V_s on Zinc (4.30 eV)
      const metal = getMetalById('zn'); // W = 4.30 eV
      const targetVs = isStandard
        ? 1.20
        : this._generateUniqueParam(
          '19.2.3_Q4',
          R,
          { baseMin: 0.55, baseStep: 0.055, randomRange: 0.55, min: 0.50, max: 3.20, decimals: 2 },
          B,
          1.20,
          trackHistory
        );
      const res = calculateWavelengthForStoppingPotential(metal.workFunctionEV, targetVs);
      const ansNm = Math.round(res.nm * 10) / 10;

      return {
        id: `q_19_2_3_Q4_${qIndex}_${B}`,
        type: 'numeric',
        questionNumber: 4,
        totalInTopic,
        generatedParam: targetVs,
        topic: '19.2.3 การวิเคราะห์กราฟและการประยุกต์',
        title: `หาความยาวคลื่นแสงเพื่อให้ได้ศักย์หยุดยั้งตามต้องการ ${titleSuffix}`,
        problemText: `ต้องการให้การทดลองโฟโตอิเล็กทริกบนผิวโลหะสังกะสี (\\(W = 4.30 \\text{ eV}\\)) มีความต่างศักย์หยุดยั้ง \\(V_s = ${targetVs.toFixed(2)} \\text{ V}\\) จะต้องฉายแสงที่มีความยาวคลื่น (\\(\\lambda\\)) เท่าใดในหน่วยนาโนเมตร (\\(\\text{nm}\\))`,
        unit: 'nm',
        correctAnswer: ansNm,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(\\frac{hc}{\\lambda} = W + eV_s \\rightarrow \\lambda = \\frac{hc}{W + eV_s}\\)`,
          `หาพลังงานโฟตอนที่ต้องการ: \\(E = 4.30 + ${targetVs.toFixed(2)} = ${res.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
          `แปลงเป็นจูล: \\(E = (${res.photonEnergyEV.toFixed(2)})(1.602 \\times 10^{-19}) = ${formatLatexScientific(electronVoltsToJoules(res.photonEnergyEV))} \\text{ J}\\)`,
          `คำนวณความยาวคลื่น: \\(\\lambda = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{${formatLatexScientific(electronVoltsToJoules(res.photonEnergyEV))}} = ${ansNm.toFixed(1)} \\text{ nm}\\)`,
          `**ตอบ**: ต้องใช้แสงความยาวคลื่น **${ansNm.toFixed(1)} nm**`
        ]
      };
    }

    // Q5: Multi-numeric — Photocell automatic door (find λ₀ in nm and E_{k,max} in eV)
    const metal = getMetalById('cs'); // W = 2.10 eV (λ₀ ≈ 590.9 nm)
    const lambdaNm = isStandard
      ? 450
      : this._generateUniqueParam(
        '19.2.3_Q5',
        R,
        { baseMin: 260, baseStep: 5.8, randomRange: 65, min: 250, max: 525, decimals: 0 },
        B,
        450,
        trackHistory
      );
    const solved = calculatePhotoelectricEffect({
      wavelengthNm: lambdaNm,
      workFunctionEV: metal.workFunctionEV
    });
    const ansLambda0 = Math.round(solved.thresholdWavelengthNm * 10) / 10;
    const ansEkEV = Math.round(solved.ekMaxEV * 100) / 100;

    return {
      id: `q_19_2_3_Q5_${qIndex}_${B}`,
      type: 'multi-numeric',
      questionNumber: 5,
      totalInTopic,
      generatedParam: lambdaNm,
      topic: '19.2.3 การวิเคราะห์กราฟและการประยุกต์',
      title: `โจทย์ประยุกต์เซลล์โฟโตอิเล็กทริกในประตูอัตโนมัติ ${titleSuffix}`,
      problemText: `เซนเซอร์เซลล์โฟโตอิเล็กทริกในระบบประตูอัตโนมัติใช้แคโทดโลหะซีเซียม (\\(W = 2.10 \\text{ eV}\\)) รับลำแสงควบคุมความยาวคลื่น \\(\\lambda = ${lambdaNm} \\text{ nm}\\) จงคำนวณ 1) ความยาวคลื่นขีดเริ่มสูงสุด (\\(\\lambda_0\\)) ที่ยังทำให้เซลล์ทำงานได้ ในหน่วย \\(\\text{nm}\\) และ 2) พลังงานจลน์สูงสุดของโฟโตอิเล็กตรอน (\\(E_{k,\\max}\\)) ในหน่วย \\(\\text{eV}\\)`,
      unit: 'nm / eV',
      correctAnswer: ansLambda0,
      correctAnswers: [ansLambda0, ansEkEV],
      tolerance: 0.03,
      inputs: [
        {
          id: 'lambda0',
          label: 'ความยาวคลื่นขีดเริ่ม (λ₀)',
          unit: 'nm',
          correctAnswer: ansLambda0,
          tolerance: 0.03
        },
        {
          id: 'ekmaxEV',
          label: 'พลังงานจลน์สูงสุด (Ek,max)',
          unit: 'eV',
          correctAnswer: ansEkEV,
          tolerance: 0.03
        }
      ],
      solutionSteps: [
        `**สูตรที่ใช้**: \\(\\lambda_0 = \\frac{hc}{W}\\) และ \\(E_{k,\\max} = \\frac{hc}{\\lambda} - W\\)`,
        `1) หาความยาวคลื่นขีดเริ่มของซีเซียม: \\(\\lambda_0 = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{(2.10)(1.602 \\times 10^{-19})} = ${ansLambda0.toFixed(1)} \\text{ nm}\\)`,
        `2) หาพลังงานโฟตอนที่ \\(\\lambda = ${lambdaNm} \\text{ nm}\\): \\(E = ${solved.photonEnergyEV.toFixed(2)} \\text{ eV}\\)`,
        `จะได้พลังงานจลน์สูงสุด: \\(E_{k,\\max} = ${solved.photonEnergyEV.toFixed(2)} - 2.10 = ${ansEkEV.toFixed(2)} \\text{ eV}\\)`,
        `**ตอบ**: \\(\\lambda_0 =\\) **${ansLambda0.toFixed(1)} nm** และ \\(E_{k,\\max} =\\) **${ansEkEV.toFixed(2)} eV**`
      ]
    };
  }

  /**
   * Evaluate student answer for current question (supports numeric & multi-numeric)
   */
  evaluateAnswer(studentAnswer) {
    if (!this.currentQuestion) {
      return { isCorrect: false, message: 'ไม่มีโจทย์ปัจจุบัน' };
    }

    if (this.currentQuestion.type === 'multi-numeric' || Array.isArray(studentAnswer)) {
      return this.evaluateMultiAnswer(Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]);
    }

    const evalResult = validateNumericAnswer(
      studentAnswer,
      this.currentQuestion.correctAnswer,
      this.currentQuestion.tolerance
    );

    this.scoreHistory.push({
      questionId: this.currentQuestion.id,
      topic: this.currentQuestion.topic,
      isCorrect: evalResult.isCorrect,
      userAnswer: evalResult.userVal,
      correctAnswer: evalResult.correctVal,
      relativeErrorPercent: evalResult.relativeErrorPercent,
      timestamp: Date.now()
    });

    return evalResult;
  }

  /**
   * Evaluate 2-part multi-numeric answers
   */
  evaluateMultiAnswer(studentAnswers = []) {
    if (!this.currentQuestion || !Array.isArray(this.currentQuestion.inputs)) {
      return { isCorrect: false, results: [], message: 'ไม่มีโจทย์หลายคำตอบในขณะนี้' };
    }

    const results = this.currentQuestion.inputs.map((inputSpec, idx) => {
      const rawAns = studentAnswers[idx];
      const evalRes = validateNumericAnswer(
        rawAns,
        inputSpec.correctAnswer,
        inputSpec.tolerance ?? this.currentQuestion.tolerance
      );
      return {
        id: inputSpec.id,
        label: inputSpec.label,
        unit: inputSpec.unit || this.currentQuestion.unit || '',
        ...evalRes
      };
    });

    const isCorrect = results.every((r) => r.isCorrect);

    this.scoreHistory.push({
      questionId: this.currentQuestion.id,
      topic: this.currentQuestion.topic,
      isCorrect,
      userAnswer: results.map((r) => r.userVal),
      correctAnswer: results.map((r) => r.correctVal),
      relativeErrorPercent: Math.max(...results.map((r) => r.relativeErrorPercent)),
      timestamp: Date.now()
    });

    return {
      isCorrect,
      results,
      message: isCorrect ? 'ถูกต้องครบทุกคำตอบ!' : 'ยังมีคำตอบบางช่องที่ไม่ถูกต้อง'
    };
  }
}
