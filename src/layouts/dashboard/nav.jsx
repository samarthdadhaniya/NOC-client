import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import { CgProfile } from "react-icons/cg";

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';

import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();

  const { currentUser } = useSelector((state) => state.user);

  const upLg = useResponsive('up', 'lg');
  const navigate = useNavigate();
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  console.log(currentUser);
  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
   

      <NavItem
        key="Application"
        item={{
          title: "Application",
          path: "/",
          icon: <IoHome fontSize={"22px"} />
        }}
      />



      {navConfig.map((item) => (
        // Check if the item is meant for admins and currentUser is an admin
        (!item.admin || (item?.admin && currentUser?.isAdmin)) &&
        <NavItem key={item.title} item={item} />

      ))}

      {currentUser.rootAdmin && <NavItem
        key="Application"
        item={{
          title: "User",
          path: "/users",
          icon: <CgProfile fontSize={"22px"} />
        }}
      />}

    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* <Logo sx={{ mt: 3, ml: 4 }} /> */}

      <Box
        sx={{
          my: 3,
          mx: 2.5,
          py: 2,
          px: 2.5,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          cursor: 'pointer',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        }}
        onClick={() => {
          navigate("/profile")
        }}
      >
        {/* here come url */}
        <Avatar src={currentUser?.profileImage?.imgUrl || account.photoURL} alt="photoURL" />

        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">{currentUser?.firstName}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {account.role}
          </Typography>
        </Box>
      </Box>

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
