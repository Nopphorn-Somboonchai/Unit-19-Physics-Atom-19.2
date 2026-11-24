/**
 * @file config.js
 * @description Application Configuration for Unit 19.2 Interactive Physics Learning Portal
 * (Photoelectric Effect). Conforms to Physics Learning Standard (v1.13.0).
 */

export const APP_CONFIG = {
  appName: 'Physics Unit 19.2: Photoelectric Effect',
  version: '1.0.0',
  standardVersion: 'v1.13.0',
  courseCode: 'ว33206',
  courseName: 'ฟิสิกส์ 6 (ม.6)',
  chapterNumber: 19,
  sectionNumber: '19.2',
  chapterTitleTh: 'ฟิสิกส์อะตอม (19.2 ปรากฏการณ์โฟโตอิเล็กทริก)',
  chapterTitleEn: 'Atomic Physics: 19.2 Photoelectric Effect',
  schoolName: 'โรงเรียนห้องสอนศึกษา ในพระอุปถัมภ์ฯ',
  author: 'Nopphorn Somboonchai',

  minRollNumber: 1,
  maxRollNumber: 40,
  numericAnswerTolerance: 0.03, // ±3% tolerance

  exam: {
    durationMinutes: 15,
    totalQuestions: 5,
    maxScore: 10,
    scorePerQuestion: 2,
    passingScore: 6, // 60%
    tolerancePercent: 3.0 // ±3% tolerance for numeric responses
  },

  storageKeys: {
    examResult: 'u19_2_exam_latest_result',
    examSession: 'u19_2_exam_active_session',
    userPreferences: 'u19_2_user_prefs'
  }
};
