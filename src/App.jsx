import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryPage from './Pages/InventoryPage';
import WarehousePage from './Pages/WarehousePage';
import ReportsPage from './Pages/ReportsPage';
import MainPage from "./Pages/MainPage";
import WelcomePage from "./Pages/WelcomePage";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./Pages/ErrorPage";
import TakePage from "./Pages/TakePage";
import TakeGoods from "./Pages/Stages/TakeGoods";
import SendPage from "./Pages/SendPage";
import SendGoods from "./Pages/Stages/SendGoods";
import RevaluationPage from "./Pages/RevaluationPage";
import WriteOffPage from "./Pages/WriteOffPage";
import ProductManagementPage from "./Pages/ProductManagementPage";

function App() {

    return (
        <Router>
            <div>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/home" element={<ProtectedRoute allowedRoles={["worker", "director", "accountant"]}><MainPage /></ProtectedRoute>} />

                    <Route path="/take" element={<ProtectedRoute allowedRoles={["worker"]}><TakePage /></ProtectedRoute>} />
                    <Route path="/take/take-goods" element={<ProtectedRoute allowedRoles={["worker"]}><TakeGoods /></ProtectedRoute>} />
                    <Route path="/send" element={<ProtectedRoute allowedRoles={("worker")}><SendPage /></ProtectedRoute>} />
                    <Route path="/send/send-goods" element={<ProtectedRoute allowedRoles={("worker")}><SendGoods /></ProtectedRoute>} />
                    <Route path="/product" element={<ProtectedRoute allowedRoles={("worker")}> <ProductManagementPage /></ProtectedRoute>} />

                    <Route path="/writeoff" element={<ProtectedRoute allowedRoles={("accountant")}><WriteOffPage /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute allowedRoles={("accountant")}><InventoryPage /></ProtectedRoute>} />
                    <Route path="/revaluation" element={<ProtectedRoute allowedRoles={("accountant")}><RevaluationPage /></ProtectedRoute>} />

                    <Route path="/warehouse" element={<ProtectedRoute allowedRoles={("director")}> <WarehousePage /></ProtectedRoute>} />
                    <Route path="/report" element={<ProtectedRoute allowedRoles={("director")}><ReportsPage /></ProtectedRoute>} />

                    <Route path="*" element={<ErrorPage/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;