import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx'; // Corrected path
import '../Modules.css'; // Corrected path
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronRight, FaCode } from 'react-icons/fa';

// New, smaller accordion component for the nested items
const SubAccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="sub-accordion-item">
            <div className="sub-accordion-header" onClick={toggleOpen}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{title}</span>
            </div>
            {isOpen && (
                <div className="sub-accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
};


// Reusable Accordion Item for the weekly content
const WeekAccordionItem = ({ topic, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="week-accordion-item">
            <div className="week-accordion-header" onClick={toggleOpen}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{topic.title}</span>
            </div>
            {isOpen && (
                <div className="week-accordion-content">
                    {/* Conditional rendering based on the type of content */}
                    {typeof topic.content === 'string' ? (
                        <div className="p-3">{topic.content}</div>
                    ) : (
                        <>
                            <SubAccordionItem title="Theory">
                                <p>{topic.content.theory}</p>
                            </SubAccordionItem>
                            <SubAccordionItem title="Practical">
                                <p>{topic.content.practical}</p>
                            </SubAccordionItem>
                        </>
                    )}
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

    // Updated data structure
    const weeklyTopics = [
        {
            title: 'General/Announcements',
            content: 'Theory will be introduced by a lecturer, and practicals will be introduced by the AI assistant based on the theory provided? (probably future work, manual upload for now).'
        },
        {
            title: 'Week 1 - Understanding The Module',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 2 - Data & Operations',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 3 - Control Flow',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 4 - Collections',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 5 - Functions & Modularity',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 6 - Introduction to OOP',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 7 - Advanced Collections',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 8 - Error Handling & Debugging',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 9 - Introduction to Software Testing',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 10 - Version Control with Git & GitHub',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Week 11 - Revision',
            content: {
                theory: 'Content goes here...',
                practical: 'Content goes here...'
            }
        },
        {
            title: 'Final Project',
            content: 'Details about the final project requirements, submission guidelines, and marking criteria.'
        },
    ];

    return (
        <div className="ai-page-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/courses">Moodle AI</Link> {/* Link back to dashboard */}
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

            <div className="page-content"> {/* Wrapper for main content */}
                <div className="container-fluid p-4" style={{ marginTop: '56px' }}>
                    <div className="row">
                        <aside className="d-none d-lg-block col-lg-1">
                            <img
                                src="../../public/21.jpg"
                                alt="Some Image"
                                className="left-sidebar-image"
                            />
                            </aside> {/* <----- EMPTY LEFT COLUMN HERE */}
                        <main className="col-lg-8">
                             <div className="module-title-header">
                                <FaCode className="icon" />
                                <h2 className="mb-0">Introduction to the Software Lifecycle</h2>
                            </div>
                            {weeklyTopics.map((topic, index) => (
                                <WeekAccordionItem key={index} topic={topic} startOpen={index === 0} />
                            ))}
                        </main>

                        <aside className="col-lg-3">
                            <CalendarWidget />
                            <div className="sidebar-widget">
                                <div className="widget-header">Colour Notes</div>
                                <div className="widget-body">
                                    <p>Add your notes for this module...</p>
                                    <p>"different colour stickers here ?"</p>
                                </div>
                            </div>
                            <div className="sidebar-widget">
                                <div className="widget-header-AI">Learning Path Gen - AI Assistant</div>
                                <div className="widget-body">
                                    <p>Under Construction</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <footer className="page-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Edgar Park | ENU. All Rights Reserved.</p>
                    <p><Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link></p>
                </div>
            </footer>
        </div>
    );
};

export default Intro;
