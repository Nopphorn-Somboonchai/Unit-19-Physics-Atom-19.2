/**
 * @file exam-manager.js
 * @description Timed Exam Orchestrator for Unit 19.2: Photoelectric Effect
 * (15 minutes, 5 questions, 10 marks total, passing score 6/10).
 * Implements Finite State Machine (IDLE -> IN_PROGRESS -> SUBMITTED),
 * Deterministic Attempt-Scoped RNG (Roll Number R ∈ [1, 40] + Attempt Seed),
 * Anti-Cheat Monitoring, Session Persistence & Refresh Recovery.
 * Conforms to Timed Exam System Rules (Physics Learning Standard v1.13.0).
 */

import { APP_CONFIG } from '../shared/config.js';
import { validateRollNumber, validateNumericAnswer } from '../utils/validation.js';
import { getSeededInt, getSeededShuffle, getDynamicParam } from '../utils/random.js';
import { formatLatexScientific } from '../utils/format.js';
import { LocalStorageAdapter } from '../adapters/storage/local-storage.js';
import {
  electronVoltsToJoules,
  calculatePhotonEnergyFromFrequency,
  calculateThresholdFrequency,
  calculateThresholdWavelength,
  calculatePhotoelectricEffect,
  calculateWavelengthForStoppingPotential
} from '../physics/photoelectric-solver.js';
import {
  calculatePlanckFromTwoPoints,
  calculateWorkFunctionFromGraphPoint
} from '../physics/ek-frequency-solver.js';
import { getMetalById } from '../physics/photoelectric-model.js';

export const EXAM_STATES = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED'
};

export class ExamManager {
  /**
   * @param {number} [rollNumber=1]
   * @param {Object} [storageAdapter=LocalStorageAdapter]
   */
  constructor(rollNumber = 1, storageAdapter = LocalStorageAdapter) {
    this.rollNumber = validateRollNumber(rollNumber);
    this.storage = storageAdapter;
    this.fullName = '';
    this.className = '';
    this.state = EXAM_STATES.IDLE;

    this.durationSeconds = APP_CONFIG.exam.durationMinutes * 60; // 900 seconds
    this.timeRemaining = this.durationSeconds;
    this.startTime = null;
    this.endTime = null;

    this.attemptId = null;
    this.attemptSeed = 0;
    this._seedCounter = 0;
    this.questions = [];
    this.userAnswers = {};
    this.tabSwitchCount = 0;
    this.examResult = null;

    this.timerInterval = null;
    this.onTimerTick = null;
    this.onTimeExpired = null;
    this.onAutoSubmitted = null;
    this.onCheatDetected = null;

    this.restoredActiveQuestionIdx = 0;
  }

  setIdentity(fullName, className, rollNumber) {
    this.fullName = String(fullName || '').trim();
    this.className = String(className || '').trim();
    this.rollNumber = validateRollNumber(rollNumber);
  }

  /**
   * Start a new timed exam session
   * @param {number|null} [customSeed=null]
   * @returns {Array<Object>} Generated 5 exam questions
   */
  startExam(customSeed = null) {
    this.state = EXAM_STATES.IN_PROGRESS;
    if (customSeed !== null) {
      this.attemptSeed = customSeed;
    } else {
      this._seedCounter += 1;
      this.attemptSeed = (
        Date.now() ^
        Math.floor(Math.random() * 0xffffffff) ^
        Math.imul(this._seedCounter, 2654435761)
      ) >>> 0;
    }

    this.timeRemaining = this.durationSeconds;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.durationSeconds * 1000;
    this.attemptId = `u19_2_exam_${this.rollNumber}_${this.attemptSeed}_${this.startTime}`;
    this.tabSwitchCount = 0;
    this.userAnswers = {};
    this.examResult = null;

    this.questions = this._generateExamPaper(this.rollNumber, this.attemptSeed);
    this._saveSessionState(0);
    this._startTimer();

    return this.questions;
  }

