import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx'; // Import the provider and hook
import Login from './Login.jsx';
import Courses from './courses/Courses.jsx';
import SoftEng from './courses/SoftEng.jsx';
import WebDev from './courses/WebDev.jsx';
import AI from './courses/AI.jsx';

import Intro from './courses/SoftDevMod/Intro.jsx';
import ReqEng from './courses/SoftDevMod/ReqEng.jsx';
import SDArchitecture from './courses/SoftDevMod/SDArchitecture.jsx';
import CodingStandards from './courses/SoftDevMod/CodingStandards.jsx';
import TestQA from './courses/SoftDevMod/TestQA.jsx';
import ProjectMgmnt from './courses/SoftDevMod/ProjectMgmnt.jsx';

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

            {/* --- New Module Routes --- */}
            <Route path="/softeng/intro" element={<ProtectedRoute><Intro /></ProtectedRoute>} />
            <Route path="/softeng/reqeng" element={<ProtectedRoute><ReqEng /></ProtectedRoute>} />
            <Route path="/softeng/sdarchitecture" element={<ProtectedRoute><SDArchitecture /></ProtectedRoute>} />
            <Route path="/softeng/codingstandards" element={<ProtectedRoute><CodingStandards /></ProtectedRoute>} />
            <Route path="/softeng/testqa" element={<ProtectedRoute><TestQA /></ProtectedRoute>} />
            <Route path="/softeng/projectmgmnt" element={<ProtectedRoute><ProjectMgmnt /></ProtectedRoute>} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;