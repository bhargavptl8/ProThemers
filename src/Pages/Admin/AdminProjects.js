import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Typography, Stack, TextField, Autocomplete, useTheme, useMediaQuery, styled, Paper, Grid, Container, Button, Modal, Backdrop, Fade, InputLabel, IconButton } from '@mui/material';

import Slider from "react-slick";

import { DataGrid } from '@mui/x-data-grid';

//React icon
import { BsDownload } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";

import {
  Link
} from "react-router-dom";
import axios from 'axios';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2.5),
  textAlign: 'center',
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


const users = ['bhargav', 'ravi', 'hardik'];



const AdminProjects = () => {


  const theme = useTheme();

  // breakPoints  
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  // const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const [categoryData, setCategoryData] = useState([]);

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

  // console.log('categoryData', categoryData);

  const [userAllProjectData, setUserAllProjectData] = useState([]);

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

  console.log('userAllProjectData', userAllProjectData);


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



  //  console.log(userAllProjectData.map((el) => el.user.fname));

  useEffect(() => {
    getCategoryData();
    getUserAllProjectData();
    getUserData();
  }, [])

  const [findData, setFindData] = useState();

  const filterData = (projectId) => {
    console.log(projectId);
    setFindData(userAllProjectData.find((el) => el._id === projectId));
  }

  console.log('findData', findData);

  let [filterProjectData, setFilterProjectData] = useState([]);

  const [filterUser, setFilterUser] = useState();
  const [filterCategory, setFilterCategory] = useState();

  console.log('filterCategory',filterCategory);
  console.log('filterUser',filterUser);

  useEffect(() => {
    filterProjectData = [ ];

    if (filterUser) {
      filterProjectData = userAllProjectData.filter((project) => project?.user?._id === filterUser?._id)
    }

    if (filterCategory) {
      filterProjectData = userAllProjectData.filter((el) => el?.category === filterCategory);
    }

    if(filterUser && filterCategory)
    {
      filterProjectData = userAllProjectData.filter((project) => project?.user?._id === filterUser?._id  && project?.category === filterCategory)
    }

    setFilterProjectData(filterProjectData);

  }, [filterCategory, filterUser])

  // console.log("categoryData=====", categoryData);


  // screenshots slider 
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };


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
                // size='small'
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
                // size='small'
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
                // size='small'
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
                // size='small'
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

              {/* <Grid item sm={4} xs={12}>
                 <InputLabel className='fw-600'>Project Zip</InputLabel>
               </Grid>
               <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
 
                 <Grid container alignItems='center'>
                   <Grid item xs={5}>
                     <StyledInput
                       type="file"
                       onChange={handleFileChange}
                       id="file-input"
                     />
                     <label htmlFor="file-input">
                       <StyledButton component="span" className='choosen-btn'>
                         Choose File
                       </StyledButton>
                     </label>
                   </Grid>
                   <Grid item xs={7}>
                     <Typography variant="subtitle2" overflow='auto' width='100%'>
                       {fileName}
                     </Typography>
                   </Grid>
                 </Grid>
               </Grid> */}

              <Grid item xs={12} textAlign='center' marginBottom={isSm ? '0px' : '16px'}>
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
      renderCell: (params) => {
        return <Stack direction="row" spacing={1}>
          {params.value}
        </Stack>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 170,
      editable: false,
    },
  ];


  const rows = filterProjectData.map((projectData, projectId) => (
    { id: projectId + 1, productName: projectData.projectName, userName: projectData.user?.fname + ' ' + projectData.user?.lname, emailId: projectData.user?.email, viewProduct: <Button variant="contained" sx={{ borderRadius: '18px', textTransform: 'capitalize' }} color='success' size='small' onClick={() => { handleProjectDetailsModalOpen(); filterData(projectData._id) }}>view details</Button>, status: projectData.status }
  ))


  return (
    <Box>
      <Typography variant="h5"  >
        Project
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" marginBottom="30px">
        <Link className="Breadcrumb" style={{ color: "#808080", fontSize: "14px", textDecoration: "none" }} to="/admin">
          Home
        </Link>
        <Typography color="#273246" fontSize="14px">Project</Typography>
      </Breadcrumbs>


      <Grid container spacing={5} >

        <Grid item sm={6} xs={12}>
          <Item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Autocomplete
              disablePortal
              onChange={(e, value) => setFilterUser(value)}
              options={userData}
              getOptionLabel={(value) => value?.fname + ' ' + value?.lname}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="User" variant='standard' size='small' />}
            />
          </Item>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Autocomplete
              disablePortal
              onChange={(e, value) => setFilterCategory(value?._id)}
              options={categoryData}
              getOptionLabel={(value) => value?.category}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Category" variant='standard' size='small' />}
            />
          </Item>
        </Grid>

        <Grid item xs={12}>
          <Item> 
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
    </Box>
  )
}

export default AdminProjects