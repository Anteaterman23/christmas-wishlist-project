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
import BuyForOthers from './components/wishlist/BuyForOthers';
import OtherWishlist from './components/wishlist/OtherWishlist';
import ManageGroup from './components/admin/ManageGroup';
import UpdatePasswords from './components/admin/UpdatePasswords';
import ModalRoot from './components/modals/ModalRoot';

import { modals } from './utils/consts';
import { clearAllWishlists } from './utils/clearAllWishlists';
import {
  isBuyForOthersTab,
  isManageGroupTab,
  isMyWishlistTab,
  isOtherWishlistTab,
  isUpdatePassword,
  shouldDisplayTabs
} from './utils/tabConditionals';

const WishlistApp = () => {
  /* ─────────────── Core App State ─────────────── */
  const [activeTab, setActiveTab] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ─────────────── Modal System ─────────────── */
  const {
    isOpen,
    modalType,
    modalProps,
    openModal,
    closeModal
  } = useModal();

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
  } = useAuth({ setActiveTab });

  /* ───────────── Users ───────────── */
  const {
    users,
    fetchUsers,
    addUser,
    deleteUser,
    loading: userLoading
  } = useUsers({ passwordVerified, verifiedAsAdmin });

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

  const handleAddItem = () => openModal(modals.addItem, { onSubmit: addWishlistItem, loading: combinedLoading });
  const handleDeleteItem = (item) => openModal(modals.deleteItem, { item, onConfirm: deleteWishlistItem, loading: combinedLoading });
  const handleEditItem = (item) => openModal(modals.editItem, { item, onSubmit: (data) => updateWishlistItem(item.itemId, data), loading: combinedLoading });
  const handleAddUser = () => openModal(modals.addUser, { onSubmit: addUser, loading: combinedLoading });
  const handleDeleteUser = (user) => openModal(modals.deleteUser, { user, onConfirm: deleteUser, loading: combinedLoading });
  const handleViewComments = (comments) => openModal(modals.viewComments, { comments });
  const handleShowMessage = (title, message) => openModal(modals.messageModal, { title, message });
  const handleClearAllWishlists = () =>
    openModal(modals.clearWishlists, {
      onConfirm: async (setModalLoading) => {
        setModalLoading(true);
        try {
          await clearAllWishlists(users);
          await fetchUsers(); // Refresh the user list
          closeModal();
        } catch (error) {
          console.error('Error clearing wishlists:', error);
          alert('Failed to clear wishlists');
        } finally {
          setModalLoading(false);
        }
      }
    });

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
              setActiveTab(null);
              logout();
            }}
          />

          {shouldDisplayTabs(currentUser) && (
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isAdmin={isAdmin}
            />
          )}

          {isMyWishlistTab(activeTab) && (
            <MyWishlist
              items={myWishlist}
              loading={combinedLoading}
              onAdd={handleAddItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onViewComments={handleViewComments}
            />
          )}

          {isBuyForOthersTab(activeTab, selectedUser) && (
            <BuyForOthers
              users={users}
              currentUser={currentUser}
              onSelectUser={(user) => {
                setSelectedUser(user);
                fetchOtherWishlist(user.id);
              }}
            />
          )}

          {isOtherWishlistTab(activeTab, selectedUser) && (
            <OtherWishlist
              user={selectedUser}
              wishlist={otherWishlist}
              currentUser={currentUser}
              loading={combinedLoading}
              onBack={() => setSelectedUser(null)}
              onTogglePurchase={(itemId) => togglePurchase(itemId, selectedUser.id)}
              onViewComments={handleViewComments}
            />
          )}

          {isManageGroupTab(activeTab) && (
            <ManageGroup
              users={users}
              loading={combinedLoading}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onClearAllWishlists={handleClearAllWishlists}
            />
          )}

          {isUpdatePassword(activeTab) && (
            <UpdatePasswords
              onShowMessage={handleShowMessage}
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
