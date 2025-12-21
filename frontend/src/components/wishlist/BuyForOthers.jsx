import React from 'react';

const BuyForOthers = ({
    users,
    currentUser,
    onSelectUser
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Buy Gifts for Others
            </h2>

            <div className="grid gap-3">
                {users
                    .filter(user => user.name !== currentUser)
                    .map(user => (
                        <div
                            key={user.id}
                            className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {user.wishlistCount} items on wishlist
                                </p>
                            </div>

                            <button
                                onClick={() => onSelectUser(user)}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                            >
                                View Their Wishlist
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BuyForOthers;
