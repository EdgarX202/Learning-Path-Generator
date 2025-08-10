import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';

// --- Main page imports ---
import Login from './Login.jsx';
import Courses from './courses/Courses.jsx';
import SoftEng from './courses/SoftEng.jsx';
import WebDev from './courses/WebDev.jsx';
import AI from './courses/AI.jsx';

// --- Module imports ---
// Soft Dev
import Intro from './courses/SoftDevMod/Intro.jsx';
import ReqEng from './courses/SoftDevMod/ReqEng.jsx';
import SDArchitecture from './courses/SoftDevMod/SDArchitecture.jsx';
import CodingStandards from './courses/SoftDevMod/CodingStandards.jsx';
import TestQA from './courses/SoftDevMod/TestQA.jsx';
import ProjectMgmnt from './courses/SoftDevMod/ProjectMgmnt.jsx';
// AI
import IntroToAI from './courses/AIMod/Intro.jsx';
import Ethics from './courses/AIMod/Ethics.jsx';
import IntroToML from './courses/AIMod/IntroToML.jsx';
import KnowledgeRep from './courses/AIMod/KnowledgeRep.jsx';
import NLP from './courses/AIMod/NLP.jsx';
import ProblemSolving from './courses/AIMod/ProblemSolving.jsx';
// Web Dev
import CSSLayout from './courses/WebDevMod/CSSLayout.jsx';
import DOM from './courses/WebDevMod/DOM.jsx';
import FinalProject from './courses/WebDevMod/FinalProject.jsx';
import IntroToWeb from './courses/WebDevMod/IntroToWeb.jsx';
import IntroToBackend from './courses/WebDevMod/IntroToBackend.jsx';
import JSFund from './courses/WebDevMod/JSFund.jsx';

// --- Helper component for protected routes ---
// Acts as a gatekeeper for pages that require a user to be logged in
const ProtectedRoute = ({ children }) => {
    // Get the current user AND the loading state from the context
    const { user, loading } = useAuth();

    // If its still loading, show a simple loading message.
    // This prevents the redirect from happening. Check the user first.
    if (loading) {
        return <div>Loading session...</div>;
    }

    // Check the user
    if (!user) {
        // If there is no user, redirect to the login page.
        return <Navigate to="/login" />;
    }

    // If there is a user, navigate to requested page.
    return children;
};

// --- Main Application Component ---
function App() {
  return (
      // AuthContext wraps the entire app, so that the user's session data was available to all components inside
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>

            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Main page routes. Protected. User must be logged in to gain access. */}
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/softeng" element={<ProtectedRoute><SoftEng /></ProtectedRoute>} />
            <Route path="/webdev" element={<ProtectedRoute><WebDev /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />

            {/* --- Software Engineering Modules --- */}
            <Route path="/softeng/intro" element={<ProtectedRoute><Intro /></ProtectedRoute>} />
            <Route path="/softeng/reqeng" element={<ProtectedRoute><ReqEng /></ProtectedRoute>} />
            <Route path="/softeng/sdarchitecture" element={<ProtectedRoute><SDArchitecture /></ProtectedRoute>} />
            <Route path="/softeng/codingstandards" element={<ProtectedRoute><CodingStandards /></ProtectedRoute>} />
            <Route path="/softeng/testqa" element={<ProtectedRoute><TestQA /></ProtectedRoute>} />
            <Route path="/softeng/projectmgmnt" element={<ProtectedRoute><ProjectMgmnt /></ProtectedRoute>} />
            {/* --- Artificial Intelligence Modules --- */}
            <Route path="/ai/intro" element={<ProtectedRoute><IntroToAI /></ProtectedRoute>} />
            <Route path="/ai/problemsolving" element={<ProtectedRoute><ProblemSolving /></ProtectedRoute>} />
            <Route path="/ai/ethics" element={<ProtectedRoute><Ethics /></ProtectedRoute>} />
            <Route path="/ai/introtoml" element={<ProtectedRoute><IntroToML /></ProtectedRoute>} />
            <Route path="/ai/knowledgerep" element={<ProtectedRoute><KnowledgeRep /></ProtectedRoute>} />
            <Route path="/ai/nlp" element={<ProtectedRoute><NLP /></ProtectedRoute>} />
            {/* --- Website Development Modules --- */}
            <Route path="/webdev/intro" element={<ProtectedRoute><IntroToWeb /></ProtectedRoute>} />
            <Route path="/webdev/csslayouts" element={<ProtectedRoute><CSSLayout /></ProtectedRoute>} />
            <Route path="/webdev/dom" element={<ProtectedRoute><DOM /></ProtectedRoute>} />
            <Route path="/webdev/finalproject" element={<ProtectedRoute><FinalProject /></ProtectedRoute>} />
            <Route path="/webdev/introtobackend" element={<ProtectedRoute><IntroToBackend /></ProtectedRoute>} />
            <Route path="/webdev/jsfund" element={<ProtectedRoute><JSFund /></ProtectedRoute>} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;