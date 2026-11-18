import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents } from '../students/studentsSlice';
import { selectAllSubjects } from '../subjects/subjectsSlice';
import { selectAllAttendanceRecords } from './attendanceSlice';
import {
  selectStudentSearch,
  selectStudentDepartment,
  selectStudentSemester,
  selectStudentSection,
  selectMarkingDate,
  selectMarkingSubject,
  selectMarkingSemester,
  selectMarkingSection,
  selectAttendanceThreshold,
  selectReportSubject,
  selectReportSemester,
  selectReportSection,
  selectReportStudentId,
  selectReportStartDate,
  selectReportEndDate
} from '../filters/filtersSlice';

/**
 * 1. Memoized Selector: Filtered Student Directory
 */
export const selectFilteredStudents = createSelector(
  [selectAllStudents, selectStudentSearch, selectStudentDepartment, selectStudentSemester, selectStudentSection],
  (students, search, dept, sem, sec) => {
    let result = [...students];

    // Department filter
    if (dept && dept !== 'all') {
      result = result.filter((s) => s.department === dept);
    }

    // Semester filter
    if (sem && sem !== 'all') {
      result = result.filter((s) => Number(s.semester) === Number(sem));
    }

    // Section filter
    if (sec && sec !== 'all') {
      result = result.filter((s) => s.section === sec);
    }

    // Search query (ID, Name, or Roll Number)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.id || '').toLowerCase().includes(q) ||
          (s.rollNumber || '').toLowerCase().includes(q) ||
          (s.email || '').toLowerCase().includes(q)
      );
    }

    return result;
  }
);

/**
 * 2. Memoized Selector: Eligible students for current marking class
 */
export const selectStudentsForMarkingClass = createSelector(
  [selectAllStudents, selectMarkingSemester, selectMarkingSection],
  (students, sem, sec) => {
    return students.filter(
      (s) => Number(s.semester) === Number(sem) && s.section === sec
    );
  }
);

/**
 * 3. Memoized Selector: Existing records matching current marking session
 */
export const selectExistingSessionRecords = createSelector(
  [selectAllAttendanceRecords, selectMarkingDate, selectMarkingSubject, selectMarkingSemester, selectMarkingSection],
  (records, date, subject, sem, sec) => {
    return records.filter(
      (r) =>
        r.date === date &&
        r.subjectCode === subject &&
        Number(r.semester) === Number(sem) &&
        r.section === sec
    );
  }
);

/**
 * 4. Memoized Selector: Detailed attendance summary for every student
 * Derived state: Total, Present, Absent, Late, Placed, Engaged, Percentage, Low Attendance flag
 */
export const selectStudentAttendanceSummaries = createSelector(
  [selectAllStudents, selectAllAttendanceRecords, selectAttendanceThreshold],
  (students, records, threshold) => {
    // Map records by studentId for fast O(1) aggregation
    const studentRecordsMap = {};
    records.forEach((r) => {
      if (!studentRecordsMap[r.studentId]) {
        studentRecordsMap[r.studentId] = [];
      }
      studentRecordsMap[r.studentId].push(r);
    });

    return students.map((student) => {
      const userRecords = studentRecordsMap[student.id] || [];
      const totalClasses = userRecords.length;

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let placedCount = 0;
      let engagedCount = 0;

      userRecords.forEach((r) => {
        if (r.status === 'P') presentCount += 1;
        else if (r.status === 'A') absentCount += 1;
        else if (r.status === 'L') lateCount += 1;
        else if (r.status === 'PL') placedCount += 1;
        else if (r.status === 'E') engagedCount += 1;
      });

      // Credit calculation: P (1), PL (1), E (1), L (0.5), A (0)
      const effectiveAttended = presentCount + placedCount + engagedCount + lateCount * 0.5;
      const percentage =
        totalClasses > 0
          ? Math.round((effectiveAttended / totalClasses) * 1000) / 10
          : 0;

      const isLowAttendance = totalClasses > 0 && percentage < threshold;

      return {
        ...student,
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        placedCount,
        engagedCount,
        effectiveAttended,
        percentage,
        isLowAttendance,
        threshold
      };
    });
  }
);

/**
 * 5. Memoized Selector: Students flagged with low attendance below threshold (default < 45%)
 */
export const selectLowAttendanceStudents = createSelector(
  [selectStudentAttendanceSummaries],
  (summaries) => summaries.filter((s) => s.isLowAttendance)
);

/**
 * 6. Memoized Selector: Overall system-wide attendance KPI metrics
 */
