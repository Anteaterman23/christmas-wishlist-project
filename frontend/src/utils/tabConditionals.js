import { tabs, guestName } from "./consts";

export const shouldIncludeTab = (tab, isAdmin) => {
    return tab.isAdmin === isAdmin;
};

export const shouldDisplayTabs = (currentUser) => {
    return currentUser !== guestName;
};

export const isMyWishlistTab = (tab) => {
    return tab === tabs.myWishlist.key;
};

export const isBuyForOthersTab = (tab, selectedUser) => {
    return tab === tabs.buyForOthers.key && !selectedUser;
};

export const isOtherWishlistTab = (tab, selectedUser) => {
    return tab === tabs.buyForOthers.key && selectedUser;
};

export const isManageGroupTab = (tab) => {
    return tab === tabs.manageGroup.key;
};

export const isUpdatePassword = (tab) => {
    return tab === tabs.updatePassword.key;
};