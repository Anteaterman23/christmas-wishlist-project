import React from 'react';
import Modal from './Modal';

import { modals } from '../../utils/consts';

import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';
import AddUserModal from './AddUserModal';
import DeleteUserModal from './DeleteUserModal';
import ViewCommentsModal from './ViewCommentsModal';
import MessageModal from './MessageModal';

const ModalRoot = ({
    isOpen,
    modalType,
    modalProps,
    closeModal
}) => {
    if (!isOpen || !modalType) return null;

    const renderModal = () => {
        switch (modalType) {
            case modals.addItem:
                return (
                    <AddItemModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case modals.editItem:
                return (
                    <EditItemModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case modals.deleteItem:
                return (
                    <DeleteItemModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case modals.addUser:
                return (
                    <AddUserModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case modals.deleteUser:
                return (
                    <DeleteUserModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case modals.viewComments:
                return (
                    <ViewCommentsModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case modals.messageModal:
                return (
                    <MessageModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Modal>{renderModal()}</Modal>
    );
};

export default ModalRoot;