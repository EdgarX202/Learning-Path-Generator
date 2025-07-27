import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// This file is in 'src', so the path is correct
import Login from './Login.jsx';

// All course-related pages are inside the 'src/courses' subfolder, so we must include 'courses/' in the path
import Courses from './courses/Courses.jsx';
import SoftEng from './courses/SoftEng.jsx';
import WebDev from './courses/WebDev.jsx';
import AI from './courses/AI.jsx';

function App() {
  // In a real app, this would be managed by a Context or state library.
  const isAuthenticated = true;

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- Core Routes --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* --- Main Dashboard --- */}
          <Route
            path="/courses"
            element={isAuthenticated ? <Courses /> : <Navigate to="/login" />}
          />

          {/* --- Individual Course Pages --- */}
          <Route
            path="/softeng"
            element={isAuthenticated ? <SoftEng /> : <Navigate to="/login" />}
          />
          <Route
            path="/webdev"
            element={isAuthenticated ? <WebDev /> : <Navigate to="/login" />}
          />
          <Route
            path="/ai"
            element={isAuthenticated ? <AI /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



