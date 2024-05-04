import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, Breadcrumbs, Grid, styled, Paper, Stack, Tabs, Tab, useTheme, useMediaQuery, Fab, TextField, Button, Checkbox, FormGroup, FormControlLabel, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { BsTwitter, BsFacebook, BsInstagram, BsLinkedin, BsUpload, BsTrash } from "react-icons/bs";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2.5),
  color: theme.palette.text.secondary,
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const StyledButton = styled(Button)({
  backgroundColor: '#4014147d',
  borderRadius: '15px',
  color: 'white',
  fontSize: '13px',
  textTransform: 'capitalize',
  padding: '5px 12px'
});

const UserProfile = ({ Update }) => {


  const theme = useTheme();
  const [value, setValue] = React.useState(0);

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

  console.log('userData', userData);




  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {

    setUserImg(userData?.profilepic);
    formikUserProfileData.values.userImg = userData?.profilepic;
    formikUserProfileData.values.firstName = userData?.fname;
    formikUserProfileData.values.lastName = userData?.lname;
    formikUserProfileData.values.about = userData?.about;
    formikUserProfileData.values.company = userData?.company;
    formikUserProfileData.values.job = userData?.job;
    formikUserProfileData.values.country = userData?.country;
    formikUserProfileData.values.phone = userData?.phone;
    formikUserProfileData.values.email = userData?.email;
    formikUserProfileData.values.twitterProfileLink = userData?.twitter;
    formikUserProfileData.values.facebookProfileLink = userData?.facebook;
    formikUserProfileData.values.instagramProfileLink = userData?.instagram;
    formikUserProfileData.values.linkedinProfileLink = userData?.linkedin;
  }, [userData])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  //  Edit User Profile 

  // const [userProfileData2, setUserProfileData2] = useState([]);
  // const [userProfileId, setUserProfileId] = useState();

  const userProfileDataSchema = Yup.object().shape({
    // about: Yup.string().required('Required'),
    // company: Yup.string().required('Required'),
    // job: Yup.string().required('Required'),
    // country: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email'),
    // password: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required')
  });

  const formikUserProfileData = useFormik({
    initialValues: {
      userImg: '',
      firstName: '',
      lastName: '',
      about: '',
      company: '',
      job: '',
      country: '',
      phone: '',
      email: '',
      twitterProfileLink: '',
      facebookProfileLink: '',
      instagramProfileLink: '',
      linkedinProfileLink: ''

    },
    validationSchema: userProfileDataSchema,
    onSubmit: (values, { setSubmitting }) => {

      let formData = new FormData();

      if (values.userImg) {
        formData.append('profilepic', values.userImg);
      }
      if (values.firstName) {
        formData.append('fname', values.firstName);
      }
      if (values.lastName) {
        formData.append('lname', values.lastName);
      }
      if (values.about) {
        formData.append('about', values.about);
      }
      if (values.company) {
        formData.append('company', values.company);
      }
      if (values.job) {
        formData.append('job', values.job);
      }
      if (values.country) {
        formData.append('country', values.country);
      }
      if (values.phone) {
        formData.append('phone', values.phone);
      }
      if (values.email) {
        formData.append('email', values.email);
      }
      if (values.twitterProfileLink) {
        formData.append('twitter', values.twitterProfileLink);
      }
      if (values.facebookProfileLink) {
        formData.append('facebook', values.facebookProfileLink);
      }
      if (values.instagramProfileLink) {
        formData.append('instagram', values.instagramProfileLink);
      }
      if (values.linkedinProfileLink) {
        formData.append('linkedin', values.linkedinProfileLink);
      }

      let Token = localStorage.getItem('loginToken');

      axios.patch('http://localhost:3000/users/update', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: Token
        }
      })
        .then((res) => {
          console.log(res);
          setSubmitting(values.userImg = '', setUserImg(''), values.firstName = '', values.lastName = '', values.about = '', values.company = '', values.job = '', values.country = '', values.phone = '', values.email = '', values.twitterProfileLink = '', values.facebookProfileLink = '', values.instagramProfileLink = '', values.linkedinProfileLink = '');
          getUserData();
          Update();
          toast(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast(err.response.data.message);
        })

    }

  })


  //change password

  const [changePasswordData, setChangePasswordData] = useState([]);

  const changePasswordDataSchema = Yup.object().shape({
    currentPassword: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required'),
    newPassword: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required'),
    re_enterNewPassword: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required')
  });

  const formikChangePasswordData = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      re_enterNewPassword: '',


    },
    validationSchema: changePasswordDataSchema,
    onSubmit: (values, { setSubmitting }) => {

      let Token = localStorage.getItem('loginToken');

      axios.patch('http://localhost:3000/users/profile/change-pass', { currentpass: values.currentPassword, pass: values.newPassword, confirmpass: values.re_enterNewPassword }, { headers: { Authorization: Token } })
        .then((res) => {
          console.log(res);
          setSubmitting(values.currentPassword = '', values.newPassword = '', values.re_enterNewPassword = '');
          toast(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast(err.response.data.message);
        })
      // }
      // else{
      //   alert("New Password and Re-enter New Password cant's same")
      // }


    }

  })


  console.log('changePasswordData========', changePasswordData);



  const [showPassword, setShowPassword] = React.useState({
    current: false,
    newPassword: false,
    reenterNewPassword: false
  });

  const handleClickShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] })
  };


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Box>
      {/* <Typography variant="h5"  >
        Profile
      </Typography> */}
      <Breadcrumbs aria-label="breadcrumb">
        <Link className="Breadcrumb" style={{ color: "#899bbd", fontSize: "14px", textDecoration: "none" }} to="/user">
          Home
        </Link>
        <Typography color="#899bbd" fontSize="14px">User</Typography>
        <Typography color="#273246" fontSize="14px">Profile</Typography>
      </Breadcrumbs>

      <Box className='section-py'>
        <Grid container spacing={4}>
          <Grid item md={4} xs={12}>
            <Item >
              <Stack alignItems="center" padding="5px" spacing={1.5}>
                <img src={`http://localhost:3000/images/${userData?.profilepic}`} alt={userData?.fname + '-img'} width={120} height={120} style={{ borderRadius: "50%" }} />
                <Box>
                  <Typography variant="h5" fontWeight={700} className='nunito-sans' color="#2c384e" marginBottom='2px'>
                    {userData?.fname.charAt(0).toUpperCase() + userData?.fname.substring(1) + ' ' + userData?.lname}
                  </Typography>
                  <Typography fontSize="17px" textAlign="center" fontWeight="500" lineHeight="1" >
                    {userData?.job}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  {userData?.twitter ? (
                    <a href={userData?.twitter} target='_blank' className='social-icon'><BsTwitter size={20} /></a>
                  ) : ''}
                  {userData?.facebook ? (
                    <a href={userData?.facebook} target='_blank' className='social-icon'><BsFacebook size={20} /></a>
                  ) : ''}
                  {userData?.instagram ? (
                    <a href={userData?.instagram} target='_blank' className='social-icon'><BsInstagram size={20} /></a>
                  ) : ''}
                  {userData?.linkedin ? (
                    <a href={userData?.linkedin} target='_blank' className='social-icon'><BsLinkedin size={20} /></a>
                  ) : ''}
                </Stack>
              </Stack>
            </Item>
          </Grid>
          <Grid item md={8} xs={12}>
            <Item>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="basic tabs example">
                    <Tab label="Overview" {...a11yProps(0)} sx={{ textTransform: "capitalize", fontSize: "16px", color: '#2c384e' }} />
                    <Tab label="Edit Profile" {...a11yProps(1)} sx={{ textTransform: "capitalize", fontSize: "16px", color: '#2c384e' }} />
                    <Tab label="Settings" {...a11yProps(2)} sx={{ textTransform: "capitalize", fontSize: "16px", color: '#2c384e' }} />
                    <Tab label="Change Password" {...a11yProps(3)} sx={{ textTransform: "capitalize", fontSize: "16px", color: '#2c384e' }} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <Stack spacing={3}>
                    {userData?.about ? (
                      <Box>
                        <Typography variant="h6" color="#012970" fontWeight={600} marginBottom="15px">
                          About
                        </Typography>
                        <Typography fontSize="14.5px" gutterBottom>
                          {userData?.about}
                        </Typography>
                      </Box>
                    ) : ''}
                    <Box>
                      <Typography variant="h6" className='nunito-sans' color="#012970" fontWeight={600} marginBottom="15px">
                        Profile Details
                      </Typography>
                      <Grid container alignItems="center" spacing={isSm ? 1 : 0}>
                        {userData?.fname ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                                First Name
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.fname}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                        {userData?.lname ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                                Last Name
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.lname}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                        {userData?.company ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                                Company
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.company}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                        {userData?.job ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                                Job
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.job}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                        {userData?.country ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                                Country
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.country}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                        {userData?.phone ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700} >
                                Phone
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.phone}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                        {userData?.email ? (
                          <>
                            <Grid item sm={3} xs={12} >
                              <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                                Email
                              </Typography>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                              <Typography variant="body1" marginBottom={isSm ? "5.6px" : "12px"} color="#000" overflow='auto'>
                                {userData?.email}
                              </Typography>
                            </Grid>
                          </>
                        ) : ''}
                      </Grid>
                    </Box>
                  </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <form onSubmit={formikUserProfileData.handleSubmit}>
                    <Grid container spacing={isSm ? 2 : 1}>
                      <Grid item sm={3} xs={12} >
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Profile Image
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <Grid container alignItems='center' spacing={1}>
                          <Grid item xs={6}>
                            <input
                              id="userImg"
                              name="userImg"
                              type="file"
                              onChange={(event) => {

                                let file = event.currentTarget.files[0];
                                formikUserProfileData.setFieldValue("userImg", file);
                                setUserImg(file?.name);
                              }}
                              onBlur={formikUserProfileData.handleBlur}
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
                          {/* <Grid item xs={12}>
                          {formikUserProfileData.touched.userImg && formikUserProfileData.errors.userImg && (
                            <Typography variant="caption" color="error">
                              {formikUserProfileData.errors.userImg}
                            </Typography>
                          )}
                        </Grid> */}
                        </Grid>

                        {/* <Stack spacing={1}>
                        <img src='https://bootstrapmade.com/demo/templates/NiceAdmin/assets/img/profile-img.jpg' alt='Profile-pic' width={120} height={120} />
                        <Box display="flex" zIndex={0}>                   
                          <Fab size="small" color="primary" aria-label="add" sx={{ borderRadius: "10px", height: "36px", width: "36px" }}>
                            <BsUpload size={16} />
                          </Fab>           
                          <Fab size="small" color="error" aria-label="add" sx={{ borderRadius: "10px", marginLeft: "10px", height: "36px", width: "36px" }}>
                            <BsTrash size={16} />
                          </Fab>
                        </Box>
                      </Stack> */}
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          First Name
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          id="firstName"
                          name='firstName'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.firstName}
                          // error={formikUserProfileData.touched.firstName && Boolean(formikUserProfileData.errors.firstName)}
                          // helperText={formikUserProfileData.touched.firstName && formikUserProfileData.errors.firstName}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Last Name
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          id="lastName"
                          name='lastName'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.lastName}
                          // error={formikUserProfileData.touched.lastName && Boolean(formikUserProfileData.errors.lastName)}
                          // helperText={formikUserProfileData.touched.lastName && formikUserProfileData.errors.lastName}
                          size="small" />
                      </Grid>

                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          About
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth
                          id="about"
                          name='about'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.about}
                          // error={formikUserProfileData.touched.about && Boolean(formikUserProfileData.errors.about)}
                          // helperText={formikUserProfileData.touched.about && formikUserProfileData.errors.about}
                          type='text'
                          multiline rows={4} size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Company
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          id="company"
                          name='company'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.company}
                          // error={formikUserProfileData.touched.company && Boolean(formikUserProfileData.errors.company)}
                          // helperText={formikUserProfileData.touched.company && formikUserProfileData.errors.company}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Job
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          id="job"
                          name='job'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.job}
                          // error={formikUserProfileData.touched.job && Boolean(formikUserProfileData.errors.job)}
                          // helperText={formikUserProfileData.touched.job && formikUserProfileData.errors.job}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Country
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          id="country"
                          name='country'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.country}
                          // error={formikUserProfileData.touched.country && Boolean(formikUserProfileData.errors.country)}
                          // helperText={formikUserProfileData.touched.country && formikUserProfileData.errors.country}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Phone
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth id='phone' name='phone'
                          onChange={formikUserProfileData.handleChange}
                          value={formikUserProfileData.values.phone}
                          type='text' size="small"
                        //  inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                        />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Email
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='email'
                          id="email"
                          name='email'
                          onChange={formikUserProfileData.handleChange}
                          onBlur={formikUserProfileData.handleBlur}
                          value={formikUserProfileData.values.email}
                          error={formikUserProfileData.touched.email && Boolean(formikUserProfileData.errors.email)}
                          helperText={formikUserProfileData.touched.email && formikUserProfileData.errors.email}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Twitter Profile Link
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          name='twitterProfileLink'
                          id='twitterProfileLink'
                          onChange={formikUserProfileData.handleChange}
                          value={formikUserProfileData.values.twitterProfileLink}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Facebook Profile Link
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          name='facebookProfileLink'
                          id='facebookProfileLink'
                          onChange={formikUserProfileData.handleChange}
                          value={formikUserProfileData.values.facebookProfileLink}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Instagram Profile Link
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          name='instagramProfileLink'
                          id='instagramProfileLink'
                          onChange={formikUserProfileData.handleChange}
                          value={formikUserProfileData.values.instagramProfileLink}
                          size="small" />
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Linkedin Profile Link
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <TextField fullWidth type='text'
                          name='linkedinProfileLink'
                          id='linkedinProfileLink'
                          onChange={formikUserProfileData.handleChange}
                          value={formikUserProfileData.values.linkedinProfileLink}
                          size="small" />
                      </Grid>
                      <Grid item xs={12} className='btn-grid'>
                        <Stack direction="row" justifyContent="center" marginTop="15px" className='btn'>
                          <Button type='submit' variant="contained" sx={{ textTransform: "capitalize", fontSize: "15px" }} size={isSm ? "medium" : "small"} className='change-btn'>Save Changes</Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <Grid container spacing={2} >
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight='bold' color="#012970" gutterBottom>
                        Notification
                      </Typography>
                      <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Email Notifications" />
                      </FormGroup>
                    </Grid>
                    {/* <Grid item sm={3} xs={12}>
                    <Typography className='nunito-sans' fontWeight={700} color="rgba(1, 41, 112, 0.6)">
                      Email Notifications
                    </Typography>
                  </Grid>
                  <Grid item sm={9} xs={12}>
                    <FormGroup className='form-group'>
                      <FormControlLabel className='form-lable' control={<Checkbox defaultChecked />} label="Changes made to your account" sx={{ color: '#000', marginX: "0px" }} />
                      <FormControlLabel className='form-lable' control={<Checkbox defaultChecked />} label="Information on new products and services" sx={{ color: '#000', marginX: "0px" }} />
                      <FormControlLabel className='form-lable' control={<Checkbox />} label="Marketing and promo offers" sx={{ color: '#000', marginX: "0px" }} />
                      <FormControlLabel className='form-lable' disabled control={<Checkbox defaultChecked />} label="Security alerts" sx={{ marginX: "0px" }} />
                    </FormGroup>
                  </Grid> */}
                    <Grid item xs={12} className='btn-grid'>
                      <Stack direction="row" justifyContent="center" marginTop="15px" className='btn'>
                        <Button variant="contained" sx={{ textTransform: "capitalize", fontSize: "15px" }} size={isSm ? "medium" : "small"} className='change-btn'>Save Changes</Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>

                  <form onSubmit={formikChangePasswordData.handleSubmit}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Current Password
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                          <InputLabel htmlFor="currentPassword" sx={{ color: formikChangePasswordData.touched.currentPassword && Boolean(formikChangePasswordData.errors.currentPassword) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikChangePasswordData.touched.currentPassword && Boolean(formikChangePasswordData.errors.currentPassword) ? 'error' : 'primary'}>Password</InputLabel>
                          <OutlinedInput
                            id="currentPassword"
                            name='currentPassword'
                            onChange={formikChangePasswordData.handleChange}
                            onBlur={formikChangePasswordData.handleBlur}
                            value={formikChangePasswordData.values.currentPassword}
                            error={formikChangePasswordData.touched.currentPassword && Boolean(formikChangePasswordData.errors.currentPassword)}
                            placeholder='Current Password'
                            type={showPassword.current ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword('current')}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                          <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikChangePasswordData.touched.currentPassword && formikChangePasswordData.errors.currentPassword}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          New Password
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                          <InputLabel htmlFor="newPassword" sx={{ color: formikChangePasswordData.touched.newPassword && Boolean(formikChangePasswordData.errors.newPassword) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikChangePasswordData.touched.newPassword && Boolean(formikChangePasswordData.errors.newPassword) ? 'error' : 'primary'}>Password</InputLabel>
                          <OutlinedInput
                            id="newPassword"
                            name='newPassword'
                            onChange={formikChangePasswordData.handleChange}
                            onBlur={formikChangePasswordData.handleBlur}
                            value={formikChangePasswordData.values.newPassword}
                            error={formikChangePasswordData.touched.newPassword && Boolean(formikChangePasswordData.errors.newPassword)}
                            placeholder='New Genrated Password'
                            type={showPassword.newPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword('newPassword')}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                          <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikChangePasswordData.touched.newPassword && formikChangePasswordData.errors.newPassword}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item sm={3} xs={12}>
                        <Typography variant="subtitle1" className='nunito-sans' marginBottom={isSm ? "5.6px" : "0px"} color="rgba(1, 41, 112, 0.6)" fontWeight={700}>
                          Re-enter New Password
                        </Typography>
                      </Grid>
                      <Grid item sm={9} xs={12} marginBottom={isSm ? "0px" : "10px"}>
                        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                          <InputLabel htmlFor="re_enterNewPassword" sx={{ color: formikChangePasswordData.touched.re_enterNewPassword && Boolean(formikChangePasswordData.errors.re_enterNewPassword) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikChangePasswordData.touched.re_enterNewPassword && Boolean(formikChangePasswordData.errors.re_enterNewPassword) ? 'error' : 'primary'}>Password</InputLabel>
                          <OutlinedInput
                            id="re_enterNewPassword"
                            name='re_enterNewPassword'
                            onChange={formikChangePasswordData.handleChange}
                            onBlur={formikChangePasswordData.handleBlur}
                            value={formikChangePasswordData.values.re_enterNewPassword}
                            error={formikChangePasswordData.touched.re_enterNewPassword && Boolean(formikChangePasswordData.errors.re_enterNewPassword)}

                            placeholder='Re-enter New Password'
                            type={showPassword.reenterNewPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword('reenterNewPassword')}
                                  edge="end"
                                >
                                  {showPassword.reenterNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                          <Typography sx={{ margin: '3px 14px 0' }} variant='caption' color='error'>{formikChangePasswordData.touched.re_enterNewPassword && formikChangePasswordData.errors.re_enterNewPassword}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} className='btn-grid'>
                        <Stack direction="row" justifyContent="center" marginTop={isSm ? "18px" : "5px"} className='btn'>
                          <Button type='submit' variant="contained" sx={{ textTransform: "capitalize", fontSize: "15px" }} size={isSm ? "medium" : "small"} className='change-btn'>Change Password</Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>

                </CustomTabPanel>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>

    </Box>
  )
}

export default UserProfile;