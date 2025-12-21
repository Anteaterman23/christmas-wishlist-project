import React from 'react';
import Modal from './Modal';

import AddItemModal from './AddItemModal';
import DeleteItemModal from './DeleteItemModal';
import AddUserModal from './AddUserModal';
import ViewCommentsModal from './ViewCommentsModal';

const ModalRoot = ({
    isOpen,
    modalType,
    modalProps,
    closeModal
}) => {
    if (!isOpen || !modalType) return null;

    const renderModal = () => {
        switch (modalType) {
            case 'addItem':
                return (
                    <AddItemModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case 'deleteItem':
                return (
                    <DeleteItemModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case 'addUser':
                return (
                    <AddUserModal
                        {...modalProps}
                        onClose={closeModal}
                    />
                );

            case 'viewComments':
                return (
                    <ViewCommentsModal
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
