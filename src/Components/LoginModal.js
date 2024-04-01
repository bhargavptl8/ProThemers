import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Button, Checkbox, Fade, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput, Stack, TextField, Tooltip, Typography, styled, useMediaQuery, useTheme } from '@mui/material';


//Mui icon 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//React icon
import { IoCloseCircleOutline } from "react-icons/io5";

import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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


const StyledButton = styled(Button)({
    backgroundColor: '#4014147d',
    borderRadius: '15px',
    color: 'white',
    fontSize: '13px',
    textTransform: 'capitalize',
    padding: '5px 12px'
  });

const LoginModal = () => {

    const theme = useTheme();

    // breakPoints  
    const isSm = useMediaQuery(theme.breakpoints.up('sm'));

    // single file choose 
    const [userImg, setUserImg] = useState('');

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

    // console.log('userData', userData);

    // useEffect(() => {
    //     getUserData();
    // }, [])


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
                    setTimeout(() => {
                        alert(res.data.message);
                    }, 1000);
                })
                .catch((err, res) => {
                    console.log(err);
                    // console.log('errorrrrrrrr===========',err.response.data.message);
                    alert(err.response.data.message);
                })

            // let copyData = [...signinData, { email: values.email, password: values.password }];

            // setSigninData(copyData);

            // setSubmitting(values.email = '', values.password = '');
        }

    })


    console.log('signinData========', signinData);




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

    const [forgetPasswordData, setForgetPasswordData] = useState([]);

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
                        setTimeout(() => {
                            alert(res.data.message);
                        }, 1000);
                    })
                    .catch((err) => {
                        console.log(err);
                        alert(err.response.data.message);
                    })

                // let copyData = [...forgetPasswordData, { forgetPasswordEmail: values.forgetPasswordEmail, forgetpasswordPassword: values.forgetpasswordPassword, forgetpasswordConfirmPassword: values.forgetpasswordConfirmPassword }];

                // setForgetPasswordData(copyData);

                // setSubmitting(values.forgetPasswordEmail = '', values.forgetpasswordPassword = '', values.forgetpasswordConfirmPassword = '');

            }
            else {
                alert("New Password and Confirm Password can't match!")
            }
        }
    })


    console.log('forgetPasswordData========', forgetPasswordData);



    // ModalLogin
    const [openModalLogin, setOpenModalLogin] = React.useState(true);
    const handleLoginModalOpen = () => setOpenModalLogin(true);
    const handleLoginModalClose = () => { setOpenModalLogin(false); formikSignIn.resetForm(); };

    //      // ModalRegister
    const [openRegisterModal, setRegisterOpenModal] = React.useState(false);
    const handleRegisterModalOpen = () => setRegisterOpenModal(true);
    const handleRegisterModalClose = () => { setRegisterOpenModal(false); formikSignUp.resetForm(); setUserImg(''); }

    //   //forgetPasswordModal

    const [openForgetPasswordModal, setOpenForgetPasswordModal] = useState(false);
    const handleForgetPasswordModalOpen = () => setOpenForgetPasswordModal(true);
    const handleForgetPasswordModalClose = () => { setOpenForgetPasswordModal(false); formikForgetPassword.resetForm(); };

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
                      <Typography variant="body2" color='#4154f1' sx={{ textDecoration: 'none!important', display: 'inline-block', cursor: 'pointer' }} onClick={() => { formikSignIn.resetForm(); handleForgetPasswordModalOpen(); }}>
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




    return (
        <div>
            {ModalForgetPassword}
            {ModalLogin}
            {ModalRegister}
        </div>
    )
}

export default LoginModal