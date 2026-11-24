/**
 * @file tab-navigator.js
 * @description Master Tab & Section Navigation Adapter for Unit 19.2 (Photoelectric Effect).
 * Controls 6 primary sections (Home, Review, Practice, Exam Start/Live/Result) and 4 Review sub-tabs.
 * Enforces Exam Navigation Lock during live exam according to Standard v1.13.0.
 */

import { KaTeXAdapter } from '../formula/katex-adapter.js';
import { SimulatorLoader } from './simulator-loader.js';

export class TabNavigatorAdapter {
  static currentSection = 'home';
  static currentReviewTab = '19-2-tube';
  static isExamInProgress = false;
  static simulators = {};

  static setExamInProgress(inProgress) {
    this.isExamInProgress = Boolean(inProgress);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('exam-locked', this.isExamInProgress);
      if (document.body) {
        document.body.classList.toggle('exam-locked', this.isExamInProgress);
      }
    }
  }

  /**
   * Switch between primary sections
   * @param {'home'|'review'|'practice'|'exam-start'|'exam-live'|'exam-result'} targetSection
   */
  static showSection(targetSection) {
    if (this.isExamInProgress && !['exam-live', 'exam-result'].includes(targetSection)) {
      if (typeof alert === 'function') {
        alert('⚠️ อยู่ระหว่างการทำแบบทดสอบจับเวลา ไม่สามารถออกจากหน้าสอบได้จนกว่าจะส่งคำตอบ');
      }
      return;
    }

    this.currentSection = targetSection;
    const sections = ['home', 'review', 'practice', 'exam-start', 'exam-live', 'exam-result'];

    if (typeof document !== 'undefined') {
      sections.forEach((sec) => {
        const el = document.getElementById(`sec-${sec}`);
        if (el) {
          el.classList.toggle('hidden', sec !== targetSection);
        }
      });

      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.add('hidden');
    }

    // Pause background simulator animation loops when leaving review section
    if (targetSection !== 'review') {
      if (this.simulators.tubeSim) this.simulators.tubeSim.stopAnimationLoop();
      if (this.simulators.photocellSim) this.simulators.photocellSim.stopAnimationLoop();
    } else {
      this.switchReviewTab(this.currentReviewTab);
    }

    if (typeof requestAnimationFrame !== 'undefined' && typeof document !== 'undefined') {
      requestAnimationFrame(() => {
        const activeContainer = document.getElementById(`sec-${targetSection}`);
        if (activeContainer) {
          KaTeXAdapter.renderAllMath(activeContainer);
        }
      });
    }
  }

  /**
   * Switch between 4 Review Sub-tabs
   * @param {'19-2-tube'|'19-2-iv'|'19-2-ekf'|'19-2-photocell'} tabId
   */
  static switchReviewTab(tabId) {
    this.currentReviewTab = tabId;
    const tabKeys = ['19-2-tube', '19-2-iv', '19-2-ekf', '19-2-photocell'];

    if (typeof document !== 'undefined') {
      tabKeys.forEach((key) => {
        const btn = document.getElementById(`btn-tab-${key}`);
        const content = document.getElementById(`review-tab-${key}`);

        if (btn) {
          if (key === tabId) {
            btn.className = 'flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 bg-white text-blue-600 shadow-sm cursor-pointer';
          } else {
            btn.className = 'flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 cursor-pointer';
          }
        }

        if (content) {
          content.classList.toggle('hidden', key !== tabId);
        }
      });
    }

    this.handleSimulatorLifecycle(tabId);

    if (typeof requestAnimationFrame !== 'undefined' && typeof document !== 'undefined') {
      requestAnimationFrame(() => {
        const content = document.getElementById(`review-tab-${tabId}`);
        if (content) KaTeXAdapter.renderAllMath(content);
      });
    }
  }

  static handleSimulatorLifecycle(tabId) {
    const { tubeSim, ivSim, ekfSim, photocellSim } = this.simulators;

    SimulatorLoader.load(tabId, { duration: 550 });

    if (tubeSim && tabId !== '19-2-tube') tubeSim.stopAnimationLoop();
    if (photocellSim && tabId !== '19-2-photocell') photocellSim.stopAnimationLoop();

    if (tabId === '19-2-tube' && tubeSim) {
      tubeSim.resize();
      if (tubeSim.state.isPlaying) tubeSim.startAnimationLoop();
    }

    if (tabId === '19-2-iv' && ivSim) {
      ivSim.resize();
    }

    if (tabId === '19-2-ekf' && ekfSim) {
      ekfSim.resize();
    }

    if (tabId === '19-2-photocell' && photocellSim) {
      photocellSim.resize();
      photocellSim.startAnimationLoop();
    }
  }

  static toggleMobileMenu() {
    if (typeof document === 'undefined') return;
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  }

  static init(simulators = {}) {
    this.simulators = simulators;
    SimulatorLoader.initGlobalHandlers();

    if (typeof window !== 'undefined') {
      window.showSection = (sectionId) => this.showSection(sectionId);
      window.switchReviewTab = (tabId) => this.switchReviewTab(tabId);
      window.toggleMobileMenu = () => this.toggleMobileMenu();
    }

    if (this.isExamInProgress) {
      this.showSection('exam-live');
    } else {
      this.showSection('home');
    }
  }
}
