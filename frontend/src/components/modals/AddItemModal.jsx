import React, { useState } from 'react';

const AddItemModal = ({ onClose, onSubmit, loading }) => {
    const [itemName, setItemName] = useState('');
    const [hyperlink, setHyperlink] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = () => {
        if (!itemName.trim()) return;

        onSubmit({
            name: itemName, 
            link: hyperlink,
            comments: comments
        });

        onClose();
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Add Wishlist Item</h2>

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <input
                    type="text"
                    placeholder="Link (optional)"
                    value={hyperlink}
                    onChange={(e) => setHyperlink(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <textarea
                    placeholder="Comments (optional)"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full border rounded p-2"
                    rows={3}
                />
            </div>

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
                    Add Item
                </button>
            </div>
        </div>
    );
};

export default AddItemModal;
