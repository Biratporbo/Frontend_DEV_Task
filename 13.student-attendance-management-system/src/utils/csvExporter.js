/**
 * Utilities for formatting and exporting attendance data into CSV spreadsheets
 */

export function exportAttendanceReportToCSV(records, filename = 'attendance_report.csv') {
  if (!records || records.length === 0) {
    alert('No attendance records available to export.');
    return;
  }

  const headers = [
    'Record ID',
    'Date',
    'Subject Code',
    'Semester',
    'Section',
    'Student ID',
    'Student Name',
    'Status',
    'Remarks',
    'Marked At'
  ];

  const rows = records.map((r) => [
    `"${r.id}"`,
    `"${r.date}"`,
    `"${r.subjectCode}"`,
    `"${r.semester}"`,
    `"${r.section}"`,
    `"${r.studentId}"`,
    `"${(r.studentName || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${(r.remarks || '').replace(/"/g, '""')}"`,
    `"${r.markedAt || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  downloadCSVFile(csvContent, filename);
}

export function exportStudentSummariesToCSV(summaries, threshold, filename = 'student_attendance_summary.csv') {
  if (!summaries || summaries.length === 0) {
    alert('No student attendance summaries available to export.');
    return;
  }

  const headers = [
    'Student ID',
    'Roll Number',
    'Name',
    'Department',
    'Semester',
    'Section',
    'Total Classes',
    'Present',
    'Absent',
    'Late',
    'Internship Placed',
    'Official Engagement',
    'Attendance %',
    `Low Attendance Alert (< ${threshold}%)`
  ];

  const rows = summaries.map((s) => [
    `"${s.id}"`,
    `"${s.rollNumber || ''}"`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${s.department}"`,
    `"${s.semester}"`,
    `"${s.section}"`,
    `"${s.totalClasses}"`,
    `"${s.presentCount}"`,
    `"${s.absentCount}"`,
    `"${s.lateCount}"`,
    `"${s.placedCount}"`,
    `"${s.engagedCount}"`,
    `"${s.percentage}%"`,
    `"${s.isLowAttendance ? 'YES - LOW ATTENDANCE' : 'Normal'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  downloadCSVFile(csvContent, filename);
}

function downloadCSVFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
