import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import "../Styles/SuppliersPage.css";

const OrdersPage = () => {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [months, setMonths] = useState("");
    const [forecastMonths, setForecastMonths] = useState("");

    useEffect(() => {
        fetchStoredProducts();
    }, []);

    const fetchStoredProducts = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/manager/stored-products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.data);
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(`Ошибка: ${error.response.data.message}`);
            } else {
                toast.error("Ошибка при загрузке продуктов.");
            }
        }
    };

    const handleCreateOrder = async () => {
        if (!productId || !months || !forecastMonths) {
            toast.error("Заполните все поля.");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            const queryParams = new URLSearchParams({
                productId: parseInt(productId),
                months: parseInt(months),
                forecastMonths: parseInt(forecastMonths),
            }).toString();

            const response = await axios.post(
                `http://localhost:8080/api/v1/manager/order?${queryParams}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { status, message, data } = response.data;

            if (status) {
                if (message === "Запасы в организации достаточны для покрытия прогнозируемого спроса.") {
                    toast.success(message);
                } else if (message === "Необходимо закупить товар у поставщиков для покрытия прогнозируемого спроса.") {
                    toast.success(message);
                    console.log("Детали заказа у поставщиков:", data);
                }
            } else {
                toast.error(`Ошибка: ${message}`);
            }
        } catch (error) {
            toast.error("Ошибка при создании заказа.");
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Наименование", flex: 2 },
        { field: "amount", headerName: "Количество", flex: 1 },
    ];

    return (
        <div>
            <NavBar />
            <div className="subMain">
                <Box sx={{ padding: "16px" }}>
                    <Box sx={{ height: 400, mb: 4 }}>
                        <DataGrid
                            rows={products}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            getRowId={(row) => row.id}
                        />
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <TextField
                            label="ID продукта"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Период (месяцы)"
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Прогнозный период (месяцы)"
                            value={forecastMonths}
                            onChange={(e) => setForecastMonths(e.target.value)}
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateOrder}
                        >
                            Создать заказ
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default OrdersPage;
