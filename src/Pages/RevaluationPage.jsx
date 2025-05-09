import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../Components/NavBar";
import {api} from "../Redux/axios";
import { toast } from "react-toastify";

const RevaluationPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [newPrices, setNewPrices] = useState("");
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Управляет состоянием кнопки "Переоценить товары"
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

    const validatePrices = () => {
        const pricesArray = newPrices
            .split(",")
            .map((price) => parseFloat(price.trim()));

        if (pricesArray.length !== selectedProducts.length) {
            toast.error(
                "Количество новых цен должно совпадать с количеством выбранных товаров."
            );
            return false;
        }

        if (pricesArray.some((price) => isNaN(price) || price <= 0)) {
            toast.error("Убедитесь, что все цены корректны и больше нуля.");
            return false;
        }

        return true;
    };

    const handleAdd = () => {
        if (selectedProducts.length === 0) {
            toast.error("Выберите хотя бы один товар.");
            return;
        }
        if (validatePrices()) {
            setIsSubmitEnabled(true);
            toast.success("Цены успешно добавлены!");
        } else {
            setIsSubmitEnabled(false);
        }
    };

    const handleRevaluation = async () => {
        const pricesArray = newPrices
            .split(",")
            .map((price) => parseFloat(price.trim()));

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            const requestBody = {
                productIds: selectedProducts.map(Number),
                newPrice: pricesArray,
            };

            const response = await api.post(
                "/product-service/api/product/revaluation",
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
            link.download = "revaluation_act.pdf";
            link.click();
            fetchProducts()
            toast.success("Переоценка выполнена успешно!");
            setSelectedProducts([]);
            setNewPrices("");
            setIsSubmitEnabled(false);
        } catch (error) {
            toast.error("Ошибка при выполнении переоценки.");
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
                            label="Новые цены (через запятую)"
                            value={newPrices}
                            onChange={(e) => setNewPrices(e.target.value)}
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
                {selectedProducts.length > 0 && newPrices && (
                    <Box sx={{ mt: 2, width: "100%" }}>
                        <strong>Выбранные товары и новые цены:</strong>
                        <Box sx={{ mt: 1, pl: 2 }}>
                            {(() => {
                                const pricesArray = newPrices.split(",").map((p) => p.trim());
                                return selectedProducts.map((id, index) => {
                                    const product = products.find((p) => p.id === id);
                                    const price = pricesArray[index];
                                    return product ? (
                                        <div key={id}>
                                            {product.name}: {price}
                                        </div>
                                    ) : null;
                                });
                            })()}
                        </Box>
                    </Box>
                )}
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleRevaluation}
                            disabled={!isSubmitEnabled || isSubmitting}
                        >
                            Переоценить товары
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default RevaluationPage;
