// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const storedUser = localStorage.getItem('libraryUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // Simulate API call
            const response = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Mock users database
                    const users = [
                        { id: 1, email: 'user@library.com', password: 'password', name: 'John Doe', role: 'user' },
                        { id: 2, email: 'admin@library.com', password: 'admin123', name: 'Admin User', role: 'admin' }
                    ];

                    const user = users.find(u => u.email === email && u.password === password);
                    if (user) {
                        resolve({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
                    } else {
                        reject(new Error('Invalid email or password'));
                    }
                }, 1000);
            });

            setUser(response.user);
            localStorage.setItem('libraryUser', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        try {
            // Simulate API call
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    const newUser = {
                        id: Date.now(),
                        ...userData,
                        role: 'user' // Default role for new users
                    };
                    resolve({ success: true, user: newUser });
                }, 1000);
            });

            setUser(response.user);
            localStorage.setItem('libraryUser', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('libraryUser');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};