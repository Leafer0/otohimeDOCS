const API_BASE = '/api';

export const ApiService = {
    async login(token) {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        return handleResponse(response);
    },

    async validateToken(token) {
        const response = await fetch(`${API_BASE}/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    async getUserData(token) {
        const response = await fetch(`${API_BASE}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    }
};

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Request failed with status ${response.status}`);
    }
    return response.json();
}