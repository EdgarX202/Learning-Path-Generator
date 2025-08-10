import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Courses.css';
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';

// Accordion Item Component
const AccordionItem = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-item">
            <div className="accordion-header" onClick={toggleOpen}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{title}</span>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
};

// Calendar Widget
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

const SoftEng = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get user data from navigation state to display name in navbar
    const { firstName } = location.state || {};

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="ai-page-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Moodle AI</a>
                    <div className="d-flex align-items-center text-white">
                        <FaBell className="me-3" />
                        <FaUserCircle className="me-2" />
                        <span>{firstName || 'User'}</span>
                        <button className="btn btn-outline-light btn-sm ms-3" onClick={handleLogout}>
                            <FaSignOutAlt className="me-1" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid p-4" style={{ marginTop: '56px' }}>
                <div className="row">
                    <main className="col-lg-9">
                        <h2 className="mb-4">Software Engineering</h2>

                        {/* Accordion Section */}
                        <AccordionItem title="Miscellaneous Quizzes">
                            <p>Links and information about miscellaneous quizzes will be available here.</p>
                        </AccordionItem>
                        <AccordionItem title="The CPU-OS simulator">
                            <p>Details and access to the CPU-OS simulator.</p>
                        </AccordionItem>
                        <AccordionItem title="WebEx Recorded Lectures">
                            <p>Find all recorded lectures for this module here.</p>
                        </AccordionItem>
                        <AccordionItem title="Assessment" startOpen={true}>
                            <p>Information about assessment and exams will be available in this section.</p>
                        </AccordionItem>

                    </main>

                    <aside className="col-lg-3">
                        <CalendarWidget />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default SoftEng;