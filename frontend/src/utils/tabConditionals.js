import { tabs, guestName } from "./consts";

export const shouldIncludeTab = (tab, isAdmin) => {
    return tab.isAdmin === isAdmin;
};

export const shouldDisplayTabs = (currentUser) => {
    return currentUser !== guestName;
}

export const isMyWishlistTab = (tab) => {
    return tab === tabs.myWishlist.keyString;
};

export const isBuyForOthersTab = (tab, selectedUser) => {
    return tab === tabs.buyForOthers.keyString && !selectedUser;
};

export const isOtherWishlistTab = (tab, selectedUser) => {
    return tab === tabs.buyForOthers.keyString && selectedUser;
};

export const isManageGroupTab = (tab) => {
    return tab === tabs.manageGroup.keyString;
};

export const isUpdatePassword = (tab) => {
    return tab === tabs.updatePassword.keyString;
};