import React from 'react';

const ViewCommentsModal = ({ comments, onClose }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                Item Comments
            </h2>

            <div className="bg-gray-100 rounded p-4 whitespace-pre-wrap text-gray-800">
                {comments || 'No comments provided.'}
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-green-600 text-white"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewCommentsModal;
