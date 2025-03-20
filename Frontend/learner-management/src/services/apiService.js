import { getToken } from './authService';

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

export const createCounselling = async (data) => {
    const response = await fetch(`${API_URL}/counsellings`, {
        method: 'POST',
        headers: headers(),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    return response.json();
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