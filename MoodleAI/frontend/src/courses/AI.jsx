import React from 'react';
import './Courses.css'; // Import the custom stylesheet
import { FaBell, FaCheckCircle, FaEye, FaUserCircle } from 'react-icons/fa';

// Mock data for demonstration
const courses = [
    { id: 'CSN11108', name: 'Computer Systems' },
    { id: 'LS002707', name: 'SoC Masters Dissertation' },
    { id: 'SET11103', name: 'Software Development 2' },
];

const CalendarWidget = () => (
    <div className="sidebar-widget">
        <div className="widget-header">Calendar</div>
        <div className="widget-body">
            <div className="text-center mb-2 fw-bold">July 2025</div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="calendar-day-name">{day}</div>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className={day === 26 ? 'calendar-day-active' : ''}>{day}</div>
                ))}
            </div>
        </div>
    </div>
);

const AI = () => {
    return (
        <div className="ai-page-container">
            {/* Top Bar - This is the dark top bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Moodle AI</a>
                    <div className="d-flex align-items-center text-white">
                        <FaBell className="me-3" />
                        <FaUserCircle className="me-2" />
                        <span>Edgar</span>
                    </div>
                </div>
            </nav>

            <div className="container-fluid p-4" style={{ marginTop: '60px' }}>
                <div className="row">
                    {/* Main Content Column */}
                    <main className="col-lg-9">
                        {/* My Programme Section */}
                        <section className="content-section">
                            <div className="section-header">My Programme</div>
                            <div className="section-body">
                                <p>Links and information related to your programme of study.</p>
                                <p>Your AI Assistant can help you find resources, understand topics, and prepare for assessments.</p>
                            </div>
                        </section>

                        {/* Course Overview Section */}
                        <section className="content-section">
                            <div className="section-header">Course Overview</div>
                            <div className="section-body">
                                {courses.map(course => (
                                    <div key={course.id} className="course-list-item">
                                        <span>{course.id} - {course.name}</span>
                                        <FaEye />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>

                    {/* Sidebar Column */}
                    <aside className="col-lg-3">
                        <CalendarWidget />

                        <div className="sidebar-widget">
                            <div className="widget-header">Events</div>
                            <div className="widget-body">
                                <p>No upcoming events.</p>
                            </div>
                        </div>

                        <div className="sidebar-widget">
                            <div className="widget-header">Module Evaluations</div>
                            <div className="widget-body text-center">
                                <FaCheckCircle size={40} className="text-success mb-2" />
                                <p>No open surveys.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default AI;
