import { useState, useCallback } from 'react';

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [modalProps, setModalProps] = useState(null);

    const openModal = useCallback((type, props = null) => {
        setModalType(type);
        setModalProps(props);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setModalType(null);
        setModalProps(null);
    }, []);

    return {
        isOpen,
        modalType,
        modalProps,
        openModal,
        closeModal
    };
};
