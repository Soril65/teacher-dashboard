import React, { useState } from 'react';

const App = () => {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const addStudent = (name) => {
    const newStudent = { name, present: false };
    setStudents([...students, newStudent]);
    localStorage.setItem('students', JSON.stringify([...students, newStudent]));
  };

  const deleteStudent = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const markPresentAbsent = (index) => {
    const updatedStudents = students.map((student, i) =>
      i === index ? { ...student, present: !student.present } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const generateRandomDemoClass = () => {
    const demoStudents = [
      { name: 'Alice', present: true },
      { name: 'Bob', present: false },
      { name: 'Charlie', present: true },
      { name: 'David', present: false },
      { name: 'Eve', present: true }
    ];
    setStudents(demoStudents);
    localStorage.setItem('students', JSON.stringify(demoStudents));
  };

  const totalStudents = students.length;
  const presentStudents = students.filter(student => student.present).length;
  const absentStudents = students.length - presentStudents;

  return (
    <div>
      <header>
        <h1>Teacher Dashboard</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addStudent(e.target.studentName.value);
          e.target.studentName.value = '';
        }}
      >
        <input type="text" name="studentName" placeholder="Add student name" required />
        <button type="submit">Add Student</button>
      </form>

      <div>
        <p>Total Students: {totalStudents}</p>
        <p>Present Students: {presentStudents}</p>
        <p>Absent Students: {absentStudents}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.present ? 'Present' : 'Absent'}</td>
              <td>
                <button onClick={() => markPresentAbsent(index)}>
                  Mark {student.present ? 'Absent' : 'Present'}
                </button>
                <button className="delete" onClick={() => deleteStudent(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={generateRandomDemoClass}>Random demo class</button>
    </div>
  );
};

export default App;
