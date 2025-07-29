import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx'; // Import the provider and hook
import Login from './Login.jsx';
import Courses from './courses/Courses.jsx';
import SoftEng from './courses/SoftEng.jsx';
import WebDev from './courses/WebDev.jsx';
import AI from './courses/AI.jsx';

// A helper component to protect routes
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // If no user is logged in, redirect to the login page
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
  return (
    <AuthProvider> {/* Wrap everything in the AuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* --- Protected Routes --- */}
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/softeng" element={<ProtectedRoute><SoftEng /></ProtectedRoute>} />
            <Route path="/webdev" element={<ProtectedRoute><WebDev /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



