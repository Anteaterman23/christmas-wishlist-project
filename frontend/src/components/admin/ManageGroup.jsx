import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { guestName } from '../../utils/consts';

const ManageGroup = ({
    users,
    loading,
    onAddUser,
    onDeleteUser,
    onClearAllWishlists
}) => {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Manage Your Group
                </h2>

                <button
                    onClick={onAddUser}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                >
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-700">
                                Name
                            </th>
                            <th className="text-left p-3 font-semibold text-gray-700">
                                # of Wishlist Items
                            </th>
                            <th className="text-center p-3 font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-3 font-medium">
                                    {user.name}
                                </td>

                                <td className="p-3">
                                    {user.name !== guestName
                                    ? user.wishlistCount
                                    : "N/A"}
                                </td>

                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => onDeleteUser(user)}
                                        disabled={loading}
                                        className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
                                        title="Remove user"
                                    >
                                        <X size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="p-8 text-center text-gray-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClearAllWishlists}
                    disabled={loading}
                    className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 font-medium"
                >
                    <Trash2 size={20} />
                    Clear All Wishlists
                </button>
            </div>
        </div>
    );
};

export default ManageGroup;