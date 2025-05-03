import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";

const WarehousePage = () => {
    const [organization, setOrganization] = useState();
    const [warehouses, setWarehouses] = useState([]);
    const [newOrganization, setNewOrganization] = useState({ name: "", inn: "", address: "" });
    const [newWarehouse, setNewWarehouse] = useState({
        name: "",
        address: "",
        organizationId: localStorage.getItem("id"),
        racks: [],
    });
    const [newRack, setNewRack] = useState({ capacity: 0, cells: [] });
    const [newCell, setNewCell] = useState({ length: 1.0, width: 1.0, height: 1.0 });
    const [cellCount, setCellCount] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedWarehouseToDelete, setSelectedWarehouseToDelete] = useState(null);
    const [innError, setInnError] = useState(false); // Состояние ошибки для УНП
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("id")) {
            fetchOrganization();
            fetchWarehouses();
        }
    }, []);

    const fetchOrganization = async () => {
        const id = localStorage.getItem("id");
        try {
            const response = await axios.get(`http://localhost:8765/organization-service/api/organization/id?id=${id}`, {
                headers: { id },
            });
            if (response?.data) setOrganization(response.data);
            else toast.error("Ошибка загрузки данных организации.");
        } catch {
            toast.error("Ошибка сервера при загрузке данных.");
        }
    };

    const fetchWarehouses = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8765/warehouse-service/api/warehouse", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWarehouses(response.data || []);
        } catch {
            toast.error("Ошибка сервера при загрузке складов.");
        }
    };

    const handleCreateOrganization = async () => {
        if (!newOrganization.name || !newOrganization.inn || !newOrganization.address) {
            toast.error("Заполните все поля.");
            return;
        }
        if (!/^\d{9}$/.test(newOrganization.inn)) {
            toast.error("УНП должен содержать ровно 9 цифр.");
            return;
        }
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            const response = await axios.post("http://localhost:8765/organization-service/api/organization", newOrganization, {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem("id", response?.data?.id);
            toast.success("Организация успешно создана!");
            setNewOrganization({ name: "", inn: "", address: "" });
            fetchOrganization();
            setNewWarehouse({
                name: "",
                address: "",
                organizationId: localStorage.getItem("id"),
                racks: [],
            });
        } catch {
            toast.error("Ошибка при создании организации.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateOrganization = async () => {
        if (!organization.name || !organization.inn || !organization.address) {
            toast.error("Заполните все поля.");
            return;
        }
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            const response = await axios.put(`http://localhost:8765/organization-service/api/organization/${organization.inn}`, {
                name: organization.name,
                address: organization.address,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem("id", response?.data?.id);
            toast.success("Организация успешно обновлена!");
            fetchOrganization();
        } catch {
            toast.error("Ошибка при обновлении организации.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOrganization = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`http://localhost:8765/organization-service/api/organization/${organization.inn}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Организация успешно удалена!");
            localStorage.clear();
            setOrganization(null);
            navigate('/');
        } catch {
            toast.error("Ошибка при удалении организации.");
        }
    };

    const confirmDeleteWarehouse = async () => {
        if (!selectedWarehouseToDelete) return;
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`http://localhost:8765/warehouse-service/api/warehouse/${selectedWarehouseToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Склад успешно удалён!");
            fetchWarehouses();
        } catch {
            toast.error("Ошибка при удалении склада.");
        } finally {
            setSelectedWarehouseToDelete(null);
        }
    };

    const handleAddCells = () => {
        if (!newCell.length || !newCell.width || !newCell.height || cellCount < 1) {
            toast.error("Заполните размеры и количество ячеек.");
            return;
        }

        const newCells = Array.from({ length: cellCount }, () => ({ ...newCell }));
        setNewRack((prev) => ({
            ...prev,
            cells: [...prev.cells, ...newCells],
        }));
        setNewCell({ length: 1.0, width: 1.0, height: 1.0 });
        setCellCount(1);
    };

    const handleAddRack = () => {
        if (!newRack.capacity || newRack.cells.length === 0) {
            toast.error("Заполните все поля и добавьте хотя бы одну ячейку.");
            return;
        }
        setNewWarehouse((prev) => ({
            ...prev,
            racks: [...prev.racks, newRack],
        }));
        setNewRack({ capacity: 0, cells: [] });
    };

    const handleCreateWarehouse = async () => {
        if (!newWarehouse.name || !newWarehouse.address || newWarehouse.racks.length === 0) {
            toast.error("Заполните все поля склада.");
            return;
        }
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("jwtToken");
            await axios.post("http://localhost:8765/warehouse-service/api/warehouse", newWarehouse, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Склад успешно создан!");
            setNewWarehouse({
                name: "",
                address: "",
                organizationId: localStorage.getItem("id"),
                racks: [],
            });
            fetchWarehouses();
        } catch {
            toast.error("Ошибка при создании склада.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const warehouseColumns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название", flex: 1.5 },
        { field: "address", headerName: "Адрес", flex: 2 },
        {
            field: "rackCount",
            headerName: "Количество стоек",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Действия",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setSelectedWarehouseToDelete(params.row.id)}
                >
                    Удалить
                </Button>
            ),
        },
    ];

    return (
        <div>
            <NavBar />
            <Box sx={{ padding: "16px" }}>
                <Typography variant="h4" mb={2}>
                    {organization ? "Управление организацией" : "Добавить организацию"}
                </Typography>
                <Grid container spacing={2} mb={4}>
                    <Grid item xs={4}><TextField label="Название" fullWidth value={organization?.name || newOrganization.name} onChange={(e) => organization ? setOrganization({ ...organization, name: e.target.value }) : setNewOrganization({ ...newOrganization, name: e.target.value })} /></Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="УНП"
                            fullWidth
                            disabled={Boolean(organization)}
                            value={organization?.inn || newOrganization.inn}
                            error={innError}
                            helperText={innError ? "УНП должен содержать ровно 9 цифр" : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,9}$/.test(value)) {
                                    if (organization) {
                                        setOrganization({ ...organization, inn: value });
                                    } else {
                                        setNewOrganization({ ...newOrganization, inn: value });
                                    }
                                }

                                if (value.length === 9 && !/^\d{9}$/.test(value)) {
                                    setInnError(true);
                                } else {
                                    setInnError(false);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}><TextField label="Адрес" fullWidth value={organization?.address || newOrganization.address} onChange={(e) => organization ? setOrganization({ ...organization, address: e.target.value }) : setNewOrganization({ ...newOrganization, address: e.target.value })} /></Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" sx={{ mr: 2, mb: 2 }} onClick={organization ? handleUpdateOrganization : handleCreateOrganization} disabled={isSubmitting}>
                            {organization ? "Редактировать" : "Добавить организацию"}
                        </Button>
                        <Button variant="outlined" color="error" disabled={!organization} onClick={() => setConfirmDeleteOpen(true)}>
                            Удалить организацию
                        </Button>
                    </Grid>
                </Grid>

                <Typography variant="h4" mb={2}>Управление складами</Typography>
                <Box sx={{ height: 300, mb: 4 }}>
                    <DataGrid
                        rows={warehouses.map((wh, i) => ({
                            id: wh.id || i,
                            ...wh,
                            rackCount: Array.isArray(wh.racks) ? wh.racks.length : 0,
                        }))}
                        columns={warehouseColumns}
                        pageSize={5}
                    />
                </Box>

                <Typography variant="h5" mb={2}>Добавить склад</Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}><TextField label="Название склада" fullWidth value={newWarehouse.name} onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })} /></Grid>
                    <Grid item xs={6}><TextField label="Адрес склада" fullWidth value={newWarehouse.address} onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })} /></Grid>
                </Grid>

                <Typography variant="h5" mt={4} mb={2}>Добавить стеллаж</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} mb={2}>
                        <TextField
                            label="Вместимость"
                            type="number"
                            fullWidth
                            value={newRack.capacity}
                            onChange={(e) =>
                                setNewRack((prev) => ({ ...prev, capacity: Number(e.target.value) }))
                            }
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Добавить ячейки:
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextField
                                    label="Длина"
                                    type="number"
                                    fullWidth
                                    value={newCell.length}
                                    onChange={(e) => setNewCell((prev) => ({ ...prev, length: Number(e.target.value) }))}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Ширина"
                                    type="number"
                                    fullWidth
                                    value={newCell.width}
                                    onChange={(e) => setNewCell((prev) => ({ ...prev, width: Number(e.target.value) }))}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Высота"
                                    type="number"
                                    fullWidth
                                    value={newCell.height}
                                    onChange={(e) => setNewCell((prev) => ({ ...prev, height: Number(e.target.value) }))}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Кол-во ячеек"
                                    type="number"
                                    fullWidth
                                    value={cellCount}
                                    onChange={(e) => setCellCount(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" onClick={handleAddCells}>
                                    Добавить ячейки
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Typography variant="body1" mt={2}>Текущие стеллажи:</Typography>
                {newWarehouse.racks.map((rack, i) => (
                    <Box key={i}>
                        <Typography variant="body2">Стеллаж {i + 1}: Ячеек:{rack.cells.length}</Typography>
                    </Box>
                ))}

                <Button variant="contained" onClick={handleAddRack} sx={{ mt: 4, ml: 2 }}>Добавить стеллаж</Button>
                <Button variant="contained" color="primary" sx={{ mt: 4, ml: 2 }} onClick={handleCreateWarehouse} disabled={isSubmitting}>Добавить склад</Button>
            </Box>

            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Удаление склада</DialogTitle>
                <DialogContent>Вы уверены, что хотите удалить этот склад?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">Отмена</Button>
                    <Button onClick={confirmDeleteWarehouse} color="error">Удалить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WarehousePage;
