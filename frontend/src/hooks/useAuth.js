import { useState } from 'react';
import { guestName, tabs } from '../utils/consts';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = ({ setActiveTab }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginData, setLoginData] = useState({ password: '', selectedUser: '' });
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [verifiedAsAdmin, setVerifiedAsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const verifyPassword = async () => {
        if (!loginData.password) return alert('Please enter a password');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: loginData.password }),
            });
            const data = await res.json();
            if (!data.success) return alert('Invalid password');

            setPasswordVerified(true);
            setVerifiedAsAdmin(data.isAdmin);
            if (data.isAdmin) {
                setIsAdmin(true);
                setCurrentUser('Admin');
                setActiveTab(tabs.manageGroup.key);
                setIsLoggedIn(true);
            }
        } catch (err) {
            console.error(err);
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (users) => {
        if (!loginData.selectedUser) return alert('Please select your name');
        const user = users.find(u => u.name === loginData.selectedUser);
        if (!user) return alert('User not found');

        if (user.name === guestName) {
            setActiveTab(tabs.buyForOthers.key);
        } else {
            setActiveTab(tabs.myWishlist.key);
        }

        setCurrentUser(user.name);
        setCurrentUserId(user.id);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCurrentUserId(null);
        setIsAdmin(false);
        setPasswordVerified(false);
        setVerifiedAsAdmin(false);
        setLoginData({ password: '', selectedUser: '' });
    };

    return {
        isLoggedIn,
        currentUser,
        currentUserId,
        isAdmin,
        loginData,
        setLoginData,
        passwordVerified,
        verifiedAsAdmin,
        loading,
        verifyPassword,
        handleLogin,
        logout,
    };
};