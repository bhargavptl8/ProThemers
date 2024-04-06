import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, CssBaseline, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, useMediaQuery, useTheme, Container, Divider, Tooltip, Avatar, ListItemIcon } from '@mui/material';

//Mui icon 
import MoreIcon from '@mui/icons-material/MoreVert';
import { IoLogOutOutline } from "react-icons/io5";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//React icon
import { LiaThemeco } from "react-icons/lia";
import { BsPerson } from "react-icons/bs";

// pages 

import UserProjects from './UserProjects';
import UserProfile from './UserProfile';
import Error404 from '../Error404';


import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';

import { toast } from 'react-toastify';


const UserMainPage = () => {

  const theme = useTheme();

  const history = useHistory();

  // use for screen breakpoint 

  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  const [userData, setUserData] = useState()

  const getUserData = () => {

    let Token = localStorage.getItem('loginToken');

    axios.get('https://prothemer-s-backend-1.onrender.com/users/read', { headers: { Authorization: Token } })
      .then((res) => {
        // console.log(res);
        setUserData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  console.log('userData', userData);


  useEffect(() => {
    getUserData();
  }, [])

  const Update = () => {
    getUserData();
  }



  // for profileMenu 
  const [profileMenu, setProfileMenu] = React.useState(null);
  const isProfileMenuOpen = Boolean(profileMenu);

  const handleProfileMenuOpen = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileMenu(null);
    // handleMobileMenuClose();
  };

  const profileMenuId = 'Profile-Menu';
  const renderProfileMenu = (
    <Menu
      anchorEl={profileMenu}
      id="profileMenuId"
      // keepMounted  
      open={isProfileMenuOpen}
      onClose={handleMenuClose}
      // onClick={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          // overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}

    >
     
      <MenuItem sx={{ padding: '10px 30px', cursor: 'default' }} disableRipple >
        <Stack direction='column'>
          <Typography fontSize='18px' textAlign='center'>
           {userData?.fname.charAt(0).toUpperCase()+userData?.fname.substring(1) + ' ' + userData?.lname}
          </Typography>
          {userData?.job ? (
          <Typography color='#8a8a8a' fontSize='14px' textAlign='center'>
            {userData?.job}
          </Typography>
          ): ''}
        </Stack>
      </MenuItem>
      <Divider sx={{ margin: '2px!important' }} />
      <MenuItem onClick={() => { history.push('/user/profile'); handleMenuClose(); handleMobileMenuClose();}}>
        <ListItemIcon sx={{ minWidth: '30px!important' }}>
          <BsPerson size={20} />
        </ListItemIcon>
        My Profile
      </MenuItem>
      <Divider sx={{ margin: '2px!important' }} />
      <MenuItem onClick={() => {
        handleMenuClose();
        localStorage.setItem('loginToken', '');
        history.push('/');
        let Token = localStorage.getItem('loginToken');
        if (!Token) {
          toast("Logout successFully");
        }
        else {
          toast("Try again");
        }
      }}>
        <ListItemIcon sx={{ minWidth: '30px!important' }}>
          <IoLogOutOutline size={20} />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  // For MobileMenu
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const mobileMenuId = 'mobile-menu';

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}

    >
      <MenuItem disableRipple sx={{ minHeight: 'auto' }} >
        <IconButton
          size="large"

          aria-label="account of current user"
          aria-controls={profileMenuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          disableRipple
          sx={{ padding: '0px' }}
        >
          <Tooltip title="Profile Settings">
            <Stack direction="row">
              <Avatar alt={userData?.fname.toUpperCase()} className='bg-secondary' sx={{ width: 34, height: 34 }} src={`https://prothemer-s-backend-1.onrender.com/images/${userData?.profilepic}`}></Avatar>
              <Button
                size='small'
                variant="contained"
                disableElevation
                endIcon={<KeyboardArrowDownIcon />}
                disableRipple
                sx={{ textTransform: 'capitalize', fontSize: "15px", paddingRight: "0px" }}
                className='profileBTN'
              >
                {userData?.fname.charAt(0) + '. ' + userData?.lname}
              </Button>

            </Stack>
          </Tooltip>
        </IconButton>
      </MenuItem>
      {/* <MenuItem onClick={handleMobileMenuClose} sx={{ minHeight: 'auto' }} >
        <BsBoxArrowRight style={{ marginRight: '8px' }} /> Logout
      </MenuItem> */}
    </Menu>
  );










  return (
    <>
      <Box sx={{ flexGrow: 1, position: "sticky", top: 0 }} zIndex={1030} >

        <AppBar position="static" className='bg-default' >
          <Toolbar >

            <Stack spacing={1} direction="row" alignItems="center">
              <LiaThemeco size={32} className='primary-color' />
              <Typography
                noWrap
                component="a"
                onClick={() => history.push('/')}
                className='secondary-color'
                sx={{
                  marginLeft: '5px!important',
                  marginTop: '4px!important',
                  fontWeight: 600,
                  fontSize: "24px",
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                Themer<span className='primary-color'>'</span>s
              </Typography>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: "center" }}>

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={profileMenuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                disableRipple
              >
                <Tooltip title="Profile Settings">
                  <Stack direction="row">
                    <Avatar alt={userData?.fname.toUpperCase()} className='bg-secondary' sx={{ width: 34, height: 34 }} src={`https://prothemer-s-backend-1.onrender.com/images/${userData?.profilepic}`}></Avatar>
                    <Button
                      size='small'
                      variant="contained"
                      disableElevation
                      endIcon={<KeyboardArrowDownIcon />}
                      disableRipple
                      sx={{ textTransform: 'capitalize', fontSize: "15px", paddingRight: "0px" }}
                      className='profileBTN'
                    >
                      {userData?.fname.charAt(0) + '. ' + userData?.lname}
                    </Button>

                  </Stack>
                </Tooltip>
              </IconButton>

              {/* <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} className='bg-primary' size={isSm ? 'medium' : 'small'} >Logout</Button> */}

            </Box>

            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ padding: '0px' }}
              >
                <MoreIcon className='secondary-color' />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {isSm ? '' : renderMobileMenu}
      </Box>

      <Box component='main' position='relative' padding='24px' className='bg-default'>
        <CssBaseline />
        <Toolbar sx={{ position: 'absolute', left: '0px', right: '0px', top: '-65px' }} id="back-to-top-anchor" />
        <Container fixed>

          {/* <UserProjects /> */}

          <Switch>
            <Route exact path='/user'>
              <UserProjects />
            </Route>
            <Route path='/user/profile'>
              <UserProfile Update={Update} />
            </Route>
            <Route path='*'>
              <Error404 />
            </Route>
          </Switch>

        </Container>
        {renderProfileMenu}

      </Box>
    </>
  )
}

export default UserMainPage;