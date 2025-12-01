const API_URL = 'http://localhost:4000';

const apiFetch = async (endpoint, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Socket.io initialization
let socket;
if (typeof io !== 'undefined') {
    socket = io('http://localhost:4000');
    
    socket.on('connect', () => {
        console.log('Connected to socket server:', socket.id);
    });
}

const api = {
    socket, // Expose socket
    auth: {
        login: (email, password) => apiFetch('/auth/login', 'POST', { email, password }),
        signup: (userData) => apiFetch('/auth/signup', 'POST', userData),
        verifySignup: (email, otp) => apiFetch('/auth/signup/verify', 'POST', { email, otp }),
        sendOtp: (email) => apiFetch('/auth/otp/send', 'POST', { email }),
        verifyOtp: (email, otp) => apiFetch('/auth/otp/verify', 'POST', { email, otp }),
        getProfile: () => apiFetch('/auth/me'),
        getUserProfile: (id) => apiFetch(`/users/${id}`),
        updateProfile: (id, data) => apiFetch(`/users/${id}`, 'PUT', data)
    },
    events: {
        getAll: (params = '') => apiFetch(`/events${params}`),
        getById: (id) => apiFetch(`/events/${id}`),
        create: (eventData) => apiFetch('/events', 'POST', eventData),
        update: (id, data) => apiFetch(`/events/${id}`, 'PUT', data),
        delete: (id) => apiFetch(`/events/${id}`, 'DELETE'),
        rsvp: (id, status) => apiFetch(`/events/${id}/rsvp`, 'POST', { status }),
        getUserEvents: (userId) => apiFetch(`/users/${userId}/events`)
    },
    groups: {
        getAll: (params = '') => apiFetch(`/groups${params}`),
        getById: (id) => apiFetch(`/groups/${id}`),
        create: (groupData) => apiFetch('/groups', 'POST', groupData),
        update: (id, data) => apiFetch(`/groups/${id}`, 'PUT', data),
        delete: (id) => apiFetch(`/groups/${id}`, 'DELETE'),
        join: (id) => apiFetch(`/groups/${id}/join`, 'POST'),
        leave: (id) => apiFetch(`/groups/${id}/leave`, 'POST'),
        getUserGroups: (userId) => apiFetch(`/users/${userId}/groups`)
    },
    payments: {
        createOrder: (data) => apiFetch('/payments/create-order', 'POST', data),
        verifyPayment: (data) => apiFetch('/payments/verify-payment', 'POST', data)
    }
};

// Expose api globally
window.api = api;
