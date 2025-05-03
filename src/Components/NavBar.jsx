import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logOut } from "../Redux/Slies/authSlice";
import { toast } from "react-toastify";
import '../Styles/NavBar.css';

import { ReactComponent as HomeIcon } from './Images/CompleteImage.svg';
import { ReactComponent as GoodsImage } from './Images/product-icon.svg';
import { ReactComponent as CheckIcon } from './Images/TransportationImage.svg';
import { ReactComponent as LocalShippingIcon } from './Images/ReportImage.svg';
import { ReactComponent as InventoryIcon } from './Images/GarbageImage.svg';
import { ReactComponent as DeleteIcon } from './Images/ListImage.svg';
import { ReactComponent as ListAltIcon } from './Images/WarehouseImage.svg';
import { ReactComponent as AssessmentIcon } from './Images/ChartImage.svg';
import { ReactComponent as ExitIcon } from "./Images/Exit.svg";

export default function NavBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:950px)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = localStorage.getItem("role");

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        try {
            localStorage.clear();
            dispatch(logOut());
            toast.success("Вы успешно вышли из системы.");
            navigate("/");
        } catch (error) {
            toast.error("Ошибка при выходе.");
        }
    };

    const handleNavigation = (path, allowedRoles) => {
        if (!allowedRoles.includes(role)) {
            toast.error("У вас нет доступа к этой странице.");
        } else {
            navigate(path);
        }
    };

    const menuItems = [
        {
            icon: <HomeIcon className="icon" />,
            label: "Получить",
            path: "/take",
            allowedRoles: ["worker"],
        },
        {
            icon: <CheckIcon className="icon" />,
            label: "Отправить",
            path: "/send",
            allowedRoles: ["worker"],
        },
        {
            icon: <GoodsImage className="icon" />,
            label: "Товар",
            path: "/product",
            allowedRoles: ["worker"],
        },
        {
            icon: <LocalShippingIcon className="icon" />,
            label: "Инвентаризация",
            path: "/inventory",
            allowedRoles: ["accountant"],
        },
        {
            icon: <InventoryIcon className="icon" />,
            label: "Списать",
            path: "/writeoff",
            allowedRoles: ["accountant"],
        },
        {
            icon: <DeleteIcon className="icon" />,
            label: "Переоценка",
            path: "/revaluation",
            allowedRoles: ["accountant"],
        },
        {
            icon: <ListAltIcon className="icon" />,
            label: "Склад",
            path: "/warehouse",
            allowedRoles: ["director"],
        },
        {
            icon: <AssessmentIcon className="icon" />,
            label: "Отчёт",
            path: "/report",
            allowedRoles: ["director"],
        }
    ];

    return (
        <AppBar position="static" className="navbar" style={{ backgroundColor: '#FFE98A', color: 'black' }}>
            <Toolbar className="toolbar" style={{ justifyContent: 'center' }}>
                <Box display="flex" justifyContent="space-between" width="100%">
                    {isMobile ? (
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                PaperProps={{
                                    sx: { backgroundColor: '#FFE98A', color: 'black' },
                                }}
                            >
                                <Box
                                    role="presentation"
                                    onClick={toggleDrawer(false)}
                                    onKeyDown={toggleDrawer(false)}
                                    sx={{ backgroundColor: '#FFE98A', height: '100%' }}
                                >
                                    <List>
                                        {menuItems.map((item, index) => (
                                            <ListItem
                                                button
                                                key={index}
                                                onClick={() => handleNavigation(item.path, item.allowedRoles)}
                                            >
                                                <ListItemIcon sx={{ color: 'black' }}>{item.icon}</ListItemIcon>
                                                <ListItemText primary={item.label} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box display="flex" justifyContent="center" flexGrow={1}>
                            {menuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    onClick={() => handleNavigation(item.path, item.allowedRoles)}
                                    className="nav-item"
                                >
                                    {item.icon}
                                    <span className="label">{item.label}</span>
                                </Button>
                            ))}
                        </Box>
                    )}
                    <Button
                        color="inherit"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'auto',
                            height: 'auto',
                            padding: 10,
                        }}
                        onClick={handleLogout}
                    >
                        <ExitIcon style={{ width: '24px', height: '24px' }} />
                        <span style={{ fontSize: '12px' }}>Выйти</span>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
