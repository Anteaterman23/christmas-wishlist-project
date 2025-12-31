const API_URL = import.meta.env.VITE_API_URL;

const clearWishlistByUserId = async (userId) => {
    const res = await fetch(`${API_URL}/wishlist/${userId}`);
    const wishlist = await res.json();

    const deletePromises = wishlist.map(async (item) => {
        await fetch(`${API_URL}/wishlist/${item.itemId}`, {
            method: 'DELETE',
        });
    });

    await Promise.allSettled(deletePromises);
};

export const clearAllWishlists = async (users) => {
    for (const user of users) {
        await clearWishlistByUserId(user.id);
    };
};