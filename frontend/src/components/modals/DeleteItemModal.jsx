import React from 'react';

const DeleteItemModal = ({ item, onClose, onConfirm, loading }) => {
    const handleConfirm = () => {
        onConfirm(item.itemId)
        onClose();
    };
    
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">
                Delete Item
            </h2>

            <p className="text-gray-700">
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                    {item.itemName}
                </span>
                ?
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
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteItemModal;
