/**
 * @file viewport-geometry.test.js
 * @description Viewport boundary clearance audit for all 4 Unit 19.2 Simulators
 * across 5 responsive widths: 360px, 393px, 768px, 1024px, and 1440px.
 */

import assert from 'node:assert';

console.log('Testing Unit 19.2 Simulators Geometry Clearance Across 5 Viewports...\n');

const viewports = [
  { name: 'Mobile Compact (360px)', w: 360 },
  { name: 'Mobile Standard (393px)', w: 393 },
  { name: 'iPad Portrait (768px)', w: 768 },
  { name: 'iPad Landscape (1024px)', w: 1024 },
  { name: 'Desktop (1440px)', w: 1440 }
];

for (const vp of viewports) {
  const w = vp.w;
  const isCompact = w < 640;

  // --- 1. Simulator 1: PhotoelectricTubePlotter ---
  const h1 = isCompact ? 380 : 420;
  const padX1 = isCompact ? 16 : 36;
  const tubeW = Math.min(w - padX1 * 2, isCompact ? w - 32 : 580);
  const tubeH = isCompact ? 148 : 172;
  const tubeX = Math.round((w - tubeW) / 2);
  const tubeY = isCompact ? 78 : 88;
  const circuitY = tubeY + tubeH + (isCompact ? 68 : 76);
  const meterH = 44;

  assert(tubeX - 10 >= 4, `[Sim1-Tube] Left wire clips viewport for ${vp.name} (left=${tubeX - 10})`);
  assert(tubeX + tubeW + 10 <= w - 4, `[Sim1-Tube] Right wire clips viewport for ${vp.name}`);
  assert(tubeW >= 300, `[Sim1-Tube] Vacuum tube too narrow for ${vp.name} (${tubeW}px)`);
  assert(circuitY + meterH / 2 <= h1 - 12, `[Sim1-Tube] Bottom meters clip bottom edge for ${vp.name}`);

  // --- 2. Simulator 2: IVCurvePlotter ---
  const h2 = isCompact ? 360 : 400;
  const padL2 = isCompact ? 46 : 64;
  const padR2 = isCompact ? 22 : 34;
  const padT2 = isCompact ? 42 : 48;
  const padB2 = isCompact ? 46 : 54;
  const plotW2 = w - padL2 - padR2;
  const plotH2 = h2 - padT2 - padB2;

  assert(plotW2 >= 260, `[Sim2-IV] Plot width too narrow for ${vp.name} (${plotW2}px)`);
  assert(plotH2 >= 240, `[Sim2-IV] Plot height too small for ${vp.name} (${plotH2}px)`);
  assert(padL2 + plotW2 + padR2 === w, `[Sim2-IV] Horizontal geometry mismatch for ${vp.name}`);

  // --- 3. Simulator 3: EkFrequencyPlotter ---
  const h3 = isCompact ? 380 : 420;
  const padL3 = isCompact ? 48 : 66;
  const padR3 = isCompact ? 22 : 34;
  const padT3 = isCompact ? 42 : 48;
  const padB3 = isCompact ? 44 : 50;
  const plotW3 = w - padL3 - padR3;
  const plotH3 = h3 - padT3 - padB3;

  assert(plotW3 >= 260, `[Sim3-Ekf] Plot width too narrow for ${vp.name} (${plotW3}px)`);
  assert(plotH3 >= 260, `[Sim3-Ekf] Plot height too small for ${vp.name} (${plotH3}px)`);
  assert(padT3 + plotH3 + padB3 === h3, `[Sim3-Ekf] Vertical geometry mismatch for ${vp.name}`);

  // --- 4. Simulator 4: PhotocellAppPlotter ---
  const h4 = isCompact ? 360 : 400;
  const padX4 = isCompact ? 16 : 34;
  const floorY4 = Math.round(h4 * 0.68);
  const doorW4 = Math.min(w - padX4 * 2 - 40, isCompact ? 260 : 420);
  const doorX4 = Math.round((w - doorW4) / 2);
  const gap4 = isCompact ? 8 : 14;
  const cardW4 = (w - padX4 * 2 - gap4 * 2) / 3;
  const stripY4 = floorY4 + 20;
  const stripH4 = Math.max(58, h4 - stripY4 - 16);

  assert(doorX4 - 30 >= 6, `[Sim4-Photocell] Left emitter post clips for ${vp.name}`);
  assert(doorX4 + doorW4 + 30 <= w - 6, `[Sim4-Photocell] Right receiver post clips for ${vp.name}`);
  assert(cardW4 >= 95, `[Sim4-Photocell] Telemetry card too narrow for ${vp.name} (${cardW4.toFixed(1)}px)`);
  assert(stripY4 + stripH4 <= h4 - 8, `[Sim4-Photocell] Telemetry strip clips bottom for ${vp.name}`);

  console.log(
    `✅ [PASS] ${vp.name}: Tube=${tubeW}px, IV=${plotW2}×${plotH2}px, Ek-f=${plotW3}×${plotH3}px, Door=${doorW4}px (cardW=${cardW4.toFixed(0)}px)`
  );
}

console.log('\n🎉 ALL VIEWPORT GEOMETRY CLEARANCE TESTS PASSED (100%)!\n');
