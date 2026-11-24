/**
 * @file simulator-loader.test.js
 * @description Unit tests for SimulatorLoader Calibrator UI Adapter (Unit 19.2).
 */

import assert from 'node:assert';
import { SimulatorLoader } from '../src/adapters/ui/simulator-loader.js';

console.log('=============== 🧪 RUNNING UNIT 19.2 SIMULATOR LOADER TESTS ===============\n');

// Test Suite 1: Initial State & Prefix Mapping
console.log('--- Test Suite 1: Initial State & Mapping ---');
SimulatorLoader.reset();
assert.strictEqual(SimulatorLoader.isLoaded('19-2-tube'), false);
assert.strictEqual(SimulatorLoader.isLoaded('19-2-iv'), false);
assert.strictEqual(SimulatorLoader.isLoaded('19-2-ekf'), false);
assert.strictEqual(SimulatorLoader.isLoaded('19-2-photocell'), false);
console.log('✅ [PASS] All 4 Unit 19.2 simulators initially not loaded');

assert.strictEqual(SimulatorLoader.prefixMap['19-2-tube'], 'tube');
assert.strictEqual(SimulatorLoader.prefixMap['19-2-iv'], 'iv');
assert.strictEqual(SimulatorLoader.prefixMap['19-2-ekf'], 'ekf');
assert.strictEqual(SimulatorLoader.prefixMap['19-2-photocell'], 'photocell');
console.log('✅ [PASS] Prefix mapping matches DOM IDs');

// Test Suite 2: Calibration Stages & Physics Status Text
console.log('\n--- Test Suite 2: Calibration Stages & Status Messages ---');
assert(SimulatorLoader.getStatusText('19-2-tube', 15).includes('สุญญากาศ'));
assert(SimulatorLoader.getStatusText('19-2-tube', 100).includes('เสร็จสมบูรณ์'));
assert(SimulatorLoader.getStatusText('19-2-iv', 50).includes('Isat'));
assert(SimulatorLoader.getStatusText('19-2-ekf', 50).includes('พลังค์'));
assert(SimulatorLoader.getStatusText('19-2-photocell', 50).includes('รีเลย์'));
console.log('✅ [PASS] Calibration stage messages verified for all 4 simulators');

// Test Suite 3: Async Progression & Anti-Duplicate Load
console.log('\n--- Test Suite 3: Async Progression & Anti-Duplicate Protection ---');
const progressSteps = [];
await SimulatorLoader.load('19-2-tube', {
  duration: 80,
  onProgress: (pct, msg) => progressSteps.push({ pct, msg })
});

assert.strictEqual(SimulatorLoader.isLoaded('19-2-tube'), true);
assert(progressSteps.length > 0 && progressSteps[progressSteps.length - 1].pct === 100);
console.log(`✅ [PASS] Async calibration reached 100% in ${progressSteps.length} updates`);

let duplicateProgressCount = 0;
let secondCompleteCalled = false;
await SimulatorLoader.load('19-2-tube', {
  duration: 80,
  onProgress: () => { duplicateProgressCount++; },
  onComplete: () => { secondCompleteCalled = true; }
});
assert.strictEqual(duplicateProgressCount, 0, 'Duplicate load skipped without re-running animation');
assert.strictEqual(secondCompleteCalled, true, 'onComplete callback still fires on cached load');
console.log('✅ [PASS] Anti-duplicate load skips redundant progression');

let forceSteps = 0;
await SimulatorLoader.reload('19-2-tube', () => { forceSteps++; });
assert.strictEqual(forceSteps, 1);
console.log('✅ [PASS] Force reload re-triggers calibration cleanly');

console.log('\n=======================================================');
console.log('📊 SIMULATOR LOADER TEST SUMMARY: ALL PASSED');
console.log('=======================================================\n');
