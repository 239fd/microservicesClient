import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "../Redux/axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductManagementPage = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const { data } = await api.get(
                `/product-service/api/product/search?query=${query}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProducts(data || []);
        } catch {
            toast.error("Ошибка при поиске товаров.");
        }
    };

    const handleEditClick = (product) => {
        const bestBeforeDate = product.bestBeforeDate?.split("T")[0] || "";
        setSelectedProduct({ ...product, bestBeforeDate });
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            const token = localStorage.getItem("jwtToken");
            await api.delete(`/product-service/api/product/${productToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Товар удалён.");
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        } catch {
            toast.error("Ошибка при удалении товара.");
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleSave = async () => {
        if (!selectedProduct) return;
        try {
            const token = localStorage.getItem("jwtToken");
            const payload = {
                price: selectedProduct.price,
                unit: selectedProduct.unit,
                amount: selectedProduct.amount,
                height: selectedProduct.height,
                length: selectedProduct.length,
                width: selectedProduct.width,
                weight: selectedProduct.weight,
                bestBeforeDate: selectedProduct.bestBeforeDate,
            };
            await api.put(
                `/product-service/api/product/${selectedProduct.id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Товар обновлён.");
            setOpenEditDialog(false);
            handleSearch();
        } catch {
            toast.error("Ошибка при обновлении товара.");
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Наименование", flex: 1, sortable: false },
        { field: "price", headerName: "Цена", width: 120 },
        { field: "unit", headerName: "Ед.изм.", width: 100 },
        { field: "amount", headerName: "Кол-во", width: 100 },
        { field: "height", headerName: "Высота", width: 100 },
        { field: "length", headerName: "Длина", width: 100 },
        { field: "width", headerName: "Ширина", width: 100 },
        { field: "weight", headerName: "Вес", width: 100 },
        {
            field: "bestBeforeDate",
            headerName: "Годен до",
            width: 130,
            valueFormatter: ({ value }) => (value ? value.split("T")[0] : ""),
        },
        {
            field: "actions",
            headerName: "Действия",
            width: 120,
            sortable: false,
            renderCell: (params) => {
                const row = params.row || {};
                return (
                    <>
                        <IconButton onClick={() => handleEditClick(row)}>
                            <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <NavBar />
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" mb={2}>
                    Управление товарами
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                        label="Поиск товаров"
                        variant="outlined"
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSearch}>
                        Поиск
                    </Button>
                </Box>

                {products.length > 0 && (
                    <DataGrid
                        rows={products}
                        columns={columns}
                        pageSize={5}
                        autoHeight
                        getRowId={(row) => row.id}
                    />
                )}

                {/* Диалог редактирования */}
                <Dialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Редактирование товара</DialogTitle>
                    <DialogContent dividers>
                        {selectedProduct && (
                            <>
                                <TextField
                                    label="Цена"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.price || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            price: parseFloat(e.target.value),
                                        })
                                    }
                                />
                                <TextField
                                    label="Ед. изм."
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.unit || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            unit: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    label="Кол-во"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.amount || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            amount: parseInt(e.target.value, 10),
                                        })
                                    }
                                />
                                <TextField
                                    label="Высота"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.height || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            height: parseFloat(e.target.value),
                                        })
                                    }
                                />
                                <TextField
                                    label="Длина"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.length || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            length: parseFloat(e.target.value),
                                        })
                                    }
                                />
                                <TextField
                                    label="Ширина"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.width || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            width: parseFloat(e.target.value),
                                        })
                                    }
                                />
                                <TextField
                                    label="Вес"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={selectedProduct.weight || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            weight: parseFloat(e.target.value),
                                        })
                                    }
                                />
                                <TextField
                                    label="Годен до"
                                    type="date"
                                    fullWidth
                                    margin="dense"
                                    InputLabelProps={{ shrink: true }}
                                    value={selectedProduct.bestBeforeDate || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            bestBeforeDate: e.target.value,
                                        })
                                    }
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>Отмена</Button>
                        <Button onClick={handleSave} variant="contained">
                            Сохранить
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Диалог удаления */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Удаление товара</DialogTitle>
                    <DialogContent>
                        Вы уверены, что хотите удалить товар <strong>{productToDelete?.name}</strong>?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                            Отмена
                        </Button>
                        <Button onClick={confirmDeleteProduct} color="error">
                            Удалить
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default ProductManagementPage;
