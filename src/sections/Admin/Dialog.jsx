import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import { IoMdClose as CloseIcon } from "react-icons/io";
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { updateCertificate } from 'src/redux/User/certificateSlice';
import CertificateService from 'src/backend/CertificateService';
import { toast } from 'react-toastify';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs({ open, handleClose, item }) {

    const user = useSelector((state) => state.user)

    const dispatch = useDispatch();

    const handleUpdate = (status) => {
        CertificateService.updateCertificate(status, item._id, user?.token?.accessToken)
            .then((val) => {
                toast.success(val.message);
                dispatch(updateCertificate({ item, status,updated_at:val?.data?.certificate?.updatedAt }))
            }).catch((error) => {
                toast.error(error)
            })
    }
    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers >
                    <Typography variant='h4' sx={{ marginBottom: "10px" }}>
                        Student Details
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>Name :{item?.student?.student_name}</div>
                        <div>Email :{item?.student?.student_email}</div>
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>Sem :{item?.student?.student_sem}</div>
                        <div>Phone :{item?.student?.student_phoneNo}</div>
                    </Typography>
                    <hr></hr>

                    <Typography variant='h4' sx={{ marginBottom: "10px" }}>
                        College Details
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>College : {item?.college?.college_name}</div>
                        <div>Branch : {item?.college?.college_branch}</div>
                    </Typography>

                    <hr></hr>

                    <Typography variant='h4' sx={{ marginBottom: "10px" }}>
                        Hr Details
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>Name : {item?.hr?.hr_name}</div>
                        <div>Email : {item?.hr?.hr_email}</div>
                    </Typography>

                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>Name : {item?.hr?.hr_phoneNo}</div>
                    </Typography>
                    <hr></hr>

                    <Typography variant='h4' sx={{ marginBottom: "10px" }}>
                        Company Details
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>College : {item?.company?.company_name}</div>
                        <div>Branch : {item?.company?.company_location}</div>
                    </Typography>

                    <hr />
                    <Typography variant='h4' sx={{ marginBottom: "10px" }}>
                        Internship Details
                    </Typography>
                    <Typography variant='h5' sx={{ fontWeight: "100", justifyContent: "space-between", gap: "100px", fontSize: "20px", display: "flex" }}>
                        <div>Start Date : {item?.internship_ending_date}</div>
                        <div>End Date : {item?.internship_ending_date}</div>
                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => {
                        handleClose()
                        handleUpdate("false")
                    }} color='error' variant='contained'>
                        Reject
                    </Button>
                    <Button autoFocus onClick={() => {
                        handleClose()
                        handleUpdate("true")
                    }} variant='contained' color='info'>
                        Approve
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}