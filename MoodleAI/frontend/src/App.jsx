import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import AI from './Courses/AI.jsx';

function App() {
  // In a real app, this would be managed by a Context or state library.
  const isAuthenticated = true;

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* The login page is the main entry point */}
          <Route path="/login" element={<Login />} />

          {/* The AI page is a protected route. If not authenticated, the user is sent to /login */}
          <Route
            path="/ai"
            element={isAuthenticated ? <AI /> : <Navigate to="/login" />}
          />

          {/* Default route redirects to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

