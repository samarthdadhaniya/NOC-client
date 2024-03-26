import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, IconButton, Typography, Button, Popover, MenuItem } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { FaPowerOff } from "react-icons/fa";
import Iconify from 'src/components/iconify';
import { NAV, HEADER } from './config-layout';
import AuthService from 'src/backend/AuthService';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearUser, removeToken, signOutUserSuccess } from 'src/redux/User/userSlice';
import { clearCertificate } from 'src/redux/User/certificateSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token ,currentUser} = useSelector((state) => state.user);
  const accesstoken = currentUser?.accessToken;
  const handleLogout = () => {
    AuthService.logout(accesstoken)
      .then((data) => {
        navigate("/login");
        dispatch(signOutUserSuccess());
        dispatch(removeToken());
        dispatch(clearUser())
        dispatch(clearCertificate())
        toast.success(data.message);
      }).catch((error) => {
        toast.error(error)
      })
  }

  return (
    <AppBar
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Box
        sx={{
          my: 3,
          mx: 2.5,
          py: 2,
          px: 2.5,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        }}
      >

        {!lgUp && (
          <IconButton onClick={onOpenNav} sx={{ mr: 1 }} >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        )}

        <Stack direction="row" width={"100%"} justifyContent={"space-between"} alignItems="center" spacing={1}>
          <Typography variant="h4" sx={{ mb: 5, color: "black", textAlign: "center" }}>
            Noc Certificate Generator
          </Typography>


          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>

          <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { width: 140 },
            }}
          >
  
          <MenuItem onClick={()=>{
            handleCloseMenu()
            handleLogout();
          }} sx={{ color: 'error.main' }}>
          
            <Iconify icon="material-symbols:logout-sharp" sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Popover>

          {/* <Button variant='contained' color='error' sx={{ borderRa: "100%" }}
            onClick={handleLogout}
          >
            <FaPowerOff size={"25px"} />
          </Button> */}
        </Stack>
      </Box>

    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};