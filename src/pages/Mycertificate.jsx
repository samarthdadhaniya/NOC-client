import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import Scrollbar from "src/components/scrollbar";
import CertificateService from "src/backend/CertificateService";
import Label from "src/components/label/label";
import { toast } from "react-toastify";

export default function MyCertificatePage() {
  const [certificates, setCertificates] = useState([]);
  const [sortOrder, setSortOrder] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // const { certificateData } = useSelector(state => state.certificate);
  const { currentUser } = useSelector(state => state.user);

  const tableHeadings = {
    'student.student_name': 'Name',
    'student.student_id': 'Id',
    'student.student_sem': 'Sem',
    'student.student_phoneNo': 'Phone No',
    'college.college_name': 'College Name',
    'college.college_branch': 'College Branch',
    'certificateStatus': 'Certificate Status',
    'createdAt': 'Issue Date'
  };


  useEffect(() => {
    const token = currentUser?.accessToken
    CertificateService.getUserCertificate(token).then((val)=>{
      const certificateData = val.data.certificate
      setCertificates(certificateData)
      setSortOrder({ studentName: 'asc' });
    }).catch((error)=>{
      toast.error(error)
    })    
  }, [currentUser]);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sortedCertificates = certificates.slice().sort((a, b) => {
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, certificates.length - page * rowsPerPage);

  return (
    <Container>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">Certificate History</Typography>
      </Toolbar>
      <Card>
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
                        {currentUser?.profileImage?.imgUrl ? (
                          <Avatar alt="s" src={currentUser.profileImage?.imgUrl} />
                        ) : (
                          <Avatar alt="s" />
                        )}
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
                    </TableCell>
                    <TableCell>{item?.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={Object.keys(tableHeadings).length + 1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]} // Adjust options as needed
          component="div"
          count={certificates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}