export const selectOverallAttendanceMetrics = createSelector(
  [selectAllStudents, selectAllAttendanceRecords, selectStudentAttendanceSummaries, selectAttendanceThreshold],
  (students, records, studentSummaries, threshold) => {
    const totalEnrolled = students.length;
    const totalRecords = records.length;

    // Unique session count (date + subject + section)
    const sessionKeys = new Set(records.map((r) => `${r.date}_${r.subjectCode}_${r.section}`));
    const totalSessions = sessionKeys.size;

    let presentTotal = 0;
    let absentTotal = 0;
    let lateTotal = 0;
    let placedTotal = 0;
    let engagedTotal = 0;

    records.forEach((r) => {
      if (r.status === 'P') presentTotal += 1;
      else if (r.status === 'A') absentTotal += 1;
      else if (r.status === 'L') lateTotal += 1;
      else if (r.status === 'PL') placedTotal += 1;
      else if (r.status === 'E') engagedTotal += 1;
    });

    const attendedEquivalent = presentTotal + placedTotal + engagedTotal + lateTotal * 0.5;
    const overallPercentage =
      totalRecords > 0
        ? Math.round((attendedEquivalent / totalRecords) * 1000) / 10
        : 0;

    const lowAttendanceCount = studentSummaries.filter((s) => s.isLowAttendance).length;

    return {
      totalEnrolled,
      totalRecords,
      totalSessions,
      overallPercentage,
      lowAttendanceCount,
      threshold,
      breakdown: {
        present: presentTotal,
        absent: absentTotal,
        late: lateTotal,
        placed: placedTotal,
        engaged: engagedTotal
      }
    };
  }
);

/**
 * 7. Memoized Selector: Subject-wise attendance summaries
 */
export const selectSubjectAttendanceSummaries = createSelector(
  [selectAllSubjects, selectAllAttendanceRecords],
  (subjects, records) => {
    return subjects.map((sub) => {
      const subRecords = records.filter((r) => r.subjectCode === sub.code);
      const total = subRecords.length;

      let present = 0;
      let absent = 0;
      let late = 0;
      let placed = 0;
      let engaged = 0;

      subRecords.forEach((r) => {
        if (r.status === 'P') present += 1;
        else if (r.status === 'A') absent += 1;
        else if (r.status === 'L') late += 1;
        else if (r.status === 'PL') placed += 1;
        else if (r.status === 'E') engaged += 1;
      });

      const attended = present + placed + engaged + late * 0.5;
      const rate = total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;
      const sessions = new Set(subRecords.map((r) => `${r.date}_${r.section}`)).size;

      return {
        ...sub,
        totalRecords: total,
        totalSessions: sessions,
        present,
        absent,
        late,
        placed,
        engaged,
        attendanceRate: rate
      };
    });
  }
);

/**
 * 8. Memoized Selector: Filtered attendance reports for Daily/Monthly view and CSV export
 */
export const selectFilteredReportRecords = createSelector(
  [
    selectAllAttendanceRecords,
    selectReportSubject,
    selectReportSemester,
    selectReportSection,
    selectReportStudentId,
    selectReportStartDate,
    selectReportEndDate
  ],
  (records, subject, semester, section, studentId, startDate, endDate) => {
    let result = [...records];

    // Subject filter
    if (subject && subject !== 'all') {
      result = result.filter((r) => r.subjectCode === subject);
    }

    // Semester filter
    if (semester && semester !== 'all') {
      result = result.filter((r) => Number(r.semester) === Number(semester));
    }

    // Section filter
    if (section && section !== 'all') {
      result = result.filter((r) => r.section === section);
    }

    // Student filter
    if (studentId && studentId !== 'all') {
      result = result.filter((r) => r.studentId === studentId);
    }

    // Date range filter
    if (startDate) {
      result = result.filter((r) => r.date >= startDate);
    }
    if (endDate) {
      result = result.filter((r) => r.date <= endDate);
    }

    // Sort descending by date
    result.sort(
      (a, b) =>
        (b.date || '').localeCompare(a.date || '') ||
        (a.studentName || '').localeCompare(b.studentName || '')
    );

    return result;
  }
);

/**
 * 9. Memoized Selector: Monthly attendance aggregation for Trend Charts
 */
export const selectMonthlyAttendanceTrend = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    const monthMap = {};

    records.forEach((r) => {
      const monthKey = r.date.slice(0, 7); // e.g. "2026-11"
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          month: monthKey,
          label: formatMonthLabel(monthKey),
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          placed: 0,
          engaged: 0
        };
      }

      monthMap[monthKey].total += 1;
      if (r.status === 'P') monthMap[monthKey].present += 1;
      else if (r.status === 'A') monthMap[monthKey].absent += 1;
      else if (r.status === 'L') monthMap[monthKey].late += 1;
      else if (r.status === 'PL') monthMap[monthKey].placed += 1;
      else if (r.status === 'E') monthMap[monthKey].engaged += 1;
    });

    return Object.values(monthMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => {
        const attended = m.present + m.placed + m.engaged + m.late * 0.5;
        const rate = m.total > 0 ? Math.round((attended / m.total) * 1000) / 10 : 0;
        return {
          ...m,
          attendanceRate: rate
        };
      });
  }
);

function formatMonthLabel(ym) {
  try {
    const [y, m] = ym.split('-');
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (e) {
    return ym;
  }
}