  /**
   * Generate 5 balanced IPST 19.2 Photoelectric Effect exam questions (1 Choice + 4 Numeric)
   */
  _generateExamPaper(R, seed) {
    const paper = [];

    // =========================================================================
    // Q1: Multiple Choice Concept Question (8-item IPST 19.2 pool + Fisher-Yates shuffle)
    // =========================================================================
    const rawChoicePool = [
      {
        questionText: 'ข้อใดกล่าวถึงเงื่อนไขการเกิดปรากฏการณ์โฟโตอิเล็กทริกตามทฤษฎีของไอน์สไตน์ได้ถูกต้องที่สุด?',
        correctText: 'ความถี่ของแสงตกกระทบต้องมากกว่าหรือเท่ากับความถี่ขีดเริ่มของโลหะ (f ≥ f₀) จึงจะเกิดโฟโตอิเล็กตรอนได้',
        distractors: [
          'ไม่ว่าจะใช้แสงความถี่ใด หากเพิ่มความเข้มแสงให้สูงพอก็จะเกิดโฟโตอิเล็กตรอนได้เสมอ',
          'ความยาวคลื่นของแสงตกกระทบต้องยาวกว่าความยาวคลื่นขีดเริ่ม (λ > λ₀) จึงจะเกิดโฟโตอิเล็กตรอนได้',
          'ต้องฉายแสงความเข้มต่ำทิ้งไว้เป็นเวลานานเพื่อให้อิเล็กตรอนค่อยๆ สะสมพลังงานจนหลุดออก'
        ],
        explanation: 'โฟโตอิเล็กตรอนจะหลุดออกจากผิวโลหะได้เมื่อพลังงานของโฟตอน 1 ตัวมากกว่าหรือเท่ากับฟังก์ชันงาน (hf ≥ W หรือ f ≥ f₀ และ λ ≤ λ₀)'
      },
      {
        questionText: 'เมื่อฉายแสงที่มีความถี่คงที่และสูงกว่าความถี่ขีดเริ่ม (f > f₀) แล้วเพิ่มความเข้มของแสงเป็น 2 เท่า ผลใดจะเกิดขึ้น?',
        correctText: 'กระแสโฟโตอิเล็กทริกอิ่มตัว (I_sat) เพิ่มขึ้น แต่พลังงานจลน์สูงสุด (E_{k,max}) และศักย์หยุดยั้ง (V_s) คงเดิม',
        distractors: [
          'พลังงานจลน์สูงสุด (E_{k,max}) และศักย์หยุดยั้ง (V_s) เพิ่มขึ้นเป็น 2 เท่า',
          'กระแสโฟโตอิเล็กทริกอิ่มตัว (I_sat) คงเดิม แต่ศักย์หยุดยั้ง (V_s) เพิ่มขึ้น',
          'ความถี่ขีดเริ่ม (f₀) ของโลหะลดลงเหลือครึ่งหนึ่ง'
        ],
        explanation: 'ความเข้มแสงกำหนดจำนวนโฟตอนต่อวินาที จึงเพิ่มกระแสอิ่มตัว I_sat แต่พลังงานต่อโฟตอน (hf) เท่าเดิม ทำให้ E_{k,max} และ V_s คงเดิม'
      },
      {
        questionText: 'เมื่อเพิ่มความถี่ของแสงตกกระทบให้สูงขึ้น (โดยรักษาความเข้มแสงคงที่และ f > f₀) ข้อใดถูกต้องเกี่ยวกับกราฟ I–ΔV?',
        correctText: 'ขนาดของความต่างศักย์หยุดยั้ง (|V_s|) เพิ่มขึ้น ทำให้จุดตัด -V_s เลื่อนไปทางซ้ายมากขึ้น',
        distractors: [
          'ความต่างศักย์หยุดยั้ง (V_s) ลดลงจนเข้าใกล้ศูนย์',
          'จุดตัดแกนความต่างศักย์ (-V_s) คงที่ตำแหน่งเดิมตลอดเวลา',
          'กระแสโฟโตอิเล็กทริกกลายเป็นศูนย์ทันทีเมื่อความถี่สูงขึ้น'
        ],
        explanation: 'จาก eV_s = hf - W เมื่อความถี่ f เพิ่มขึ้น พลังงานจลน์สูงสุดของโฟโตอิเล็กตรอนเพิ่มขึ้น จึงต้องใช้ศักย์หยุดยั้ง |V_s| สูงขึ้น'
      },
      {
        questionText: 'ความชันของกราฟระหว่างพลังงานจลน์สูงสุด (E_{k,max}) กับความถี่แสง (f) สำหรับโลหะต่างชนิดกันมีสมบัติอย่างไร?',
        correctText: 'เป็นเส้นตรงขนานกันทุกชนิด โดยมีความชันเท่ากับค่าคงตัวของพลังค์ (h) เสมอ',
        distractors: [
          'มีความชันแตกต่างกันตามค่าฟังก์ชันงาน W ของโลหะแต่ละชนิด',
          'มีความชันเท่ากับอัตราเร็วแสง c ในสุญญากาศ',
          'ความชันมีค่าเป็นลบและตัดแกนนอนที่ความยาวคลื่นขีดเริ่ม'
        ],
        explanation: 'จากสมการ E_{k,max} = hf - W ความชันเท่ากับ h = 6.626 × 10⁻³⁴ J·s ซึ่งเป็นค่าคงตัวสากล กราฟของโลหะทุกชนิดจึงขนานกัน'
      },
      {
        questionText: 'หากเขียนกราฟระหว่างความต่างศักย์หยุดยั้ง (V_s) กับความถี่แสง (f) แล้วต่อเส้นประลงไปตัดแกนตั้ง จุดตัดแกนตั้งมีค่าเท่าใด?',
        correctText: 'เท่ากับ -W / e (ลบของฟังก์ชันงานหารด้วยประจุอิเล็กตรอน)',
        distractors: [
          'เท่ากับค่าความถี่ขีดเริ่ม f₀ ของโลหะ',
          'เท่ากับค่าคงตัวของพลังค์ h',
          'เท่ากับศูนย์ (0 V) สำหรับโลหะทุกชนิด'
        ],
        explanation: 'จากสมการ V_s = (h/e)f - W/e เมื่อแทน f = 0 จะได้จุดตัดแกนตั้งเท่ากับ -W/e และความชันเท่ากับ h/e'
      },
      {
        questionText: 'ข้อใดคือข้อจำกัดสำคัญของทฤษฎีคลื่นแม่เหล็กไฟฟ้าดั้งเดิมในการอธิบายปรากฏการณ์โฟโตอิเล็กทริก?',
        correctText: 'ไม่สามารถอธิบายได้ว่าเหตุใดจึงมีค่าความถี่ขีดเริ่ม f₀ และเหตุใด E_{k,max} จึงไม่ขึ้นกับความเข้มแสง',
        distractors: [
          'ทฤษฎีคลื่นดั้งเดิมทำนายว่าแสงไม่มีพลังงานในการส่งผ่านสุญญากาศ',
          'ทฤษฎีคลื่นดั้งเดิมระบุว่าโลหะไม่สามารถนำไฟฟ้าได้ในหลอดสุญญากาศ',
          'ทฤษฎีคลื่นดั้งเดิมไม่สามารถอธิบายการแทรกสอดและเลี้ยวเบนของแสงได้'
        ],
        explanation: 'ทฤษฎีคลื่นดั้งเดิมทายว่าพลังงานขึ้นกับความเข้มแสง ไม่ควรมี f₀ และต้องใช้เวลาสะสมพลังงาน ซึ่งขัดแย้งกับการทดลองโฟโตอิเล็กทริกทั้ง 3 ประเด็น'
      },
      {
        questionText: 'เพราะเหตุใดจึงนิยมใช้โลหะซีเซียม (Cs, W = 2.1 eV) ทำแคโทดในเซลล์โฟโตอิเล็กทริกสำหรับประตูอัตโนมัติ?',
        correctText: 'เพราะมีฟังก์ชันงานต่ำ จึงตอบสนองต่อแสงที่ตามองเห็นได้ (λ ≤ 591 nm) โดยไม่จำเป็นต้องใช้รังสี UV พลังงานสูง',
        distractors: [
          'เพราะมีฟังก์ชันงานสูงที่สุดในตารางโลหะจึงทนความร้อนได้ดีที่สุด',
          'เพราะซีเซียมสามารถปล่อยโฟโตอิเล็กตรอนได้แม้ไม่มีแสงตกกระทบเลย',
          'เพราะซีเซียมมีความถี่ขีดเริ่มสูงกว่าทองคำและทองแดง'
        ],
        explanation: 'ซีเซียมมี W = 2.1 eV (λ₀ ≈ 591 nm) จึงเกิดโฟโตอิเล็กตรอนได้ง่ายด้วยแสงที่ตามองเห็น เช่น แสงสีฟ้าหรือเขียว'
      },
      {
        questionText: 'หากต่อความต่างศักย์หน่วง ΔV ที่มีขนาดมากกว่าความต่างศักย์หยุดยั้ง (ΔV < -V_s) ในหลอดโฟโตอิเล็กทริก อิเล็กตรอนที่หลุดจากแคโทดจะเป็นอย่างไร?',
        correctText: 'ถูกสนามไฟฟ้าหน่วงจนหยุดก่อนถึงแอโนดแล้วเคลื่อนที่ย้อนกลับสู่แคโทด ทำให้กระแสในแอมมิเตอร์เป็น 0 µA',
        distractors: [
          'ถูกเร่งให้เคลื่อนที่เร็วขึ้นชนแอโนดทำให้กระแสพุ่งสูงเกินกระแสอิ่มตัว',
          'หยุดหลุดออกจากผิวโลหะแคโทดทันทีแม้แสงยังมีความถี่สูงกว่า f₀',
          'เปลี่ยนประจุเป็นประจุบวกแล้วเคลื่อนที่เข้าหาขั้วลบของแหล่งจ่ายไฟ'
        ],
        explanation: 'โฟโตอิเล็กตรอนยังคงหลุดออกจากแคโทดเมื่อ f ≥ f₀ แต่เมื่อ ΔV ≤ -V_s สนามไฟฟ้าหน่วงจะยับยั้งไม่ให้แม้แต่อิเล็กตรอนที่มี E_{k,max} ไปถึงแอโนด กระแสจึงเป็น 0'
      }
    ];

    const choicePickIdx = getSeededInt(R, 100, 0, rawChoicePool.length - 1, seed);
    const chosenConcept = rawChoicePool[choicePickIdx];
    const originalChoices = [
      { text: chosenConcept.correctText, isCorrect: true },
      ...chosenConcept.distractors.map((d) => ({ text: d, isCorrect: false }))
    ];
    const shuffledChoices = getSeededShuffle(R, 101, originalChoices, seed);
    const correctIdx = shuffledChoices.findIndex((c) => c.isCorrect);

    paper.push({
      index: 0,
      type: 'choice',
      topic: '19.2 แนวคิดปรากฏการณ์โฟโตอิเล็กทริก',
      title: 'หลักการและแนวคิดปรากฏการณ์โฟโตอิเล็กทริก (ปรนัย 4 ตัวเลือก)',
      score: 2,
      problemText: chosenConcept.questionText,
      choices: shuffledChoices.map((c) => c.text),
      correctChoiceIndex: correctIdx,
      explanation: chosenConcept.explanation
    });

    // =========================================================================
    // Q2: Calculation — Threshold Frequency f₀ (×10¹⁴ Hz) OR Threshold Wavelength λ₀ (nm)
    // =========================================================================
    const q2Variant = getSeededInt(R, 200, 0, 1, seed);
    const q2WorkEV = getDynamicParam(R, 1.95, 0.08, 0.65, { min: 1.90, max: 5.30, decimals: 2 }, seed + 201);

    if (q2Variant === 0) {
      const f0Hz = calculateThresholdFrequency(q2WorkEV);
      const ansF0 = Math.round((f0Hz / 1e14) * 100) / 100;

      paper.push({
        index: 1,
        type: 'numeric',
        topic: '19.2.1 ฟังก์ชันงานและความถี่ขีดเริ่ม',
        title: 'การคำนวณความถี่ขีดเริ่มของโลหะ',
        score: 2,
        problemText: `โลหะชนิดหนึ่งมีค่าฟังก์ชันงาน \\(W = ${q2WorkEV.toFixed(2)} \\text{ eV}\\) จงคำนวณความถี่ขีดเริ่ม (\\(f_0\\)) ของโลหะนี้ (กรอกเฉพาะตัวเลขหน้าสัญกรณ์ในหน่วย \\(\\times 10^{14} \\text{ Hz}\\)) กำหนด \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
        unit: '× 10¹⁴ Hz',
        correctAnswer: ansF0,
        tolerance: 0.03,
        explanation: `\\(f_0 = \\frac{W}{h} = \\frac{(${q2WorkEV.toFixed(2)})(1.602 \\times 10^{-19})}{6.626 \\times 10^{-34}} = ${ansF0.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`
      });
    } else {
      const lambda0 = calculateThresholdWavelength(q2WorkEV);
      const ansNm = Math.round(lambda0.nm * 10) / 10;

      paper.push({
        index: 1,
        type: 'numeric',
        topic: '19.2.1 ฟังก์ชันงานและความยาวคลื่นขีดเริ่ม',
        title: 'การคำนวณความยาวคลื่นขีดเริ่มของโลหะ',
        score: 2,
        problemText: `โลหะชนิดหนึ่งมีค่าฟังก์ชันงาน \\(W = ${q2WorkEV.toFixed(2)} \\text{ eV}\\) จงคำนวณความยาวคลื่นขีดเริ่ม (\\(\\lambda_0\\)) ในหน่วยนาโนเมตร (\\(\\text{nm}\\)) กำหนด \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\), \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
        unit: 'nm',
        correctAnswer: ansNm,
        tolerance: 0.03,
        explanation: `\\(\\lambda_0 = \\frac{hc}{W} = \\frac{(6.626 \\times 10^{-34})(3.00 \\times 10^8)}{(${q2WorkEV.toFixed(2)})(1.602 \\times 10^{-19})} = ${ansNm.toFixed(1)} \\text{ nm}\\)`
      });
    }

    // =========================================================================
    // Q3: Calculation — Maximum Kinetic Energy E_{k,max} (eV) from f or λ
    // =========================================================================
    const q3Metals = ['cs', 'k', 'na', 'ca'];
    const q3Metal = getMetalById(q3Metals[getSeededInt(R, 300, 0, q3Metals.length - 1, seed)]);
    const q3Variant = getSeededInt(R, 301, 0, 1, seed);

    if (q3Variant === 0) {
      const minFreq14 = Math.ceil((q3Metal.thresholdFrequency14 + 1.5) * 10) / 10;
      const freqCoeff = getDynamicParam(R, minFreq14 + 0.5, 0.14, 1.1, { min: minFreq14, max: 17.0, decimals: 2 }, seed + 302);
      const solved = calculatePhotoelectricEffect({
        frequencyHz: freqCoeff * 1e14,
        workFunctionEV: q3Metal.workFunctionEV
      });
      const ansEk = Math.round(solved.ekMaxEV * 100) / 100;

      paper.push({
        index: 2,
        type: 'numeric',
        topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์',
        title: 'พลังงานจลน์สูงสุดของโฟโตอิเล็กตรอนจากความถี่แสง',
        score: 2,
        problemText: `ฉายแสงความถี่ \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) ตกกระทบผิวโลหะ${q3Metal.nameTh} (\\(W = ${q3Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) จงคำนวณพลังงานจลน์สูงสุดของโฟโตอิเล็กตรอน (\\(E_{k,\\max}\\)) ในหน่วย \\(\\text{eV}\\)`,
        unit: 'eV',
        correctAnswer: ansEk,
        tolerance: 0.03,
        explanation: `\\(E_{k,\\max} = \\frac{hf}{e} - W = ${solved.photonEnergyEV.toFixed(2)} - ${q3Metal.workFunctionEV.toFixed(1)} = ${ansEk.toFixed(2)} \\text{ eV}\\)`
      });
    } else {
      const maxSafeLambda = Math.min(380, Math.floor(q3Metal.thresholdWavelengthNm - 70));
      const lambdaNm = getDynamicParam(R, 195, 4.2, 45, { min: 185, max: maxSafeLambda, decimals: 0 }, seed + 303);
      const solved = calculatePhotoelectricEffect({
        wavelengthNm: lambdaNm,
        workFunctionEV: q3Metal.workFunctionEV
      });
      const ansEk = Math.round(solved.ekMaxEV * 100) / 100;

      paper.push({
        index: 2,
        type: 'numeric',
        topic: '19.2.2 สมการโฟโตอิเล็กทริกของไอน์สไตน์',
        title: 'พลังงานจลน์สูงสุดของโฟโตอิเล็กตรอนจากความยาวคลื่นแสง',
        score: 2,
        problemText: `ฉายแสงความยาวคลื่น \\(\\lambda = ${lambdaNm} \\text{ nm}\\) ตกกระทบผิวโลหะ${q3Metal.nameTh} (\\(W = ${q3Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) จงคำนวณพลังงานจลน์สูงสุดของโฟโตอิเล็กตรอน (\\(E_{k,\\max}\\)) ในหน่วย \\(\\text{eV}\\)`,
        unit: 'eV',
        correctAnswer: ansEk,
        tolerance: 0.03,
        explanation: `\\(E_{k,\\max} = \\frac{hc}{\\lambda e} - W = ${solved.photonEnergyEV.toFixed(2)} - ${q3Metal.workFunctionEV.toFixed(1)} = ${ansEk.toFixed(2)} \\text{ eV}\\)`
      });
    }

    // =========================================================================
    // Q4: Calculation — Stopping Potential V_s (V) OR Maximum Speed v_max (×10⁵ m/s)
    // =========================================================================
    const q4Variant = getSeededInt(R, 400, 0, 1, seed);
    const q4Metal = getMetalById(['cs', 'k', 'na'][getSeededInt(R, 401, 0, 2, seed)]);
    const q4LambdaNm = getDynamicParam(R, 210, 5.2, 55, { min: 190, max: 430, decimals: 0 }, seed + 402);
    const q4Solved = calculatePhotoelectricEffect({
      wavelengthNm: q4LambdaNm,
      workFunctionEV: q4Metal.workFunctionEV
    });

    if (q4Variant === 0) {
      const ansVs = Math.round(q4Solved.stoppingPotentialV * 100) / 100;

      paper.push({
        index: 3,
        type: 'numeric',
        topic: '19.2.2 ความต่างศักย์หยุดยั้ง (Stopping Potential)',
        title: 'การคำนวณความต่างศักย์หยุดยั้ง',
        score: 2,
        problemText: `ฉายแสงความยาวคลื่น \\(\\lambda = ${q4LambdaNm} \\text{ nm}\\) ลงบนผิวโลหะ${q4Metal.nameTh} (\\(W = ${q4Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) จงคำนวณความต่างศักย์หยุดยั้ง (\\(V_s\\)) ในหน่วยโวลต์ (\\(\\text{V}\\))`,
        unit: 'V',
        correctAnswer: ansVs,
        tolerance: 0.03,
        explanation: `\\(eV_s = \\frac{hc}{\\lambda} - W = ${q4Solved.photonEnergyEV.toFixed(2)} - ${q4Metal.workFunctionEV.toFixed(1)} = ${ansVs.toFixed(2)} \\text{ eV} \\rightarrow V_s = ${ansVs.toFixed(2)} \\text{ V}\\)`
      });
    } else {
      const ansV5 = Math.round((q4Solved.vMaxMs / 1e5) * 100) / 100;

      paper.push({
        index: 3,
        type: 'numeric',
        topic: '19.2.2 อัตราเร็วสูงสุดของโฟโตอิเล็กตรอน',
        title: 'การคำนวณอัตราเร็วสูงสุดของโฟโตอิเล็กตรอน',
        score: 2,
        problemText: `ฉายแสงความยาวคลื่น \\(\\lambda = ${q4LambdaNm} \\text{ nm}\\) ลงบนผิวโลหะ${q4Metal.nameTh} (\\(W = ${q4Metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) จงหาอัตราเร็วสูงสุดของโฟโตอิเล็กตรอน (กรอกเฉพาะตัวเลขหน้าสัญกรณ์ในหน่วย \\(\\times 10^5 \\text{ m/s}\\)) กำหนด \\(m_e = 9.109 \\times 10^{-31} \\text{ kg}\\)`,
        unit: '× 10⁵ m/s',
        correctAnswer: ansV5,
        tolerance: 0.03,
        explanation: `\\(E_{k,\\max} = ${q4Solved.ekMaxEV.toFixed(2)} \\text{ eV} = ${formatLatexScientific(q4Solved.ekMaxJ)} \\text{ J} \\rightarrow v_{\\max} = \\sqrt{\\frac{2 E_{k,\\max}}{m_e}} = ${ansV5.toFixed(2)} \\times 10^5 \\text{ m/s}\\)`
      });
    }

    // =========================================================================
    // Q5: Calculation — Graph Analysis (h or W) OR Reverse Wavelength λ
    // =========================================================================
    const q5Variant = getSeededInt(R, 500, 0, 2, seed);

    if (q5Variant === 0) {
      // Find W (eV) from frequency f and stopping potential V_s
      const freqCoeff = getDynamicParam(R, 9.00, 0.16, 1.30, { min: 8.50, max: 16.00, decimals: 2 }, seed + 501);
      const photonEV = calculatePhotonEnergyFromFrequency(freqCoeff * 1e14).electronVolts;
      const vsVal = Math.round(Math.max(0.60, Math.min(photonEV - 2.00, 0.80 + (R % 7) * 0.22)) * 100) / 100;
      const wRes = calculateWorkFunctionFromGraphPoint(freqCoeff * 1e14, vsVal);
      const ansW = Math.round(wRes.electronVolts * 100) / 100;

      paper.push({
        index: 4,
        type: 'numeric',
        topic: '19.2.3 การวิเคราะห์กราฟ Vs–f และฟังก์ชันงาน',
        title: 'หาฟังก์ชันงานจากข้อมูลกราฟศักย์หยุดยั้ง',
        score: 2,
        problemText: `จากกราฟความสัมพันธ์ระหว่าง \\(V_s\\) กับ \\(f\\) ของโลหะชนิดหนึ่ง พบจุดข้อมูล \\(f = ${freqCoeff.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) และ \\(V_s = ${vsVal.toFixed(2)} \\text{ V}\\) จงคำนวณค่าฟังก์ชันงาน (\\(W\\)) ของโลหะนี้ในหน่วย \\(\\text{eV}\\)`,
        unit: 'eV',
        correctAnswer: ansW,
        tolerance: 0.03,
        explanation: `\\(W = \\frac{hf}{e} - V_s = ${photonEV.toFixed(2)} - ${vsVal.toFixed(2)} = ${ansW.toFixed(2)} \\text{ eV}\\)`
      });
    } else if (q5Variant === 1) {
      // Find experimental Planck's constant h from E_{k,max}-f slope
      const hExp34 = getDynamicParam(R, 6.45, 0.008, 0.12, { min: 6.40, max: 6.85, decimals: 2 }, seed + 502);
      const f1 = 6.00;
      const df = 3.00 + (R % 5) * 0.50;
      const f2 = Math.round((f1 + df) * 100) / 100;
      const ek1 = 0.70;
      const ek2 = Math.round((ek1 + (hExp34 * 1e-34 * df * 1e14) / 1e-19) * 100) / 100;
      const hCalc = calculatePlanckFromTwoPoints(f1 * 1e14, ek1 * 1e-19, f2 * 1e14, ek2 * 1e-19);
      const ansH34 = Math.round((hCalc / 1e-34) * 100) / 100;

      paper.push({
        index: 4,
        type: 'numeric',
        topic: '19.2.3 การวิเคราะห์กราฟ Ek,max–f',
        title: 'หาค่าคงตัวของพลังค์จากความชันกราฟ Ek,max–f',
        score: 2,
        problemText: `กราฟเส้นตรงระหว่าง \\(E_{k,\\max}\\) กับ \\(f\\) ผ่านจุด \\((f_1 = ${f1.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k1} = ${ek1.toFixed(2)} \\times 10^{-19} \\text{ J})\\) และ \\((f_2 = ${f2.toFixed(2)} \\times 10^{14} \\text{ Hz},\\ E_{k2} = ${ek2.toFixed(2)} \\times 10^{-19} \\text{ J})\\) จงหาค่าคงตัวของพลังค์ (กรอกเฉพาะตัวเลขหน้าสัญกรณ์ในหน่วย \\(\\times 10^{-34} \\text{ J}\\cdot\\text{s}\\))`,
        unit: '× 10⁻³⁴ J·s',
        correctAnswer: ansH34,
        tolerance: 0.03,
        explanation: `\\(h = \\frac{E_{k2} - E_{k1}}{f_2 - f_1} = \\frac{(${ek2.toFixed(2)} - ${ek1.toFixed(2)}) \\times 10^{-19}}{${df.toFixed(2)} \\times 10^{14}} = ${ansH34.toFixed(2)} \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\)`
      });
    } else {
      // Find required wavelength λ (nm) for target V_s on Aluminum/Zinc
      const metal = getMetalById(['al', 'zn', 'cu'][getSeededInt(R, 503, 0, 2, seed)]);
      const targetVs = getDynamicParam(R, 0.70, 0.045, 0.45, { min: 0.60, max: 2.80, decimals: 2 }, seed + 504);
      const res = calculateWavelengthForStoppingPotential(metal.workFunctionEV, targetVs);
      const ansNm = Math.round(res.nm * 10) / 10;

      paper.push({
        index: 4,
        type: 'numeric',
        topic: '19.2.3 การประยุกต์สมการโฟโตอิเล็กทริก',
        title: 'หาความยาวคลื่นแสงเพื่อให้ได้ศักย์หยุดยั้งตามต้องการ',
        score: 2,
        problemText: `ต้องการให้โลหะ${metal.nameTh} (\\(W = ${metal.workFunctionEV.toFixed(1)} \\text{ eV}\\)) เกิดความต่างศักย์หยุดยั้ง \\(V_s = ${targetVs.toFixed(2)} \\text{ V}\\) ต้องใช้แสงที่มีความยาวคลื่น (\\(\\lambda\\)) เท่าใดในหน่วยนาโนเมตร (\\(\\text{nm}\\))`,
        unit: 'nm',
        correctAnswer: ansNm,
        tolerance: 0.03,
        explanation: `\\(E = W + eV_s = ${metal.workFunctionEV.toFixed(1)} + ${targetVs.toFixed(2)} = ${res.photonEnergyEV.toFixed(2)} \\text{ eV} \\rightarrow \\lambda = \\frac{hc}{E} = ${ansNm.toFixed(1)} \\text{ nm}\\)`
      });
    }

    return paper;
  }

  recordAnswer(questionIndex, answer) {
    if (this.state !== EXAM_STATES.IN_PROGRESS) return;
    this.userAnswers[questionIndex] = answer;
    this._saveSessionState(questionIndex);
  }

  setActiveQuestion(questionIndex) {
    if (this.state !== EXAM_STATES.IN_PROGRESS) return;
    this._saveSessionState(questionIndex);
  }

  recordTabSwitch() {
    if (this.state !== EXAM_STATES.IN_PROGRESS) return;
    this.tabSwitchCount++;
    this._saveSessionState(this.restoredActiveQuestionIdx);
    if (typeof this.onCheatDetected === 'function') {
      this.onCheatDetected(this.tabSwitchCount);
    }
  }

  _startTimer() {
    this._stopTimer();
    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const remainMs = Math.max(0, this.endTime - now);
      this.timeRemaining = Math.ceil(remainMs / 1000);

      if (typeof this.onTimerTick === 'function') {
        this.onTimerTick(this.timeRemaining, this.formatTimerString());
      }

      if (this.timeRemaining <= 0) {
        this._stopTimer();
        const result = this.submitExam(true, 'timeout');
        if (typeof this.onTimeExpired === 'function') {
          this.onTimeExpired(result);
        }
        if (typeof this.onAutoSubmitted === 'function') {
          this.onAutoSubmitted(result);
        }
      }
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTimerString() {
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  _saveSessionState(activeQuestionIdx = 0) {
    if (this.state !== EXAM_STATES.IN_PROGRESS) return;
    this.restoredActiveQuestionIdx = activeQuestionIdx;
    if (this.storage && typeof this.storage.saveExamSession === 'function') {
      this.storage.saveExamSession({
        attemptId: this.attemptId,
        fullName: this.fullName,
        className: this.className,
        rollNumber: this.rollNumber,
        attemptSeed: this.attemptSeed,
        startTime: this.startTime,
        endTime: this.endTime,
        questions: this.questions,
        userAnswers: this.userAnswers,
        tabSwitchCount: this.tabSwitchCount,
        activeQuestionIdx,
        lastSavedAt: new Date().toISOString()
      });
    }
  }

  resumeExamSession(savedSession) {
    if (!savedSession || !savedSession.endTime) return false;

    const now = Date.now();
    const remainMs = savedSession.endTime - now;

    this.attemptId =
      savedSession.attemptId ||
      `u19_2_exam_${savedSession.rollNumber}_${savedSession.attemptSeed}_${savedSession.startTime}`;
    this.fullName = savedSession.fullName;
    this.className = savedSession.className;
    this.rollNumber = validateRollNumber(savedSession.rollNumber);
    this.attemptSeed = savedSession.attemptSeed;
    this.startTime = savedSession.startTime;
    this.endTime = savedSession.endTime;
    this.questions = savedSession.questions || [];
    this.userAnswers = savedSession.userAnswers || {};
    this.tabSwitchCount = savedSession.tabSwitchCount || 0;
    this.restoredActiveQuestionIdx = savedSession.activeQuestionIdx || 0;

    if (remainMs <= 0) {
      this.timeRemaining = 0;
      const result = this.submitExam(true, 'timeout-on-recovery');
      if (typeof this.onAutoSubmitted === 'function') {
        this.onAutoSubmitted(result);
      }
      return false;
    }

    this.timeRemaining = Math.ceil(remainMs / 1000);
    this.state = EXAM_STATES.IN_PROGRESS;
    this._startTimer();
    return true;
  }

  submitExam(isAutoSubmit = false, autoSubmitReason = null) {
    this._stopTimer();
    this.state = EXAM_STATES.SUBMITTED;

    let totalScore = 0;
    const gradedQuestions = this.questions.map((q, idx) => {
      const userAns = this.userAnswers[idx];
      let isCorrect = false;

      if (q.type === 'choice') {
        isCorrect = parseInt(userAns, 10) === q.correctChoiceIndex;
      } else {
        const valRes = validateNumericAnswer(userAns, q.correctAnswer, q.tolerance);
        isCorrect = valRes.isCorrect;
      }

      const earnedScore = isCorrect ? q.score : 0;
      totalScore += earnedScore;

      return {
        ...q,
        userAnswer: userAns !== undefined && userAns !== '' ? userAns : null,
        isCorrect,
        earnedScore
      };
    });

    const percentage = Math.round((totalScore / APP_CONFIG.exam.maxScore) * 100);
    const isPassed = totalScore >= APP_CONFIG.exam.passingScore;

    let gradeLevel = 'ปรับปรุง';
    if (percentage >= 80) gradeLevel = 'ดีเยี่ยม (Excellent)';
    else if (percentage >= 70) gradeLevel = 'ดีมาก (Very Good)';
    else if (percentage >= 60) gradeLevel = 'ผ่านเกณฑ์ (Passed)';

    const submissionStatus = isAutoSubmit ? 'auto-submitted' : 'submitted';
    const resolvedReason = isAutoSubmit ? (autoSubmitReason || 'timeout') : null;

    this.examResult = {
      attemptId: this.attemptId,
      examId: 'unit-19-2-timed-exam',
      examTitle: 'แบบทดสอบเก็บคะแนนบทที่ 19: ปรากฏการณ์โฟโตอิเล็กทริก (19.2)',
      fullName: this.fullName,
      className: this.className,
      rollNumber: this.rollNumber,
      durationMinutes: APP_CONFIG.exam.durationMinutes,
      totalScore,
      maxScore: APP_CONFIG.exam.maxScore,
      percentage,
      isPassed,
      gradeLevel,
      tabSwitchCount: this.tabSwitchCount,
      isAutoSubmit,
      submissionStatus,
      autoSubmitReason: resolvedReason,
      syncStatus: 'local-only',
      startedAt: this.startTime ? new Date(this.startTime).toISOString() : null,
      submittedAt: new Date().toISOString(),
      gradedQuestions
    };

    if (this.storage && typeof this.storage.saveExamResult === 'function') {
      this.storage.saveExamResult(this.examResult);
    }
    if (this.storage && typeof this.storage.clearExamSession === 'function') {
      this.storage.clearExamSession();
    }

    return this.examResult;
  }
}
