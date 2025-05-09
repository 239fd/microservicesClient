import React, { useState, useEffect, useRef } from "react";
import {
    Button,
    Box,
    Checkbox,
    FormControlLabel,
    Typography,
} from "@mui/material";
import { api } from "../Redux/axios";
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
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
    Font,
    Image,
} from "@react-pdf/renderer";
import roboto from "../fonts/Roboto/static/Roboto-Regular.ttf";
import { toPng } from "html-to-image";

Font.register({ family: "Roboto", src: roboto });

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        backgroundColor: "#ffffff",
        padding: 30,
    },
    section: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        marginBottom: 10,
    },
    table: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
    },
    tableRow: {
        display: "flex",
        flexDirection: "row",
        padding: 5,
    },
    tableCell: {
        border: "1px solid black",
        padding: 5,
        flex: 1,
    },
});

const ReportsPage = () => {
    const [warehouseStats, setWarehouseStats] = useState([]);
    const [showBar, setShowBar] = useState(true);
    const [showPie, setShowPie] = useState(true);
    const [showLine, setShowLine] = useState(true);
    const [showTable, setShowTable] = useState(true);
    const [barChartImage, setBarChartImage] = useState(null);
    const [pieChartImage, setPieChartImage] = useState(null);
    const [lineChartImage, setLineChartImage] = useState(null);

    const barRef = useRef();
    const pieRef = useRef();
    const lineRef = useRef();

    useEffect(() => {
        fetchWarehouseStats();
    }, []);

    const fetchWarehouseStats = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const resp = await api.get("/warehouse-service/api/statistics/warehouses", {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    const captureChartImages = async () => {
        try {
            if (showBar && barRef.current) {
                const dataUrl = await toPng(barRef.current, { pixelRatio: 2 });
                setBarChartImage(dataUrl);
            }
            if (showPie && pieRef.current) {
                const dataUrl = await toPng(pieRef.current, { pixelRatio: 2 });
                setPieChartImage(dataUrl);
            }
            if (showLine && lineRef.current) {
                const dataUrl = await toPng(lineRef.current, { pixelRatio: 2 });
                setLineChartImage(dataUrl);
            }
        } catch (err) {
            console.error("Ошибка захвата диаграмм:", err);
        }
    };

    const WarehouseReportPDF = () => (
        <Document>
            <Page style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.heading}>Заполненность ячеек на складах</Text>

                    <View style={{ flexDirection: "column", gap: 20 }}>
                        {showBar && barChartImage && (
                            <Image
                                src={barChartImage}
                                style={{ width: "100%", height: 250, marginBottom: 10 }}
                            />
                        )}
                        {showPie && pieChartImage && (
                            <Image
                                src={pieChartImage}
                                style={{ width: "100%", height: 250, marginBottom: 10 }}
                            />
                        )}
                        {showLine && lineChartImage && (
                            <Image
                                src={lineChartImage}
                                style={{ width: "100%", height: 250, marginBottom: 10 }}
                            />
                        )}
                    </View>

                    {showTable && (
                        <View style={styles.table}>
                            {warehouseStats.map((row, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{row.warehouseName}</Text>
                                    <Text style={styles.tableCell}>{row.cellCount}</Text>
                                    <Text style={styles.tableCell}>{row.filledCellCount}</Text>
                                    <Text style={styles.tableCell}>{row.productCount}</Text>
                                    <Text style={styles.tableCell}>{row.totalProductValue}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );

    const totalFilled = warehouseStats.reduce((sum, w) => sum + w.filledCellCount, 0);
    const totalCells = warehouseStats.reduce((sum, w) => sum + w.cellCount, 0);
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
                        control={<Checkbox checked={showBar} onChange={() => setShowBar(!showBar)} />}
                        label="Гистограмма"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showPie} onChange={() => setShowPie(!showPie)} />}
                        label="Круговая диаграмма"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showLine} onChange={() => setShowLine(!showLine)} />}
                        label="Линейный график"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showTable} onChange={() => setShowTable(!showTable)} />}
                        label="Таблица"
                    />
                </Box>

                <Box mb={2}>
                    <Button variant="contained" onClick={captureChartImages}>
                        Обновить изображения диаграмм
                    </Button>
                    {(barChartImage || pieChartImage || lineChartImage) && (
                        <Box mt={1}>
                            <PDFDownloadLink
                                document={<WarehouseReportPDF />}
                                fileName="warehouse_report.pdf"
                            >
                                {({ loading }) =>
                                    <Button variant="contained">
                                        {loading ? "Генерация PDF..." : "Скачать PDF-отчет"}
                                    </Button>
                                }
                            </PDFDownloadLink>
                        </Box>
                    )}
                </Box>

                {showBar && (
                    <Box ref={barRef} sx={{ mt: 4, maxWidth:'100%'}}>
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
                    </Box>
                )}

                {showPie && (
                    <Box ref={pieRef} sx={{ mt: 4, maxWidth:'100%' }}>
                        <Typography variant="h6" mb={1}>
                            Круговая диаграмма: Заполнено / Свободно
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                )}

                {showLine && (
                    <Box ref={lineRef} sx={{ mt: 4, maxWidth:'100%'}}>
                        <Typography variant="h6" mb={1}>
                            Линейный график: Средняя вместимость стеллажей
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
                                    name="Средняя вместимость"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}

                {showTable && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" mb={1}>
                            Таблица складов
                        </Typography>
                        <div style={{ height: 400 }}>
                            <DataGrid
                                rows={warehouseStats.map((row, i) => ({ id: i, ...row }))}
                                columns={[
                                    { field: "warehouseName", headerName: "Склад", flex: 1 },
                                    { field: "rackCount", headerName: "Стеллажи", flex: 1 },
                                    { field: "cellCount", headerName: "Ячеек", flex: 1 },
                                    { field: "filledCellCount", headerName: "Заполнено", flex: 1 },
                                    { field: "productCount", headerName: "Кол-во товаров", flex: 1 },
                                    { field: "totalProductValue", headerName: "Общий объем", flex: 1 },
                                ]}
                                pageSize={warehouseStats.length || 5}
                                autoHeight
                            />
                        </div>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default ReportsPage;
