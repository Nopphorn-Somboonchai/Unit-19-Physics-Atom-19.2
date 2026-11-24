/**
 * @file simulator-loader.js
 * @description Simulator Calibration & Async Loader UI Adapter for Unit 19.2.
 * Conforms to Physics Learning Standard (v1.13.0).
 */

export class SimulatorLoader {
  static loadedState = {
    '19-2-tube': false,
    '19-2-iv': false,
    '19-2-ekf': false,
    '19-2-photocell': false
  };

  static prefixMap = {
    '19-2-tube': 'tube',
    '19-2-iv': 'iv',
    '19-2-ekf': 'ekf',
    '19-2-photocell': 'photocell'
  };

  static calibrationStages = {
    '19-2-tube': [
      { maxPct: 25, status: 'กำลังปรับสุญญากาศในหลอดโฟโตอิเล็กทริก...' },
      { maxPct: 60, status: 'คำนวณฟังก์ชันงาน (W) และความถี่ขีดเริ่ม (f₀)...' },
      { maxPct: 90, status: 'ปรับเทียบแอมมิเตอร์ (µA) และโวลต์มิเตอร์ (V)...' },
      { maxPct: 100, status: 'หลอดโฟโตอิเล็กทริกเสมือนจริงพร้อมใช้งานเสร็จสมบูรณ์ 100%' }
    ],
    '19-2-iv': [
      { maxPct: 25, status: 'กำลังเตรียมพิกัดกราฟกระแสโฟโตอิเล็กทริก I–ΔV...' },
      { maxPct: 60, status: 'คำนวณกระแสอิ่มตัว (Isat) และศักย์หยุดยั้ง (-Vs)...' },
      { maxPct: 90, status: 'สร้างชุดกราฟเปรียบเทียบความเข้มแสงและความถี่...' },
      { maxPct: 100, status: 'ระบบวิเคราะห์กราฟ I–ΔV พร้อมใช้งานเสร็จสมบูรณ์ 100%' }
    ],
    '19-2-ekf': [
      { maxPct: 25, status: 'กำลังสร้างพิกัดแกน Ek,max–f และ Vs–f...' },
      { maxPct: 60, status: 'คำนวณความชันค่าคงตัวของพลังค์ (h และ h/e)...' },
      { maxPct: 90, status: 'ลากเส้นประต่อจุดตัดแกนตั้ง (-W) เปรียบเทียบโลหะ...' },
      { maxPct: 100, status: 'กราฟเปรียบเทียบหลายโลหะพร้อมใช้งานเสร็จสมบูรณ์ 100%' }
    ],
    '19-2-photocell': [
      { maxPct: 25, status: 'กำลังติดตั้งเซนเซอร์เซลล์โฟโตอิเล็กทริก (Cs)...' },
      { maxPct: 60, status: 'เชื่อมต่อวงจรรีเลย์และมอเตอร์ประตูอัตโนมัติ...' },
      { maxPct: 90, status: 'ทดสอบลำแสงควบคุมและระบบตรวจจับการบังแสง...' },
      { maxPct: 100, status: 'แบบจำลองประตูอัตโนมัติพร้อมใช้งานเสร็จสมบูรณ์ 100%' }
    ]
  };

  static isLoaded(simId) {
    return Boolean(this.loadedState[simId]);
  }

  static markLoaded(simId) {
    this.loadedState[simId] = true;
  }

  static reset(simId) {
    if (simId) {
      this.loadedState[simId] = false;
    } else {
      Object.keys(this.loadedState).forEach((key) => {
        this.loadedState[key] = false;
      });
    }
  }

  static getStatusText(simId, pct) {
    const stages = this.calibrationStages[simId] || this.calibrationStages['19-2-tube'];
    const current = stages.find((s) => pct <= s.maxPct);
    return current ? current.status : stages[stages.length - 1].status;
  }

  static load(simId, options = {}) {
    const {
      force = false,
      duration = 650,
      onComplete = null,
      onProgress = null
    } = options;

    if (this.isLoaded(simId) && !force) {
      if (typeof onComplete === 'function') onComplete();
      return Promise.resolve(true);
    }

    const prefix = this.prefixMap[simId] || simId;

    return new Promise((resolve) => {
      const isDOM = typeof document !== 'undefined';
      const elOverlay = isDOM ? document.getElementById(`loader-${prefix}`) : null;
      const elPct = isDOM ? document.getElementById(`loader-${prefix}-pct`) : null;
      const elBar = isDOM ? document.getElementById(`loader-${prefix}-bar`) : null;
      const elStatus = isDOM ? document.getElementById(`loader-${prefix}-status`) : null;

      if (elOverlay) {
        elOverlay.classList.remove('opacity-0', 'pointer-events-none');
        elOverlay.style.display = 'flex';
      }

      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

      const updateProgress = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, Math.max(0, elapsed / duration));

        const ease = 1 - Math.pow(1 - progress, 3);
        const currentPct = Math.min(100, Math.round(ease * 100));
        const statusText = this.getStatusText(simId, currentPct);

        if (elPct) elPct.textContent = String(currentPct);
        if (elBar) elBar.style.width = `${currentPct}%`;
        if (elStatus) elStatus.textContent = statusText;

        if (typeof onProgress === 'function') {
          onProgress(currentPct, statusText);
        }

        if (progress < 1) {
          if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(updateProgress);
          } else {
            setTimeout(() => updateProgress(Date.now()), 16);
          }
        } else {
          this.markLoaded(simId);

          if (elPct) elPct.textContent = '100';
          if (elBar) elBar.style.width = '100%';
          if (elStatus) elStatus.textContent = this.getStatusText(simId, 100);

          if (elOverlay) {
            setTimeout(() => {
              elOverlay.classList.add('opacity-0', 'pointer-events-none');
              setTimeout(() => {
                if (elOverlay.classList.contains('opacity-0')) {
                  elOverlay.style.display = 'none';
                }
              }, 300);
            }, 120);
          }

          if (typeof onComplete === 'function') {
            onComplete();
          }

          resolve(true);
        }
      };

      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => updateProgress(Date.now()), 16);
      }
    });
  }

  static reload(simId, onComplete = null) {
    return this.load(simId, { force: true, onComplete });
  }

  static initGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.SimulatorLoader = SimulatorLoader;
      window.reloadSimulator = (simId) => SimulatorLoader.reload(simId);
    }
  }
}
