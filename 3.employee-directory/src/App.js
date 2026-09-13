import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import SearchFilter from './components/SearchFilter';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import initialEmployees from './data/initialEmployees';
import './App.css';

function App() {
  // 1. Core State Hooks (useState)
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Helper to show temporary status feedback
  const showFeedback = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  // 2. Event Handlers
  // Toggle form visibility
  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingEmployee(null);
    } else {
      setEditingEmployee(null);
      setIsFormOpen(true);
    }
  };

  // Trigger edit mode for a selected employee
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  // Save new or updated employee
  const handleSaveEmployee = (employeeData, isEditing) => {
    if (isEditing) {
      // Update existing record using array map
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employeeData.id ? employeeData : emp))
      );
      showFeedback(`Employee ${employeeData.name} (${employeeData.id}) updated successfully!`, 'success');
    } else {
      // Add new employee record to beginning of list
      setEmployees((prev) => [employeeData, ...prev]);
      showFeedback(`Employee ${employeeData.name} added successfully!`, 'success');
    }

    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  // Delete an employee with confirmation
  const handleDeleteEmployee = (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to remove employee "${name}" (${id}) from the directory?`
    );

    if (isConfirmed) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      showFeedback(`Employee "${name}" has been deleted.`, 'danger');

      // If the currently edited employee was deleted, close the form
      if (editingEmployee && editingEmployee.id === id) {
        setIsFormOpen(false);
        setEditingEmployee(null);
      }
    }
  };

  // Search input handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Department dropdown handler
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  // Clear search and department filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All');
  };

  // 3. Data Processing (Filtering & Employee Counts)
  // Extract distinct departments from current dataset
  const uniqueDepartments = Array.from(
    new Set(employees.map((emp) => emp.department))
  ).sort();

  // Filter employees according to department and search keyword
  const filteredEmployees = employees.filter((emp) => {
    // Department check
    const matchesDepartment =
      selectedDepartment === 'All' || emp.department === selectedDepartment;

    // Search query check (Name, Employee ID, or Phone)
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      emp.name.toLowerCase().includes(query) ||
      emp.id.toLowerCase().includes(query) ||
      emp.phone.includes(query);

    return matchesDepartment && matchesSearch;
  });

  const existingIds = employees.map((e) => e.id);

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar isFormOpen={isFormOpen} onToggleForm={handleToggleForm} />

      <main className="main-content">
        {/* Status Notification Banner (Conditional Rendering) */}
        {feedbackMessage && (
          <div className={`feedback-banner feedback-${feedbackMessage.type}`}>
            <span>{feedbackMessage.text}</span>
            <button
              className="feedback-close"
              onClick={() => setFeedbackMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Add / Edit Form (Conditional Rendering) */}
        {isFormOpen && (
          <EmployeeForm
            onSave={handleSaveEmployee}
            onCancel={handleCloseForm}
            editingEmployee={editingEmployee}
            existingIds={existingIds}
          />
        )}

        {/* Employee Metrics & Count Display */}
        <StatsBar
          totalCount={employees.length}
          filteredCount={filteredEmployees.length}
          departmentCount={uniqueDepartments.length}
          selectedDepartment={selectedDepartment}
        />

        {/* Search & Department Filter Controls */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={handleDepartmentChange}
          departments={uniqueDepartments}
          onReset={handleResetFilters}
        />

        {/* Employee Records List */}
        <EmployeeList
          employees={filteredEmployees}
          onEdit={handleEditClick}
          onDelete={handleDeleteEmployee}
          onViewDetails={(emp) => setViewingEmployee(emp)}
          onClearFilters={handleResetFilters}
          isFiltered={searchTerm !== '' || selectedDepartment !== 'All'}
        />
      </main>

      {/* Employee Detail & Address Modal (Conditional Rendering) */}
      {viewingEmployee && (
        <EmployeeDetailModal
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(null)}
          onEdit={handleEditClick}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} GreenField Farm Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

