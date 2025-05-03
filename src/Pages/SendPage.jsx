import React from 'react';
import DataTable from '../Components/DataTable';
import NavBar from "../Components/NavBar";
import "../Styles/TakePage.css"
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

const SendPage = () => {
    const navigate = useNavigate();

    const handleSendGoods = () => {
        navigate('/send/send-goods');
    };

    return (
        <div>
            <NavBar/>
            <div className="Table">
                <DataTable/>
            </div>
            <div className="take-button">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendGoods}
                    sx={{mt: 2}}
                >
                    Отпустить товар
                </Button>
            </div>
        </div>
    );
};

export default SendPage;
