import React, { useState } from 'react';

const ClearWishlistsModal = ({ onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        await onConfirm(setLoading);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">Clear All Wishlists</h2>
            
            <p className="text-gray-700 mb-4">
                Are you sure you want to clear all wishlists for all users?
            </p>
            
            <p className="text-gray-700 mb-6 font-semibold">
                This action cannot be undone!
            </p>
            
            <div className="flex gap-3">
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Clearing...' : 'Yes, Clear All'}
                </button>
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:bg-gray-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ClearWishlistsModal;