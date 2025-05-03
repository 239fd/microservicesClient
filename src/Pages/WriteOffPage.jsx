import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../Components/NavBar";
import axios from "axios";
import { toast } from "react-toastify";

const WriteOffPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantities, setQuantities] = useState("");
    const [reason, setReason] = useState("");
    const [writeOffDate, setWriteOffDate] = useState("");
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get(
                "http://localhost:8765/product-service/api/product/all",
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
                "Количество товаров должно совпадать с количеством введённых количеств."
            );
            return false;
        }

        if (quantitiesArray.some((qty) => isNaN(qty) || qty < 0)) {
            toast.error("Количество товаров должно быть числом и больше нуля.");
            return false;
        }

        if (!reason.trim()) {
            toast.error("Укажите причину списания.");
            return false;
        }

        const today = new Date().toISOString().split("T")[0];
        if (!writeOffDate || new Date(writeOffDate) > new Date(today)) {
            toast.error(
                "Дата приказа должна быть корректной и не позднее сегодняшнего дня."
            );
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

    const handleWriteOff = async () => {
        const quantitiesArray = quantities
            .split(",")
            .map((qty) => parseInt(qty.trim(), 10));

        const requestBody = {
            productId: selectedProducts.map(Number),
            quantity: quantitiesArray,
            reason,
            date: writeOffDate,
        };

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            const response = await axios.post(
                "http://localhost:8765/product-service/api/product/writeoff",
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
            link.download = "write_off_act.pdf";
            link.click();

            toast.success("Списание выполнено успешно!");
            setSelectedProducts([]);
            setQuantities("");
            setReason("");
            setWriteOffDate("");
            setIsSubmitEnabled(false);
        } catch (error) {
            toast.error("Ошибка при выполнении списания.");
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
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 4,
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
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Количество (через запятую)"
                            value={quantities}
                            onChange={(e) => setQuantities(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Причина списания"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            type="date"
                            label="Дата приказа"
                            InputLabelProps={{ shrink: true }}
                            value={writeOffDate}
                            onChange={(e) => setWriteOffDate(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAdd}
                            disabled={isSubmitting}
                            sx={{ width: "100%" }}
                        >
                            Добавить
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleWriteOff}
                            disabled={!isSubmitEnabled || isSubmitting}
                            sx={{ width: "100%" }}
                        >
                            Списать товары
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default WriteOffPage;
