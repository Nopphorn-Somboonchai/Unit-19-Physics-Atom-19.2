/**
 * @file exam.test.js
 * @description Automated Verification Script for Unit 19.2 Timed Exam System.
 * Verifies FSM (IDLE->IN_PROGRESS->SUBMITTED), 5 questions / 10 marks, 15-min timer,
 * Anti-Cheat switch counter, Session Persistence & Refresh Recovery (including timeout-on-recovery).
 */

import { ExamManager, EXAM_STATES } from '../src/application/exam-manager.js';
import { LocalStorageAdapter } from '../src/adapters/storage/local-storage.js';

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

// Mock localStorage for Node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; }
  };
}

console.log('=============== 🧪 RUNNING UNIT 19.2 TIMED EXAM TESTS ===============\n');

// --- Suite 1: FSM & 15-Minute Timer ---
console.log('--- Test Suite 1: FSM & 15-Minute Timer Initialization ---');
const em = new ExamManager(1, LocalStorageAdapter);
assert(em.state === EXAM_STATES.IDLE, 'Exam starts in IDLE state');

em.setIdentity('สมชาย ใจดี', 'ม.6/1', 12);
assert(em.fullName === 'สมชาย ใจดี' && em.className === 'ม.6/1' && em.rollNumber === 12, 'Student identity stored cleanly');

const questions = em.startExam(12345);
assert(em.state === EXAM_STATES.IN_PROGRESS, 'State transitions to IN_PROGRESS on startExam()');
assert(questions.length === 5, 'Exam paper contains exactly 5 questions');
assert(questions[0].type === 'choice' && questions[0].choices.length === 4, 'Q1 is 4-option multiple choice');
assert(questions.slice(1).every((q) => q.type === 'numeric' && q.score === 2), 'Q2–Q5 are numeric questions worth 2 marks each');
assert(em.formatTimerString() === '15:00', 'Countdown timer initialized to 15:00 (900 seconds)');

// --- Suite 2: Scoring (10 Marks Total) & Storage Isolation ---
console.log('\n--- Test Suite 2: Grading (10 Marks) & Isolated Storage Keys ---');
em.recordAnswer(0, questions[0].correctChoiceIndex);
for (let i = 1; i < 5; i++) {
  em.recordAnswer(i, questions[i].correctAnswer);
}

const result = em.submitExam(false);
assert(em.state === EXAM_STATES.SUBMITTED, 'State transitions to SUBMITTED');
assert(result.totalScore === 10 && result.maxScore === 10, 'Perfect score is 10 / 10');
assert(result.percentage === 100 && result.isPassed === true, 'Percentage is 100% and passed status is true');
assert(result.examId === 'unit-19-2-timed-exam', 'Exam ID uniquely identifies Unit 19.2');
assert(globalThis.localStorage.getItem('u19_2_exam_latest_result') !== null, 'Result persisted under isolated u19_2_exam_latest_result key');

// --- Suite 3: Seeded RNG Attempt Determinism & Anti-Cheat ---
console.log('\n--- Test Suite 3: Attempt-Scoped Determinism & Anti-Cheat ---');
const emA = new ExamManager(5, LocalStorageAdapter);
const qsA = emA.startExam(1111);
const emB = new ExamManager(5, LocalStorageAdapter);
const qsB = emB.startExam(9999);
const emAReplay = new ExamManager(5, LocalStorageAdapter);
const qsAReplay = emAReplay.startExam(1111);

assert(qsA[1].correctAnswer !== qsB[1].correctAnswer, 'Different attempt seeds produce different randomized exam questions');
assert(qsA[1].correctAnswer === qsAReplay[1].correctAnswer, 'Same attempt seed replays identical numeric parameters');
assert(JSON.stringify(qsA[0].choices) === JSON.stringify(qsAReplay[0].choices), 'Same attempt seed replays identical shuffled choices');

