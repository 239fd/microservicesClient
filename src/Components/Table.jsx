import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import "../Styles/Table.css"

const useStyles = makeStyles({
    tableContainer: {
        maxHeight: 700,
    },
    tableRow: {
        height: 60,
    },
});

const TableComponent = ({ data }) => {
    const classes = useStyles();

    const rows = [...data];
    while (rows.length < 17) {
        rows.push({ id: '', name: '', date: '' });
    }

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow >
                        <TableCell align={"center"}>Уникальный номер</TableCell>
                        <TableCell align={"center"}>Наименование</TableCell>
                        <TableCell align={"center"}>Дата поступления</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index} className={classes.tableRow}>
                            <TableCell align={"center"}>{row.id}</TableCell>
                            <TableCell align={"center"}>{row.name}</TableCell>
                            <TableCell align={"center"}>{row.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponent;
