import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    // State to hold the user data
    const [user, setUser] = useState(null);
    // NEW: State to track if we are done checking localStorage
    const [loading, setLoading] = useState(true);

    // This effect runs once when the application first loads
    useEffect(() => {
        try {
            // Try to get the saved user data from localStorage
            const savedUser = localStorage.getItem('user'); // Using your key 'user'
            if (savedUser) {
                // If data exists, parse it and set it as the current user
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Failed to parse saved user from localStorage", error);
            // If there's an error (e.g., corrupted data), clear it
            localStorage.removeItem('user');
        } finally {
            // NEW: We are done loading, whether we found a user or not
            setLoading(false);
        }
    }, []); // The empty dependency array means this runs only once on mount

    // Login function
    const login = (userData) => {
        // 1. Save the user data to localStorage as a string
        localStorage.setItem('user', JSON.stringify(userData));
        // 2. Set the user state in the application
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        // 1. Remove the user data from localStorage
        localStorage.removeItem('user');
        // 2. Clear the user state in the application
        setUser(null);
    };

    // The value provided to consuming components, now including the loading state
    const value = { user, login, logout, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
    return useContext(AuthContext);
};
