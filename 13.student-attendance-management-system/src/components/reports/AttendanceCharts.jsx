import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const STATUS_COLORS = {
  Present: '#16a34a',
  Absent: '#dc2626',
  Late: '#ea580c',
  Placed: '#7c3aed',
  Engaged: '#0284c7'
};

export function AttendanceCharts({ subjectSummaries = [], overall = null }) {
  // 1. Data for Status Distribution Pie Chart
  const pieData = overall?.breakdown
    ? [
        { name: 'Present', value: overall.breakdown.present, color: STATUS_COLORS.Present },
        { name: 'Absent', value: overall.breakdown.absent, color: STATUS_COLORS.Absent },
        { name: 'Late', value: overall.breakdown.late, color: STATUS_COLORS.Late },
        { name: 'Placed', value: overall.breakdown.placed, color: STATUS_COLORS.Placed },
        { name: 'Engaged', value: overall.breakdown.engaged, color: STATUS_COLORS.Engaged }
      ].filter((item) => item.value > 0)
    : [];

  // 2. Data for Subject-Wise Bar Chart
  const barData = subjectSummaries
    .filter((s) => s.totalSessions > 0)
    .map((s) => ({
      subject: s.code,
      name: s.name,
      AttendanceRate: s.attendanceRate,
      Present: s.present,
      Absent: s.absent
    }));

  return (
    <div className="charts-grid-2">
      {/* Subject-Wise Attendance Rates Bar Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h4 className="chart-title">Subject-Wise Attendance Rate (%)</h4>
          <span className="chart-subtitle">Comparison across conducted curricula</span>
        </div>

        <div className="chart-canvas-wrap" style={{ height: 280 }}>
          {barData.length === 0 ? (
            <div className="no-chart-data">No session data available for chart</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 12 }} unit="%" />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, 'Attendance Rate']}
                  labelFormatter={(code) => {
                    const item = barData.find((b) => b.subject === code);
                    return item ? `${code} - ${item.name}` : code;
                  }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <Bar dataKey="AttendanceRate" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Overall Status Distribution Donut Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h4 className="chart-title">Overall Status Distribution</h4>
          <span className="chart-subtitle">Breakdown of recorded marks</span>
        </div>

        <div className="chart-canvas-wrap" style={{ height: 280 }}>
          {pieData.length === 0 ? (
            <div className="no-chart-data">No attendance records logged yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} marks`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceCharts;
