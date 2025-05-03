import React from 'react';
import DataTable from '../Components/DataTable';
import NavBar from "../Components/NavBar";
import "../Styles/TakePage.css"
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

const TakePage = () => {
    const navigate = useNavigate();

    const handleTakeGoods = () => {
        navigate('/take/take-goods');
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
                    onClick={handleTakeGoods}
                    sx={{mt: 2}}
                >
                    Принять товар
                </Button>
            </div>
        </div>
    );
};

export default TakePage;