let cheatNotifiedCount = 0;
emA.onCheatDetected = (c) => { cheatNotifiedCount = c; };
emA.recordTabSwitch();
emA.recordTabSwitch();
assert(emA.tabSwitchCount === 2 && cheatNotifiedCount === 2, 'Anti-Cheat records tab switches accurately and invokes callback');

emA._stopTimer();
emB._stopTimer();
emAReplay._stopTimer();

// --- Suite 4: Session Persistence & Recovery (Active + Timeout-on-Recovery) ---
console.log('\n--- Test Suite 4: Session Persistence & Recovery (Active + Expired) ---');
LocalStorageAdapter.clearExamSession();

const activeEm = new ExamManager(18, LocalStorageAdapter);
activeEm.setIdentity('อนันต์ มุ่งมั่น', 'ม.6/2', 18);
const activeQs = activeEm.startExam(7777);
activeEm.recordAnswer(0, activeQs[0].correctChoiceIndex);
activeEm.recordAnswer(2, activeQs[2].correctAnswer);
activeEm._saveSessionState(3);
activeEm._stopTimer();

const saved = LocalStorageAdapter.loadExamSession();
assert(saved !== null && saved.activeQuestionIdx === 3, 'Active session saved with current question index');
assert(globalThis.localStorage.getItem('u19_2_exam_active_session') !== null, 'Active session stored under isolated u19_2_exam_active_session key');

// Simulate 3 minutes elapsed before refresh
saved.startTime = Date.now() - 3 * 60 * 1000;
saved.endTime = saved.startTime + 15 * 60 * 1000;

const resumedEm = new ExamManager(1, LocalStorageAdapter);
const didResume = resumedEm.resumeExamSession(saved);
assert(didResume === true && resumedEm.state === EXAM_STATES.IN_PROGRESS, 'Active session resumes into IN_PROGRESS');
assert(resumedEm.restoredActiveQuestionIdx === 3, 'Resumed session restores exact active question index');
assert(resumedEm.timeRemaining <= 720 && resumedEm.timeRemaining >= 718, 'Remaining time preserves original 15-min deadline (~12:00 left)');
resumedEm.submitExam(false);
assert(LocalStorageAdapter.loadExamSession() === null, 'Active session cleared upon manual submission');

// Timeout-on-recovery test
const expEm = new ExamManager(22, LocalStorageAdapter);
expEm.setIdentity('ทดสอบ หมดเวลา', 'ม.6/3', 22);
const expQs = expEm.startExam(8888);
expEm.recordAnswer(0, expQs[0].correctChoiceIndex);
expEm._stopTimer();

const expiredSession = LocalStorageAdapter.loadExamSession();
expiredSession.endTime = Date.now() - 10000; // Expired 10s ago

const recoveryEm = new ExamManager(1, LocalStorageAdapter);
let autoCbFired = false;
recoveryEm.onAutoSubmitted = () => { autoCbFired = true; };
const resumedExpired = recoveryEm.resumeExamSession(expiredSession);

assert(resumedExpired === false, 'Expired session returns false from resumeExamSession');
assert(recoveryEm.state === EXAM_STATES.SUBMITTED, 'Expired session transitions immediately to SUBMITTED');
assert(autoCbFired === true, 'onAutoSubmitted callback fires for expired recovery');
assert(recoveryEm.examResult.isAutoSubmit === true && recoveryEm.examResult.autoSubmitReason === 'timeout-on-recovery', 'Result contract records autoSubmitReason = timeout-on-recovery');
assert(recoveryEm.examResult.totalScore === 2, 'Partial saved answer graded accurately upon timeout-on-recovery (2/10)');
assert(LocalStorageAdapter.loadExamSession() === null, 'Expired session cleared after auto-submit');

console.log(`\n=======================================================`);
console.log(`📊 EXAM TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`=======================================================`);

if (failed > 0) {
  process.exit(1);
}
