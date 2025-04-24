import { getToken } from './authService';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const API_URL = 'http://localhost:8000/api';

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

// Student API calls
export const getStudents = async () => {
    const response = await fetch(`${API_URL}/students`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

export const getStudent = async (id) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

export const getStudentDetails = async (studentId) => {
    const response = await fetch(`${API_URL}/students/${studentId}`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

// Module API calls
export const getModules = async () => {
    const response = await fetch(`${API_URL}/modules`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

export const getModule = async (id) => {
    const response = await fetch(`${API_URL}/modules/${id}`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

// Progress API calls
export const getProgress = async () => {
    const response = await fetch(`${API_URL}/progress`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

export const updateProgress = async (id, data) => {
    const response = await fetch(`${API_URL}/progress/${id}`, {
        method: 'PUT',
        headers: headers(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    return response.json();
};

// Counselling API calls
export const getCounsellings = async () => {
    const response = await fetch(`${API_URL}/counsellings`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
};

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true // This is important for CORS with credentials
});

// Add request interceptor
apiClient.interceptors.request.use(
    async config => {
        // Get the CSRF cookie before making the request
        if (!document.cookie.includes('XSRF-TOKEN')) {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true
            });
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const createCounselling = async (counsellingData) => {
    try {
        console.log('[ApiService] Creating counselling session:', {
            endpoint: '/api/counsellings',
            requestData: counsellingData
        });

        const response = await apiClient.post('/api/counsellings', counsellingData);

        console.log('[ApiService] Counselling creation response:', {
            status: response.status,
            data: response.data
        });

        return response;
    } catch (error) {
        console.error('[ApiService] Counselling creation failed:', {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

export const updateCounselling = async (id, data) => {
    const response = await fetch(`${API_URL}/counsellings/${id}`, {
        method: 'PUT',
        headers: headers(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    return response.json();
};

// Mentor API calls
export const getMentors = async () => {
    const response = await fetch(`${API_URL}/mentors`, {
        headers: headers(),
        credentials: 'include',
    });
    return response.json();
}; 