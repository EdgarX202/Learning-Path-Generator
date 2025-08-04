import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './Login.css';

const Login = () => {
    // --- State Management ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // --- Hooks ---
    const navigate = useNavigate(); // Get the navigate function from React Router to redirect the user
    const { login } = useAuth(); // Get the login function from AuthContext to manage users session

    // --- Event Handlers ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        // try/catch for handling any network errors
        try {
            // Send a POST request to the backend API with users credentials
            const response = await fetch('http://127.0.0.1:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            // Parse JSON response from the server
            const data = await response.json();

            if (response.ok) {
                // This saves users data to localStorage, making the session persistent
                login({ userId: data.userId, role: data.role, firstName: data.firstName });
                navigate('/courses');
            } else {
                setError(data.error || 'An unknown error occurred.');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again later.');
        }
    };

    /*
        --- JSX rendering ---
        This is the HTML structure that will be rendered
    */
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">Log In</button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default Login;


