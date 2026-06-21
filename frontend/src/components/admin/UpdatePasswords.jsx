import React, { useState } from 'react';
import { capitalize } from '../../utils/capitalize';
import { apiFetch } from '../../utils/apiFetch';

const UpdatePasswords = ({ onShowMessage }) => {
    const [role, setRole] = useState('user');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            onShowMessage('Error', 'All fields are required');
            return;
        }

        if (oldPassword === newPassword) {
            onShowMessage('Error', 'Old password cannot be same as new password');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            onShowMessage('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            onShowMessage('Error', 'New password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await apiFetchetch(`/auth/update-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    oldPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                onShowMessage('Success', `${capitalize(role)} password has been updated`);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                onShowMessage('Error', data.error || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            onShowMessage('Error', 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Update Passwords
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Change the user or admin password
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 max-w-md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled={loading}
                        >
                            <option value="user">User Password</option>
                            <option value="admin">Admin Password</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Old Password
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter current password"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter new password"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Re-enter new password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePasswords;