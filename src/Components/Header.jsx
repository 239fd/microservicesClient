import React from 'react';
import { Button } from '@mui/material';
import "../Styles/Header.css";

const Header = ({ setLoginOpen, setRegisterOpen }) => {
    return (
        <header>
            <div className="logo">WMS</div>
            <div className="auth-buttons">
                <Button variant="text" onClick={() => setLoginOpen(true)}>Войти</Button>
                <Button variant="contained" color="primary" onClick={() => setRegisterOpen(true)}>Регистрация</Button>
            </div>
        </header>
    );
};

export default Header;
