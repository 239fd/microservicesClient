import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import "../Styles/SuppliersPage.css"

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        inn: "",
        address: "",
    });
    const [newStock, setNewStock] = useState({
        name: "",
        amount: 0,
        price: 0,
        suppliersId: 0,
    });
    const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSuppliers();
        fetchStocks();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/manager/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuppliers(response.data.data);
        } catch (error) {
            toast.error("Ошибка при загрузке поставщиков.");
        }
    };

    const fetchStocks = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8080/api/v1/manager/stock", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStocks(response.data.data);
        } catch (error) {
            toast.error("Ошибка при загрузке запасов.");
        }
    };

    const handleAddSupplier = async () => {
        if (!newSupplier.name || !newSupplier.inn || !newSupplier.address) {
            toast.error("Заполните все поля.");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.post("http://localhost:8080/api/v1/manager/supplier", newSupplier, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Поставщик добавлен!");
            setNewSupplier({ name: "", inn: "", address: "" });
            fetchSuppliers();
        } catch (error) {
            toast.error("Ошибка при добавлении поставщика.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSupplier = async () => {
        if (!selectedSupplier) return;

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.put("http://localhost:8080/api/v1/manager/supplier", selectedSupplier, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Информация о поставщике обновлена!");
            fetchSuppliers();
            setIsDialogOpen(false);
            setIsSupplierDialogOpen(false);
        } catch (error) {
            toast.error("Ошибка при обновлении поставщика.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSupplier = async (supplier) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete("http://localhost:8080/api/v1/manager/supplier", {
                data: { inn: supplier.inn },
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Поставщик удален!");
            fetchSuppliers();
        } catch (error) {
            toast.error("Ошибка при удалении поставщика.");
        }
    };

    const handleAddStock = async () => {
        if (!newStock.name || newStock.amount <= 0 || newStock.price <= 0) {
            toast.error("Заполните все поля корректно.");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            const queryParams = new URLSearchParams({
                name: newStock.name,
                amount: newStock.amount.toString(),
                price: newStock.price.toString(),
                suppliersId: selectedSupplier.id.toString(),
            }).toString();

            await axios.post(`http://localhost:8080/api/v1/manager/stock?${queryParams}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Запас добавлен!");
            setNewStock({ name: "", amount: 0, price: 0 });
            fetchStocks();
        } catch (error) {
            toast.error("Ошибка при добавлении запаса.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStock = async (stock) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`http://localhost:8080/api/v1/manager/stock/${stock.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Запас удален!");
            fetchStocks();
        } catch (error) {
            toast.error("Ошибка при удалении запаса.");
        }
    };

    const columnsSuppliers = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название", flex: 1.5 },
        { field: "inn", headerName: "ИНН", flex: 1 },
        { field: "address", headerName: "Адрес", flex: 2 },
        {
            field: "actions",
            headerName: "Действия",
            flex: 1,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setSelectedSupplier(params.row);
                            setIsDialogOpen(true);
                        }}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSupplier(params.row)}
                        sx={{ ml: 1 }}
                    >
                        Удалить
                    </Button>
                    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                        <DialogTitle >Редактировать поставщика</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Название"
                                value={selectedSupplier?.name || ""}
                                onChange={(e) =>
                                    setSelectedSupplier((prev) => ({ ...prev, name: e.target.value }))
                                }
                                fullWidth
                                sx={{
                                    marginY: "5px",
                                    paddingY: "15px",
                                    mb: 3 ,
                                }}
                            />

                            <TextField
                                label="Адрес"
                                value={selectedSupplier?.address || ""}
                                onChange={(e) =>
                                    setSelectedSupplier((prev) => ({ ...prev, address: e.target.value }))
                                }
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                            <Button onClick={handleUpdateSupplier} disabled={isSubmitting}>
                                Сохранить
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ),
        },
    ];

    const columnsStocks = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название", flex: 1.5 },
        { field: "amount", headerName: "Количество", flex: 1 },
        { field: "price", headerName: "Цена", flex: 1 },
    ];

    return (
        <div >
            <NavBar />
            <div className="subMain">
                <Box sx={{ padding: "16px" }}>
                    <Typography variant="h4" mb={2}>Управление поставщиками</Typography>
                    <Box sx={{ height: 400, mb: 4 }}>
                        <DataGrid rows={suppliers} columns={columnsSuppliers} pageSize={5} />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                label="Название"
                                value={newSupplier.name}
                                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="ИНН"
                                value={newSupplier.inn}
                                onChange={(e) => setNewSupplier({ ...newSupplier, inn: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Адрес"
                                value={newSupplier.address}
                                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleAddSupplier}>
                                Добавить поставщика
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography variant="h5" mt={4} mb={2}>Управление запасами</Typography>
                    <Box sx={{ height: 400, mb: 4 }}>
                        <DataGrid rows={stocks} columns={columnsStocks} pageSize={5} />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                label="Название"
                                value={newStock.name}
                                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Количество"
                                type="number"
                                value={newStock.amount}
                                onChange={(e) => setNewStock({ ...newStock, amount: parseInt(e.target.value, 10) })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Цена"
                                type="number"
                                value={newStock.price}
                                onChange={(e) => setNewStock({ ...newStock, price: parseFloat(e.target.value) })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={16}>
                            <Button
                                variant="contained"
                                onClick={handleAddStock}
                                disabled={!selectedSupplier}
                            >
                                Добавить запас
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default SuppliersPage;
