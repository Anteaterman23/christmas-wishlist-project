export const capitalize = (str) => {
    if (!str || str.length === 0) return str;
    else if (str.length === 1) return str.charAt(0).toUpperCase();
    else return str.charAt(0).toUpperCase() + str.slice(1);
};