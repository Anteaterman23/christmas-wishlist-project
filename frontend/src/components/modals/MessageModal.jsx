import React from 'react';

const MessageModal = ({ title, message, onClose }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                {message}
            </p>
            
            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default MessageModal;