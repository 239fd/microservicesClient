import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../Components/NavBar";
import { api } from "../Redux/axios";
import { toast } from "react-toastify";

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantities, setQuantities] = useState("");
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Управляет состоянием кнопки "Отправить"
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await api.get(
                "/product-service/api/product/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data) {
                setProducts(response.data);
            } else {
                toast.error("Ошибка при загрузке данных.");
            }
        } catch (error) {
            toast.error("Ошибка сервера.");
            console.error(error);
        }
    };

    const handleSelectionChange = (ids) => {
        setSelectedProducts(ids);
    };

    const validateInputs = () => {
        const quantitiesArray = quantities
            .split(",")
            .map((qty) => parseInt(qty.trim(), 10));

        if (selectedProducts.length === 0) {
            toast.error("Выберите хотя бы один товар.");
            return false;
        }

        if (quantitiesArray.length !== selectedProducts.length) {
            toast.error(
                "Количество введённых значений должно совпадать с количеством выбранных товаров."
            );
            return false;
        }

        if (quantitiesArray.some((qty) => isNaN(qty) || qty < 0)) {
            toast.error("Количество должно быть числом и больше нуля.");
            return false;
        }

        return true;
    };

    const handleAdd = () => {
        if (validateInputs()) {
            setIsSubmitEnabled(true);
            toast.success("Данные успешно добавлены!");
        } else {
            setIsSubmitEnabled(false);
        }
    };

    const handleInventory = async () => {
        const quantitiesArray = quantities
            .split(",")
            .map((qty) => parseInt(qty.trim(), 10));

        const requestBody = {
            ids: selectedProducts.map(Number),
            amounts: quantitiesArray,
        };

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            const response = await api.post(
                "/product-service/api/product/inventory",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "inventory_report.pdf";
            link.click();

            toast.success("Инвентаризация выполнена успешно!");
            setSelectedProducts([]);
            setQuantities("");
            setIsSubmitEnabled(false);
        } catch (error) {
            toast.error("Ошибка при выполнении инвентаризации.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Наименование", flex: 2 },
        { field: "price", headerName: "Цена", flex: 1 },
        { field: "amount", headerName: "Количество", flex: 1 },
    ];

    return (
        <div>
            <NavBar />
            <Box
                sx={{
                    width: "80%",
                    padding: "3%",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ height: 400, width: "100%", mb: 4 }}>
                    <DataGrid
                        rows={products}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        onRowSelectionModelChange={(ids) =>
                            handleSelectionChange(ids)
                        }
                    />
                </Box>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Количество (через запятую)"
                            value={quantities}
                            onChange={(e) => setQuantities(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleAdd}
                            disabled={isSubmitting}
                        >
                            Добавить
                        </Button>
                    </Grid>
                </Grid>
                {selectedProducts.length > 0 && quantities && (
                    <Box sx={{ mt: 2 }}>
                        {(() => {
                            const quantitiesArray = quantities.split(",").map((q) => q.trim());
                            return selectedProducts.map((id, index) => {
                                const product = products.find((p) => p.id === id);
                                const qty = quantitiesArray[index];
                                return product ? (
                                    <div key={id}>
                                        {product.name}: {qty}
                                    </div>
                                ) : null;
                            });
                        })()}
                    </Box>
                )}
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={handleInventory}
                            disabled={!isSubmitEnabled || isSubmitting}
                        >
                            Провести инвентаризацию
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default InventoryPage;
