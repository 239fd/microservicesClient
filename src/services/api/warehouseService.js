import api from './config';

export const warehouseService = {
    getOrganization: async () => {
        const response = await api.get('/director/organization');
        return response.data.data;
    },

    getWarehouses: async () => {
        const response = await api.get('/director/organization/warehouses');
        return response.data.data;
    },

    createOrganization: async (organizationData) => {
        const response = await api.post('/director/organization', organizationData);
        return response.data;
    },

    createWarehouse: async (warehouseData) => {
        const response = await api.post('/director/organization/warehouse', warehouseData);
        return response.data;
    }
}; 