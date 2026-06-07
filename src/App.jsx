import React, { useState } from 'react';

const App = () => {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [csvContent, setCsvContent] = useState("");

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

  const exportToCSV = () => {
    if (!students || students.length === 0) {
      alert("No students to export");
      return;
    }

    const headers = ["Name", "Attendance", "Grade", "Notes"];

    const rows = students.map((student) => [
      student.name || "",
      student.present ? 'Present' : 'Absent',
      student.grade || "",
      Array.isArray(student.notes) ? student.notes.join(" | ") : student.notes || ""
    ]);

    const csvContent = [
      "\uFEFF", // UTF-8 BOM
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");

    setCsvContent(csvContent);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'students-export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(csvContent).then(() => {
      alert('CSV content copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
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

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={generateRandomDemoClass}>Random demo class</button>
        <button onClick={exportToCSV} style={{ backgroundColor: '#38bdf8' }}>Export to CSV</button>
      </div>

      {csvContent && (
        <>
          <textarea value={csvContent} readOnly rows="10" cols="50" style={{ marginTop: '20px', width: '100%' }} />
          <button onClick={copyToClipboard} style={{ backgroundColor: '#f472b6' }}>Copy CSV</button>
        </>
      )}
    </div>
  );
};

export default App;
