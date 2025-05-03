import api from './config';

export const workerService = {
    getProducts: async () => {
        const response = await api.get('/worker');
        return response.data.data;
    },

    receiveGoods: async (goodsData) => {
        const response = await api.post('/worker/receive', goodsData, {
            responseType: 'blob'
        });
        return response.data;
    },

    dispatchGoods: async (dispatchData) => {
        const response = await api.post('/worker/dispatch', dispatchData, {
            responseType: 'blob'
        });
        return response.data;
    }
}; 