/**
 * @file quiz.test.js
 * @description Automated Verification Script for Unit 19.2 Dynamic RNG Quiz System.
 * Verifies Roll 1-40 bounds, all 15 questions (3 topics × 5), Standard vs Random modes,
 * 0% Anti-Repeat guarantee, choice & multi-numeric grading, and ±3% tolerance.
 */

import { QuizManager } from '../src/application/quiz-manager.js';
import { validateRollNumber, validateNumericAnswer } from '../src/utils/validation.js';

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

console.log('=============== 🧪 RUNNING UNIT 19.2 QUIZ ENGINE TESTS ===============\n');

// --- Suite 1: Roll Number Bounds [1, 40] ---
console.log('--- Test Suite 1: Roll Number Validation [1, 40] ---');
assert(validateRollNumber(1) === 1, 'Roll number 1 accepted');
assert(validateRollNumber(40) === 40, 'Roll number 40 accepted');
assert(validateRollNumber(0) === 1, 'Roll number 0 clamped to 1');
assert(validateRollNumber(-9) === 1, 'Negative roll number clamped to 1');
assert(validateRollNumber(99) === 40, 'Roll number > 40 clamped to 40');
assert(validateRollNumber('27') === 27, 'String roll number parsed accurately');

// --- Suite 2: ±3% Numeric Tolerance ---
console.log('\n--- Test Suite 2: Numeric Grading & ±3% Tolerance ---');
assert(validateNumericAnswer(2.40, 2.40, 0.03).isCorrect === true, 'Exact match accepted');
assert(validateNumericAnswer(2.46, 2.40, 0.03).isCorrect === true, '2.5% error accepted within ±3%');
assert(validateNumericAnswer(2.52, 2.40, 0.03).isCorrect === false, '5.0% error rejected (> 3%)');
assert(validateNumericAnswer('invalid', 2.40, 0.03).isCorrect === false, 'Non-numeric input rejected');

// --- Suite 3: Topic 19.2.1 Standard 5-Question Bank ---
console.log('\n--- Test Suite 3: Topic 19.2.1 (5 Questions — Standard Mode) ---');
const qmStd = new QuizManager(1);
const t1q1 = qmStd.generateQuestion(0, '19.2.1', null, 'standard');
assert(t1q1.type === 'numeric' && t1q1.unit === 'eV' && t1q1.correctAnswer === 3.1, `19.2.1 Q1 (400 nm) = 3.10 eV (got ${t1q1.correctAnswer})`);

const t1q2 = qmStd.generateQuestion(1, '19.2.1', null, 'standard');
assert(t1q2.type === 'numeric' && t1q2.unit === '× 10¹⁴ Hz' && t1q2.correctAnswer === 5.8, `19.2.1 Q2 (Na 2.4 eV f₀) = 5.80 × 10¹⁴ Hz (got ${t1q2.correctAnswer})`);

const t1q3 = qmStd.generateQuestion(2, '19.2.1', null, 'standard');
assert(t1q3.type === 'numeric' && t1q3.unit === 'nm' && t1q3.correctAnswer === 590.9, `19.2.1 Q3 (Cs 2.1 eV λ₀) = 590.9 nm (got ${t1q3.correctAnswer})`);

const t1q4 = qmStd.generateQuestion(3, '19.2.1', null, 'standard');
assert(t1q4.type === 'choice' && t1q4.choices.length === 4 && t1q4.correctChoiceIndex === 0, '19.2.1 Q4 is 4-option emission condition choice question');

const t1q5 = qmStd.generateQuestion(4, '19.2.1', null, 'standard');
assert(t1q5.type === 'multi-numeric' && t1q5.inputs.length === 2, '19.2.1 Q5 is 2-part multi-numeric (f₀ & λ₀)');
assert(t1q5.inputs[0].correctAnswer === 5.56 && t1q5.inputs[1].correctAnswer === 539.5, `19.2.1 Q5 (K 2.3 eV) = [5.56, 539.5] (got [${t1q5.inputs[0].correctAnswer}, ${t1q5.inputs[1].correctAnswer}])`);
assert(qmStd.evaluateMultiAnswer([5.56, 539.5]).isCorrect === true, '19.2.1 Q5 multi-numeric accepts both correct answers');
assert(qmStd.evaluateMultiAnswer([5.56, 999]).isCorrect === false, '19.2.1 Q5 multi-numeric rejects partial wrong answer');

// --- Suite 4: Topic 19.2.2 Standard 5-Question Bank ---
console.log('\n--- Test Suite 4: Topic 19.2.2 (5 Questions — Standard Mode) ---');
const t2q1 = qmStd.generateQuestion(0, '19.2.2', null, 'standard');
assert(t2q1.unit === 'eV' && t2q1.correctAnswer === 0.91, `19.2.2 Q1 (Na, 8.00e14 Hz) = 0.91 eV (got ${t2q1.correctAnswer})`);

const t2q2 = qmStd.generateQuestion(1, '19.2.2', null, 'standard');
assert(t2q2.unit === 'V' && t2q2.correctAnswer === 1.74, `19.2.2 Q2 (Na, 300 nm Vs) = 1.74 V (got ${t2q2.correctAnswer})`);

const t2q3 = qmStd.generateQuestion(2, '19.2.2', null, 'standard');
assert(t2q3.unit === 'eV' && t2q3.correctAnswer === 2.3, `19.2.2 Q3 (10e14 Hz, Vs=1.84V -> W) = 2.30 eV (got ${t2q3.correctAnswer})`);

