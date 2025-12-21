import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ensureHttps } from '../../utils/ensureHttps';

const OtherWishlist = ({
    user,
    wishlist,
    currentUser,
    loading,
    onBack,
    onTogglePurchase,
    onViewComments
}) => {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <button
                onClick={onBack}
                className="mb-4 text-green-600 hover:text-green-700 flex items-center gap-2 font-medium"
            >
                <ArrowLeft size={20} />
                Go Back
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {user.name}'s Wishlist
            </h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-700">
                                Item Name
                            </th>
                            <th className="text-left p-3 font-semibold text-gray-700">
                                Comments
                            </th>
                            <th className="text-center p-3 font-semibold text-gray-700">
                                Purchase Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {wishlist.map(item => (
                            <tr
                                key={item.itemId}
                                className={`border-b ${item.purchased ? 'bg-red-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <td className="p-3">
                                    {item.hyperlink ? (
                                        <a
                                            href={ensureHttps(item.hyperlink)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {item.itemName}
                                        </a>
                                    ) : (
                                        <span>{item.itemName}</span>
                                    )}
                                </td>

                                <td className="p-3">
                                    {item.comments && (
                                        <button
                                            onClick={() => onViewComments(item.comments)}
                                            className="text-green-600 hover:underline text-sm"
                                        >
                                            View
                                        </button>
                                    )}
                                </td>

                                <td className="p-3 text-center">
                                    {!item.purchased && (
                                        <button
                                            onClick={() => onTogglePurchase(item.itemId)}
                                            disabled={loading}
                                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm disabled:bg-gray-400"
                                        >
                                            Mark as Purchased
                                        </button>
                                    )}

                                    {item.purchased &&
                                        item.purchasedBy === currentUser && (
                                            <button
                                                onClick={() => onTogglePurchase(item.itemId)}
                                                disabled={loading}
                                                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm disabled:bg-gray-400"
                                            >
                                                Cancel Purchase
                                            </button>
                                        )}

                                    {item.purchased &&
                                        item.purchasedBy !== currentUser && (
                                            <span className="text-sm text-gray-600">
                                                Purchased by {item.purchasedBy}
                                            </span>
                                        )}
                                </td>
                            </tr>
                        ))}

                        {wishlist.length === 0 && (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="p-8 text-center text-gray-500"
                                >
                                    No items on this wishlist yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OtherWishlist;
