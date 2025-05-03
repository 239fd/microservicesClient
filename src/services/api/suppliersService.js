import api from './config';

export const suppliersService = {
    getSuppliers: async () => {
        const response = await api.get('/manager/supplier');
        return response.data.data;
    },

    getStocks: async () => {
        const response = await api.get('/manager/stock');
        return response.data.data;
    },

    addSupplier: async (supplierData) => {
        const response = await api.post('/manager/supplier', supplierData);
        return response.data;
    },

    updateSupplier: async (supplierData) => {
        const response = await api.put('/manager/supplier', supplierData);
        return response.data;
    },

    deleteSupplier: async (inn) => {
        const response = await api.delete('/manager/supplier', {
            data: { inn }
        });
        return response.data;
    },

    addStock: async (stockData) => {
        const queryParams = new URLSearchParams({
            name: stockData.name,
            amount: stockData.amount.toString(),
            price: stockData.price.toString(),
            suppliersId: stockData.suppliersId.toString(),
        }).toString();

        const response = await api.post(`/manager/stock?${queryParams}`);
        return response.data;
    },

    deleteStock: async (stockId) => {
        const response = await api.delete(`/manager/stock/${stockId}`);
        return response.data;
    }
}; 