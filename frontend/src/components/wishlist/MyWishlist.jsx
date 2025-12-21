import { X, Plus, Pencil } from 'lucide-react';
import { ensureHttps } from '../../utils/ensureHttps';

const MyWishlist = ({ items, onAdd, onEdit, onDelete, onViewComments, loading }) => (
    <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Wishlist</h2>
            <button
                onClick={onAdd}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
            >
                <Plus size={20} /> Add Item
            </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">Item Name</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Comments</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.itemId} className="border-b hover:bg-gray-50">
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
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(item)}
                                        disabled={loading}
                                        className="text-blue-600 hover:text-blue-800 transition-colors disabled:text-gray-400"
                                        title="Edit item"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)}
                                        disabled={loading}
                                        className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
                                        title="Delete item"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="3" className="p-8 text-center text-gray-500">
                                No items yet. Click Add Item to start your wishlist!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default MyWishlist;