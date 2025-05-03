import api from './config';

export const ordersService = {
    getStoredProducts: async () => {
        const response = await api.get('/manager/stored-products');
        return response.data.data;
    },

    createOrder: async (productId, months, forecastMonths) => {
        const queryParams = new URLSearchParams({
            productId: parseInt(productId),
            months: parseInt(months),
            forecastMonths: parseInt(forecastMonths),
        }).toString();

        const response = await api.post(`/manager/order?${queryParams}`);
        return response.data;
    }
}; 