/**
 * @file main.js
 * @description Main application entry point for Unit 19.2 Interactive Physics Learning Portal
 * (Photoelectric Effect). Wires Canvas Plotters -> Simulator Orchestrators -> UI Adapters,
 * sets up Global Error Boundary, and initializes offline KaTeX formula rendering.
 * Conforms to Physics Learning Standard (v1.13.0).
 */

import { APP_CONFIG } from './shared/config.js';
import {
  PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
  ELEMENTARY_CHARGE,
  ELECTRON_MASS
} from './shared/constants.js';

import { CanvasRenderer } from './adapters/canvas/canvas-renderer.js';
import { PhotoelectricTubePlotter } from './adapters/canvas/photoelectric-tube-plotter.js';
import { IVCurvePlotter } from './adapters/canvas/iv-curve-plotter.js';
import { EkFrequencyPlotter } from './adapters/canvas/ek-frequency-plotter.js';
import { PhotocellAppPlotter } from './adapters/canvas/photocell-app-plotter.js';

import { PhotoelectricTubeSimulator } from './application/photoelectric-tube-simulator.js';
import { IVCurveSimulator } from './application/iv-curve-simulator.js';
import { EkFrequencySimulator } from './application/ek-frequency-simulator.js';
import { PhotocellAppSimulator } from './application/photocell-app-simulator.js';

import { ControlPanelAdapter } from './adapters/ui/control-panel.js';
import { TabNavigatorAdapter } from './adapters/ui/tab-navigator.js';
import { QuizUIAdapter } from './adapters/ui/quiz-ui.js';
import { ExamUIAdapter } from './adapters/ui/exam-ui.js';
import { KaTeXAdapter } from './adapters/formula/katex-adapter.js';

setupErrorBoundary();

document.addEventListener('DOMContentLoaded', () => {
  console.log(`[Physics Portal] Initializing ${APP_CONFIG.appName} v${APP_CONFIG.version} (${APP_CONFIG.standardVersion})`);
  console.log(
    `[Physics Constants] h = ${PLANCK_CONSTANT.toExponential(3)} J·s, c = ${SPEED_OF_LIGHT.toExponential(2)} m/s, e = ${ELEMENTARY_CHARGE.toExponential(3)} C, me = ${ELECTRON_MASS.toExponential(3)} kg`
  );

  verifyKaTeXLoaded();

  try {
    // 1. Simulator 1: Virtual Photoelectric Tube Lab
    const canvasTube = document.getElementById('canvas-tube');
    let tubeSim = null;
    if (canvasTube) {
      const tubeRenderer = new CanvasRenderer(canvasTube);
      const tubePlotter = new PhotoelectricTubePlotter(tubeRenderer);
      tubeSim = new PhotoelectricTubeSimulator({ plotter: tubePlotter });
      tubeRenderer.onResize = () => tubeSim.render();
      ControlPanelAdapter.bindPhotoelectricTubeControls(tubeSim);
    }

    // 2. Simulator 2: I vs ΔV Characteristic Curves
    const canvasIV = document.getElementById('canvas-iv');
    let ivSim = null;
    if (canvasIV) {
      const ivRenderer = new CanvasRenderer(canvasIV);
      const ivPlotter = new IVCurvePlotter(ivRenderer);
      ivSim = new IVCurveSimulator({ plotter: ivPlotter });
      ivRenderer.onResize = () => ivSim.render();
      ControlPanelAdapter.bindIVCurveControls(ivSim);
    }

    // 3. Simulator 3: E_{k,max}-f & V_s-f Multi-Metal Graph
    const canvasEkf = document.getElementById('canvas-ekf');
    let ekfSim = null;
    if (canvasEkf) {
      const ekfRenderer = new CanvasRenderer(canvasEkf);
      const ekfPlotter = new EkFrequencyPlotter(ekfRenderer);
      ekfSim = new EkFrequencySimulator({ plotter: ekfPlotter });
      ekfRenderer.onResize = () => ekfSim.render();
      ControlPanelAdapter.bindEkFrequencyControls(ekfSim);
    }

    // 4. Simulator 4: Automatic Door Photocell Application
    const canvasCell = document.getElementById('canvas-photocell');
    let photocellSim = null;
    if (canvasCell) {
      const cellRenderer = new CanvasRenderer(canvasCell);
      const cellPlotter = new PhotocellAppPlotter(cellRenderer);
      photocellSim = new PhotocellAppSimulator({ plotter: cellPlotter });
      cellRenderer.onResize = () => photocellSim.render();
      ControlPanelAdapter.bindPhotocellAppControls(photocellSim);
    }

    // 5. Initialize Section & Tab Navigation before ExamUIAdapter so recovery routing persists
    TabNavigatorAdapter.init({
      tubeSim,
      ivSim,
      ekfSim,
      photocellSim
    });

    // 6. Initialize Practice Arena (Dynamic RNG Quiz)
    new QuizUIAdapter();

    // 7. Initialize Timed Exam & Anti-Cheat System
    new ExamUIAdapter();

    // 8. Render All Offline KaTeX Mathematical Expressions
    renderAllMathFormulas();

    console.log('[Physics Portal] Unit 19.2 Photoelectric Effect portal initialized successfully.');
  } catch (err) {
    console.error('[Physics Portal Error] Failed to initialize portal modules:', err);
  }
});

function renderAllMathFormulas() {
  let attempts = 0;
  const maxAttempts = 20;

  const tryRender = () => {
    attempts++;
    if (typeof window.katex !== 'undefined') {
      KaTeXAdapter.renderAllMath(document.body);
    } else if (attempts < maxAttempts) {
      setTimeout(tryRender, 80);
    }
  };

  tryRender();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => {
      KaTeXAdapter.renderAllMath(document.body);
    });
  }
}

function verifyKaTeXLoaded() {
  if (typeof window.katex !== 'undefined') {
    console.log('[KaTeX Adapter] Local offline KaTeX engine loaded successfully.');
  } else {
    console.warn('[KaTeX Adapter] KaTeX not yet ready in global context. Retrying...');
  }
}

function setupErrorBoundary() {
  window.addEventListener('error', (evt) => {
    console.error('[Global Error Boundary]', evt.message, evt.filename, evt.lineno);
  });

  window.addEventListener('unhandledrejection', (evt) => {
    console.error('[Unhandled Rejection Boundary]', evt.reason);
  });
}
