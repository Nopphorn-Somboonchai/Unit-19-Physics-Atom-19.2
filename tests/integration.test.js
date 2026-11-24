/**
 * @file integration.test.js
 * @description Master Integration & Clean Architecture Boundary Audit for Unit 19.2.
 * Verifies ZERO DOM/Canvas/Storage/Network/KaTeX leaks in src/physics/ and src/application/,
 * plus end-to-end cross-layer data flow across simulators, quiz, exam, and tab navigation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PhotoelectricTubeSimulator } from '../src/application/photoelectric-tube-simulator.js';
import { IVCurveSimulator } from '../src/application/iv-curve-simulator.js';
import { EkFrequencySimulator } from '../src/application/ek-frequency-simulator.js';
import { PhotocellAppSimulator } from '../src/application/photocell-app-simulator.js';
import { QuizManager } from '../src/application/quiz-manager.js';
import { ExamManager, EXAM_STATES } from '../src/application/exam-manager.js';
import { LocalStorageAdapter } from '../src/adapters/storage/local-storage.js';
import { TabNavigatorAdapter } from '../src/adapters/ui/tab-navigator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

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

if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
}

console.log('================================================================');
console.log('🧪 MASTER INTEGRATION & CLEAN ARCHITECTURE AUDIT — UNIT 19.2');
console.log('================================================================\n');

// --- Suite 1: Static Clean Architecture Boundary Enforcement ---
console.log('--- 1. Clean Architecture Boundary Check (src/physics & src/application) ---');
const physicsDir = path.join(ROOT_DIR, 'src', 'physics');
const appDir = path.join(ROOT_DIR, 'src', 'application');
const forbiddenPhysicsRe = /\b(document|window|HTMLElement|CanvasRenderingContext2D|localStorage|sessionStorage|fetch|katex)\b/i;
const forbiddenAppRe = /\b(document|window|HTMLElement|CanvasRenderingContext2D|localStorage|sessionStorage)\b/i;

const physicsFiles = fs.readdirSync(physicsDir).filter((f) => f.endsWith('.js'));
assert(physicsFiles.length === 6, `src/physics/ contains all 6 expected domain modules (found ${physicsFiles.length})`);
for (const file of physicsFiles) {
  const src = fs.readFileSync(path.join(physicsDir, file), 'utf8');
  assert(!forbiddenPhysicsRe.test(src), `src/physics/${file} has zero DOM/Canvas/Storage/Network/KaTeX references`);
}

const appFiles = fs.readdirSync(appDir).filter((f) => f.endsWith('.js'));
assert(appFiles.length === 6, `src/application/ contains all 6 expected service modules (found ${appFiles.length})`);
for (const file of appFiles) {
  const src = fs.readFileSync(path.join(appDir, file), 'utf8');
  assert(!forbiddenAppRe.test(src), `src/application/${file} has zero concrete DOM/Canvas/Browser Storage references`);
}

// --- Suite 2: Cross-Layer Simulator Orchestrators (Headless Node Execution) ---
console.log('\n--- 2. Simulator Orchestrators Cross-Layer Integration ---');
let tubeRenderCount = 0;
const tubeSim = new PhotoelectricTubeSimulator({
  plotter: { render: () => { tubeRenderCount++; } }
});
tubeSim.setMetal('na');
tubeSim.setWavelength(300);
tubeSim.setIntensity(80);
tubeSim.step(0.02);
assert(tubeSim.physics.emitsElectrons === true && tubeSim.physics.ekMaxEV > 1.7, 'Tube simulator computes accurate emission state from Physics Domain');
const vStop = tubeSim.setToStoppingPotential();
assert(vStop < 0 && tubeSim.physics.photocurrentMicroA === 0, 'Setting tube to stopping potential drops photocurrent to 0 µA');
assert(tubeRenderCount > 0, 'Tube orchestrator delegates rendering to plotter adapter');

const ivSim = new IVCurveSimulator();
ivSim.setComparisonMode('frequency');
assert(ivSim.model.comparisonMode === 'frequency' && ivSim.model.curves.length === 3, 'I-V simulator generates 3 frequency comparison curves');

const ekfSim = new EkFrequencySimulator();
ekfSim.setYAxisMode('vs');
ekfSim.toggleMetal('au');
assert(ekfSim.model.yAxisMode === 'vs' && ekfSim.model.series.length === 3, 'Ek-f simulator switches to Vs-f axis and enforces max 3 metals');

const cellSim = new PhotocellAppSimulator();
assert(cellSim.physics.photocurrentMicroA > 0 && cellSim.physics.relayTriggeredOpen === false, 'Photocell door stays closed when 450 nm beam hits Cs cell');
cellSim.setManualBlock(true);
cellSim.step(0.5);
assert(cellSim.physics.photocurrentMicroA === 0 && cellSim.physics.relayTriggeredOpen === true && cellSim.state.doorOpenRatio > 0, 'Blocking beam cuts photocurrent to 0 µA and triggers door opening');

// --- Suite 3: Quiz, Exam & Tab Navigation Lock Integration ---
console.log('\n--- 3. Quiz, Timed Exam & Navigation Lock Flow ---');
const qm = new QuizManager(15);
const q = qm.generateQuestion(0, '19.2.2', 4242, 'random');
assert(qm.evaluateAnswer(q.correctAnswer).isCorrect === true, 'QuizManager evaluates domain-computed answer cleanly');

const exam = new ExamManager(15, LocalStorageAdapter);
const qs = exam.startExam(31337);
TabNavigatorAdapter.setExamInProgress(true);
assert(TabNavigatorAdapter.isExamInProgress === true, 'TabNavigator locks navigation during live exam');

exam.recordAnswer(0, qs[0].correctChoiceIndex);
for (let i = 1; i < 5; i++) exam.recordAnswer(i, qs[i].correctAnswer);
const res = exam.submitExam(false);
TabNavigatorAdapter.setExamInProgress(false);

assert(exam.state === EXAM_STATES.SUBMITTED && res.totalScore === 10, 'End-to-end exam submission achieves 10/10');
assert(TabNavigatorAdapter.isExamInProgress === false, 'TabNavigator unlocks navigation after exam submission');
assert(LocalStorageAdapter.loadExamResult()?.totalScore === 10, 'Exam result persisted cleanly via LocalStorageAdapter');

console.log(`\n================================================================`);
console.log(`📊 MASTER INTEGRATION RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);

if (failed > 0) {
  process.exit(1);
}
