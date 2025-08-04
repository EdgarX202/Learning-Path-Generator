import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx'; // Corrected path
import '../Modules.css'; // Corrected path
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronRight, FaCode, FaTimes, FaFileUpload, FaFilePdf, FaFileCode, FaTrash } from 'react-icons/fa';

const ColourNotesWidget = ({ moduleId }) => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [error, setError] = useState('');
    const [selectedColor, setSelectedColor] = useState('yellow');
    const colors = ['yellow', 'blue', 'green', 'purple', 'orange', 'cyan'];
    const MAX_NOTES = 12;

    useEffect(() => {
        if (user?.userId && moduleId) {
            const fetchNotes = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/notes?userId=${user.userId}&moduleId=${moduleId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setNotes(data);
                    } else {
                        console.error("Failed to fetch notes:", data.error);
                    }
                } catch (error) {
                    console.error("Error fetching notes:", error);
                }
            };
            fetchNotes();
        }
    }, [user, moduleId]);

    const handleSaveNote = async () => {
        if (!newNote.trim()) return;

        // Check if the note limit has been reached
        if (notes.length >= MAX_NOTES) {
            setError(`You have reached the maximum limit of ${MAX_NOTES} notes.`);
            return;
        }

        setError(''); // Clear any previous errors

        try {
            const response = await fetch('http://127.0.0.1:5001/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    moduleId: moduleId,
                    content: newNote,
                    color: selectedColor
                })
            });
            const data = await response.json();
            if (response.ok) {
                // Add the new note to the top of the list for immediate feedback
                setNotes([{ note_id: data.note_id, content: newNote, color: selectedColor }, ...notes]);
                setNewNote(''); // Clear the textarea
            } else {
                console.error("Failed to save note:", data.error);
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

     const handleDeleteNote = async (noteId) => {
            try {
                const response = await fetch(`http://127.0.0.1:5001/api/notes/${noteId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Remove the note from the state for immediate feedback
                    setNotes(notes.filter(note => note.note_id !== noteId));
                    setError('');
                } else {
                    const data = await response.json();
                    console.error("Failed to delete note:", data.error);
                }
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        };

    return (
        <div className="sidebar-widget">
            <div className="widget-header">Colour Notes</div>
            <div className="widget-body">
                <textarea
                    className="notes-textarea"
                    placeholder="Write your notes here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="d-flex justify-content-between align-items-center">
                    <div className="color-palette">
                        {colors.map(color => (
                            <div
                                key={color}
                                className={`color-option note-${color} ${selectedColor === color ? 'selected' : ''}`}

                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={handleSaveNote}>Save</button>
                </div>
                {error && <div className="alert alert-danger mt-2 p-2">{error}</div>}
                <hr />
                <div className="notes-list">
                    {notes.map(note => (
                        <div key={note.note_id} className={`note-item note-${note.color}`}>
                            <button className="delete-note-btn" onClick={() => handleDeleteNote(note.note_id)}>
                                <FaTimes />
                            </button>
                            <p>{note.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const LearningPathWidget = () => {
    const [difficulty, setDifficulty] = useState('Beginner');
    const [language, setLanguage] = useState('Python');

    const handleGenerate = () => {
        // This is where you would make an API call to your AI backend in the future
        console.log(`Generating learning path for: ${difficulty} level in ${language}`);
        alert(`Generating path for: ${difficulty} ${language}`);
    };

    return (
        <div className="sidebar-widget">
            <div className="widget-header-AI">Learning Path Gen - AI Assistant</div>
            <div className="widget-body">
                <div className="learning-path-form">
                    <div className="form-group">
                        <label htmlFor="difficulty-select" className="form-label">Select Difficulty:</label>
                        <select id="difficulty-select" className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="language-select" className="form-label">Select Language:</label>
                        <select id="language-select" className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option>Python</option>
                            <option>Java</option>
                            <option>JavaScript</option>
                        </select>
                    </div>
                    <button className="btn btn-warning btn-sm btn-generate" onClick={handleGenerate}>Generate</button>
                </div>
            </div>
        </div>
    );
};

// --- File Upload Component ---
const FileUpload = ({ moduleId, weekTitle, fileType, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('moduleId', moduleId);
        formData.append('weekTitle', weekTitle);
        formData.append('fileType', fileType);

        try {
            const response = await fetch('http://127.0.0.1:5001/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(`Success: ${data.filename} uploaded.`);
                onUploadSuccess(); // Call the refresh function from the parent
                setFile(null);
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="file-upload-container">
            <div className="file-upload-form">
                <input type="file" onChange={handleFileChange} className="form-control form-control-sm file-upload-input" />
                <button onClick={handleUpload} className="btn btn-secondary btn-sm"><FaFileUpload /></button>
            </div>
            {message && <p className="mt-2 mb-0 small">{message}</p>}
        </div>
    );
};


// --- Sub-Accordion for Theory/Practical ---
const SubAccordionItem = ({ title, children, moduleId, weekTitle }) => {
    const [isOpen, setIsOpen] = useState(false);
    // This component manages its own list of files.
    const [files, setFiles] = useState([]);
    const { user } = useAuth();
    const toggleOpen = () => setIsOpen(!isOpen);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const handleUploadSuccess = () => setRefreshTrigger(t => t + 1);

    useEffect(() => {
        const refreshFiles = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5001/api/files?moduleId=${moduleId}&weekTitle=${encodeURIComponent(weekTitle)}`);
                const data = await response.json();
                if(response.ok) {
                    setFiles(data.filter(f => f.file_type.toLowerCase() === title.toLowerCase()));
                }
            } catch (error) { console.error("Error fetching files:", error); }
        };

        if (isOpen) {
            refreshFiles();
        }
        // CORRECTED: Added 'refreshTrigger' to the dependency array
    }, [isOpen, refreshTrigger]);

    const handleDeleteFile = async (fileId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/files/${fileId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                handleUploadSuccess();
            } else {
                console.error("Failed to delete file.");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div className="sub-accordion-item">
            <div className="sub-accordion-header" onClick={toggleOpen}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{title}</span>
            </div>
            {isOpen && (
                <div className="sub-accordion-content">
                    {children}
                    <ul className="file-list">
                        {/* This map function uses the 'files' state variable defined above. */}
                        {files.map(file => (
                            <li key={file.file_id} className="file-list-item">
                                <div>
                                    {title.toLowerCase() === 'theory' ? <FaFilePdf className="me-2" /> : <FaFileCode className="me-2" />}
                                    <a href={`http://127.0.0.1:5001/uploads/${file.file_name}`} target="_blank" rel="noopener noreferrer">
                                        {file.file_name}
                                    </a>
                                </div>
                                {user?.role === 'staff' && (
                                    <button className="delete-file-btn" onClick={() => handleDeleteFile(file.file_id)}>
                                        <FaTrash />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {user?.role === 'staff' && (
                        <FileUpload moduleId={moduleId} weekTitle={weekTitle} fileType={title.toLowerCase()} onUploadSuccess={handleUploadSuccess} />
                    )}
                </div>
            )}
        </div>
    );
};


// --- Main Week Accordion ---
const WeekAccordionItem = ({ topic, startOpen = false, moduleId }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    // This component also manages its own 'files' state, specifically for the Final Project section.
    const [files, setFiles] = useState([]);
    const { user } = useAuth();
    const toggleOpen = () => setIsOpen(!isOpen);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const handleUploadSuccess = () => setRefreshTrigger(t => t + 1);

    const refreshFiles = async () => {
        if (topic.title !== 'Final Project') return;
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/files?moduleId=${moduleId}&weekTitle=${encodeURIComponent(weekTitle)}`);
            const data = await response.json();
            if (response.ok) {
                setFiles(data);
            }
        } catch (error) { console.error("Error fetching files:", error); }
    };

     useEffect(() => {
        const refreshFiles = async () => {
            if (topic.title !== 'Final Project') return;
            try {
                const response = await fetch(`http://127.0.0.1:5001/api/files?moduleId=${moduleId}&weekTitle=${topic.title}`);
                const data = await response.json();
                if (response.ok) {
                    setFiles(data);
                }
            } catch (error) { console.error("Error fetching files:", error); }
        };

        if (isOpen && topic.title === 'Final Project') {
            refreshFiles();
        }
    }, [isOpen, refreshTrigger]);

    const handleDeleteFile = async (fileId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/files/${fileId}`, { method: 'DELETE' });
            if (response.ok) {
                handleUploadSuccess();
            }
        } catch (error) { console.error("Error deleting file:", error); }
    };

    return (
        <div className="week-accordion-item">
            <div className="week-accordion-header" onClick={toggleOpen}>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
                <span>{topic.title}</span>
            </div>
            {isOpen && (
                <div className="week-accordion-content">
                    {typeof topic.content === 'string' ? (
                        <div className="p-3">
                            <p>{topic.content}</p>
                            {/* Special handling for Final Project to show files and upload */}
                            {topic.title === 'Final Project' && (
                                <>
                                    <ul className="file-list px-0">
                                        {/* This map function uses the 'files' state variable defined in this component. */}
                                        {files.map(file => (
                                            <li key={file.file_id} className="file-list-item">
                                                <div>
                                                    <FaFilePdf className="me-2" />
                                                    <a href={`http://127.0.0.1:5001/uploads/${file.file_name}`} target="_blank" rel="noopener noreferrer">
                                                        {file.file_name}
                                                    </a>
                                                </div>
                                                {user?.role === 'staff' && (
                                                    <button className="delete-file-btn" onClick={() => handleDeleteFile(file.file_id)}>
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    {user?.role === 'staff' && (
                                        <FileUpload moduleId={moduleId} weekTitle={topic.title} fileType="project" onUploadSuccess={handleUploadSuccess} />
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <SubAccordionItem title="Theory" moduleId={moduleId} weekTitle={topic.title}>
                                <p>{topic.content.theory}</p>
                            </SubAccordionItem>
                            <SubAccordionItem title="Practical" moduleId={moduleId} weekTitle={topic.title}>
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
            <div className="text-center mb-2 fw-bold">August 2025</div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="calendar-day-name">{day}</div>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className={day === 8 ? 'calendar-day-active' : ''}>{day}</div>
                ))}
            </div>
        </div>
    </div>
);

const Intro = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Get user data from context
    const moduleId = "INTRO_SE";

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Updated data structure
    const weeklyTopics = [
        {
            title: 'General/Announcements',
            content: 'Theory will be introduced by a lecturer, and practicals will be introduced by the AI assistant based on the theory provided? (probably future work, manual upload for now - STAFF login required).'
        },
        {
            title: 'Week 1 - Understanding The Module',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 2 - Data & Operations',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 3 - Control Flow',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 4 - Collections',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 5 - Functions & Modularity',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 6 - Introduction to OOP',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Reading Week - No Classes',
            content: { theory: 'Theory revision.', practical: 'Catching up with the practicals.' }
        },
        {
            title: 'Week 8 - Error Handling & Debugging',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 9 - Introduction to Software Testing',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 10 - Version Control with Git & GitHub',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
        },
        {
            title: 'Week 11 - Revision',
            content: { theory: 'Read the PDF file for this week.', practical: 'Finish the practical by the end of this week.' }
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
                            </aside>
                        <main className="col-lg-8">
                             <div className="module-title-header">
                                <FaCode className="icon" />
                                <h2 className="mb-0">Introduction to the Software Lifecycle</h2>
                            </div>
                            {weeklyTopics.map((topic, index) => (
                                <WeekAccordionItem key={index} topic={topic} startOpen={index === 0} moduleId={moduleId} />
                            ))}
                        </main>

                        <aside className="col-lg-3">
                            <CalendarWidget />
                            <ColourNotesWidget moduleId={moduleId} />
                            <LearningPathWidget />
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
