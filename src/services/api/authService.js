import api from './config';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        if (response.status === 200) {
            const data = response.data.data;
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        }
        throw new Error(response.data.message || 'Ошибка входа');
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
    }
}; 