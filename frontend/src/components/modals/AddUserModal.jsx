import React, { useState } from 'react';

const AddUserModal = ({ onClose, onSubmit, loading }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name);
        onClose();
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                Add New User
            </h2>

            <input
                type="text"
                placeholder="User name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-2"
            />

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded border"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-gray-400"
                >
                    Add User
                </button>
            </div>
        </div>
    );
};

export default AddUserModal;
