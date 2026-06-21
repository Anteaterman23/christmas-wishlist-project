const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = (path, options = {}) => {
    const token = localStorage.getItem('authToken');
    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
};