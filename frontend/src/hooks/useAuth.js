import { useState, useEffect } from 'react';
import { guestName, tabs } from '../utils/consts';
import { apiFetch } from '../utils/apiFetch';

// decode JWT payload without library, middle chunk is base64 JSON
const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

const isTokenValid = (token) => {
    const payload = decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now(); // exp is in seconds, Date.now() in ms
};

const localStorageReset = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('isAdmin');
};

export const useAuth = ({ setActiveTab }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginData, setLoginData] = useState({ password: '', selectedUser: '' });
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [verifiedAsAdmin, setVerifiedAsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    // on mount, check if valid stamp already in localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !isTokenValid(token)) {
            localStorageReset();
            return;
        }

        const payload = decodeToken(token);
        const savedUser = localStorage.getItem('currentUser');
        const savedUserId = localStorage.getItem('currentUserId');
        const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';

        if (savedIsAdmin || payload.role === 'admin') {
            setIsAdmin(true);
            setCurrentUser('Admin');
            setPasswordVerified(true);
            setVerifiedAsAdmin(true);
            setActiveTab(tabs.manageGroup.key);
            setIsLoggedIn(true);
        } else if (savedUser && savedUserId) {
            setCurrentUser(savedUser);
            setCurrentUserId(savedUserId);
            setPasswordVerified(true);
            setIsLoggedIn(true);
            if (savedUser === guestName) {
                setActiveTab(tabs.buyForOthers.key);
            } else {
                setActiveTab(tabs.myWishlist.key);
            }
        }
        // if token valid but no savedUser, just drop them back to login screen
    }, []);

    const verifyPassword = async () => {
        if (!loginData.password) return alert('Please enter a password');
        setLoading(true);
        try {
            const res = await apiFetch(`/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: loginData.password }),
            });
            const data = await res.json();
            if (!data.success) return alert('Invalid password');

            localStorage.setItem('authToken', data.token);

            setPasswordVerified(true);
            setVerifiedAsAdmin(data.isAdmin);
            if (data.isAdmin) {
                localStorage.setItem('isAdmin', 'true');
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

        // save user identity so refresh can restore it
        localStorage.setItem('currentUser', user.name);
        localStorage.setItem('currentUserId', user.id);

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
        localStorageReset();
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