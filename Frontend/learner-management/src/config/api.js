export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const FRONTEND_URL = process.env.REACT_APP_URL || 'http://localhost:3002';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    
    // Counselling endpoints
    COUNSELLING: {
        CREATE: '/api/counsellings',
        LIST: '/api/counsellings',
        GET: (id) => `/api/counsellings/${id}`,
        UPDATE: (id) => `/api/counsellings/${id}`,
        DELETE: (id) => `/api/counsellings/${id}`,
    }
}; 