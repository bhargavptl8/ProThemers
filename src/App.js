import * as React from 'react';
import PropTypes from 'prop-types';
import { useScrollTrigger, Box, Fab, Fade, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


// components
// import Header from './Components/Header';


// Pages 
import LandingPage from './Pages/LandingPage';
import Category from './Pages/Category';
import Details from './Pages/Details';
import AdminMainPage from './Pages/Admin/AdminMainPage';
import UserMainPage from './Pages/User/UserMainPage';
import AdminLogin from './Pages/Admin/AdminLogin';
import Error404 from './Pages/Error404';

// component 
import AdminProtect from './Components/AdminProtect';
import Protect from './Components/Protect';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

//css
import './App.css';


function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    ).scrollIntoView({ behavior: 'smooth' });

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function App(props) {

  const theme = createTheme(
    {
      typography: {
        fontFamily: '"Nunito", sans-serif',
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
          @font-face {
            font-family: 'Nunito';
            font-style: normal;
            // font-weight: 100!important;
            font-display: swap;
            src: local('Nunito Regular'), local('Nunito-Regular'), 
             url(https://fonts.gstatic.com/s/nunito/v11/XRXV3I6Li01BKofINeaBTMnFcQ.woff2) 
             format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, 
              U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, 
              U+2215, U+FEFF, U+FFFD;
          }
          `,
        },
      },
    }
  );

  return (
    <>

      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Switch>
            <Route exact path='/'>
              {/* <Header /> */}
              <LandingPage />
            </Route>
            <Route path='/category'>
              <Category />
            </Route>
            <Route path='/detail'>
              <Details />
            </Route>


            <Route path='/user'>
              <Protect>
                <UserMainPage />
              </Protect>
            </Route>

            <Route path='/admin/login'>
              <AdminLogin />
            </Route>
            <Route path='/admin'>
              <AdminProtect>
                <AdminMainPage />
              </AdminProtect>
            </Route>
            
            <Route path='*'>
              <Error404 />
            </Route>

          </Switch>

          <ScrollTop {...props}>
            <Fab size="small" aria-label="scroll back to top" className='scroll-top' >
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </ThemeProvider>

      </Router>


    </>
  );
}

export default App;
