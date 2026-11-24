/**
 * @file control-panel.js
 * @description UI Adapter binding DOM controls (sliders, selects, toggles, buttons)
 * and live DOM readout updates to the 4 Unit 19.2 Simulator Orchestrators.
 * Keeps all DOM access cleanly in the Adapters layer (Standard v1.13.0).
 */

import { formatScientific } from '../../utils/format.js';

export class ControlPanelAdapter {
  /**
   * Bind controls & readout updates for Simulator 1: Photoelectric Tube Lab
   * @param {Object} sim - PhotoelectricTubeSimulator instance
   */
  static bindPhotoelectricTubeControls(sim) {
    const selectMetal = document.getElementById('select-tube-metal');
    const sliderLambda = document.getElementById('slider-tube-lambda');
    const sliderIntensity = document.getElementById('slider-tube-intensity');
    const sliderVoltage = document.getElementById('slider-tube-voltage');
    const btnStopV = document.getElementById('btn-tube-stop-v');
    const btnPlay = document.getElementById('btn-tube-play');

    const renderReadouts = ({ state, physics }) => {
      const lblLambda = document.getElementById('lbl-tube-lambda');
      const lblIntensity = document.getElementById('lbl-tube-intensity');
      const lblVoltage = document.getElementById('lbl-tube-voltage');
      const valPhotonE = document.getElementById('tube-val-photon-e');
      const valWorkF0 = document.getElementById('tube-val-work-f0');
      const valEkVmax = document.getElementById('tube-val-ek-vmax');
      const valVsCurr = document.getElementById('tube-val-vs-current');
      const banner = document.getElementById('tube-status-banner');

      if (lblLambda) {
        lblLambda.textContent = `${state.wavelengthNm} nm (${physics.colorInfo.labelTh})`;
      }
      if (lblIntensity) {
        lblIntensity.textContent = `${state.intensityPercent}%`;
      }
      if (lblVoltage) {
        const prefix = state.voltageV > 0 ? '+' : '';
        lblVoltage.textContent = `${prefix}${state.voltageV.toFixed(2)} V`;
      }

      if (valPhotonE) {
        valPhotonE.innerHTML = `${physics.photonEnergyEV.toFixed(2)} eV <span class="block text-[10px] text-slate-400 font-normal">f = ${physics.frequency14.toFixed(2)} × 10¹⁴ Hz</span>`;
      }
      if (valWorkF0) {
        valWorkF0.innerHTML = `${physics.workFunctionEV.toFixed(1)} eV <span class="block text-[10px] text-slate-400 font-normal">f₀ = ${physics.thresholdFrequency14.toFixed(2)}×10¹⁴ Hz · λ₀ = ${physics.thresholdWavelengthNm.toFixed(0)} nm</span>`;
      }
      if (valEkVmax) {
        const vmaxStr = physics.vMaxMs > 0 ? `${formatScientific(physics.vMaxMs, 2)} m/s` : '0 m/s';
        valEkVmax.innerHTML = `${physics.ekMaxEV.toFixed(2)} eV <span class="block text-[10px] text-slate-400 font-normal">vmax = ${vmaxStr}</span>`;
      }
      if (valVsCurr) {
        valVsCurr.innerHTML = `${physics.stoppingPotentialV.toFixed(2)} V <span class="block text-[10px] text-slate-400 font-normal">กระแส I = ${physics.photocurrentMicroA.toFixed(1)} µA</span>`;
      }

      if (banner) {
        if (!physics.emitsElectrons) {
          banner.className = 'rounded-xl px-4 py-2.5 text-xs font-semibold border bg-red-50 border-red-300 text-red-900 flex items-center gap-2';
          banner.innerHTML = `<i class="fa-solid fa-circle-xmark text-red-600"></i> <span><strong>ไม่เกิดโฟโตอิเล็กตรอน เพราะ E &lt; W:</strong> พลังงานโฟตอน (${physics.photonEnergyEV.toFixed(2)} eV) ต่ำกว่าฟังก์ชันงานของ${physics.metal.nameTh} (${physics.workFunctionEV.toFixed(1)} eV) แม้เพิ่มความเข้มแสงเป็น 100% ก็ไม่มีอิเล็กตรอนหลุด! (ลองลดความยาวคลื่นให้ ≤ ${physics.thresholdWavelengthNm.toFixed(0)} nm)</span>`;
        } else if (state.intensityPercent === 0) {
          banner.className = 'rounded-xl px-4 py-2.5 text-xs font-semibold border bg-slate-100 border-slate-300 text-slate-700 flex items-center gap-2';
          banner.innerHTML = `<i class="fa-solid fa-power-off text-slate-500"></i> <span>ความเข้มแสงเป็น 0% — เพิ่มความเข้มแสงเพื่อให้โฟตอนตกกระทบผิวแคโทด</span>`;
        } else if (physics.electronMotionMode === 'stopped') {
          banner.className = 'rounded-xl px-4 py-2.5 text-xs font-semibold border bg-amber-50 border-amber-300 text-amber-900 flex items-center gap-2';
          banner.innerHTML = `<i class="fa-solid fa-hand text-amber-600"></i> <span><strong>หยุดยั้งโฟโตอิเล็กตรอนสมบูรณ์:</strong> ความต่างศักย์หน่วง (${state.voltageV.toFixed(2)} V) มีขนาด ≥ ศักย์หยุดยั้ง (Vs = ${physics.stoppingPotentialV.toFixed(2)} V) ทำให้อิเล็กตรอนย้อนกลับสู่แคโทดทั้งหมด (I = 0 µA)</span>`;
        } else {
          banner.className = 'rounded-xl px-4 py-2.5 text-xs font-semibold border bg-emerald-50 border-emerald-300 text-emerald-900 flex items-center gap-2';
          banner.innerHTML = `<i class="fa-solid fa-bolt text-emerald-600"></i> <span><strong>เกิดปรากฏการณ์โฟโตอิเล็กทริก!</strong> โฟตอนพลังงาน ${physics.photonEnergyEV.toFixed(2)} eV ≥ W (${physics.workFunctionEV.toFixed(1)} eV) ปลดปล่อยโฟโตอิเล็กตรอนด้วย Ek,max = ${physics.ekMaxEV.toFixed(2)} eV และกระแส I = ${physics.photocurrentMicroA.toFixed(1)} µA</span>`;
        }
      }
    };

    sim.setOnUpdate(renderReadouts);

    if (selectMetal) {
      selectMetal.addEventListener('change', (e) => sim.setMetal(e.target.value));
    }
    if (sliderLambda) {
      sliderLambda.addEventListener('input', (e) => sim.setWavelength(parseFloat(e.target.value)));
    }
    if (sliderIntensity) {
      sliderIntensity.addEventListener('input', (e) => sim.setIntensity(parseFloat(e.target.value)));
    }
    if (sliderVoltage) {
      sliderVoltage.addEventListener('input', (e) => sim.setVoltage(parseFloat(e.target.value)));
    }
    if (btnStopV) {
      btnStopV.addEventListener('click', () => {
        const vStop = sim.setToStoppingPotential();
        if (sliderVoltage) sliderVoltage.value = String(vStop);
      });
    }
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        const playing = sim.togglePlay();
        btnPlay.innerHTML = playing
          ? '<i class="fa-solid fa-pause mr-1"></i> พักแอนิเมชัน'
          : '<i class="fa-solid fa-play mr-1"></i> เล่นต่อ';
      });
    }
  }

  /**
   * Bind controls & readout updates for Simulator 2: I vs ΔV Graph
   * @param {Object} sim - IVCurveSimulator instance
   */
  static bindIVCurveControls(sim) {
    const selectMetal = document.getElementById('select-iv-metal');
    const sliderLambda = document.getElementById('slider-iv-lambda');
    const sliderIntensity = document.getElementById('slider-iv-intensity');
    const sliderVoltage = document.getElementById('slider-iv-voltage');
    const btnModeInt = document.getElementById('btn-iv-mode-intensity');
    const btnModeFreq = document.getElementById('btn-iv-mode-frequency');
    const cbOpPoint = document.getElementById('cb-iv-op-point');

    const updateModeButtons = (mode) => {
      if (btnModeInt) {
        btnModeInt.className =
          mode === 'intensity'
            ? 'flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-cyan-600 text-white shadow-sm cursor-pointer transition'
            : 'flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition';
      }
      if (btnModeFreq) {
        btnModeFreq.className =
          mode === 'frequency'
            ? 'flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-sm cursor-pointer transition'
            : 'flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition';
      }
    };

    const renderReadouts = ({ state, model }) => {
      updateModeButtons(state.comparisonMode);

      const lblLambda = document.getElementById('lbl-iv-lambda');
      const lblIntensity = document.getElementById('lbl-iv-intensity');
      const lblVoltage = document.getElementById('lbl-iv-voltage');
      const valVs = document.getElementById('iv-val-vs');
      const valIsat = document.getElementById('iv-val-isat');
      const valCurrent = document.getElementById('iv-val-current');
      const valSummary = document.getElementById('iv-val-summary');

      if (lblLambda) lblLambda.textContent = `${state.wavelengthNm} nm (f = ${model.primary.frequency14.toFixed(2)}×10¹⁴ Hz)`;
      if (lblIntensity) lblIntensity.textContent = `${state.intensityPercent}%`;
      if (lblVoltage) lblVoltage.textContent = `${state.operatingVoltageV >= 0 ? '+' : ''}${state.operatingVoltageV.toFixed(2)} V`;

      if (valVs) valVs.textContent = model.primary.emitsElectrons ? `-${model.primary.stoppingPotentialV.toFixed(2)} V` : 'ไม่เกิด e⁻';
      if (valIsat) valIsat.textContent = `${model.primarySaturationCurrentMicroA.toFixed(1)} µA`;
      if (valCurrent) valCurrent.textContent = `${model.operatingPoint.currentMicroA.toFixed(1)} µA`;
      if (valSummary) {
        valSummary.textContent =
          state.comparisonMode === 'intensity'
            ? 'ความเข้มแสงเพิ่ม → Isat เพิ่มขึ้น แต่จุดตัด -Vs เท่าเดิม (เพราะความถี่ f คงที่)'
            : 'ความถี่แสงเพิ่ม → ขนาด |Vs| เพิ่มขึ้น (จุดตัดเลื่อนซ้าย) ส่วน Isat เท่าเดิมเมื่อความเข้มคงที่';
      }
    };

    sim.setOnUpdate(renderReadouts);

    if (selectMetal) selectMetal.addEventListener('change', (e) => sim.setMetal(e.target.value));
    if (sliderLambda) sliderLambda.addEventListener('input', (e) => sim.setWavelength(parseFloat(e.target.value)));
    if (sliderIntensity) sliderIntensity.addEventListener('input', (e) => sim.setIntensity(parseFloat(e.target.value)));
    if (sliderVoltage) sliderVoltage.addEventListener('input', (e) => sim.setOperatingVoltage(parseFloat(e.target.value)));
    if (btnModeInt) btnModeInt.addEventListener('click', () => sim.setComparisonMode('intensity'));
    if (btnModeFreq) btnModeFreq.addEventListener('click', () => sim.setComparisonMode('frequency'));
    if (cbOpPoint) cbOpPoint.addEventListener('change', (e) => sim.setShowOperatingPoint(e.target.checked));
  }

  /**
   * Bind controls & readout updates for Simulator 3: E_{k,max}-f and V_s-f Multi-Metal Graph
   * @param {Object} sim - EkFrequencySimulator instance
   */
  static bindEkFrequencyControls(sim) {
    const btnAxisEk = document.getElementById('btn-ekf-axis-ek');
    const btnAxisVs = document.getElementById('btn-ekf-axis-vs');
    const sliderFreq = document.getElementById('slider-ekf-freq');
    const cbExtrapolate = document.getElementById('cb-ekf-extrapolate');
    const metalIds = ['cs', 'k', 'na', 'ca', 'al', 'zn', 'cu', 'au'];

    const renderReadouts = ({ state, model }) => {
      if (btnAxisEk) {
        btnAxisEk.className =
          state.yAxisMode === 'ek'
            ? 'flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm cursor-pointer transition'
            : 'flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition';
      }
      if (btnAxisVs) {
        btnAxisVs.className =
          state.yAxisMode === 'vs'
            ? 'flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm cursor-pointer transition'
            : 'flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition';
      }

      metalIds.forEach((id) => {
        const btn = document.getElementById(`btn-ekf-metal-${id}`);
        if (btn) {
          const isActive = state.metalIds.includes(id);
          btn.className = isActive
            ? 'px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-cyan-300 border border-cyan-400 shadow-sm cursor-pointer transition'
            : 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer transition';
        }
      });

      const lblFreq = document.getElementById('lbl-ekf-freq');
      if (lblFreq) lblFreq.textContent = `${state.probeFrequency14.toFixed(1)} × 10¹⁴ Hz`;

      const valSlope = document.getElementById('ekf-val-slope');
      if (valSlope) {
        valSlope.textContent =
          model.yAxisMode === 'vs'
            ? 'h/e = 4.14 × 10⁻¹⁵ V·s (ขนานทุกโลหะ)'
            : 'h = 6.626 × 10⁻³⁴ J·s (ขนานทุกโลหะ)';
      }

      const cardsWrap = document.getElementById('ekf-readout-cards');
      if (cardsWrap) {
        cardsWrap.innerHTML = model.series
          .map((s) => {
            const valText = s.probe.emitsElectrons
              ? `${s.probe.yValue.toFixed(2)} ${model.yUnit}`
              : 'ไม่เกิด e⁻ (f < f₀)';
            const valClass = s.probe.emitsElectrons ? 'text-emerald-600' : 'text-red-500';
            return `
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-slate-800 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${s.metal.lineColor}"></span>
                    ${s.metal.nameTh} (${s.metal.symbol})
                  </span>
                  <span class="font-mono text-[11px] text-slate-500">W = ${s.metal.workFunctionEV.toFixed(1)} eV</span>
                </div>
                <div class="text-[11px] text-slate-500">จุดตัดแกนนอน f₀ = <strong class="font-mono text-slate-700">${s.f0_14.toFixed(2)}×10¹⁴ Hz</strong></div>
                <div class="text-[11px] text-slate-500">ค่าที่ f ทดสอบ: <strong class="font-mono ${valClass}">${valText}</strong></div>
              </div>
            `;
          })
          .join('');
      }
    };

    sim.setOnUpdate(renderReadouts);

    if (btnAxisEk) btnAxisEk.addEventListener('click', () => sim.setYAxisMode('ek'));
    if (btnAxisVs) btnAxisVs.addEventListener('click', () => sim.setYAxisMode('vs'));
    if (sliderFreq) sliderFreq.addEventListener('input', (e) => sim.setProbeFrequency(parseFloat(e.target.value)));
    if (cbExtrapolate) cbExtrapolate.addEventListener('change', (e) => sim.setShowExtrapolation(e.target.checked));

    metalIds.forEach((id) => {
      const btn = document.getElementById(`btn-ekf-metal-${id}`);
      if (btn) btn.addEventListener('click', () => sim.toggleMetal(id));
    });
  }

  /**
   * Bind controls & readout updates for Simulator 4: Automatic Door Photocell Application
   * @param {Object} sim - PhotocellAppSimulator instance
   */
  static bindPhotocellAppControls(sim) {
    const btnWalk = document.getElementById('btn-cell-walk');
    const btnBlock = document.getElementById('btn-cell-block');
    const btnReset = document.getElementById('btn-cell-reset');
    const sliderLambda = document.getElementById('slider-cell-lambda');

    const renderReadouts = ({ state, physics }) => {
      const lblLambda = document.getElementById('lbl-cell-lambda');
      const valCurr = document.getElementById('cell-val-current');
      const valRelay = document.getElementById('cell-val-relay');
      const valDoor = document.getElementById('cell-val-door');
      const valCount = document.getElementById('cell-val-count');

      if (lblLambda) {
        lblLambda.textContent = `${state.wavelengthNm} nm (${physics.colorInfo.labelTh})`;
      }
      if (valCurr) {
        valCurr.textContent = `${physics.photocurrentMicroA.toFixed(1)} µA`;
        valCurr.className = physics.photocurrentMicroA > 0 ? 'font-bold font-mono text-emerald-600' : 'font-bold font-mono text-red-600';
      }
      if (valRelay) {
        valRelay.textContent = physics.relayTriggeredOpen ? 'สั่งเปิดประตู (I = 0)' : 'กระแสเลี้ยงปกติ';
      }
      if (valDoor) {
        valDoor.textContent = state.doorOpenRatio > 0.25 ? `เปิด (${Math.round(state.doorOpenRatio * 100)}%)` : 'ปิดปกติ';
      }
      if (valCount) {
        valCount.textContent = `${state.passCount} ครั้ง`;
      }
      if (btnBlock) {
        btnBlock.innerHTML = state.manualBlock
          ? '<i class="fa-solid fa-eye mr-1"></i> เลิกบังลำแสง'
          : '<i class="fa-solid fa-hand mr-1"></i> บังลำแสงค้างไว้';
      }
    };

    sim.setOnUpdate(renderReadouts);

    if (btnWalk) btnWalk.addEventListener('click', () => sim.triggerPersonWalk());
    if (btnBlock) btnBlock.addEventListener('click', () => sim.setManualBlock(!sim.state.manualBlock));
    if (btnReset) btnReset.addEventListener('click', () => sim.resetSimulation());
    if (sliderLambda) sliderLambda.addEventListener('input', (e) => sim.setWavelength(parseFloat(e.target.value)));
  }
}
