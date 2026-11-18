/**
 * Initial historical attendance records spanning across sessions.
 * Provides rich baseline data for attendance analytics, daily/monthly reports,
 * charts, and low attendance alerts (< 45%).
 */

// Helper to format consistent compound ID
export const generateAttendanceKey = (date, subjectCode, studentId) =>
  `ATT_${date}_${subjectCode}_${studentId}`;

export const STATUS_CODES = {
  PRESENT: 'P',
  ABSENT: 'A',
  LATE: 'L',
  PLACED: 'PL', // Internship Placed
  ENGAGED: 'E'  // Official Engagement
};

export const STATUS_LABELS = {
  P: { label: 'Present', full: 'Present', color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  A: { label: 'Absent', full: 'Absent', color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
  L: { label: 'Late', full: 'Late (Half credit)', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa' },
  PL: { label: 'Placed', full: 'Internship Placed', color: '#7c3aed', bg: '#f3e8ff', border: '#e9d5ff' },
  E: { label: 'Engaged', full: 'Official Engagement', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' }
};

export const INITIAL_ATTENDANCE_RECORDS = [
  // Session 1: 2026-11-03, CS401 (Database Management Systems), Sem 4, Sec A
  { id: 'ATT_2026-11-03_CS401_STU-2024-001', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-001', studentName: 'Aarav Sharma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-002', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-002', studentName: 'Priya Patel', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-003', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-003', studentName: 'Rohan Verma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-004', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-005', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-005', studentName: 'Vikram Malhotra', status: 'A', remarks: 'Unexcused' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-006', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-006', studentName: 'Sneha Kulkarni', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-007', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-007', studentName: 'Kabir Das', status: 'L', remarks: 'Arrived 15m late' },
  { id: 'ATT_2026-11-03_CS401_STU-2024-008', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-008', studentName: 'Diya Sengupta', status: 'E', remarks: 'Inter-college Hackathon' },

  // Session 2: 2026-11-05, CS402 (Algorithms), Sem 4, Sec A
  { id: 'ATT_2026-11-05_CS402_STU-2024-001', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-001', studentName: 'Aarav Sharma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-002', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-002', studentName: 'Priya Patel', status: 'PL', remarks: 'Google Summer Internship' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-003', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-003', studentName: 'Rohan Verma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-004', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', status: 'A', remarks: 'Medical Leave' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-005', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-005', studentName: 'Vikram Malhotra', status: 'A', remarks: 'Absent' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-006', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-006', studentName: 'Sneha Kulkarni', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-007', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-007', studentName: 'Kabir Das', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-05_CS402_STU-2024-008', date: '2026-11-05', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-008', studentName: 'Diya Sengupta', status: 'P', remarks: '' },

  // Session 3: 2026-11-07, CS403 (Operating Systems), Sem 4, Sec A
  { id: 'ATT_2026-11-07_CS403_STU-2024-001', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-001', studentName: 'Aarav Sharma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-002', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-002', studentName: 'Priya Patel', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-003', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-003', studentName: 'Rohan Verma', status: 'L', remarks: 'Late transport' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-004', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-005', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-005', studentName: 'Vikram Malhotra', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-006', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-006', studentName: 'Sneha Kulkarni', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-007', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-007', studentName: 'Kabir Das', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-07_CS403_STU-2024-008', date: '2026-11-07', subjectCode: 'CS403', semester: 4, section: 'A', studentId: 'STU-2024-008', studentName: 'Diya Sengupta', status: 'PL', remarks: 'Placed at Microsoft' },

  // Session 4: 2026-11-10, CS401 (Database Management Systems), Sem 4, Sec A
  { id: 'ATT_2026-11-10_CS401_STU-2024-001', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-001', studentName: 'Aarav Sharma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-002', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-002', studentName: 'Priya Patel', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-003', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-003', studentName: 'Rohan Verma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-004', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', status: 'A', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-005', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-005', studentName: 'Vikram Malhotra', status: 'A', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-006', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-006', studentName: 'Sneha Kulkarni', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-007', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-007', studentName: 'Kabir Das', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-10_CS401_STU-2024-008', date: '2026-11-10', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-008', studentName: 'Diya Sengupta', status: 'P', remarks: '' },

  // Session 5: 2026-11-12, CS402 (Algorithms), Sem 4, Sec A
  { id: 'ATT_2026-11-12_CS402_STU-2024-001', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-001', studentName: 'Aarav Sharma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-002', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-002', studentName: 'Priya Patel', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-003', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-003', studentName: 'Rohan Verma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-004', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-005', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-005', studentName: 'Vikram Malhotra', status: 'A', remarks: '' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-006', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-006', studentName: 'Sneha Kulkarni', status: 'L', remarks: 'Late by 10m' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-007', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-007', studentName: 'Kabir Das', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-12_CS402_STU-2024-008', date: '2026-11-12', subjectCode: 'CS402', semester: 4, section: 'A', studentId: 'STU-2024-008', studentName: 'Diya Sengupta', status: 'E', remarks: 'Sports meet' },

  // Session 6: 2026-11-14, CS401 (Database Management Systems), Sem 4, Sec A
  { id: 'ATT_2026-11-14_CS401_STU-2024-001', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-001', studentName: 'Aarav Sharma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-002', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-002', studentName: 'Priya Patel', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-003', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-003', studentName: 'Rohan Verma', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-004', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-005', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-005', studentName: 'Vikram Malhotra', status: 'A', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-006', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-006', studentName: 'Sneha Kulkarni', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-007', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-007', studentName: 'Kabir Das', status: 'P', remarks: '' },
  { id: 'ATT_2026-11-14_CS401_STU-2024-008', date: '2026-11-14', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-2024-008', studentName: 'Diya Sengupta', status: 'P', remarks: '' }
];
