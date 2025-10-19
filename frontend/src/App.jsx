import './App.css';
import React, { useState } from 'react';
import { X, Plus, ArrowLeft } from 'lucide-react';

const WishlistApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('myWishlist');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [users, setUsers] = useState([
    { id: '1', name: 'Tyler', wishlistCount: 2 },
    { id: '2', name: 'Sarah', wishlistCount: 3 },
    { id: '3', name: 'Mike', wishlistCount: 1 },
  ]);
  
  const [myWishlist, setMyWishlist] = useState([
    { id: '1', name: 'New backpack', link: 'https://solo-ny.com/products/grand-travel-tsa-backpack', comments: 'I prefer either the red or blue color' },
    { id: '2', name: 'Coffee maker', link: '', comments: '' },
  ]);
  
  const [otherWishlist, setOtherWishlist] = useState([
    { id: '1', name: 'Headphones', link: 'https://example.com', comments: 'Noise cancelling preferred', purchased: false, purchasedBy: null },
    { id: '2', name: 'Book set', link: '', comments: '', purchased: true, purchasedBy: 'Tyler' },
  ]);
  
  const [formData, setFormData] = useState({ name: '', link: '', comments: '', userName: '' });
  const [loginData, setLoginData] = useState({ password: '', selectedUser: '' });

  const handleLogin = () => {
    const userPassword = 'user123';
    const adminPassword = 'admin123';
    
    if (loginData.password === adminPassword) {
      setIsAdmin(true);
      setCurrentUser(loginData.selectedUser || 'Admin');
      setIsLoggedIn(true);
    } else if (loginData.password === userPassword && loginData.selectedUser) {
      setIsAdmin(false);
      setCurrentUser(loginData.selectedUser);
      setIsLoggedIn(true);
    } else {
      alert('Invalid password or user not selected');
    }
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
    setFormData({ name: '', link: '', comments: '', userName: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', link: '', comments: '', userName: '' });
  };

  const addWishlistItem = () => {
    if (!formData.name) {
      alert('Item name is required');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      link: formData.link,
      comments: formData.comments,
    };
    setMyWishlist([...myWishlist, newItem]);
    closeModal();
  };

  const deleteWishlistItem = (id) => {
    setMyWishlist(myWishlist.filter(item => item.id !== id));
    closeModal();
  };

  const togglePurchase = (id) => {
    setOtherWishlist(otherWishlist.map(item => {
      if (item.id === id) {
        if (item.purchased && item.purchasedBy === currentUser) {
          return { ...item, purchased: false, purchasedBy: null };
        } else if (!item.purchased) {
          return { ...item, purchased: true, purchasedBy: currentUser };
        }
      }
      return item;
    }));
  };

  const addUser = () => {
    if (!formData.userName) {
      alert('User name is required');
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      name: formData.userName,
      wishlistCount: 0,
    };
    setUsers([...users, newUser]);
    closeModal();
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    closeModal();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700">🎁 Gift Wishlist</h1>
          <p className="text-center text-gray-600 mb-6">Coordinate gifts with family & friends</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Name</label>
              <select
                value={loginData.selectedUser}
                onChange={(e) => setLoginData({...loginData, selectedUser: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Choose your name...</option>
                {users.map(user => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎁 Gift Wishlist</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {currentUser}!</span>
            {isAdmin && <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">ADMIN</span>}
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUser(null);
                setIsAdmin(false);
                setActiveTab('myWishlist');
              }}
              className="text-sm bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-1 p-2">
          <button
            onClick={() => setActiveTab('myWishlist')}
            className={`px-4 py-2 rounded-t font-medium transition-colors ${
              activeTab === 'myWishlist' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Add To Your Wishlist
          </button>
          <button
            onClick={() => {
              setActiveTab('buyForOthers');
              setSelectedUser(null);
            }}
            className={`px-4 py-2 rounded-t font-medium transition-colors ${
              activeTab === 'buyForOthers' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Buy for Others
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('manageGroup')}
              className={`px-4 py-2 rounded-t font-medium transition-colors ${
                activeTab === 'manageGroup' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manage Your Group
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'myWishlist' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Wishlist</h2>
              <button
                onClick={() => openModal('addItem')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
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
                  {myWishlist.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {item.name}
                          </a>
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.comments && (
                          <button
                            onClick={() => {
                              setModalType('viewComments');
                              setFormData({...formData, comments: item.comments});
                              setShowModal(true);
                            }}
                            className="text-green-600 hover:underline text-sm"
                          >
                            View
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => openModal('deleteItem', item)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {myWishlist.length === 0 && (
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
        )}

        {activeTab === 'buyForOthers' && !selectedUser && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Buy Gifts for Others</h2>
            <div className="grid gap-3">
              {users.filter(u => u.name !== currentUser).map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.wishlistCount} items on wishlist</p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    View Their Wishlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'buyForOthers' && selectedUser && (
          <div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-4 text-green-600 hover:text-green-700 flex items-center gap-2 font-medium"
            >
              <ArrowLeft size={20} /> Go Back
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedUser.name}'s Wishlist</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Item Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Comments</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Purchase Status</th>
                  </tr>
                </thead>
                <tbody>
                  {otherWishlist.map(item => (
                    <tr 
                      key={item.id} 
                      className={`border-b ${item.purchased ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="p-3">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {item.name}
                          </a>
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.comments && (
                          <button
                            onClick={() => {
                              setModalType('viewComments');
                              setFormData({...formData, comments: item.comments});
                              setShowModal(true);
                            }}
                            className="text-green-600 hover:underline text-sm"
                          >
                            View
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {!item.purchased && (
                          <button
                            onClick={() => togglePurchase(item.id)}
                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Purchase
                          </button>
                        )}
                        {item.purchased && item.purchasedBy === currentUser && (
                          <button
                            onClick={() => togglePurchase(item.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            Cancel Purchase
                          </button>
                        )}
                        {item.purchased && item.purchasedBy !== currentUser && (
                          <span className="text-sm text-gray-600">Purchased by {item.purchasedBy}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'manageGroup' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Manage Your Group</h2>
              <button
                onClick={() => openModal('addUser')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Add User
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700"># of Wishlist Items</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3">{user.wishlistCount}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => openModal('deleteUser', user)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {modalType === 'addItem' && (
              <>
                <h3 className="text-xl font-bold mb-4">Add Wishlist Item</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hyperlink (optional)</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments (optional)</label>
                    <textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({...formData, comments: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={addWishlistItem}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modalType === 'deleteItem' && (
              <>
                <h3 className="text-xl font-bold mb-4">Remove Item</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to remove this item from your wishlist?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteWishlistItem(selectedUser.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    No
                  </button>
                </div>
              </>
            )}

            {modalType === 'viewComments' && (
              <>
                <h3 className="text-xl font-bold mb-4">Additional Comments</h3>
                <p className="text-gray-700 mb-6 whitespace-pre-wrap">{formData.comments}</p>
                <button
                  onClick={closeModal}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </>
            )}

            {modalType === 'addUser' && (
              <>
                <h3 className="text-xl font-bold mb-4">Add User</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addUser}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modalType === 'deleteUser' && (
              <>
                <h3 className="text-xl font-bold mb-4">Remove User</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to remove this user from the group?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteUser(selectedUser.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistApp;