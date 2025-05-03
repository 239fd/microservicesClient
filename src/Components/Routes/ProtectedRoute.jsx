import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("role");

    if (!token) {
        toast.error("Вы не авторизованы. Пожалуйста, войдите в систему.");
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        toast.error("У вас нет доступа к этой странице.");
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;