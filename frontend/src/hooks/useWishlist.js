import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';

export const useWishlist = ({ currentUserId, currentUser, refreshUsers }) => {
    const [myWishlist, setMyWishlist] = useState([]);
    const [otherWishlist, setOtherWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch current user's wishlist
    useEffect(() => {
        if (!currentUserId) return;

        const fetchMyWishlist = async () => {
            setLoading(true);
            try {
                const res = await apiFetch(`/wishlist/${currentUserId}`);
                const data = await res.json();
                setMyWishlist(data);
            } catch (err) {
                console.error('Error fetching wishlist:', err);
                alert('Failed to load wishlist');
            } finally {
                setLoading(false);
            }
        };

        fetchMyWishlist();
    }, [currentUserId]);

    // Fetch another user's wishlist
    const fetchOtherWishlist = async (userId) => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await apiFetch(`/wishlist/${userId}`);
            const data = await res.json();
            setOtherWishlist(data);
        } catch (err) {
            console.error('Error fetching other wishlist:', err);
            alert('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Add an item to current user's wishlist
    const addWishlistItem = async ({ name, link, comments }) => {
        if (!name) return alert('Item name is required');
        if (!currentUserId) return;

        setLoading(true);
        try {
            const res = await apiFetch(`/wishlist/${currentUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemName: name, hyperlink: link, comments }),
            });

            if (!res.ok) return alert('Failed to add item');

            const updatedRes = await apiFetch(`/wishlist/${currentUserId}`);
            const data = await updatedRes.json();
            setMyWishlist(data);

            // Refresh user counts
            if (refreshUsers) await refreshUsers();
        } catch (err) {
            console.error('Error adding item:', err);
            alert('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    // Delete an item from current user's wishlist
    const deleteWishlistItem = async (itemId) => {
        if (!itemId) return;

        setLoading(true);
        try {
            const res = await apiFetch(`/wishlist/${itemId}`, {
                method: 'DELETE',
            });

            if (!res.ok) return alert('Failed to delete item');

            // Refresh wishlist
            if (currentUserId) {
                const updatedRes = await apiFetch(`/wishlist/${currentUserId}`);
                const data = await updatedRes.json();
                setMyWishlist(data);

                // Refresh user counts
                if (refreshUsers) await refreshUsers();
            }
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    // Update an item in current user's wishlist
    const updateWishlistItem = async (itemId, { name, link, comments }) => {
        if (!name) return alert('Item name is required');
        if (!itemId) return;

        setLoading(true);
        try {
            const res = await apiFetch(`/wishlist/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemName: name, hyperlink: link, comments }),
            });

            if (!res.ok) return alert('Failed to update item');

            // Refresh wishlist
            if (currentUserId) {
                const updatedRes = await apiFetch(`/wishlist/${currentUserId}`);
                const data = await updatedRes.json();
                setMyWishlist(data);
            }
        } catch (err) {
            console.error('Error updating item:', err);
            alert('Failed to update item');
        } finally {
            setLoading(false);
        }
    };

    // Toggle purchase status on another user's wishlist
    const togglePurchase = async (itemId, selectedUserId) => {
        if (!itemId || !selectedUserId) return;

        setLoading(true);
        try {
            const res = await apiFetch(`/wishlist/${itemId}/purchase`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchasedBy: currentUser }),
            });

            if (!res.ok) return alert('Failed to update purchase status');

            // Refresh the other user's wishlist
            await fetchOtherWishlist(selectedUserId);
        } catch (err) {
            console.error('Error updating purchase:', err);
            alert('Failed to update purchase status');
        } finally {
            setLoading(false);
        }
    };

    return {
        myWishlist,
        otherWishlist,
        loading,
        fetchOtherWishlist,
        addWishlistItem,
        deleteWishlistItem,
        updateWishlistItem,
        togglePurchase,
    };
};
