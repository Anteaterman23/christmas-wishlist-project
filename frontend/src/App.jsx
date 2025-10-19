import React, { useState, useEffect } from 'react';
import { X, Plus, ArrowLeft } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

const WishlistApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('myWishlist');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [myWishlist, setMyWishlist] = useState([]);
  const [otherWishlist, setOtherWishlist] = useState([]);
  
  const [formData, setFormData] = useState({ name: '', link: '', comments: '', userName: '' });
  const [loginData, setLoginData] = useState({ password: '', selectedUser: '' });

  // Helper function to ensure URL has protocol
  const ensureHttps = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users');
    }
  };

  // Fetch user's wishlist
  const fetchMyWishlist = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/wishlist/${userId}`);
      const data = await response.json();
      setMyWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      alert('Failed to load wishlist');
    }
  };

  // Fetch other user's wishlist
  const fetchOtherWishlist = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/wishlist/${userId}`);
      const data = await response.json();
      setOtherWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      alert('Failed to load wishlist');
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Load current user's wishlist when logged in
  useEffect(() => {
    if (isLoggedIn && currentUserId) {
      fetchMyWishlist(currentUserId);
    }
  }, [isLoggedIn, currentUserId]);

  // Verify password first
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [verifiedAsAdmin, setVerifiedAsAdmin] = useState(false);

  const verifyPassword = async () => {
    if (!loginData.password) {
      alert('Please enter a password');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginData.password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPasswordVerified(true);
        setVerifiedAsAdmin(data.isAdmin);
        if (data.isAdmin) {
          // Admin can log in immediately
          setIsAdmin(true);
          setCurrentUser('Admin');
          setIsLoggedIn(true);
        }
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
    setLoading(false);
  };

  // Login handler (after password verified)
  const handleLogin = async () => {
    if (!loginData.selectedUser) {
      alert('Please select your name');
      return;
    }
    
    // Find user ID from selected name
    const user = users.find(u => u.name === loginData.selectedUser);
    if (user) {
      setCurrentUser(loginData.selectedUser);
      setCurrentUserId(user.id);
      setIsLoggedIn(true);
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

  // Add wishlist item
  const addWishlistItem = async () => {
    if (!formData.name) {
      alert('Item name is required');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist/${currentUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: formData.name,
          hyperlink: formData.link,
          comments: formData.comments
        })
      });
      
      if (response.ok) {
        await fetchMyWishlist(currentUserId);
        await fetchUsers(); // Update wishlist count
        closeModal();
      } else {
        alert('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
    setLoading(false);
  };

  // Delete wishlist item
  const deleteWishlistItem = async (itemId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchMyWishlist(currentUserId);
        await fetchUsers(); // Update wishlist count
        closeModal();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
    setLoading(false);
  };

  // Toggle purchase
  const togglePurchase = async (itemId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist/${itemId}/purchase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchasedBy: currentUser })
      });
      
      if (response.ok) {
        await fetchOtherWishlist(selectedUser.id);
      } else {
        alert('Failed to update purchase status');
      }
    } catch (error) {
      console.error('Error updating purchase:', error);
      alert('Failed to update purchase status');
    }
    setLoading(false);
  };

  // Add user
  const addUser = async () => {
    if (!formData.userName) {
      alert('User name is required');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.userName })
      });
      
      if (response.ok) {
        await fetchUsers();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
    setLoading(false);
  };

  // Delete user
  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchUsers();
        closeModal();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
    setLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700">Christmas Wishlist 2025</h1>
          <p className="text-center text-gray-600 mb-6">Coordinate gifts with family & friends</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && !passwordVerified && verifyPassword()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading || passwordVerified}
              />
            </div>
            
            {!passwordVerified && (
              <button
                onClick={verifyPassword}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            )}
            
            {passwordVerified && !verifiedAsAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Name</label>
                  <select
                    value={loginData.selectedUser}
                    onChange={(e) => setLoginData({...loginData, selectedUser: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    <option value="">Choose your name...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.name}>{user.name}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Christmas Wishlist 2025</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {currentUser}!</span>
            {isAdmin && <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">ADMIN</span>}
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUser(null);
                setCurrentUserId(null);
                setIsAdmin(false);
                setActiveTab('myWishlist');
                setPasswordVerified(false);
                setVerifiedAsAdmin(false);
                setLoginData({ password: '', selectedUser: '' });
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
                  {myWishlist.map(item => (
                    <tr key={item.itemId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {item.hyperlink ? (
                          <a href={ensureHttps(item.hyperlink)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {item.itemName}
                          </a>
                        ) : (
                          <span>{item.itemName}</span>
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
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
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
                    onClick={() => {
                      setSelectedUser(user);
                      fetchOtherWishlist(user.id);
                    }}
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
                      key={item.itemId} 
                      className={`border-b ${item.purchased ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="p-3">
                        {item.hyperlink ? (
                          <a href={ensureHttps(item.hyperlink)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {item.itemName}
                          </a>
                        ) : (
                          <span>{item.itemName}</span>
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
                            onClick={() => togglePurchase(item.itemId)}
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400"
                          >
                            Mark as Purchased
                          </button>
                        )}
                        {item.purchased && item.purchasedBy === currentUser && (
                          <button
                            onClick={() => togglePurchase(item.itemId)}
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors text-sm disabled:bg-gray-400"
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
                  {otherWishlist.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-500">
                        No items on this wishlist yet.
                      </td>
                    </tr>
                  )}
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
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
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
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
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
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hyperlink (optional)</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments (optional)</label>
                    <textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({...formData, comments: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={addWishlistItem}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Adding...' : 'Submit'}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:bg-gray-200"
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
                    onClick={() => deleteWishlistItem(selectedUser.itemId)}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Deleting...' : 'Yes'}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:bg-gray-200"
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
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addUser}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Adding...' : 'Submit'}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:bg-gray-200"
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
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Deleting...' : 'Yes'}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:bg-gray-200"
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