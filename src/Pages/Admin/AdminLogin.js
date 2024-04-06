import * as React from 'react';
import { Box, CssBaseline, Container, Stack, Typography, Card, CardContent, FormControl, TextField, InputAdornment, IconButton, Button, Grid, InputLabel, Input } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BsFillPersonFill } from "react-icons/bs";
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AdminLogin = () => {

    let history = useHistory();


    //  Edit User Profile 

    const [adminData, setAdminData] = React.useState([]);

    const adminDataSchema = Yup.object().shape({

        adminEmail: Yup.string().email('Invalid email').required('Required'),
        adminPassword: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required')
        // about: Yup.string().required('Required'),
        // company: Yup.string().required('Required'),
        // job: Yup.string().required('Required'),
        // country: Yup.string().required('Required'),
        // email: Yup.string().email('Invalid email'),
        // password: Yup.string().min(8, 'password length 8 required').max(16, 'Too Long!').required('Required')
    });

    const formikAdminData = useFormik({
        initialValues: {
            adminEmail: '',
            adminPassword: ''
        },
        validationSchema: adminDataSchema,
        onSubmit: (values, { setSubmitting }) => {


            axios.post('https://pro-themers-backend.onrender.com/admin/login', { email: values.adminEmail, pass: values.adminPassword })
                .then((res) => {
                    // console.log(res);
                    console.log(res.data.token);
                    localStorage.setItem("adminToken", res.data.token)
                    setSubmitting(values.adminEmail = '', values.adminPassword = '');
                    toast(res.data.message);
                    history.push('/admin');
                })
                .catch((err) => {
                    console.log(err);
                    toast(err.response.data.message);
                })



            // let copyData = [...adminData, { adminEmail: values.adminEmail, adminPassword: values.adminPassword }];

            // setAdminData(copyData);

            // setSubmitting(values.adminEmail = '', values.adminPassword = '');
        }

    })


    console.log('adminData========', adminData);


    //Show/hide Password
    const [showPassword, setShowPassword] = React.useState(false);
    const [values, setValue] = React.useState('');


    const handleClickShowPassword = () => setShowPassword((show) => !show);



    const handlePassword = (event) => {
        setValue(event.target.value);
    };

    // console.log(values);

    return (
        <Box className='bg-default' height='100vh' display='flex' justifyContent='center' alignItems='center'>
            <CssBaseline />
            <Container maxWidth="sm">

                <Box>
                    <form onSubmit={formikAdminData.handleSubmit} >
                        <Grid container justifyContent="center" alignItems='center'>
                            <Grid item sm={8} xs={12} alignItems='center'>

                                <Card sx={{ boxShadow: "0px 0px 8px rgba(0,0,0,0.3)" }}>

                                    <CardContent sx={{ padding: "50px 40px!important" }}>
                                        <Typography variant="h5" component="div" fontWeight={700} display='flex' justifyContent='center' alignItems='flex-start' color="#000" marginBottom='15px' >
                                            <BsFillPersonFill size={27} style={{ marginRight: '5px' }} /> Admin
                                        </Typography>
                                        {/* <Typography variant="body2" textAlign="center" marginBottom="22px">
                                    Enter admin-name & password to login
                                </Typography> */}


                                        <Stack spacing={2}>
                                            {/* <FormControl fullWidth> */}
                                            <TextField type='email'
                                                id='adminEmail'
                                                name='adminEmail'
                                                onChange={formikAdminData.handleChange}
                                                value={formikAdminData.values.adminEmail}
                                                onBlur={formikAdminData.handleBlur}
                                                error={formikAdminData.touched.adminEmail && Boolean(formikAdminData.errors.adminEmail)}
                                                helperText={formikAdminData.touched.adminEmail && formikAdminData.errors.adminEmail}
                                                label="Email" variant="standard" />
                                            {/* </FormControl>   */}

                                            <FormControl fullWidth variant="standard">
                                                <InputLabel htmlFor="adminPassword" sx={{ color: formikAdminData.touched.adminPassword && Boolean(formikAdminData.errors.adminPassword) ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)' }} color={formikAdminData.touched.adminPassword && Boolean(formikAdminData.errors.adminPassword) ? 'error' : 'primary'}>Password</InputLabel>
                                                <Input
                                                    onKeyUp={handlePassword}
                                                    id="adminPassword"
                                                    name='adminPassword'
                                                    onChange={formikAdminData.handleChange}
                                                    onBlur={formikAdminData.handleBlur}
                                                    value={formikAdminData.values.adminPassword}
                                                    error={formikAdminData.touched.adminPassword && Boolean(formikAdminData.errors.adminPassword)}
                                                    type={showPassword ? 'text' : 'password'}
                                                    endAdornment={
                                                        (values.length === 0) ? '' :
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                    }
                                                />
                                                <Typography variant='caption' color='error'>{formikAdminData.touched.adminPassword && formikAdminData.errors.adminPassword}</Typography>
                                            </FormControl>
                                            <Button type='submit' variant="contained" sx={{ textTransform: "capitalize", fontSize: "16px", backgroundColor: "#0d6efd", marginTop: '40px!important' }}>
                                                Login
                                            </Button>
                                        </Stack>

                                    </CardContent>

                                </Card>

                            </Grid>
                        </Grid>
                    </form>
                </Box>

            </Container>
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
        </Box>
    )
}

export default AdminLogin