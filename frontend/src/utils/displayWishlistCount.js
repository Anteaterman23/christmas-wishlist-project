// Helper function to format wishlist count
export const displayWishlistCount = (count) => {
    if (count === 1) {
        return `${count} item on wishlist`;
    } else {
        return `${count} items on wishlist`;
    }
};