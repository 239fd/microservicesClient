import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLoginData } from "../Redux/Slies/authSlice";
import { Box, TextField, Button, Typography, Modal } from "@mui/material";
import "../Styles/LoginPopup.css";
import { toast } from "react-toastify";

const LoginPopup = ({ open, onClose }) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const status = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (!open) {
            setLogin("");
            setPassword("");
        }
    }, [open]);

    useEffect(() => {
        if (status === "loaded" && open) {
            navigate("/home");
            onClose();
        }
    }, [status, open, navigate, onClose]);


    const validateLogin = (login) => /^[^#{}\]()&%$]{6,}$/.test(login);
    const validatePassword = (password) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleLogin = async () => {
        if (!validateLogin(login)) {
            toast.error("Логин должен содержать не менее 6 символов и не содержать #{}[]()&%$");
            return;
        }
        if (!validatePassword(password)) {
            toast.error("Пароль должен содержать не менее 8 символов, включать буквы, цифры и специальные символы");
            return;
        }

        try {
            await dispatch(fetchLoginData({ login, password })).unwrap();
            toast.success("Успешный вход!");
            navigate("/home");
            onClose();
        } catch (error) {
            if (error.includes("Unknown user")) {
                toast.error("Неверный логин или пароль.");
            } else {
                toast.error("Ошибка входа. Попробуйте снова.");
            }
        }
    };

    const handleClose = () => {
        setLogin("");
        setPassword("");
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="login-popup-box">
                <Typography variant="h6" className="login-title">Личный кабинет</Typography>
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="login-input"
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    className="login-button"
                >
                    Войти
                </Button>
            </Box>
        </Modal>
    );
};

export default LoginPopup;
