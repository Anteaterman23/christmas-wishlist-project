const listOfTabs = [
    ['myWishlist', 'Add To Your Wishlist'],
    ['buyForOthers', 'Buy for Others']
];

const Tabs = ({ activeTab, setActiveTab, isAdmin }) => (
    <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-1 p-2">
            {listOfTabs.map(([key, label]) => (
                <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 py-2 rounded-t ${activeTab === key
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100'
                        }`}
                >
                    {label}
                </button>
            ))}

            {isAdmin && (
                <button
                    onClick={() => setActiveTab('manageGroup')}
                    className={`px-4 py-2 rounded-t ${activeTab === 'manageGroup'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100'
                        }`}
                >
                    Manage Your Group
                </button>
            )}
        </div>
    </div>
);

export default Tabs;