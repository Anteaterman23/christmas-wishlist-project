import { Star } from 'lucide-react';

// Interactive star toggle — used on the owner's own wishlist
const StarButton = ({ starred, onToggle, disabled }) => (
    <button
        onClick={onToggle}
        disabled={disabled}
        title={starred ? 'Unstar this item' : 'Star this item'}
        className={`transition-colors disabled:text-gray-300 ${
            starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-400'
        }`}
    >
        <Star size={20} fill={starred ? 'currentColor' : 'none'} />
    </button>
);

// Read-only star indicator — used when viewing someone else's wishlist
export const StarIndicator = ({ starred }) => {
    if (!starred) return null;

    return (
        <span className="inline-flex items-center gap-1 text-yellow-500" title="Starred item">
            <Star size={16} fill="currentColor" />
        </span>
    );
};

export default StarButton;