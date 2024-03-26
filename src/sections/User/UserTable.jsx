import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable } from "react-table";
import {
    Avatar,
    Card,
    Container,
    IconButton,
    InputAdornment,
    MenuItem,
    OutlinedInput,
    Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
import Scrollbar from "src/components/scrollbar";
import CustomizedDialogs from "./Dialog";
import AuthService from "src/backend/AuthService";

export default function UserForm({ pending, reject, approve }) {
    const [sortOrder, setSortOrder] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
    const [users, setUsers] = useState([]);
    const { currentUser } = useSelector(state => state.user);
    const [open, setOpen] = React.useState(false);
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("")

    const handleClose = () => {
        setOpen(false);
    };


    const tableHeadings = {
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'email': 'Email',
        'isAdmin': 'Role',
        'View': 'Change Role',
        "createdAt": 'User created'
    };

    useEffect(() => {
        const token = currentUser?.accessToken;
        setToken(token);
        if (token) {
            AuthService.getAllUser(token).then((val) => {
                setUsers(val.data.users);
                setSortOrder({ name: 'asc' });
            }).catch((error) => {
                console.log(error);
            })
        }

    }, [currentUser, reloadUserData]);

    function reloadUserData() {
        const token = currentUser?.accessToken;
        console.log("dw");
        AuthService.getAllUser(token).then((val) => {
            setUsers(val.data.users);
            setSortOrder({ name: 'asc' });
        }).catch((error) => {
            console.log(error);
        })
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleSelectChange = (event) => {
        setSelectedCollege(event.target.value);
    };

    const handleSort = (column) => {
        setSortOrder((prevState) => ({
            ...Object.keys(prevState).reduce((acc, key) => {
                if (key !== column) {
                    acc[key] = null;
                }
                return acc;
            }, {}),
            [column]: prevState[column] === 'asc' ? 'desc' : 'asc',
        }));
    };

    // for search Data
    const searchData = users.filter((value) => {
        return value.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const sortedUsers = searchData.slice().sort((a, b) => {
        const column = Object.keys(sortOrder).find(key => sortOrder[key]);
        const order = sortOrder[column] || 'asc';
        const keys = column.split('.'); // Split the string by dot
        const valueA = keys.reduce((obj, key) => obj[key], a); // Traverse the object to access the nested property
        const valueB = keys.reduce((obj, key) => obj[key], b); // Traverse the object to access the nested property


        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return order === 'asc' ? valueA - valueB : valueB - valueA;
        }
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedUsers.length - page * rowsPerPage);

    return (

        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">All User</Typography>
            </Stack>
            <Card>
                <Toolbar
                    sx={{
                        height: 96,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <OutlinedInput
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search user..."
                        startAdornment={
                            <InputAdornment position="start">
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                                />
                            </InputAdornment>
                        }
                    />

                </Toolbar>
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" />
                                    {Object.entries(tableHeadings).map(([key, heading], index) => (
                                        <TableCell key={key}>
                                            <TableSortLabel
                                                active={sortOrder[key]}
                                                direction={sortOrder[key] || 'asc'}
                                                onClick={() => handleSort(key)}
                                            >
                                                {heading}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index} hover tabIndex={-1} role="checkbox">
                                        <TableCell padding="checkbox" />
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" spacing={2}>

                                                <Typography variant="subtitle2" noWrap>
                                                    {index + 1}
                                                </Typography>
                                                <Typography variant="subtitle2" noWrap>
                                                    {item.student?.student_name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{item?.firstName}</TableCell>
                                        <TableCell>{item?.email}</TableCell>
                                        <TableCell>
                                            <Label color={(item?.isAdmin === true ? 'warning' : 'success')}>
                                                {item?.isAdmin === false && 'User'}
                                                {item?.isAdmin === true && 'Admin'}
                                            </Label>

                                        </TableCell >
                                        <TableCell sx={{ cursor: "pointer", color: "blue", textAlign: "left" }} onClick={() => {
                                            setOpen(true);
                                            setUserId(item._id);
                                        }}>View</TableCell>
                                        <TableCell>
                                            {item?.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={Object.keys(tableHeadings).length + 1} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <CustomizedDialogs
                                userID={userId}
                                token={currentUser?.accessToken}
                                open={open}
                                handleClose={handleClose}
                                reloadUserData={reloadUserData}
                            ></CustomizedDialogs>
                        </Table>

                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    rowsPerPageOptions={[1, 5, 10, 25]}
                    component="div"
                    count={sortedUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
