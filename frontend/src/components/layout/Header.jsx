const Header = ({ currentUser, isAdmin, onLogout }) => (
    <div className="bg-green-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Christmas Wishlist 2025</h1>
            <div className="flex items-center gap-4">
                <span>Welcome, {currentUser}!</span>
                {isAdmin && (
                    <span className="bg-red-600 px-2 py-1 rounded text-xs">ADMIN</span>
                )}
                <button
                    onClick={onLogout}
                    className="bg-white text-green-700 px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    </div>
);

export default Header;