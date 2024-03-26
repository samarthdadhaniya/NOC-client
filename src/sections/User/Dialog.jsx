import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { IoMdClose as CloseIcon } from "react-icons/io";
import AuthService from 'src/backend/AuthService';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs({ open, handleClose, token, userID ,reloadUserData}) {
    const handleUpdate = (status) => {
        console.log(userID);
        console.log(token);
        AuthService.updateAdmin(status,userID,token).then((val)=>{
            console.log(val);
        }).catch((error)=>{
            console.log(error);
        })
        reloadUserData();
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
                        Change Role
                    </Typography>
                    <Typography gutterBottom>
                        Are you sure you want to change user role?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => {
                        handleClose()
                        handleUpdate("false")
                    }} color='success' variant='contained'>
                        User
                    </Button>
                    <Button autoFocus onClick={() => {
                        handleClose()
                        handleUpdate("true")
                    }} variant='contained' color='info'>
                        Admin
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}