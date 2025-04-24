const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // or
            sessionStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error) {
        console.error('[AuthService] Login failed:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
}; 