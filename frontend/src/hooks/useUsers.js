import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users`);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const addUser = async (userName) => {
        if (!userName) return alert('User name is required');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: userName }),
            });
            if (res.ok) {
                await fetchUsers();
            } else {
                const errData = await res.json();
                alert(errData.error || 'Failed to add user');
            }
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
            if (res.ok) await fetchUsers();
            else alert('Failed to delete user');
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    return { users, fetchUsers, addUser, deleteUser, loading };
};
