import React, { useEffect, useState } from "react";
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
import CertificateService from "src/backend/CertificateService";
import { signInSuccess } from "src/redux/User/userSlice";
import { addCertificates } from "src/redux/User/certificateSlice";

export default function AdminForm({ pending, reject, approve }) {
    const [certificates, setCertificates] = useState([]);
    const [sortOrder, setSortOrder] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
    const [certificateDatas,setcertificateDatas] = useState([]);
    const { certificateData } = useSelector(state => state.certificate);
    const { currentUser } = useSelector(state => state.user);

    const [open, setOpen] = React.useState(false);

    const dispatch = useDispatch();
    const [certificate, setCertificate] = useState("");
    const handleClose = () => {
        setOpen(false);
    };


    const tableHeadings = {
        'student.student_name': 'Name',
        'student.student_id': 'Id',
        'student.student_sem': 'Sem',
        'student.student_phoneNo': 'Phone No',
        'college.college_name': 'College Name',
        'college.college_branch': 'College Branch',
        'certificateStatus': 'Certificate Status',
        'View': 'view',
        "createdAt": 'Certificate Issue Date'
    };

    useEffect(() => {
        const token = currentUser?.accessToken;
        CertificateService.getAllCertificate(token).then((val) => {
            setcertificateDatas(val.data.certificate)
            setSortOrder({ studentName: 'asc' });
        }).catch((error) => {
            console.log(error);
        })

    }, [certificateData,currentUser]);

    useEffect(() => {

        if (pending) {
            const pendingCertificates = certificateDatas.filter((certificate) => certificate.certificate_status === 'pending');
            setCertificates(pendingCertificates);
        }

        if (reject) {
            const rejectCertificates = certificateDatas.filter((certificate) => certificate.certificate_status === 'false');
            setCertificates(rejectCertificates);
        }
        if (approve) {
            const approveCertificates = certificateDatas.filter((certificate) => certificate.certificate_status == 'true');
            setCertificates(approveCertificates);
        }

    }, [certificateDatas])

    console.log(certificateData);

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

    const filteredCertificates = certificates.filter((certificate) => {
        const isMatchedCollege = selectedCollege === '' || certificate.college.college_name === selectedCollege;
        const isMatchedSearch = certificate.student.student_name.toLowerCase().includes(searchQuery);
        return isMatchedCollege && isMatchedSearch;
    });

    const sortedCertificates = filteredCertificates.slice().sort((a, b) => {
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedCertificates.length - page * rowsPerPage);
    console.log(certificateDatas);


    return (

        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Certificate History</Typography>
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

                    <TextField
                        id="select-currency"
                        select
                        sx={{ width: "180px", marginLeft: "10px" }}
                        label="College"
                        defaultValue="2"
                        name='college_branch'
                        value={selectedCollege}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="CSPIT">CSPIT</MenuItem>
                        <MenuItem value="">All Select</MenuItem>
                    </TextField>
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
                                {sortedCertificates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
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
                                        <TableCell>{item.student?.student_id}</TableCell>
                                        <TableCell>{item.student?.student_sem}</TableCell>
                                        <TableCell>{item.student?.student_phoneNo}</TableCell>
                                        <TableCell>{item.college?.college_name}</TableCell>
                                        <TableCell>{item.college?.college_branch}</TableCell>
                                        <TableCell>
                                            <Label color={(item?.certificate_status === 'true' ? 'success' : (item?.certificate_status === 'false' ? 'error' : 'warning'))}>
                                                {item?.certificate_status === 'false' && 'rejected'}
                                                {item?.certificate_status === 'true' && 'success'}
                                                {item?.certificate_status === 'pending' && 'pending'}
                                            </Label>

                                        </TableCell >
                                        <TableCell sx={{ cursor: "pointer", color: "blue", textAlign: "left" }} onClick={() => {
                                            setOpen(true);
                                            setCertificate(item);
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
                            <CustomizedDialogs item={certificate} open={open} handleClose={handleClose}></CustomizedDialogs>
                        </Table>

                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    rowsPerPageOptions={[1, 5, 10, 25]} // Adjust options as needed
                    component="div"
                    count={sortedCertificates.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
