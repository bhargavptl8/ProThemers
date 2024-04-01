import * as React from 'react';
import { styled, useTheme, Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Stack, useMediaQuery, Hidden } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

//mui icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


//React icon
import { LiaThemeco } from "react-icons/lia";
import { BsGrid } from "react-icons/bs";
import { GoProject } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";


// Pages 
import Dashboard from './Dashboard';
import AdminProjects from './AdminProjects';
import AdminCategory from './AdminCategory';
import Error404 from '../Error404';

// import { useHistory } from "react-router-dom";

import {
  // BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  // Link
} from "react-router-dom";
import { useEffect } from 'react';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const drawerWidth = 270;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Mainbody = () => {

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let history = useHistory();
  // console.log("history", history);


  const handleDrawer = () => {
    setOpen(!open);
  }

  const adminLogout = () => {
    localStorage.setItem('adminToken', '');
    history.push('/admin/login');
  }




  //Pages 

  const AdminPages = [

    {
      page: 'Dashboard',
      icon: <BsGrid />,
      path: '/admin'
    },
    {
      page: 'Project',
      icon: <GoProject />,
      path: '/admin/Project'
    },
    {
      page: 'Category',
      icon: <MdOutlineCategory />,
      path: '/admin/category'
    }


  ]


  // use for screen breakpoint 
  // const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <>


      <Box sx={{ flexGrow: 1, position: "sticky", top: 0 }} zIndex={1030} >

        <AppBar position="static" sx={{ backgroundColor: '#fff' }} >
          <Toolbar  >

            <Stack spacing={1} direction="row" alignItems="center" sx={{ width: "20%" }}>
              <LiaThemeco size={32} className='primary-color' />
              <Typography
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                className='secondary-color'
                sx={{
                  marginLeft: '5px!important',
                  marginTop: '4px!important',
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 600,
                  fontSize: "24px",
                  textDecoration: 'none',
                }}
              >
                Themer<span className='primary-color'>'</span>s
              </Typography>

            </Stack>


            <IconButton
              size="large"
              color="inherit"
              aria-label="open drawer"
              sx={{ mx: { md: "15px", xs: "5px" } }}
              onClick={handleDrawer}

            // sx={{ mr: 2, ...(open && { display: 'none' }) }}

            >
              <MenuIcon sx={{ fontSize: 30 }} className='secondary-color' />
            </IconButton>


            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: "center" }}>

              <Button variant="contained" sx={{ borderRadius: '8px', textTransform: 'capitalize' }} className='bg-primary' size={isSm ? 'medium' : 'small'} onClick={adminLogout} >Logout</Button>

            </Box>
          </Toolbar>
        </AppBar>
        {/* </ThemeProvider> */}
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <CssBaseline />

        <Drawer
          sx={{
            width: drawerWidth,
            zIndex: isLG ? 1 : 1200,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant={isLG ? "persistent" : "temporary"}
          anchor="left"
          onClose={handleDrawer}
          open={open}
        >

          {/* <Hidden lgUp> */}
          <DrawerHeader>
            <Hidden lgUp>
              <Stack spacing={1} direction="row" justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
                <LiaThemeco size={32} className='primary-color' />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  className='secondary-color'
                  sx={{
                    mr: 2,
                    // display: 'flex' ,
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: "24px",
                    color: "#012970",
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Themer<span className='primary-color'>'</span>s
                </Typography>

              </Stack>

              <IconButton onClick={handleDrawer}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Hidden>
          </DrawerHeader>
          {/* </Hidden> */}

          <Divider />

          <Box sx={{ padding: "20px 0px 70px" }}>
            <List>
              {AdminPages.map((adminPage) => (
                <ListItem key={adminPage.page} sx={{ padding: "0px 20px" }}>
                  <ListItemButton onClick={() => { history.push(adminPage.path); if (!isLG) { handleDrawer(); } }}>
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      {adminPage.icon}
                    </ListItemIcon>
                    <ListItemText primary={adminPage.page} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

          </Box>

        </Drawer>
                
        <Main open={open} position='relative' sx={{ maxWidth: "100%" }} className='bg-default'>
          <CssBaseline />
          <Toolbar sx={{ position: 'absolute', left: '0px', right: '0px', top: '-65px' }} id="back-to-top-anchor" />


          <Switch>
            <Route exact path='/admin' >
              <Dashboard />
            </Route>
            <Route path='/admin/Project'>
              <AdminProjects />
            </Route>
            <Route path='/admin/category'>
              <AdminCategory />
            </Route>
            <Route path='*'>
              <Error404 />
            </Route>
          </Switch>

        </Main>

      </Box>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Mainbody;