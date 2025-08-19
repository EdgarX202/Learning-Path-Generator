import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // States
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs once when the application first loads
    useEffect(() => {
        try {
            // Try to get the saved user data from localStorage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                // If data exists, parse it and set it as the current user
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Failed to parse saved user from localStorage", error);
            // If there's an error, clear it
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    // Login function
    const login = (userData) => {
        // Save the user data to localStorage as a string
        localStorage.setItem('user', JSON.stringify(userData));
        // Set the user state in the application
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        // Remove the user data from localStorage
        localStorage.removeItem('user');
        // Clear the user state in the application
        setUser(null);
    };

    const value = { user, login, logout, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context in other places
export const useAuth = () => {
    return useContext(AuthContext);
};
