import React, { useState } from "react";
import {
    Box,
    Button,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../../Components/NavBar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TakeGoods = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [goodsCount, setGoodsCount] = useState(1);
    const [goodsData, setGoodsData] = useState([]);
    const [currentGood, setCurrentGood] = useState({
        name: "",
        unit: "",
        amount: "",
        price: "",
        dimensions: "",
        bestBeforeDate: "",
        weight: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const steps = ["Введите количество позиций", "Введите данные товара"];

    const handleNext = () => {
        if (activeStep === 0 && goodsCount > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === 1) {
            handleSubmit();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAddGood = () => {
        const dimensions = currentGood.dimensions.split("-").map(Number);
        if (dimensions.length !== 3) {
            toast.error("Неверный формат габаритов. Используйте формат 11-111-12.");
            return;
        }
        if (
            currentGood.name &&
            currentGood.unit &&
            currentGood.amount > 0 &&
            currentGood.price > 0 &&
            dimensions.every((d) => d > 0) &&
            currentGood.bestBeforeDate &&
            new Date(currentGood.bestBeforeDate) > new Date() &&
            currentGood.weight > 0
        ) {
            const [length, width, height] = dimensions;
            setGoodsData((prev) => [
                ...prev,
                {
                    ...currentGood,
                    length,
                    width,
                    height,
                },
            ]);
            setCurrentGood({
                name: "",
                unit: "",
                amount: "",
                price: "",
                dimensions: "",
                bestBeforeDate: "",
                weight: "",
            });
        } else {
            toast.error("Проверьте корректность всех полей.");
        }
    };

    const handleRemoveGood = (indexToRemove) => {
        setGoodsData((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.post(
                "http://localhost:8765/product-service/api/product/accept",
                goodsData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/zip" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "acceptance_package.zip";
            link.click();
            toast.success("Товары успешно приняты!");
            setGoodsData([]);
            setActiveStep(0);

            navigate("/take");
        } catch (error) {
            toast.error("Ошибка при отправке данных.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAddDisabled =
        !currentGood.name ||
        !currentGood.unit ||
        !currentGood.amount ||
        !currentGood.price ||
        !currentGood.dimensions ||
        !currentGood.bestBeforeDate ||
        !currentGood.weight;

    return (
        <div>
            <NavBar />
            <Box sx={{ width: "100%", padding: "16px" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                        justifyContent: "space-between",
                    }}
                >
                    <Box flex={1} display="flex" flexDirection="column" alignItems="center">
                        {activeStep === 0 ? (
                            <>
                                <Typography variant="h6" mb={2}>
                                    Введите количество позиций
                                </Typography>
                                <TextField
                                    type="number"
                                    label="Количество позиций"
                                    value={goodsCount}
                                    onChange={(e) => setGoodsCount(Number(e.target.value))}
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={goodsCount <= 0}
                                >
                                    Далее
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" mb={2}>
                                    Введите данные товара
                                </Typography>
                                <TextField
                                    label="Наименование"
                                    value={currentGood.name}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, name: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <TextField
                                    label="Единица измерения"
                                    value={currentGood.unit}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, unit: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <TextField
                                    type="number"
                                    label="Количество"
                                    value={currentGood.amount}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, amount: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <TextField
                                    type="number"
                                    label="Стоимость"
                                    value={currentGood.price}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, price: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <TextField
                                    label="Габариты (Формат: 11-111-12)"
                                    value={currentGood.dimensions}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, dimensions: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <TextField
                                    type="date"
                                    label="Срок годности"
                                    InputLabelProps={{ shrink: true }}
                                    value={currentGood.bestBeforeDate}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, bestBeforeDate: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <TextField
                                    type="number"
                                    label="Вес"
                                    value={currentGood.weight}
                                    onChange={(e) =>
                                        setCurrentGood({ ...currentGood, weight: e.target.value })
                                    }
                                    sx={{ mb: 2, width: "300px" }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddGood}
                                    disabled={isAddDisabled || goodsData.length >= goodsCount}
                                    sx={{ mb: 2 }}
                                >
                                    Добавить
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={goodsData.length < goodsCount || isSubmitting}
                                >
                                    Отправить
                                </Button>
                            </>
                        )}
                    </Box>
                    <Box
                        flex={1}
                        sx={{
                            backgroundColor: "#ffffff",
                            padding: 2,
                            borderRadius: 1,
                            maxHeight: "400px",
                            overflowY: "auto",
                        }}
                    >
                        <Typography variant="h6">Добавленные товары:</Typography>
                        <List>
                            {goodsData.map((good, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemoveGood(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={`${good.name} (${good.amount} ${good.unit})`}
                                        secondary={`Цена: ${good.price}, Габариты: ${good.length}-${good.width}-${good.height}, Вес: ${good.weight}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
                {activeStep > 0 && (
                    <Button onClick={handleBack} sx={{ mt: 2 }}>
                        Назад
                    </Button>
                )}
            </Box>
        </div>
    );
};

export default TakeGoods;
