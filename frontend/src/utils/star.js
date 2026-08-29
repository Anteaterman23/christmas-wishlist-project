export const sortByStar = (items) =>
    [...items].sort((a, b) => (b.isStarred === true) - (a.isStarred === true));
