import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx';
import '../Modules.css';
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronRight, FaCode, FaTimes, FaFileUpload, FaFilePdf, FaFileCode, FaTrash, FaLightbulb, FaSpinner, FaBook } from 'react-icons/fa';

// --- COLOUR NOTES WIDGET ---
const ColourNotesWidget = ({ moduleId }) => {
    // Hook
    const { user } = useAuth();
    // States
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [error, setError] = useState('');
    const [selectedColor, setSelectedColor] = useState('yellow');

    const colors = ['yellow', 'blue', 'green', 'purple', 'orange', 'cyan'];
    const MAX_NOTES = 12;

    // Fetch the notes
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

    // Save a note to the database
    const handleSaveNote = async () => {
        if (!newNote.trim()) return; // Don't save empty notes

        // Check if the note limit has been reached
        if (notes.length >= MAX_NOTES) {
            setError(`You have reached the maximum limit of ${MAX_NOTES} notes.`);
            return;
        }
        setError('');

        try {
            // POST request to API to create a new note
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
                setNewNote('');
            } else {
                console.error("Failed to save note:", data.error);
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    // Delete a note
     const handleDeleteNote = async (noteId) => {
            try {
                // DELETE request to the API
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

// --- Result Accordion Item ---
const ResultAccordionItem = ({ module }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="widget-result-module">
            <button className="widget-result-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{module.module_number}. {module.title}</span>
                <FaChevronRight className={`accordion-icon ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
                <div className="widget-result-content">
                    <p className="widget-module-description">{module.description}</p>
                    {module.topics.map(topic => (
                        <div key={topic.topic_number} className="widget-result-topic">
                            <strong>{topic.topic_number}. {topic.title}</strong>
                            <p><strong>Concept:</strong> {topic.concept}</p>
                            <p className="widget-topic-project"><strong>Project Idea:</strong> {topic.project}</p>
                            {topic.resource_link ? (
                                <a href={topic.resource_link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-warning btn-sm mt-2">
                                    <FaBook className="me-1" /> Learn More
                                </a>
                            ) : (
                                <button className="btn btn-outline-secondary btn-sm mt-2" disabled style={{ cursor: 'not-allowed' }}>
                                    <FaBook className="me-1" /> No Link Available
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- LEARNING PATH WIDGET ---
const LearningPathWidget = ({ moduleId }) => {
    // Hooks
    const { user } = useAuth(); // Get the logged-in user context
    // States
    const [difficulty, setDifficulty] = React.useState('Beginner');
    const [language, setLanguage] = React.useState('JavaScript');
    const [pathData, setPathData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    // --- UPDATED: useEffect to load path from DATABASE ---
    React.useEffect(() => {
        const loadPathFromDb = async () => {
            if (user?.userId && moduleId) {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/load-path?userId=${user.userId}&moduleId=${moduleId}`);
                    const data = await response.json();
                    if (response.ok && data.learningPath) {
                        setPathData(data);
                    } else {
                        setPathData(null); // No path saved for this module
                    }
                } catch (err) {
                    console.error("Failed to load learning path from DB:", err);
                    setError("Could not load saved path.");
                }
            }
        };
        loadPathFromDb();
    }, [moduleId, user]); // Dependency on user and module

    // Generate button functionality
    const handleGenerate = async () => {
        if (!moduleId || !user?.userId) {
            setError("Cannot generate path. User or Module ID is missing.");
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            // 1. Generate the new path
            const genResponse = await fetch('http://127.0.0.1:5001/api/generate-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moduleId: moduleId,
                    difficulty: difficulty,
                    language: language,
                }),
            });
            const genData = await genResponse.json();
            if (!genResponse.ok) throw new Error(genData.error || 'Failed to generate path.');

            setPathData(genData);

            // 2. Save the newly generated path to the database
            await fetch('http://127.0.0.1:5001/api/save-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    moduleId: moduleId,
                    pathData: genData
                })
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sidebar-widget">
            <div className="widget-header-AI">
                Learning Path Generator
            </div>
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
                        <label htmlFor="language-select" className="form-label">Select Programming Language:</label>
                        <select id="language-select" className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option>JavaScript</option>
                            <option>Python</option>
                            <option>Java</option>
                            <option>C#</option>
                            <option>C++</option>
                        </select>
                    </div>
                    <button className="btn btn-warning btn-sm btn-generate" onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? <> Generating...</> : 'Generate'}
                    </button>
                </div>

                <div className="widget-results-container mt-3">
                    {isLoading && (
                        <div className="text-center p-3">
                            <FaSpinner className="spinner-icon-sm" />
                            <p className="small text-muted mt-2">Please Wait...</p>
                        </div>
                    )}
                    {error && (
                         <div className="alert alert-danger p-2 small">{error}</div>
                    )}

                    {!isLoading && pathData?.learningPath && (
                        <div className="widget-learning-path">
                            <h6 className="widget-results-title">Your Personal Path:</h6>
                            {pathData.learningPath.map(module => (
                                <ResultAccordionItem key={module.module_number} module={module} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- FILE UPLOAD COMPONENT ---
// Handles file selection and upload
const FileUpload = ({ moduleId, weekTitle, fileType, onUploadSuccess }) => {
    // States
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Updates state when a user select a file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    // Upload the selected file to the server
    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }
        // Use of formData for sending the file as a multi-part data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('moduleId', moduleId);
        formData.append('weekTitle', weekTitle);
        formData.append('fileType', fileType);

        try {
            // POST request to the upload API
            const response = await fetch('http://127.0.0.1:5001/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(`Success: ${data.filename} uploaded.`);
                onUploadSuccess(); // Callback to notify the parent component
                setFile(null); // Reset file input
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

/*
    --- SUB-ACCORDION FOR THEORY/PRACTICAL ---
   It renders the nested accordion items within a main week.
   Also manages fetching and displaying its own set of files.
*/
const SubAccordionItem = ({ title, children, moduleId, weekTitle }) => {
    // States
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState([]); // Stores the list of files for this specific item
    const { user } = useAuth();
    const toggleOpen = () => setIsOpen(!isOpen);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Counter for triggering re-fetch of data
    // Callback function to be passed to the FileUpload component. Increments the trigger.
    const handleUploadSuccess = () => setRefreshTrigger(t => t + 1);

    // Fetches files when the accordion is opened or after a file upload/delete
    useEffect(() => {
        const refreshFiles = async () => {
            try {
                // Fetch files. weekTitle is encoded to handle special characters ('&')
                const response = await fetch(`http://127.0.0.1:5001/api/files?moduleId=${moduleId}&weekTitle=${encodeURIComponent(weekTitle)}`);
                const data = await response.json();
                if(response.ok) {
                    // Filter the results to show only files matching components title
                    setFiles(data.filter(f => f.file_type.toLowerCase() === title.toLowerCase()));
                }
            } catch (error) { console.error("Error fetching files:", error); }
        };

        if (isOpen) {
            refreshFiles();
        }
    }, [isOpen, refreshTrigger]);

    // Handles file deletion
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


/*
    --- MAIN WEEK ACCORDION ---
    Render a top-level weekly accordion item.
    1. If content is a string, it displays the text and a file list.
    2. If content is an object, it renders SubAccordionItem for theory and practical
*/
const WeekAccordionItem = ({ topic, startOpen = false, moduleId }) => {
    // States
    const [isOpen, setIsOpen] = useState(startOpen);
    const [files, setFiles] = useState([]); // Manages files only for string-based content like 'Final Project'
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

    // Fetch files for the 'Final Project' section
    // This effect only applies to this specific section
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

    // Handles delete file for the final project section
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

/*
    --- CALENDAR WIDGET ---
    A hardcoded static calendar, no functionality integrated (for now).
*/
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

/*
    --- INTRO: MAIN PAGE ---
    The main page component for a specific module.
    It orchestrates the entire layout, including header, weekly content accordions, and sidebar widgets.
*/
const Intro = () => {
    // Hooks
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    // Unique identifier for this module (should be changed to dynamically assign ID through database)
    const moduleId = "INTRO_SE"; // CHANGE FOR EACH MODULE

    // Handles user logout, and re-directs to login page
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /*
        Data structure defining the content for each week of the module.
        The structure of the 'content' property determines how the WeekAccordionItem will render it.
    */
    const weeklyTopics = [
        {
            title: 'General/Announcements',
            content: 'Welcome to the module! Check out your weekly lecture and practical sessions.'
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
            {/* TOP NAV BAR */}
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

            {/* MAIN CONTENT AREA */}
            <div className="page-content"> {/* Wrapper for main content */}
                <div className="container-fluid p-4" style={{ marginTop: '56px' }}>
                    <div className="row">
                        {/* left sidebar image */}
                        <aside className="d-none d-lg-block col-lg-1">
                            <img
                                src="../../public/21.jpg"
                                alt="Some Image"
                                className="left-sidebar-image"
                            />
                            </aside>

                        {/* main content column with weekly accordions */}
                        <main className="col-lg-8">
                             <div className="module-title-header">
                                <FaCode className="icon" />
                                <h2 className="mb-0">Introduction to the Software Lifecycle</h2>
                            </div>
                            {/* dynamically create an accordion for each topic in the data structure */}
                            {weeklyTopics.map((topic, index) => (
                                <WeekAccordionItem key={index} topic={topic} startOpen={index === 0} moduleId={moduleId} />
                            ))}
                        </main>

                        {/* RIGHT SIDE BAR WITH WIDGETS */}
                        <aside className="col-lg-3">
                            <CalendarWidget />
                            <ColourNotesWidget moduleId={moduleId} />
                            <LearningPathWidget moduleId={moduleId} />
                        </aside>
                    </div>
                </div>
            </div>

            {/* PAGE FOOTER */}
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
