import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx';
import '../Modules.css'; // Imports the stylesheet from the Canvas
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronRight, FaCode } from 'react-icons/fa';

// Reusable Accordion Item for the weekly content
const WeekAccordionItem = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="week-accordion-item">
            <div className="week-accordion-header" onClick={toggleOpen}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{title}</span>
            </div>
            {isOpen && (
                <div className="week-accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
};

// Calendar Widget for layout consistency
const CalendarWidget = () => (
    <div className="sidebar-widget">
        <div className="widget-header">Calendar</div>
        <div className="widget-body">
            <div className="text-center mb-2 fw-bold">July 2025</div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="calendar-day-name">{day}</div>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className={day === 27 ? 'calendar-day-active' : ''}>{day}</div>
                ))}
            </div>
        </div>
    </div>
);

const Intro = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Get user data from context

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const weeklyTopics = [
        { title: 'General/Announcements', content: 'Theory introduced by a lecturer. Practical introduced by AI' },
        { title: 'Week 1 - Understanding The Module', content: 'Content goes here...' },
        { title: 'Week 2 - Data & Operations', content: 'Content goes here...' },
        { title: 'Week 3 - Control Flow', content: 'Content goes here...' },
        { title: 'Week 4 - Collections', content: 'Content goes here...' },
        { title: 'Week 5 - Functions & Modularity', content: 'Content goes here...' },
        { title: 'Week 6 - Introduction to OOP', content: 'Content goes here...' },
        { title: 'Week 7 - Advanced Collections', content: 'Content goes here....' },
        { title: 'Week 7 - Error Handling & Debugging', content: 'Content goes here....' },
        { title: 'Week 9 - Introduction to Software Testing', content: 'Content goes here...' },
        { title: 'Week 10 - Version Control with Git & GitHub', content: 'Content goes here...' },
        { title: 'Week 11 - Revision', content: 'Content goes here...' },
        { title: 'Final Project', content: 'Content goes here...' }
    ];

    return (
        <div className="ai-page-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/courses">Moodle AI</a> {/* Link back to dashboard */}
                    <div className="d-flex align-items-center text-white">
                        <FaBell className="me-3" />
                        <FaUserCircle className="me-2" />
                        <span>{user?.firstName || 'User'}</span>
                        <button className="btn btn-outline-light btn-sm ms-3" onClick={handleLogout}>
                            <FaSignOutAlt className="me-1" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid p-4" style={{ marginTop: '56px' }}>
                <div className="row">
                    <main className="col-lg-9">
                         <div className="module-title-header">
                            <FaCode className="icon" />
                            <h2 className="mb-0">Software Engineering Module</h2>
                        </div>
                        {weeklyTopics.map((topic, index) => (
                            <WeekAccordionItem key={index} title={topic.title}>
                                <p>{topic.content}</p>
                            </WeekAccordionItem>
                        ))}
                    </main>

                    <aside className="col-lg-3">
                        <CalendarWidget />
                        <div className="sidebar-widget">
                            <div className="widget-header">Module Resources</div>
                            <div className="widget-body">
                                <p>Links to reading lists, past papers, etc.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Intro;
