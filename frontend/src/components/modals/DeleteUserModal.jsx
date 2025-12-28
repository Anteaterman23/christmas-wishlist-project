import React from 'react';

const DeleteUserModal = ({ user, onClose, onConfirm, loading }) => {
    const handleConfirm = () => {
        onConfirm(user.id)
        onClose();
    };
    
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">
                Remove User
            </h2>

            <p className="text-gray-700">
                Are you sure you want to remove{' '}
                <span className="font-semibold">
                    {user.name}
                </span>
                {' '}from the group?
            </p>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded border"
                >
                    Cancel
                </button>

                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-red-600 text-white disabled:bg-gray-400"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default DeleteUserModal;
