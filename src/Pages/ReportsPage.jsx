import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import HeatMapGrid from "react-heatmap-grid";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportsPage = () => {
    const [warehouseStats, setWarehouseStats] = useState([]);
    const [showBar, setShowBar] = useState(true);
    const [showTable, setShowTable] = useState(true);
    const [showPie, setShowPie] = useState(false);
    const [showLine, setShowLine] = useState(false);

    const barRef = useRef();
    const tableRef = useRef();
    const pieRef = useRef();
    const lineRef = useRef();
    const heatmapRef = useRef();

    useEffect(() => {
        fetchWarehouseStats();
    }, []);

    const fetchWarehouseStats = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const resp = await axios.get(
                "http://localhost:8765/warehouse-service/api/statistics/warehouses",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resp.data) {
                const cleaned = resp.data.map(({ warehouseId, ...rest }) => rest);
                setWarehouseStats(cleaned);
            } else {
                toast.error("Ошибка загрузки данных складов.");
            }
        } catch (e) {
            toast.error("Ошибка сервера при загрузке складской статистики.");
        }
    };

    const generatePDF = async () => {
        if (
            !showBar &&
            !showTable &&
            !showPie &&
            !showLine
        ) {
            toast.error("Пожалуйста, выберите хотя бы одну секцию для отчета.");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");
        let y = 10;
        const sections = [
            { show: showBar, ref: barRef, title: "Гистограмма: Ячеек и заполнено" },
            {
                show: showPie,
                ref: pieRef,
                title: "Круговая диаграмма: заполнено/свободно",
            },
            {
                show: showLine,
                ref: lineRef,
                title: "Линейный график: средняя загрузка стеллажей",
            },
            { show: showTable, ref: tableRef, title: "Информация: Таблица складов" },
        ];

        for (const sec of sections) {
            if (!sec.show || !sec.ref.current) continue;
            const canvas = await html2canvas(sec.ref.current);
            const img = canvas.toDataURL("image/png");
            const props = doc.getImageProperties(img);
            const w = doc.internal.pageSize.getWidth() - 20;
            const h = (props.height * w) / props.width;
            doc.text(sec.title, 10, y);
            y += 5;
            doc.addImage(img, "PNG", 10, y, w, h);
            y += h + 10;
            if (y + h > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                y = 10;
            }
        }

        doc.save("warehouse_report.pdf");
    };

    const totalFilled = warehouseStats.reduce(
        (sum, w) => sum + w.filledCellCount,
        0
    );
    const totalCells = warehouseStats.reduce(
        (sum, w) => sum + w.cellCount,
        0
    );
    const pieData = [
        { name: "Заполнено", value: totalFilled },
        { name: "Свободно", value: totalCells - totalFilled },
    ];
    const pieColors = ["#82ca9d", "#8884d8"];

    return (
        <div>
            <NavBar />
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" mt={4} mb={2}>
                    Заполненность ячеек на складах
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showBar}
                                onChange={() => setShowBar(!showBar)}
                            />
                        }
                        label="Гистограмма"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showPie}
                                onChange={() => setShowPie(!showPie)}
                            />
                        }
                        label="Круговая диаграмма"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showLine}
                                onChange={() => setShowLine(!showLine)}
                            />
                        }
                        label="Линейный график"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showTable}
                                onChange={() => setShowTable(!showTable)}
                            />
                        }
                        label="Таблица"
                    />
                    <Button variant="contained" onClick={generatePDF}>
                        Скачать отчет (PDF)
                    </Button>
                </Box>

                {showBar && (
                    <div ref={barRef}>
                        <Typography variant="h6" mb={1}>
                            Гистограмма: Ячеек и заполнено
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={warehouseStats}>
                                <XAxis dataKey="warehouseName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cellCount" fill="#8884d8" name="Ячеек" />
                                <Bar dataKey="filledCellCount" fill="#82ca9d" name="Заполнено" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {showPie && (
                    <div ref={pieRef}>
                        <Typography variant="h6" mb={1}>
                            Круговая диаграмма: заполнено/свободно
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {showLine && (
                    <div ref={lineRef}>
                        <Typography variant="h6" mb={1}>
                            Линейный график: средняя загрузка стеллажей
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={warehouseStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="warehouseName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="averageRackCapacity"
                                    stroke="#8884d8"
                                    name="Средняя загрузка"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {showTable && (
                    <Box
                        ref={tableRef}
                        sx={{
                            height: 400,
                            mt: 4,
                            "& .MuiDataGrid-footerContainer": { display: "none" },
                        }}
                    >
                        <Typography variant="h6" mb={1}>
                            Информация: Таблица складов
                        </Typography>
                        <DataGrid
                            rows={warehouseStats.map((row, i) => ({ id: i, ...row }))}
                            columns={[
                                { field: "warehouseName", headerName: "Склад", flex: 1 },
                                { field: "rackCount", headerName: "Стеллажи", flex: 1 },
                                { field: "cellCount", headerName: "Ячеек", flex: 1 },
                                {
                                    field: "filledCellCount",
                                    headerName: "Заполнено",
                                    flex: 1,
                                },
                                {
                                    field: "productCount",
                                    headerName: "Кол-во товаров",
                                    flex: 1,
                                },
                                {
                                    field: "totalProductValue",
                                    headerName: "Общий объем",
                                    flex: 1,
                                },
                            ]}
                            pageSize={warehouseStats.length || 5}
                            autoHeight
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default ReportsPage;
