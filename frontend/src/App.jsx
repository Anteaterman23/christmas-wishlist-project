import React, { useState } from 'react';
import './App.css';

import { useModal } from './hooks/useModal';
import { useAuth } from './hooks/useAuth';
import { useUsers } from './hooks/useUsers';
import { useWishlist } from './hooks/useWishlist';

import LoginScreen from './components/auth/LoginScreen';
import Header from './components/layout/Header';
import Tabs from './components/layout/Tabs';
import MyWishlist from './components/wishlist/MyWishlist';
import ManageGroup from './components/admin/ManageGroup';
import BuyForOthers from './components/wishlist/BuyForOthers';
import OtherWishlist from './components/wishlist/OtherWishlist';
import ModalRoot from './components/modals/ModalRoot';

const WishlistApp = () => {
  /* ─────────────── Core App State ─────────────── */
  const [activeTab, setActiveTab] = useState('myWishlist');
  const [selectedUser, setSelectedUser] = useState(null);

  /* ─────────────── Modal System ─────────────── */
  const {
    isOpen,
    modalType,
    modalProps,
    openModal,
    closeModal
  } = useModal();

  /* ───────────── Users ───────────── */
  const {
    users,
    fetchUsers,
    addUser,
    deleteUser,
    loading: userLoading
  } = useUsers();

  /* ───────────── Auth ───────────── */
  const {
    isLoggedIn,
    currentUser,
    currentUserId,
    isAdmin,
    loginData,
    setLoginData,
    passwordVerified,
    verifiedAsAdmin,
    loading: authLoading,
    verifyPassword,
    handleLogin,
    logout,
  } = useAuth();

  /* ───────────── Wishlist ───────────── */
  const {
    myWishlist,
    otherWishlist,
    loading: wishlistLoading,
    addWishlistItem,
    deleteWishlistItem,
    updateWishlistItem,
    togglePurchase,
    fetchOtherWishlist,
  } = useWishlist({ currentUserId, currentUser, refreshUsers: fetchUsers });

  /* ───────────── Modal Handlers ───────────── */
  const combinedLoading = authLoading || wishlistLoading || userLoading;

  const handleAddItem = () => openModal('addItem', { onSubmit: addWishlistItem, loading: combinedLoading });
  const handleDeleteItem = (item) => openModal('deleteItem', { item, onConfirm: deleteWishlistItem, loading: combinedLoading });
  const handleEditItem = (item) => openModal('editItem', { item, onSubmit: (data) => updateWishlistItem(item.itemId, data), loading: combinedLoading });
  const handleAddUser = () => openModal('addUser', { onSubmit: addUser, loading: combinedLoading });
  const handleDeleteUser = (user) => openModal('deleteUser', { user, onConfirm: deleteUser, loading: combinedLoading });
  const handleViewComments = (comments) => openModal('viewComments', { comments });

  /* ───────────── Render ───────────── */
  return (
    <>
      {!isLoggedIn ? (
        <LoginScreen
          users={users}
          loginData={loginData}
          setLoginData={setLoginData}
          loading={combinedLoading}
          passwordVerified={passwordVerified}
          verifiedAsAdmin={verifiedAsAdmin}
          verifyPassword={verifyPassword}
          handleLogin={() => handleLogin(users)}
        />
      ) : (
        <>
          <Header
            currentUser={currentUser}
            isAdmin={isAdmin}
            onLogout={() => {
              setSelectedUser(null);
              setActiveTab('myWishlist');
              logout();
            }}
          />

          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
          />

          {activeTab === 'myWishlist' && (
            <MyWishlist
              items={myWishlist}
              loading={combinedLoading}
              onAdd={handleAddItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onViewComments={handleViewComments}
            />
          )}

          {activeTab === 'buyForOthers' && !selectedUser && (
            <BuyForOthers
              users={users}
              currentUser={currentUser}
              onSelectUser={(user) => {
                setSelectedUser(user);
                fetchOtherWishlist(user.id);
              }}
            />
          )}

          {activeTab === 'buyForOthers' && selectedUser && (
            <OtherWishlist
              user={selectedUser}
              wishlist={otherWishlist}
              currentUser={currentUser}
              loading={combinedLoading}
              onBack={() => setSelectedUser(null)}
              onTogglePurchase={(itemId) => togglePurchase(itemId, selectedUser.id)}
              onViewComments={(comments) => openModal('viewComments', { comments })}
            />
          )}

          {activeTab === 'manageGroup' && (
            <ManageGroup
              users={users}
              loading={combinedLoading}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </>
      )}

      <ModalRoot
        isOpen={isOpen}
        modalType={modalType}
        modalProps={modalProps}
        closeModal={closeModal}
      />
    </>
  );
};

export default WishlistApp;
