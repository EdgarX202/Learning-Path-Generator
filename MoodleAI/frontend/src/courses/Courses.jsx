import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx'; // Import the useAuth hook
import './Courses.css';
import { FaBell, FaCheckCircle, FaUserCircle, FaSignOutAlt, FaQuestionCircle, FaFileAlt, FaChevronRight } from 'react-icons/fa';

const CourseAccordionItem = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleToggle = async () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen && modules.length === 0) {
            setIsLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:5001/api/modules?courseId=${course.id}`);
                if (!response.ok) throw new Error('Failed to fetch modules.');
                const data = await response.json();
                setModules(data);
            } catch (error) {
                console.error("Error fetching modules:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    const getModulePath = (moduleName) => {
        const lowerModuleName = moduleName.toLowerCase();

        // Main course pages (this logic is for navigating from the course title itself, which we aren't doing right now)
        if (lowerModuleName.includes('software engineering') && modules.length === 0) return '/softeng';
        if (lowerModuleName.includes('website development')) return '/webdev';
        if (lowerModuleName.includes('artificial intelligence')) return '/ai';

        // Specific module pages for Software Engineering
        if (lowerModuleName.includes('introduction to the software lifecycle')) return '/softeng/intro';
        if (lowerModuleName.includes('requirements engineering')) return '/softeng/reqeng';
        if (lowerModuleName.includes('software design and architecture')) return '/softeng/sdarchitecture';
        if (lowerModuleName.includes('implementation and coding standards')) return '/softeng/codingstandards';
        if (lowerModuleName.includes('software testing and quality assurance')) return '/softeng/testqa';
        if (lowerModuleName.includes('project management and devops')) return '/softeng/projectmgmnt';

        return '#';
    };
    return (
        <div className="course-accordion">
            <div className="accordion-header" onClick={handleToggle}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{course.name}</span>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    {isLoading ? (<p className="p-3">Loading modules...</p>) : (
                        <ul>
                            {modules.length > 0 ? (
                                modules.map(module => (
                                    <li key={module.module_id} onClick={() => navigate(getModulePath(module.module_name))}>
                                        {module.module_name}
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted">No modules found for this course.</li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

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

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Get user and logout from the context

    const programmeInfo = [
        { icon: <FaQuestionCircle />, title: 'Programme Level', content: 'BSc - Year 2' },
        { icon: <FaFileAlt />, title: 'Programme Information', content: 'TBC' },
        { icon: <FaUserCircle />, title: 'Main Contact', content: 'Teslania Musketeer (T.Musketeer@edu.ac.uk)' },
        { icon: <FaUserCircle />, title: 'Personal Development Contact', content: 'Nio Maximiliamus (N.Maximiliamus@edu.ac.uk)' }
    ];

    useEffect(() => {
        if (user?.userId) {
            const fetchCourses = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/courses?userId=${user.userId}`);
                    if (!response.ok) throw new Error('Failed to fetch courses.');
                    const data = await response.json();
                    setCourses(data);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchCourses();
        }
    }, [user]); // Re-run the effect if the user object changes

    const handleLogout = () => {
        logout(); // Call the logout function from the context
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
                        <span>{user?.firstName || 'User'}</span> {/* Get name from context */}
                        <button className="btn btn-outline-light btn-sm ms-3" onClick={handleLogout}>
                            <FaSignOutAlt className="me-1" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid p-4" style={{ marginTop: '56px' }}>
                <div className="row">
                    <main className="col-lg-9">
                        <section className="content-section">
                            <div className="section-header">My Programme</div>
                            <div className="section-body p-0">
                                {programmeInfo.map((item, index) => (
                                    <div key={index} className="programme-info-item">
                                        <div className="info-icon">{item.icon}</div>
                                        <div className="info-text">
                                            <div className="info-title">{item.title}</div>
                                            <div className="info-content">{item.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="content-section">
                            <div className="section-header">Course Overview</div>
                            <div className="section-body p-0">
                                {error && <div className="alert alert-danger m-3">{error}</div>}
                                {courses.length > 0 ? (
                                    courses.map(course => (
                                        <CourseAccordionItem key={course.id} course={course} />
                                    ))
                                ) : (
                                    !error && <p className="p-3">No courses to display.</p>
                                )}
                            </div>
                        </section>
                    </main>

                    <aside className="col-lg-3">
                        <CalendarWidget />
                        <div className="sidebar-widget">
                            <div className="widget-header">Latest Announcements</div>
                            <div className="widget-body text-center"><p>No new announcements.</p></div>
                        </div>
                        <div className="sidebar-widget">
                            <div className="widget-header">Coursework Deadlines</div>
                            <div className="widget-body text-center">
                                <p>No deadlines published.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Courses;






