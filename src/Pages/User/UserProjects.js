import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Container, Grid, styled, Paper, Modal, Backdrop, Fade, InputLabel, useTheme, useMediaQuery, Stack, IconButton, Typography, TextField, Button, Divider, Breadcrumbs } from '@mui/material';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

import Slider from "react-slick";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActions } from '@mui/material';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

//React icon

import { IoCloseCircleOutline } from "react-icons/io5";
import axios from 'axios';

import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

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

const StyledInput = styled('input')({
    display: 'none', // Hide the input element
});

const StyledButton = styled(Button)({
    backgroundColor: '#4014147d',
    borderRadius: '15px',
    color: 'white',
    fontSize: '13px',
    textTransform: 'capitalize',
    padding: '5px 12px'
});


const UserProjects = () => {

    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.up('sm'));


    const [initialValues, setInitialValues] = useState({
        projectName: '',
        Category: '',
        useTechnology: '',
        tags: '',
        projectLink: '',
        projectZip: '',
        projectScreenshots: ''
    })



    const [categoryData, setCategoryData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const getCategoryData = () => {
        let Token = localStorage.getItem('token');

        axios.get('https://pro-themers-backend.onrender.com/admin/category/read', { headers: { Authorization: Token } })
            .then((res) => {
                // console.log(res);
                setCategoryData(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const [userProjectData, setUserProjectData] = useState([]);
    const [filterCategoryData, setFilterCategoryData] = useState([]);
    const [filterStatusData, setFilterStatusData] = useState(null);

    const getUserProjectData = () => {

        let Token = localStorage.getItem('loginToken');

        axios.get('https://pro-themers-backend.onrender.com/users/project/userread',
            {
                headers: {
                    Authorization: Token
                }
            }
        )
            .then((res) => {
                console.log(res);
                setUserProjectData(res.data.data);
                setFilterData(res.data.data)
                setFilterCategoryData([])
                setFilterStatusData(null)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getCategoryData();
        getUserProjectData();
    }, [])

    console.log(filterData)

    useEffect(() => {
        let tempFilterData = [...userProjectData]
        if (filterCategoryData?.length) {
            tempFilterData = tempFilterData.filter((project) => {
                return filterCategoryData.some((filterCategory) => {
                    return project.category.category === filterCategory.category
                })
            })
        }
        if (filterStatusData?.length) {
            tempFilterData = tempFilterData?.filter((el) => el.status == filterStatusData)
        }

        setFilterData(tempFilterData)


    }, [filterStatusData, filterCategoryData])


    console.log('userProjectData========', userProjectData);


    console.log('categoryData====', categoryData);
    //   console.log('selectedCategory====',selectedCategory);


    // single file choose 
    const [projectZip, setProjectZip] = useState('');


    //multiple file choose
    let [projectScreenShots, setProjectScreenShots] = useState([]);


    const [id, setId] = useState();

    const [findData, setFindData] = useState();

    const FindData = (projectId) => {

        console.log(projectId);

        setId(projectId);
        setFindData(userProjectData.find((el) => el._id === projectId));
        let data = userProjectData.find((el) => el._id === projectId);

        console.log('data', data);
        // console.log("data.screenshorts", data.screenshorts);

        setInitialValues({
            projectName: data.projectName,
            Category: data.category?._id,
            useTechnology: data.technology.toString(),
            tags: data.tags.toString(),
            projectLink: data.projectLink,
            projectZip: data.projectZip,
            projectScreenshots: data.screenshorts
        })
        setProjectZip(data.projectZip);
        setProjectScreenShots(data.screenshorts);

    }

    console.log('findData', findData);

    // console.log('screenShots=======', projectScreenShots);


    // Formik Project Detail's

    // const[id,setId] = useState();

    const [projectDetailData, setProjectDetailData] = useState([])


    const projectDetailSchema = Yup.object().shape({
        projectName: Yup.string().required('Required'),
        Category: Yup.string().required('Required'),
        useTechnology: Yup.string().required('Required'),
        tags: Yup.string().required('Required'),
        projectLink: Yup.string().required('Required'),
        projectZip: Yup.mixed().test('is-match', 'Upload your project zip file is Required', (value) => {
            if (!value) {
                return false; // Error condition
            }
            return true; // Validation passes
        }),
        projectScreenshots: Yup.array()
            .min(3, 'Upload your project of 3 Screen shots is Required')
            .test('is-match', 'Upload your project Screen shots is Required', (value) => {
                if (!value || value.length === 0) {
                    return false; // Error condition
                }
                return true; // Validation passes
            })
    });

    const formikProjectDetail = useFormik({
        initialValues: initialValues,
        validationSchema: projectDetailSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting, resetForm }) => {


            if (id) {

                let formData = new FormData();
                formData.append('projectName', formikProjectDetail.values.projectName);
                formData.append('category', formikProjectDetail.values.Category);
                formData.append('technology', formikProjectDetail.values.useTechnology.split(","));
                formData.append('tags', formikProjectDetail.values.tags.split(","));
                formData.append('projectLink', formikProjectDetail.values.projectLink);
                formData.append('projectZip', formikProjectDetail.values.projectZip);

                formikProjectDetail.values.projectScreenshots.forEach(file => {
                    formData.append('screenshorts', file);
                });

                let Token = localStorage.getItem('loginToken')

                axios.patch(`https://pro-themers-backend.onrender.com/users/project/update/${id}`, formData, { headers: { Authorization: Token } })
                    .then((res) => {
                        console.log(res);
                        setId('');
                        handleProjectDetailsModalClose();
                        getUserProjectData();
                        toast(res.data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
            else {

                let formData = new FormData();
                formData.append('projectName', values.projectName);
                formData.append('category', values.Category);
                formData.append('technology', values.useTechnology.split(","));
                formData.append('tags', values.tags.split(","));
                formData.append('projectLink', values.projectLink);
                formData.append('projectZip', values.projectZip);

                values.projectScreenshots.forEach(file => {
                    formData.append('screenshorts', file);
                });


                // console.log("Project Name:", formData.get('projectName'));
                // console.log("Category:", formData.get('category'));
                // console.log("Technology:", formData.get('technology'));
                // console.log("Tags:", formData.get('tags'));
                // console.log("Project Link:", formData.get('projectLink'));
                // console.log("Project Zip:", formData.get('projectZip'));
                // console.log("Screenshots:", formData.getAll('screenshorts'));

                // values.projectScreenshots.map((_,i) => (
                // console.log("Screenshots:", formData.get(`screenshorts[${i}]`))
                // ))


                let Token = localStorage.getItem('loginToken');

                axios.post('https://pro-themers-backend.onrender.com/users/project/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: Token
                    }
                })
                    .then((res) => {
                        console.log(res);
                        setSubmitting(values.projectName = '', values.Category = '', values.useTechnology = '', values.tags = '', values.projectLink = '', values.projectZip = '', values.projectScreenshots = '', setProjectZip(''), setProjectScreenShots([]));
                        resetForm();
                        setInitialValues({
                            projectName: '',
                            Category: null,
                            useTechnology: '',
                            tags: '',
                            projectLink: '',
                            projectZip: '',
                            projectScreenshots: ''
                        })
                        handleProjectDetailsModalClose();
                        getUserProjectData();
                        toast(res.data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        }

    })


    console.log('projectDetailData========', projectDetailData);





    // slider 
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    //Status

    const Status = ['Pendding', 'Rejected', 'Approved'];


    // Modal-Project-Details
    const [openProjectDetailsModal, setOpenProjectDetailsModal] = React.useState(false);
    const handleProjectDetailsModalOpen = () => setOpenProjectDetailsModal(true);
    const handleProjectDetailsModalClose = () => {
        setOpenProjectDetailsModal(false); setInitialValues({
            projectName: '',
            Category: null,
            useTechnology: '',
            tags: '',
            projectLink: '',
            projectZip: '',
            projectScreenshots: ''
        }); setProjectZip('');
        setProjectScreenShots('');
        setId('');
        formikProjectDetail.resetForm();
    }


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

                    <Box component='div' >
                        <form onSubmit={formikProjectDetail.handleSubmit} >

                            <Grid container alignItems='center' spacing={isSm ? 2 : 0}>

                                <Grid item sm={4} xs={12}>
                                    <InputLabel className='fw-600'>Project Name</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        id="projectName"
                                        name='projectName'
                                        onChange={formikProjectDetail.handleChange}
                                        onBlur={formikProjectDetail.handleBlur}
                                        value={formikProjectDetail.values.projectName}
                                        error={formikProjectDetail.touched.projectName && Boolean(formikProjectDetail.errors.projectName)}
                                        helperText={formikProjectDetail.touched.projectName && formikProjectDetail.errors.projectName}
                                    />
                                </Grid>
                                <Grid item sm={4} xs={12}>
                                    <InputLabel className='fw-600'>Category</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                                    <Autocomplete
                                        disablePortal
                                        id="Category"
                                        name='Category'
                                        onChange={(e, value) =>

                                            // console.log('value',value)
                                            formikProjectDetail.setFieldValue("Category", value?._id)
                                        }
                                        options={categoryData}
                                        getOptionLabel={(values) => values?.category}
                                        fullWidth

                                        renderInput={(params) => <TextField {...params}
                                            label={id ? (findData?.category?._id === formikProjectDetail.values.Category) ? findData?.category?.category : '' : ''}
                                            variant='standard'
                                            onBlur={formikProjectDetail.handleBlur}
                                            error={formikProjectDetail.touched.Category && Boolean(formikProjectDetail.errors.Category)}
                                            helperText={formikProjectDetail.touched.Category && formikProjectDetail.errors.Category}

                                        />}
                                    />
                                </Grid>
                                {/* <Grid item xs={12}>
                                {formikProjectDetail.touched.Category && formikProjectDetail.errors.Category}

                                </Grid> */}
                                <Grid item sm={4} xs={12}>
                                    <InputLabel className='fw-600'>Technology Use</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        id="useTechnology"
                                        name='useTechnology'
                                        onChange={formikProjectDetail.handleChange}
                                        onBlur={formikProjectDetail.handleBlur}
                                        value={formikProjectDetail.values.useTechnology}
                                        error={formikProjectDetail.touched.useTechnology && Boolean(formikProjectDetail.errors.useTechnology)}
                                        helperText={formikProjectDetail.touched.useTechnology && formikProjectDetail.errors.useTechnology}
                                    />
                                </Grid>
                                <Grid item sm={4} xs={12}>
                                    <InputLabel className='fw-600'>Tags</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        id="tags"
                                        name='tags'
                                        onChange={formikProjectDetail.handleChange}
                                        onBlur={formikProjectDetail.handleBlur}
                                        value={formikProjectDetail.values.tags}
                                        error={formikProjectDetail.touched.tags && Boolean(formikProjectDetail.errors.tags)}
                                        helperText={formikProjectDetail.touched.tags && formikProjectDetail.errors.tags}
                                    />
                                </Grid>
                                <Grid item sm={4} xs={12} >
                                    <InputLabel className='fw-600'>Project Link</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={'16px'}>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        id="projectLink"
                                        name='projectLink'
                                        onChange={formikProjectDetail.handleChange}
                                        onBlur={formikProjectDetail.handleBlur}
                                        value={formikProjectDetail.values.projectLink}
                                        error={formikProjectDetail.touched.projectLink && Boolean(formikProjectDetail.errors.projectLink)}
                                        helperText={formikProjectDetail.touched.projectLink && formikProjectDetail.errors.projectLink}
                                    />
                                </Grid>

                                <Grid item sm={4} xs={12} marginBottom={isSm ? '0px' : '10px'}>
                                    <InputLabel className='fw-600'>Project Zip</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>

                                    <Grid container alignItems='center'>
                                        <Grid item xs={5}>
                                            <input
                                                id="projectZip"
                                                name="projectZip"
                                                type="file"
                                                onChange={(event) => {
                                                    let file = event.currentTarget.files[0];
                                                    formikProjectDetail.setFieldValue("projectZip", file);
                                                    setProjectZip(file?.name)
                                                    // setUserImg(file?.name);
                                                }}
                                                onBlur={formikProjectDetail.handleBlur}
                                                style={{ display: 'none' }} // You might want to hide the input field visually and use a custom button
                                            />
                                            <label htmlFor="projectZip">
                                                <StyledButton component="span" className='choosen-btn'>
                                                    Choose File
                                                </StyledButton>
                                            </label>
                                            {/* <StyledInput
                                            type="file"
                                            onChange={handleSingleFileChange}
                                            id="singleFile-input"
                                        /> */}
                                            {/* <label htmlFor="singleFile-input">
                                            <StyledButton component="span" className='choosen-btn'>
                                                Choose File
                                            </StyledButton>
                                        </label> */}
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography variant="subtitle2" overflow='auto' width='100%'>
                                                {projectZip}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {formikProjectDetail.touched.projectZip && formikProjectDetail.errors.projectZip && (
                                                <Typography variant="caption" color="error">
                                                    {formikProjectDetail.errors.projectZip}
                                                </Typography>
                                            )}

                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item sm={4} xs={12} marginBottom={isSm ? '0px' : '10px'}>
                                    <InputLabel className='fw-600'>ScreenShots</InputLabel>
                                </Grid>
                                <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>
                                    <Grid container alignItems='center'>
                                        <Grid item xs={5}>
                                            <input
                                                id="projectScreenshots"
                                                name="projectScreenshots"
                                                type="file"
                                                multiple
                                                // onChange={handleMultiFileChange}
                                                onChange={(event) => {

                                                    // // setUserImg(file?.name);
                                                    // setProjectScreenShots(file?.name)

                                                    let multiFile = [];

                                                    const file = event.target.files;

                                                    // console.log('file======',file[0]);
                                                    // console.log('file======',file[1]);
                                                    // console.log('file======',file[2]);

                                                    let projectScreenShotsFile = [...file];
                                                    console.log(projectScreenShotsFile);

                                                    // formikProjectDetail.setFieldValue("projectScreenshots", file);
                                                    formikProjectDetail.setFieldValue("projectScreenshots", projectScreenShotsFile);

                                                    // console.log('file=====',file);

                                                    if (file.length === 0) {
                                                        setProjectScreenShots([]);
                                                    }
                                                    else {
                                                        let fileNamesArray = [];

                                                        multiFile = [...file];

                                                        multiFile.forEach((file) => {
                                                            fileNamesArray.push(file?.name);
                                                            setProjectScreenShots(fileNamesArray)
                                                            // console.log(fileNamesArray);
                                                        })

                                                    }


                                                }}
                                                onBlur={formikProjectDetail.handleBlur}
                                                style={{ display: 'none' }} // You might want to hide the input field visually and use a custom button
                                            />
                                            <label htmlFor="projectScreenshots">
                                                <StyledButton component="span" className='choosen-btn'>
                                                    Choose File
                                                </StyledButton>
                                            </label>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography variant="subtitle2" overflow='auto' width='100%'>
                                                {/* {projectScreenShots} */}
                                                {projectScreenShots?.length > 0 && projectScreenShots.length}
                                                {/* {projectScreenShots?.map((filename, i) => (
                                                    <React.Fragment key={i}>
                                                        {filename}
                                                        <br></br>
                                                        <hr></hr>
                                                    </React.Fragment>
                                                )
                                                )} */}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {formikProjectDetail.touched.projectScreenshots && formikProjectDetail.errors.projectScreenshots && (
                                                <Typography variant="caption" color="error">
                                                    {formikProjectDetail.errors.projectScreenshots}
                                                </Typography>
                                            )}

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} textAlign='center' marginTop='16px' marginBottom={isSm ? '0px' : '16px'}>
                                    <Button variant="contained" type='submit'>
                                        submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )


    return (
        <>
            <Box>

                {/* <Typography variant="h5"  >
                      Profile
                    </Typography> */}
                <Breadcrumbs aria-label="breadcrumb">
                    {/* <Link className="Breadcrumb" style={{ color: "#899bbd", fontSize: "14px", textDecoration: "none" }} to="/user">
                        Home
                    </Link> */}
                    <Typography color="#899bbd" fontSize="14px">Home</Typography>
                    <Typography color="#899bbd" fontSize="14px">User</Typography>
                    <Typography color="#273246" fontSize="14px">Project</Typography>
                </Breadcrumbs>
                <Box className='section-py'>
                    <Container maxWidth="md">
                        <Grid container spacing={4}>
                            <Grid item sm={6} xs={12} >
                                <Item sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Autocomplete
                                        multiple
                                        onChange={(e, value) => setFilterCategoryData(value)}
                                        options={categoryData}
                                        sx={{ width: 300, maxWidth: '100%' }}
                                        getOptionLabel={(value) => value?.category}
                                        // defaultValue={[top100Films[10]]}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Category"
                                                size='small'
                                            />
                                        )}
                                    />
                                </Item>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Item sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Autocomplete
                                        disablePortal
                                        onChange={(e, value) => setFilterStatusData(value)}
                                        options={Status}
                                        sx={{ width: 300, maxWidth: '100%' }}
                                        renderInput={(params) => <TextField {...params} label="Status" variant='standard' size='small' />}
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={12}>
                                {/* <Item> */}
                                <Button variant="contained" onClick={() => {
                                    setInitialValues({
                                        projectName: '',
                                        Category: null,
                                        useTechnology: '',
                                        tags: '',
                                        projectLink: '',
                                        projectZip: '',
                                        projectScreenshots: ''
                                    }); handleProjectDetailsModalOpen()
                                }}>Add Project</Button>
                                {/* </Item> */}

                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box sx={{paddingTop : '20px',paddingBottom : '60px'}}>
                    <Grid container spacing={5}>
                        {
                            filterData.map((projectData, projectIndex) => (
                                <Grid item lg={4} md={6} sm={6} xs={12} key={projectIndex}>
                                    <Card className="project-card">
                                        <CardMedia sx={{ borderBottom: '1px solid #e3e3e3', height: '200px' }}>
                                            <Slider {...settings} className='User-Project-slider'>
                                                <div className='img-container'>
                                                    <img src={`https://pro-themers-backend.onrender.com/images/${projectData.screenshorts[0]}`} width='100%' height='100%' alt='img-1' />
                                                </div>
                                                <div >
                                                    <img src={`https://pro-themers-backend.onrender.com/images/${projectData.screenshorts[1]}`} width='100%' height='100%' alt='img-2' />
                                                </div>
                                                <div >
                                                    <img src={`https://pro-themers-backend.onrender.com/images/${projectData.screenshorts[2]}`} width='100%' height='100%' alt='img-3' />
                                                </div>
                                            </Slider>
                                        </CardMedia>
                                        <CardContent sx={{ padding: '16px 16px 10px' }}>
                                            <Stack direction='row' alignItems='center' divider={<Divider orientation="vertical" flexItem />} spacing={1} marginBottom='5px'>
                                                <Typography variant="h6" className='fw-600' component="div" noWrap>
                                                    {projectData.projectName}
                                                </Typography>
                                                <Typography variant="subtitle2" >
                                                    {projectData.category?.category}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">
                                                {projectData.technology}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => { handleProjectDetailsModalOpen(); FindData(projectData._id) }} >view detail's</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
                {ModalProjectDetails}
            </Box>

        </>
    )
}

export default UserProjects;