const t2q4 = qmStd.generateQuestion(3, '19.2.2', null, 'standard');
assert(t2q4.unit === '× 10⁵ m/s' && Math.abs(t2q4.correctAnswer - 5.94) <= 0.02, `19.2.2 Q4 (Cs, 400 nm vmax) ≈ 5.94 × 10⁵ m/s (got ${t2q4.correctAnswer})`);

const t2q5 = qmStd.generateQuestion(4, '19.2.2', null, 'standard');
assert(t2q5.type === 'multi-numeric' && t2q5.inputs.length === 2, '19.2.2 Q5 is 2-part multi-numeric (Ek,max & Vs)');
assert(qmStd.evaluateMultiAnswer([t2q5.inputs[0].correctAnswer, t2q5.inputs[1].correctAnswer]).isCorrect === true, '19.2.2 Q5 multi-numeric grading passes');

// --- Suite 5: Topic 19.2.3 Standard 5-Question Bank ---
console.log('\n--- Test Suite 5: Topic 19.2.3 (5 Questions — Standard Mode) ---');
const t3q1 = qmStd.generateQuestion(0, '19.2.3', null, 'standard');
assert(t3q1.unit === '× 10⁻³⁴ J·s' && Math.abs(t3q1.correctAnswer - 6.63) <= 0.02, `19.2.3 Q1 (slope h) ≈ 6.63 × 10⁻³⁴ J·s (got ${t3q1.correctAnswer})`);

const t3q2 = qmStd.generateQuestion(1, '19.2.3', null, 'standard');
assert(t3q2.unit === 'eV' && Math.abs(t3q2.correctAnswer - 4.30) <= 0.02, `19.2.3 Q2 (f₀=10.40e14 Hz -> W) ≈ 4.30 eV (got ${t3q2.correctAnswer})`);

const t3q3 = qmStd.generateQuestion(2, '19.2.3', null, 'standard');
assert(t3q3.type === 'choice' && t3q3.choices.length === 4, '19.2.3 Q3 is 4-option graph & wave-vs-photon concept question');

const t3q4 = qmStd.generateQuestion(3, '19.2.3', null, 'standard');
assert(t3q4.unit === 'nm' && Math.abs(t3q4.correctAnswer - 225.6) <= 0.2, `19.2.3 Q4 (Zn, Vs=1.20 V -> λ) ≈ 225.6 nm (got ${t3q4.correctAnswer})`);

const t3q5 = qmStd.generateQuestion(4, '19.2.3', null, 'standard');
assert(t3q5.type === 'multi-numeric' && t3q5.inputs.length === 2, '19.2.3 Q5 is 2-part photocell application question (λ₀ & Ek,max)');
assert(qmStd.evaluateMultiAnswer([t3q5.inputs[0].correctAnswer, t3q5.inputs[1].correctAnswer]).isCorrect === true, '19.2.3 Q5 multi-numeric grading passes');

// --- Suite 6: Random Mode Seeded RNG + 0% Anti-Repeat Guarantee across all 15 questions ---
console.log('\n--- Test Suite 6: Zero-Repeat RNG (0% Repeat) & Roll Uniqueness across all 15 Questions ---');
const qmR1 = new QuizManager(1);
const qmR40 = new QuizManager(40);
const detA = qmR1.generateQuestion(0, '19.2.1', 55555, 'random');
const detB = qmR40.generateQuestion(0, '19.2.1', 55555, 'random');
const detAReplay = new QuizManager(1).generateQuestion(0, '19.2.1', 55555, 'random');
assert(detA.correctAnswer !== detB.correctAnswer, 'Roll #1 and Roll #40 receive distinct randomized values');
assert(detA.correctAnswer === detAReplay.correctAnswer, 'Deterministic seed replays identical question and answer');

const topicChecks = [
  { topic: '19.2.1', stdParams: [400, 2.40, 2.10, 'na-650', 2.30], drawCounts: [30, 30, 30, 11, 30] },
  { topic: '19.2.2', stdParams: [8.00, 300, 10.00, 400, 320], drawCounts: [30, 30, 30, 30, 30] },
  { topic: '19.2.3', stdParams: [6.63, 10.40, 'iv-intensity', 1.20, 450], drawCounts: [25, 30, 7, 30, 30] }
];

const qmUnique = new QuizManager(14);
for (const tc of topicChecks) {
  for (let slot = 0; slot < 5; slot++) {
    const seen = new Set();
    let hitStd = false;
    let repeated = false;
    const nDraws = tc.drawCounts[slot];

    for (let i = 0; i < nDraws; i++) {
      const q = qmUnique.generateQuestion(slot, tc.topic, null, 'random');
      if (q.generatedParam === tc.stdParams[slot]) hitStd = true;
      if (seen.has(q.generatedParam)) repeated = true;
      seen.add(q.generatedParam);
    }

    assert(!hitStd, `${tc.topic} Q${slot + 1} random mode never repeats standard value (${tc.stdParams[slot]})`);
    assert(!repeated, `${tc.topic} Q${slot + 1} random mode achieves 0% repeat across ${nDraws} consecutive draws`);
  }
}

console.log(`\n=======================================================`);
console.log(`📊 QUIZ TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`=======================================================`);

if (failed > 0) {
  process.exit(1);
}
