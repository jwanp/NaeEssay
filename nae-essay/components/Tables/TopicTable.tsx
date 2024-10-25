'use client';

import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface Data {
    title: string;
    author: string;
    date: string;
    bookmarks: number;
    essays: number;
}

function createData(title: string, author: string, date: string, bookmarks: number, essays: number): Data {
    return { title, author, date, bookmarks, essays };
}

const rows: Data[] = [
    createData(
        'Cupcake Cupcake Cupcake Cupcake Cupcake Cupcake Cupcake Cupcake Cupcake Cupcake Cupcake ',
        'jwanp',
        '3.7',
        67,
        4.3
    ),
    createData('Donut', 'jwanp', '25.0', 51, 4.9),
    createData('Eclair', 'jwanp', '16.0', 24, 6.0),
    createData('Frozen yoghurt', 'jwanp', '6.0', 24, 4.0),
    createData('Gingerbread', 'jwanp', '16.0', 49, 3.9),
    createData('Honeycomb', 'jwanp', '3.2', 87, 6.5),
    createData('Jelly Bean', 'jwanp', '0.0', 94, 0.0),
    createData('Ice cream sandwich', 'jwanp', '9.0', 37, 4.3),
    createData('KitKat', 'jwanp', '26.0', 65, 7.0),
    createData('Lollipop', 'jwanp', '0.2', 98, 0.0),
    createData('Marshmallow', 'jwanp', '0', 81, 2.0),
    createData('Nougat', 'jwanp', '19.0', 9, 37.0),
    createData('Oreo', 'jwanp', '18.0', 63, 4.0),
];

let topics = [
    {
        title: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
        author: 'Malcolm Lockyer',
        date: '1961',
        bookmarks: 5,
        essays: 10,
    },
    {
        title: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
        author: 'Malcolm Lockyer',
        date: '1961',
        bookmarks: 5,
        essays: 10,
    },
    {
        title: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
        author: 'Malcolm Lockyer',
        date: '1961',
        bookmarks: 5,
        essays: 10,
    },
    {
        title: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
        author: 'Malcolm Lockyer',
        date: '1961',
        bookmarks: 5,
        essays: 10,
    },
];

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    id: keyof Data;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'author', numeric: true, disablePadding: false, label: 'Author' },
    { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
    { id: 'bookmarks', numeric: true, disablePadding: false, label: 'bookmarks' },
    { id: 'essays', numeric: true, disablePadding: false, label: 'essays' },
];

const useStyles = makeStyles()((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

interface EnhancedTableHeadProps {
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}>
                        <TableSortLabel className="font-thin text-base" color="green">
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles()((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.mode === 'light'
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85),
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark,
              },
    title: {
        flex: '1 1 100%',
    },
}));

interface EnhancedTableToolbarProps {
    numSelected: number;
}

export default function AdvTable() {
    const { classes } = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');

    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table">
                        <EnhancedTableHead rowCount={topics.length} />
                        <TableBody>
                            {topics.map((row, index) => {
                                const isItemSelected = isSelected(row.title);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.title)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.title}
                                        selected={isItemSelected}>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell component="th" id={labelId} scope="row" padding="none">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="right">{row.author}</TableCell>
                                        <TableCell align="right">{row.date}</TableCell>
                                        <TableCell align="right">{row.bookmarks}</TableCell>
                                        <TableCell align="right">{row.essays}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
        </div>
    );
}
