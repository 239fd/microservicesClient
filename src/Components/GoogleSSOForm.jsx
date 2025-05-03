import { Box, Button, TextField } from "@mui/material";
import "../Styles/LoginPopup.css";
import React, { useState } from "react";

export default function GoogleSSOForm() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("sosal");
    };

    return (
        <Box className="login-popup-box">
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
                Заполнить
            </Button>
        </Box>
    );
}
