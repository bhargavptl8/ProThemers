import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Grid, Typography, styled, Paper, Stack, Button, Modal, Backdrop, Fade, useMediaQuery, useTheme, TextField, InputLabel, IconButton, Autocomplete } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Slider from "react-slick";


//React icon
import { BsDownload } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Link
} from "react-router-dom";
import axios from 'axios';

import { toast } from 'react-toastify';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2.5),
  color: theme.palette.text.secondary,
}));


//Modal 
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};



const Dashboard = () => {

  const theme = useTheme();


  // const classes = useStyles();

  // breakPoints  
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  // const isMd = useMediaQuery(theme.breakpoints.up('md'));


  // screenshots slider 
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [categoryData, setCategoryData] = useState([]);

  const [userAllProjectData, setUserAllProjectData] = useState([]);

  const [findData, setFindData] = useState();

  const filterData = (projectId) => {
    console.log(projectId);
    setFindData(userAllProjectData.find((el) => el._id === projectId));
  }

  console.log('findData', findData);


  const getCategoryData = () => {
    axios.get('https://pro-themers-backend.onrender.com/admin/category/read')
      .then((res) => {
        // console.log(res);
        setCategoryData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  console.log('categoryData',categoryData);


  const getUserAllProjectData = () => {

    let Token = localStorage.getItem('adminToken');

    axios.get('https://pro-themers-backend.onrender.com/admin/project/read', { headers: { Authorization: Token } })
      .then((res) => {
        console.log(res);
        setUserAllProjectData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const [userData, setUserData] = useState([]);

  const getUserData = () => {

    let Token = localStorage.getItem('adminToken');
    axios.get('https://pro-themers-backend.onrender.com/users/alldata/read', { headers: { Authorization: Token } })
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
    getUserAllProjectData();
    getUserData();
  }, [])

  console.log('userAllProjectData========', userAllProjectData);

  // console.log('data====',userAllProjectData.filter((el) => el.status === 'Pendding'));

  const Status = ['Pendding', 'Rejected', 'Approved'];


  const statusSchema = Yup.object().shape({
    Status: Yup.string().required('Required'),

  });

  const formikStatus = useFormik({
    initialValues: {
      Status: '',
    },
    validationSchema: statusSchema,
    // enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {

      let Token = localStorage.getItem('adminToken');

      axios.patch(`https://pro-themers-backend.onrender.com/admin/project/update/${findData._id}`, { status: values.Status },{headers: {Authorization : Token}})
        .then((res) => {
          console.log("fsddddddddddddddddddddddddd",res);
          resetForm();
          handleStatusModalClose();
          getUserAllProjectData();
          toast('Status update');
        })
        .catch((err) => {
          console.log(err);
        })
    }

  })

  // Modal-status
  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const handleStatusModalOpen = () => setOpenStatusModal(true);
  const handleStatusModalClose = () => { setOpenStatusModal(false); formikStatus.resetForm(); }


  const ModalStatus = (
    <Modal
      open={openStatusModal}
      onClose={handleStatusModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openStatusModal}>
        <Box sx={style} width={isSm ? 450 : 290}   >

          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px' marginBottom='30px'>
            <IconButton aria-label="delete" onClick={handleStatusModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>

          {/* <Typography variant="h5" textAlign='center' id="transition-modal-title" className='fw-600' marginTop='10px' marginBottom='20px'>
            Status
          </Typography> */}

          <Box component='form' onSubmit={formikStatus.handleSubmit} >

            <Grid container alignItems='center' spacing={isSm ? 2 : 0}>

              <Grid item sm={4} xs={12}>
                <InputLabel className='fw-600'>Status</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                <Autocomplete
                  disablePortal
                  id="Status"
                  name='Status'
                  onChange={(e, value) => formikStatus.setFieldValue("Status", value)}
                  options={Status}
                  fullWidth
                  renderInput={(params) => <TextField {...params}
                    variant='standard'
                    onBlur={formikStatus.handleBlur}
                    error={formikStatus.touched.Status && Boolean(formikStatus.errors.Status)}
                    helperText={formikStatus.touched.Status && formikStatus.errors.Status}
                  />}
                />
              </Grid>
              <Grid item xs={12} textAlign='center' marginTop='16px' marginBottom={isSm ? '0px' : '16px'}>
                <Button variant="contained" type='submit' >
                  submit
                </Button>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )





  // Modal-Project-Details
  const [openProjectDetailsModal, setOpenProjectDetailsModal] = React.useState(false);
  const handleProjectDetailsModalOpen = () => setOpenProjectDetailsModal(true);
  const handleProjectDetailsModalClose = () => setOpenProjectDetailsModal(false);


  const ModalProjectDetails = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openProjectDetailsModal}
      onClose={handleProjectDetailsModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openProjectDetailsModal}>
        <Box sx={style} width={isSm ? 450 : 290} className='ModalScroll' >

          <Stack direction='row' justifyContent='flex-end' alignItems='center' position='relative' height='0px'>
            <IconButton aria-label="delete" onClick={handleProjectDetailsModalClose} position='absolute' sx={{ top: '0px', right: '-15px' }}>
              <IoCloseCircleOutline />
            </IconButton>
          </Stack>
          <Typography variant="h5" textAlign='center' id="transition-modal-title" className='fw-600' marginTop='10px' marginBottom='20px'>
            Project Detail's
          </Typography>
          <Box component='form' >

            <Grid container alignItems='center' spacing={isSm ? 2 : 0}>

              <Grid item sm={4} xs={12}>
                <InputLabel className='fw-600'>Project Name</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                <TextField

                  defaultValue={findData?.projectName}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <InputLabel className='fw-600'>Category</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                <TextField
                    defaultValue={categoryData.find((el) => el._id === findData?.category)?.category}
                  InputProps={{
                    readOnly: true,
                  }}

                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <InputLabel className='fw-600'>Technology Use</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                <TextField
                  defaultValue={findData?.technology}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <InputLabel className='fw-600'>Tags</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={isSm ? '10px' : '16px'}>
                <TextField
                  defaultValue={findData?.tags}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item sm={4} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                <InputLabel className='fw-600'>ScreenShots</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                <Box paddingX='40px'>
                  <Slider {...settings}>
                    <div className='imageContainer'>
                      <img src={`https://pro-themers-backend.onrender.com/images/${findData?.screenshorts[0]}`} className='sliderImg' alt='img-1' />
                    </div>
                    <div className='imageContainer'>
                      <img src={`https://pro-themers-backend.onrender.com/images/${findData?.screenshorts[1]}`} className='sliderImg' alt='img-2' />
                    </div>
                    <div className='imageContainer'>
                      <img src={`https://pro-themers-backend.onrender.com/images/${findData?.screenshorts[2]}`} className='sliderImg' alt='img-3' />
                    </div>
                  </Slider>
                </Box>
              </Grid>
              <Grid item sm={4} xs={12} marginBottom={isSm ? '16px' : '0px'}>
                <InputLabel className='fw-600'>Project Link</InputLabel>
              </Grid>
              <Grid item sm={8} xs={12} marginBottom={'16px'}>
                <TextField
                  defaultValue={findData?.projectLink}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: isSm ? '0px' : '16px' }}>
                <a href={'https://pro-themers-backend.onrender.com/images/' + findData?.projectZip}
                  download>
                  <Button variant="contained" endIcon={<BsDownload size={16} style={{ marginRight: '4px' }} />} sx={{ textTransform: 'capitalize' }} >
                    download .zip
                  </Button>
                </a>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )


  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 150,
      editable: false,
    },
    {
      field: 'userName',
      headerName: 'User Name',
      width: 150,
      editable: false,
    },
    {
      field: 'emailId',
      headerName: 'Email Id',
      width: 200,
      editable: false,
    },

    {
      field: 'viewProduct',
      headerName: 'View Product',
      // description: 'This column only view product and is not sortable.',
      sortable: false,
      editable: false,
      width: 160,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <Stack direction="row" spacing={1}>
          {params.value}
          {/* <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='success' size='small' onClick={handleProjectDetailsModalOpen} >view details</Button> */}
        </Stack>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      // description: 'This column only view product and is not sortable.',
      sortable: false,
      editable: false,
      width: 160,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <Stack direction="row" spacing={1}>
          {params.value}
          {/* <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='success' size='small' onClick={handleProjectDetailsModalOpen} >view details</Button> */}
        </Stack>;
      },
    },
  ];


  const rows = userAllProjectData.filter((el) => el.status === 'Pendding').map((projectData, projectId) => (
    { id: projectId + 1, productName: projectData.projectName, userName: projectData.user?.fname + ' ' + projectData.user?.lname, emailId: projectData.user?.email, viewProduct: <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='success' size='small' onClick={() => { handleProjectDetailsModalOpen(); filterData(projectData._id) }}>view details</Button>, status: <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='warning' size='small' onClick={() => { handleStatusModalOpen(); filterData(projectData._id) }} >status</Button> }
  ))

  // const rows = [
  //   { id: 1, productName: 'Snow', userName: 'Jon', emailId: 'xyz@gmail.com', viewProduct: <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='success' size='small' onClick={handleProjectDetailsModalOpen} >view details</Button>, status: <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='warning' size='small' onClick={handleStatusModalOpen} >status</Button> },

  // ];



  return (
    <Box>
      <Typography variant="h5"  >
        Dashboard
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" marginBottom="30px">
        <Link className="Breadcrumb" style={{ color: "#808080", fontSize: "14px", textDecoration: "none" }} to="/admin">
          Home
        </Link>
        <Typography color="#273246" fontSize="14px"> Dashboard</Typography>
      </Breadcrumbs>


      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <Item>
            <Typography variant="h5" textAlign='center' className='fw-600' gutterBottom>
              Total User's
            </Typography>
            <Typography fontSize='35px' textAlign='center' className='fw-600'>
              {userData?.length}
            </Typography>
          </Item>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Item>
            <Typography variant="h5" textAlign='center' className='fw-600' gutterBottom>
              Total Project's
            </Typography>
            <Typography fontSize='35px' textAlign='center' className='fw-600'>
              {userAllProjectData?.length}
            </Typography>
          </Item>
        </Grid>

        <Grid item xs={12}>

          <Item>
            <Typography variant="h5" textAlign='center' marginBottom='18px' className='fw-600' >
              Pending Product's
            </Typography>

            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                // checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>

          </Item>

        </Grid>

      </Grid>
      {ModalProjectDetails}
      {ModalStatus}
    </Box>
  );
}

export default Dashboard