import React, { useEffect, useState } from 'react';
import { Avatar, Backdrop, Box, Button, Checkbox, Container, Divider, Fade, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, ListItemIcon, Menu, MenuItem, Modal, OutlinedInput, Stack, Tab, Tabs, TextField, Toolbar, Tooltip, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
// import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';


//Mui icon 
import MoreIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IoLogOutOutline } from "react-icons/io5";

//React icon
import { LiaThemeco } from "react-icons/lia";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsGrid, BsPerson } from "react-icons/bs";

import { useHistory } from "react-router-dom";
import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const drawerWidth = 270;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // width: `calc(100% - ${drawerWidth}px)`,
    // marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


//Modal 
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


// const StyledInput = styled('input')({
//   display: 'none', // Hide the input element
// });

const StyledButton = styled(Button)({
  backgroundColor: '#4014147d',
  borderRadius: '15px',
  color: 'white',
  fontSize: '13px',
  textTransform: 'capitalize',
  padding: '5px 12px'
});

//grid paper-box
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));


const Header = ({ loadData }) => {

  const theme = useTheme();

  const history = useHistory();

  // header tabs

  const [value, setValue] = React.useState();

  useEffect(() => {
    setValue(Number(sessionStorage.getItem('value')));
  }, [])


  //  console.log('value',value);

  // const handleChange = (event, newValue) => {
  //   setValue(sessionStorage.getItem('value'));
  // };

  // console.log('value',value);


  // breakPoints  
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  let LoginToken = localStorage.getItem('loginToken');


  // category Data 
  const [categoryData, setCategoryData] = useState([]);


  const getCategoryData = () => {

    axios.get('http://localhost:3000/admin/category/read')
      .then((res) => {
        // console.log(res);
        setCategoryData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const [userData, setUserData] = useState()

  const getUserData = () => {

    let Token = localStorage.getItem('loginToken');

    axios.get('http://localhost:3000/users/read', { headers: { Authorization: Token } })
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
    getCategoryData();
    getUserData();
  }, [])

  console.log('categoryData====', categoryData);


  const [OTP, setOTP] = useState();

  console.log('otp', OTP);

  const getOTP = (email) => {


    axios.post('http://localhost:3000/users/login/check', { email: email })
      .then((res) => {
        // console.log(res);
        setOTP(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })

  }


  const [showPassword, setShowPassword] = useState(
    {
      signinPassword: false,
      signupPassword: false,
      forgetpasswordPassword: false,
      forgetpasswordConfirmPassword: false
    }
  );


  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  // sign-in 

  const [signinData, setSigninData] = useState([]);

  const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required')
  });

  const formikSignIn = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: SigninSchema,
    onSubmit: (values, { setSubmitting }) => {

      // console.log('values============',values);

      let token = localStorage.getItem('token');

      axios.post('http://localhost:3000/users/login', { email: values.email, pass: values.password }, { headers: { Authorization: token } })
        .then((res) => {
          console.log(res);
          localStorage.setItem('loginToken', res.data.token)
          setSubmitting(values.email = '', values.password = '');
          handleLoginModalClose();
          getUserData();
          toast(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast(err.response.data.message);
        })

      // let copyData = [...signinData, { email: values.email, password: values.password }];

      // setSigninData(copyData);

      // setSubmitting(values.email = '', values.password = '');
    }

  })


  console.log('signinData========', signinData);



  // single file choose 
  const [userImg, setUserImg] = useState('');


  // sign-up

  const [signupData, setSignupData] = useState([]);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required'),
    userImg: Yup.mixed().test('is-match', 'Upload your img is Required', (value) => {
      if (!value) {
        return false; // Error condition
      }
      return true; // Validation passes
    })
  });

  const formikSignUp = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userImg: ''
    },

    validationSchema: SignupSchema,
    onSubmit: (values, { setSubmitting }) => {


      let formData = new FormData();

      formData.append("fname", values.firstName);
      formData.append("lname", values.lastName);
      formData.append("email", values.email);
      formData.append("pass", values.password);
      formData.append("profilepic", values.userImg);


      axios.post('http://localhost:3000/users/signup', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
        .then((res) => {
          // console.log(res);
          // console.log(res.data.token);
          localStorage.setItem('token', res.data.token)
          setSubmitting(values.firstName = '', values.lastName = '', values.email = '', values.password = '', values.userImg = '', setUserImg(''));
          handleRegisterModalClose();
          toast(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast(err.response.data.message);
        })

      // let copyData = [...signupData, { firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password, userImg: values.userImg }];

      // setSignupData(copyData);

      // setSubmitting(values.firstName = '', values.lastName = '', values.email = '', values.password = '',values.userImg='', setUserImg(''));

    }

  })


  console.log('signupData========', signupData);




  // forget-password

  // const [forgetPasswordData, setForgetPasswordData] = useState([]);

  const ForgetPasswordSchema = Yup.object().shape({
    forgetPasswordEmail: Yup.string().email('Invalid email').required('Required'),
    forgetpasswordPassword: Yup.string().min(8, 'password length 8  required').max(16, 'Too Long!').required('Required'),
    forgetpasswordConfirmPassword: Yup.string().min(8, 'password length 8  required').max(16, 'Too Long!').required('Required')
  });

  const formikForgetPassword = useFormik({
    initialValues: {
      forgetPasswordEmail: '',
      forgetpasswordPassword: '',
      forgetpasswordConfirmPassword: ''
    },
    validationSchema: ForgetPasswordSchema,
    onSubmit: (values, { setSubmitting }) => {


      if (values.forgetpasswordPassword === values.forgetpasswordConfirmPassword) {

        axios.patch('http://localhost:3000/users/login/forget-pass', { email: values.forgetPasswordEmail, pass: values.forgetpasswordPassword, confirmpass: values.forgetpasswordConfirmPassword })
          .then((res) => {
            console.log(res);
            setSubmitting(values.forgetPasswordEmail = '', values.forgetpasswordPassword = '', values.forgetpasswordConfirmPassword = '');
            handleForgetPasswordModalClose();
            toast(res.data.message);
          })
          .catch((err) => {
            console.log(err);
            toast(err.response.data.message);
          })

        // let copyData = [...forgetPasswordData, { forgetPasswordEmail: values.forgetPasswordEmail, forgetpasswordPassword: values.forgetpasswordPassword, forgetpasswordConfirmPassword: values.forgetpasswordConfirmPassword }];

        // setForgetPasswordData(copyData);

        // setSubmitting(values.forgetPasswordEmail = '', values.forgetpasswordPassword = '', values.forgetpasswordConfirmPassword = '');

      }
      else {
        toast("New Password and Confirm Password can't match!");
      }
    }
  })


  // console.log('forgetPasswordData========', forgetPasswordData);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const userId = 'user Dasboard';

  const userMenu = (
    <Menu
      // sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
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
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      <MenuItem onClick={() => { history.push('/user'); handleCloseUserMenu(); }}>
        <ListItemIcon sx={{ minWidth: '30px!important' }}>
          <BsGrid size={18} />
        </ListItemIcon>
        <Typography textAlign="center">My Dasboard</Typography>
      </MenuItem>
      <Divider sx={{ margin: '0px!important' }} />
      <MenuItem onClick={() => { history.push('/user/profile'); handleCloseUserMenu(); }}>
        <ListItemIcon sx={{ minWidth: '30px!important' }}>
          <BsPerson size={20} />
        </ListItemIcon>
        My Profile
      </MenuItem>
      <Divider sx={{ margin: '0px!important' }} />
      <MenuItem onClick={() => {
        handleCloseUserMenu();
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
  )


  // ModalLogin
  const [openModalLogin, setOpenModalLogin] = React.useState(false);
  const handleLoginModalOpen = () => setOpenModalLogin(true);
  const handleLoginModalClose = () => { setOpenModalLogin(false); formikSignIn.resetForm(); };


  // ModalRegister
  const [openRegisterModal, setRegisterOpenModal] = React.useState(false);
  const handleRegisterModalOpen = () => setRegisterOpenModal(true);
  const handleRegisterModalClose = () => { setRegisterOpenModal(false); formikSignUp.resetForm(); setUserImg(''); }

  //forgetPasswordModal

  const [openForgetPasswordModal, setOpenForgetPasswordModal] = useState(false);
  const handleForgetPasswordModalOpen = () => setOpenForgetPasswordModal(true);
  const handleForgetPasswordModalClose = () => { setOpenForgetPasswordModal(false); formikForgetPassword.resetForm(); };

  // emailVerify
  const [openEmailVerifyModal, setOpenEmailVerifyModal] = useState(false);
  const handleEmailVerifyModalOpen = () => setOpenEmailVerifyModal(true);
  const handleEmailVerifyModalClose = () => { setOpenEmailVerifyModal(false); formikEmailVerify.resetForm(); };


  //  emailVerifySchema 
  const EmailVerifySchema = Yup.object().shape({
    verifyEmail: Yup.string().email('Invalid email').required('Required')
  });

  const formikEmailVerify = useFormik({
    initialValues: {
      verifyEmail: '',
    },
    validationSchema: EmailVerifySchema,
    onSubmit: (values, { setSubmitting }) => {
      // console.log('values',values)


      axios.patch('http://localhost:3000/users/login/verify', { email: values.verifyEmail })
        .then((res) => {
          console.log(res);
          getOTP(values.verifyEmail);
          setSubmitting(values.verifyEmail = '');

          handleEmailVerifyModalClose();

          handleOTPVerifyModalOpen();

        })
        .catch((err) => {
          // console.log(err);
          toast(err.response.data.message);
        })

    }
  })

  // console.log('formikEmailVerify',formikEmailVerify);


  const ModalEmailVerify = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openEmailVerifyModal}
      onClose={handleEmailVerifyModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openEmailVerifyModal}>
        <Box sx={style} width={isSm ? 400 : 290}  >
          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px'>
            <IconButton aria-label="delete" onClick={handleEmailVerifyModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>
          <Typography variant="h5" id="transition-modal-title" className='fw-600' marginBottom='25px'>
            Verify Email
          </Typography>
          <Box sx={{ mt: 2 }} component='div'>
            <form onSubmit={formikEmailVerify.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" display="block" gutterBottom>
                    Note : Verify your email id. We will send you OTP in your email id.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth
                    id="verifyEmail"
                    name='verifyEmail'
                    onChange={formikEmailVerify.handleChange}
                    onBlur={formikEmailVerify.handleBlur}
                    value={formikEmailVerify.values.verifyEmail}
                    error={formikEmailVerify.touched.verifyEmail && Boolean(formikEmailVerify.errors.verifyEmail)}
                    helperText={formikEmailVerify.touched.verifyEmail && formikEmailVerify.errors.verifyEmail}
                    label="Email Address" />
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Button type='submit' variant="contained" sx={{ display: 'block', width: '100%', marginTop: '15px' }} >verify email</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>

  )

  // otpVerify
  const [openOTPVerifyModal, setOpenOTPVerifyModal] = useState(false);
  const handleOTPVerifyModalOpen = () => setOpenOTPVerifyModal(true);
  const handleOTPVerifyModalClose = () => { setOpenOTPVerifyModal(false); formikOTPVerify.resetForm(); };

  //  otpVerifySchema 
  const OTPVerifySchema = Yup.object().shape({
    verifyOTP: Yup.string().required('Required')
  });

  const formikOTPVerify = useFormik({
    initialValues: {
      verifyOTP: '',
    },
    validationSchema: OTPVerifySchema,
    onSubmit: (values, { setSubmitting }) => {
      // console.log('values', values);

      if (OTP === values.verifyOTP) {
        setSubmitting(values.verifyOTP = '');
        handleOTPVerifyModalClose();
        handleForgetPasswordModalOpen();
      }
      else {
        toast('Invalid OTP');
      }


    }
  })

  const ModalOTPVerify = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openOTPVerifyModal}
      onClose={handleOTPVerifyModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openOTPVerifyModal}>
        <Box sx={style} width={isSm ? 400 : 290}  >
          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px'>
            <IconButton aria-label="delete" onClick={handleOTPVerifyModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>
          <Typography variant="h5" id="transition-modal-title" className='fw-600' marginBottom='25px'>
            Verify OTP
          </Typography>
          <Box sx={{ mt: 2 }} component='div'>
            <form onSubmit={formikOTPVerify.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" display="block" gutterBottom>
                    Note : Verify Your OTP. We have send you an OTP on your email id.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth
                    id="verifyOTP"
                    name='verifyOTP'
                    onChange={formikOTPVerify.handleChange}
                    onBlur={formikOTPVerify.handleBlur}
                    value={formikOTPVerify.values.verifyOTP}
                    error={formikOTPVerify.touched.verifyOTP && Boolean(formikOTPVerify.errors.verifyOTP)}
                    helperText={formikOTPVerify.touched.verifyOTP && formikOTPVerify.errors.verifyOTP}
                    label="Enter OTP" />
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Button type='submit' variant="contained" sx={{ display: 'block', width: '100%', marginTop: '15px' }} >verify OTP</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>

  )


  const ModalForgetPassword = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openForgetPasswordModal}
      onClose={handleForgetPasswordModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openForgetPasswordModal}>
        <Box sx={style} width={isSm ? 400 : 290} className='ModalScroll' >
          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px'>
            <IconButton aria-label="delete" onClick={handleForgetPasswordModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>
          <Typography variant="h5" id="transition-modal-title" className='fw-600' marginBottom='25px'>
            Forget Password
          </Typography>
          <Box sx={{ mt: 2 }} component='div'>
            <form onSubmit={formikForgetPassword.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth
                    id="forgetPasswordEmail"
                    name='forgetPasswordEmail'
                    onChange={formikForgetPassword.handleChange}
                    onBlur={formikForgetPassword.handleBlur}
                    value={formikForgetPassword.values.forgetPasswordEmail}
                    error={formikForgetPassword.touched.forgetPasswordEmail && Boolean(formikForgetPassword.errors.forgetPasswordEmail)}
                    helperText={formikForgetPassword.touched.forgetPasswordEmail && formikForgetPassword.errors.forgetPasswordEmail}
                    label="Email Address" />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="forgetpasswordPassword" sx={{ color: formikForgetPassword.touched.forgetpasswordPassword && Boolean(formikForgetPassword.errors.forgetpasswordPassword) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikForgetPassword.touched.forgetpasswordPassword && Boolean(formikForgetPassword.errors.forgetpasswordPassword) ? 'error' : 'primary'}>New Password</InputLabel>
                    <OutlinedInput
                      id="forgetpasswordPassword"
                      name='forgetpasswordPassword'
                      onChange={formikForgetPassword.handleChange}
                      onBlur={formikForgetPassword.handleBlur}
                      value={formikForgetPassword.values.forgetpasswordPassword}
                      error={formikForgetPassword.touched.forgetpasswordPassword && Boolean(formikForgetPassword.errors.forgetpasswordPassword)}
                      // helperText={formikForgetPassword.touched.forgetpasswordPassword && formikForgetPassword.errors.forgetpasswordPassword}
                      type={showPassword.forgetpasswordPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('forgetpasswordPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.forgetpasswordPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                    />
                    <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikForgetPassword.touched.forgetpasswordPassword && formikForgetPassword.errors.forgetpasswordPassword}</Typography>
                  </FormControl>

                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="forgetpasswordConfirmPassword" sx={{ color: formikForgetPassword.touched.forgetpasswordConfirmPassword && Boolean(formikForgetPassword.errors.forgetpasswordConfirmPassword) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikForgetPassword.touched.forgetpasswordConfirmPassword && Boolean(formikForgetPassword.errors.forgetpasswordConfirmPassword) ? 'error' : 'primary'}>Confirm Password</InputLabel>
                    <OutlinedInput
                      id="forgetpasswordConfirmPassword"
                      name='forgetpasswordConfirmPassword'
                      onChange={formikForgetPassword.handleChange}
                      onBlur={formikForgetPassword.handleBlur}
                      value={formikForgetPassword.values.forgetpasswordConfirmPassword}
                      error={formikForgetPassword.touched.forgetpasswordConfirmPassword && Boolean(formikForgetPassword.errors.forgetpasswordConfirmPassword)}
                      //  helperText={formikForgetPassword.touched.forgetpasswordConfirmPassword && formikForgetPassword.errors.forgetpasswordConfirmPassword}
                      type={showPassword.forgetpasswordConfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('forgetpasswordConfirmPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.forgetpasswordConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                    <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikForgetPassword.touched.forgetpasswordConfirmPassword && formikForgetPassword.errors.forgetpasswordConfirmPassword}</Typography>
                  </FormControl>

                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Button type='submit' variant="contained" sx={{ display: 'block', width: '100%', marginTop: '15px' }} >change</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )


  // ModalLogin

  const ModalLogin = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModalLogin}
      onClose={handleLoginModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openModalLogin}>
        <Box sx={style} width={isSm ? 400 : 290} className='ModalScroll' >
          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px'>
            <IconButton aria-label="delete" onClick={handleLoginModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>
          <Typography variant="h5" id="transition-modal-title" className='fw-600' gutterBottom>
            Sign in
          </Typography>
          <Box sx={{ mt: 2 }} component='div'>
            <form onSubmit={formikSignIn.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth
                    id="email"
                    name='email'
                    onChange={formikSignIn.handleChange}
                    onBlur={formikSignIn.handleBlur}
                    value={formikSignIn.values.email}
                    error={formikSignIn.touched.email && Boolean(formikSignIn.errors.email)}
                    helperText={formikSignIn.touched.email && formikSignIn.errors.email}
                    label="Email Address" />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="password" sx={{ color: formikSignIn.touched.password && Boolean(formikSignIn.errors.password) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikSignIn.touched.password && Boolean(formikSignIn.errors.password) ? 'error' : 'primary'}>Password</InputLabel>
                    <OutlinedInput
                      id='password'
                      name='password'
                      onChange={formikSignIn.handleChange}
                      onBlur={formikSignIn.handleBlur}
                      value={formikSignIn.values.password}
                      error={formikSignIn.touched.password && Boolean(formikSignIn.errors.password)}
                      // helperText={formikSignIn.touched.password && formikSignIn.errors.password}
                      type={showPassword.signinPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('signinPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.signinPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikSignIn.touched.password && formikSignIn.errors.password}</Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox disableRipple sx={{ paddingY: '0px' }} />} label="Remember me" />
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Button type='submit' variant="contained" sx={{ display: 'block', width: '100%' }} >Sign in</Button>
                </Grid>
                <Grid item xs={12} textAlign='end'  >
                  <Stack spacing={1} marginTop='5px'>
                    <div>
                      <Typography variant="body2" color='#4154f1' sx={{ textDecoration: 'none!important', display: 'inline-block', cursor: 'pointer' }} onClick={() => { formikSignIn.resetForm(); handleLoginModalClose(); handleEmailVerifyModalOpen(); }}>
                        Forgot password?
                      </Typography>
                    </div>
                    <div style={{ marginTop: '2px' }}>
                      <Typography variant="body2" color='#4154f1' sx={{ textDecoration: 'none!important', display: 'inline-block', cursor: 'pointer' }} onClick={() => { handleLoginModalClose(); handleRegisterModalOpen(); }}>
                        Don't have an account? Sign Up
                      </Typography>
                    </div>

                  </Stack>

                </Grid>

              </Grid>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )

  // ModalRegister

  const ModalRegister = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openRegisterModal}
      onClose={handleRegisterModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openRegisterModal}>
        <Box sx={style} width={isSm ? 400 : 290} className='ModalScroll'>
          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px'>
            <IconButton aria-label="delete" onClick={handleRegisterModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>
          <Typography variant="h5" id="transition-modal-title" className='fw-600' gutterBottom>
            Sign up
          </Typography>

          <Box sx={{ mt: 2 }} component='div'>
            <form onSubmit={formikSignUp.handleSubmit}>
              <Grid container spacing={2} >
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth
                    id="firstName"
                    name='firstName'
                    onChange={formikSignUp.handleChange}
                    onBlur={formikSignUp.handleBlur}
                    value={formikSignUp.values.firstName}
                    error={formikSignUp.touched.firstName && Boolean(formikSignUp.errors.firstName)}
                    helperText={formikSignUp.touched.firstName && formikSignUp.errors.firstName}
                    label="First Name" />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth
                    id="lastName"
                    name='lastName'
                    onChange={formikSignUp.handleChange}
                    onBlur={formikSignUp.handleBlur}
                    value={formikSignUp.values.lastName}
                    error={formikSignUp.touched.lastName && Boolean(formikSignUp.errors.lastName)}
                    helperText={formikSignUp.touched.lastName && formikSignUp.errors.lastName}
                    label="Last Name" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth
                    id="email"
                    name='email'
                    onChange={formikSignUp.handleChange}
                    onBlur={formikSignUp.handleBlur}
                    value={formikSignUp.values.email}
                    error={formikSignUp.touched.email && Boolean(formikSignUp.errors.email)}
                    helperText={formikSignUp.touched.email && formikSignUp.errors.email}
                    label="Email Address" />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="password" sx={{ color: formikSignUp.touched.password && Boolean(formikSignUp.errors.password) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikSignUp.touched.password && Boolean(formikSignUp.errors.password) ? 'error' : 'primary'}>Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      name='password'
                      onChange={formikSignUp.handleChange}
                      onBlur={formikSignUp.handleBlur}
                      value={formikSignUp.values.password}
                      error={formikSignUp.touched.password && Boolean(formikSignUp.errors.password)}
                      // helperText={formikSignIn.touched.password && formikSignIn.errors.password}
                      type={showPassword.signupPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('signupPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.signupPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikSignUp.touched.password && formikSignUp.errors.password}</Typography>
                  </FormControl>

                </Grid>
                <Grid container item alignItems='center'>
                  <Grid item sm={4} xs={12} marginBottom={isSm ? '0px' : '10px'}>
                    <Tooltip title="Passport Size Photo" arrow>
                      <InputLabel className='fw-600'>Upload Photo</InputLabel>
                    </Tooltip>

                  </Grid>
                  <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>

                    <Grid container alignItems='center' spacing={1}>
                      <Grid item xs={6}>
                        <input
                          id="userImg"
                          name="userImg"
                          type="file"
                          onChange={(event) => {

                            let file = event.currentTarget.files[0];
                            formikSignUp.setFieldValue("userImg", file);
                            setUserImg(file?.name);
                          }}
                          onBlur={formikSignUp.handleBlur}
                          style={{ display: 'none' }} // You might want to hide the input field visually and use a custom button
                        />
                        <label htmlFor="userImg">
                          <StyledButton component="span" className='choosen-btn'>
                            Choose File
                          </StyledButton>
                        </label>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" overflow='auto' width='100%'>
                          {userImg}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {formikSignUp.touched.userImg && formikSignUp.errors.userImg && (
                    <Typography variant="caption" color="error">
                      {formikSignUp.errors.userImg}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems='flex-start'>
                    <Checkbox disableRipple sx={{ paddingTop: '0px' }} />
                    <Typography>
                      I agree and accept the
                      <Typography component='a' href='#' style={{ color: "#4154f1", textDecoration: "none" }}> terms and conditions</Typography>

                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Button type='submit' variant="contained" sx={{ display: 'block', width: '100%' }} >sign up</Button>
                </Grid>
                <Grid item xs={12} textAlign='end'  >
                  <Typography color='#4154f1' sx={{ textDecoration: 'none!important', display: 'inline-block', cursor: 'pointer' }} onClick={() => { handleRegisterModalClose(); handleLoginModalOpen(); }}>
                    Already have an account? Sign in
                  </Typography>
                </Grid>

              </Grid>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )


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
      { !LoginToken ? (
        <>
         <MenuItem onClick={() => { handleLoginModalOpen(); handleMobileMenuClose() }} sx={{ minHeight: 'auto' }}>
         Login
       </MenuItem>
       <Divider sx={{ margin: '0px!important' }} />
       <MenuItem onClick={() => { handleRegisterModalOpen(); handleMobileMenuClose() }} sx={{ minHeight: 'auto' }} >
         Sign-up
       </MenuItem>
        </>
      ) : '' }
      {LoginToken ? (
        <>
          <MenuItem disableRipple  >
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={userId}
              aria-haspopup="false"
              onClick={handleOpenUserMenu}
              color="inherit"
              disableRipple
              sx={{ padding: '0px' }}
            >
              <Tooltip title="Profile Settings">
                <Stack direction="row">
                  <Avatar alt={userData?.fname.toUpperCase()} className='bg-secondary' sx={{ width: 34, height: 34 }} src={`http://localhost:3000/images/${userData?.profilepic}`} ></Avatar>
                  <Button
                    size='small'
                    variant="contained"
                    disableElevation
                    endIcon={<KeyboardArrowDownIcon />}
                    disableRipple
                    sx={{ textTransform: 'capitalize', fontSize: "15px", paddingRight: "0px",backgroundColor : '#ffffff!important' }}
                    className='profileBTN'
                  >
                    {userData?.fname.charAt(0) + '.' + userData?.lname}
                  </Button>

                </Stack>
              </Tooltip>
            </IconButton>
          </MenuItem>
        </>
      ) : ''}
    </Menu>
  );




  return (
    <>
      <Box sx={{ flexGrow: 1, position: "sticky", top: 0 }} zIndex={1030} >
        <Box sx={{ flexGrow: 1 }} className='header bg-default'>
          <Container maxWidth='lg'>
            <AppBar position="static" className='bg-default' sx={{ boxShadow: '0px 0px' }} >
              <Toolbar >
                <Stack spacing={1} direction="row" alignItems="center" >
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

                <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: "center" } }}>
                  {LoginToken ? ''
                    : (<>
                      <Button variant="contained" sx={{ marginLeft: "15px", borderRadius: '8px', textTransform: 'capitalize' }} className='bg-secondary' size='medium' onClick={handleLoginModalOpen}>login</Button>
                      <Button variant="contained" sx={{ marginLeft: "15px", borderRadius: '8px', textTransform: 'capitalize' }} className='bg-primary' size='medium' onClick={handleRegisterModalOpen}>Sign-up</Button>
                    </>
                    )}
                  {LoginToken ? (
                    <>
                      {/* <Divider orientation="vertical" flexItem sx={{ margin: '10px 15px', borderColor: '#000' }} /> */}
                      <Tooltip title="Open Menu">
                        <IconButton
                          size="large"
                          edge="end"
                          aria-label="user dasboard menu"
                          aria-controls={userId}
                          aria-haspopup="false"
                          onClick={handleOpenUserMenu}
                          color="inherit"
                          disableRipple
                          sx={{ padding: '0px' }}
                        >
                          <Stack direction="row">
                            {/* <Avatar className='bg-secondary' sx={{ width: 35, height: 35 }} >{userData?.fname.charAt(0).toUpperCase()}</Avatar> */}
                            <Avatar alt={userData?.fname.toUpperCase()} sx={{ width: 34, height: 34 }} className='bg-secondary' src={`http://localhost:3000/images/${userData?.profilepic}`} ></Avatar>
                            <Button
                              size='small'
                              variant="contained"
                              disableElevation
                              endIcon={<KeyboardArrowDownIcon />}
                              disableRipple
                              sx={{ textTransform: 'capitalize', fontSize: "15px", paddingRight: "0px" }}
                              className='profileBTN'
                            >
                              {userData?.fname.charAt(0) + '.' + userData?.lname}
                            </Button>
                          </Stack>
                        </IconButton>
                      </Tooltip>
                    </>
                  )
                    : ''}
                </Box>

                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
          </Container>

          {isMd ? '' : renderMobileMenu}
          {userMenu}
          {ModalLogin}
          {ModalRegister}
          {ModalEmailVerify}
          {ModalOTPVerify}
          {ModalForgetPassword}
        </Box>
        <Box sx={{ color: '#fff' }} className='bg-secondary'>
          <Tabs
            value={value}
            // onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="scrollable auto tabs example"
            id='header-tabs'
          >

            {categoryData.map((categoryData, index) => (
              <Tab label={categoryData.category} sx={{ color: 'rgba(255,255,255,0.6)' }} onClick={() => {
                setValue(index)
                sessionStorage.setItem('value', index)
                sessionStorage.setItem('categoryId', categoryData._id);
                if (loadData) {
                  loadData();
                }
                history.push("/category");
              }} />
            ))}
          </Tabs>
        </Box>
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

export default Header