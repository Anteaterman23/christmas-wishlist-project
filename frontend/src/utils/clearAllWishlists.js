const clearWishlistByUserId = async (userId) => {
    const res = await apiFetch(`$/wishlist/${userId}`);
    const wishlist = await res.json();

    const deletePromises = wishlist.map(async (item) => {
        await apiFetch(`/wishlist/${item.itemId}`, {
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