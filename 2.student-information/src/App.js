// src/App.js
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StudentList from './components/StudentList';
import Footer from './components/Footer';
import STUDENTS_DATA from './data/studentsData';
import './App.css';

/**
 * App Component
 * Acts as the centralized state manager and orchestrator.
 * Adheres to strict Prop-passing architecture:
 * - Passes header metadata and statistics to <Header />
 * - Passes student data, sort state, and callback handlers to <StudentList />
 * - <StudentList /> passes individual student properties down to <StudentCard />
 * - Passes footer info to <Footer />
 */
function App() {
  // Sort order state: 'none' (default), 'cgpa-desc' (high to low), 'cgpa-asc' (low to high)
  const [sortOrder, setSortOrder] = useState('none');
  
  // Search query state for filtering by name or roll number
  const [searchQuery, setSearchQuery] = useState('');
  
  // Department filter state
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set(STUDENTS_DATA.map((s) => s.department));
    return Array.from(set).sort();
  }, []);

  // Compute portal-wide statistics to pass as props to Header
  const stats = useMemo(() => {
    const total = STUDENTS_DATA.length;
    if (total === 0) return { total: 0, avgCgpa: '0.00', topCgpa: '0.00' };

    const totalCgpa = STUDENTS_DATA.reduce((acc, curr) => acc + curr.cgpa, 0);
    const avgCgpa = (totalCgpa / total).toFixed(2);
    const topCgpa = Math.max(...STUDENTS_DATA.map((s) => s.cgpa)).toFixed(2);

    return { total, avgCgpa, topCgpa };
  }, []);

  // Process, filter, and sort students according to active criteria
  const processedStudents = useMemo(() => {
    let result = [...STUDENTS_DATA];

    // 1. Department Filter
    if (selectedDepartment !== 'All') {
      result = result.filter((student) => student.department === selectedDepartment);
    }

    // 2. Search Query Filter (Name or Roll Number)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.rollNumber.toLowerCase().includes(query)
      );
    }

    // 3. CGPA Sorting Mechanism
    if (sortOrder === 'cgpa-desc') {
      result.sort((a, b) => b.cgpa - a.cgpa);
    } else if (sortOrder === 'cgpa-asc') {
      result.sort((a, b) => a.cgpa - b.cgpa);
    }

    return result;
  }, [sortOrder, searchQuery, selectedDepartment]);

  return (
    <div className="portal-app">
      {/* 1. Header Component (receives title, subtitle, and stats via props) */}
      <Header
        title="Student Information Portal"
        subtitle="Manage, view, and sort student academic profiles with clean props-based data flow."
        stats={stats}
      />

      {/* 2. Main Content Area */}
      <main className="portal-main">
        {/* StudentList Component (receives student dataset & handlers via props) */}
        <StudentList
          students={processedStudents}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
          totalCount={STUDENTS_DATA.length}
        />
      </main>

      {/* 3. Footer Component (receives portalName via props) */}
      <Footer portalName="Student Information Portal" />
    </div>
  );
}

export default App;

