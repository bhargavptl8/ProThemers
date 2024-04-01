import React, { useEffect, useState } from 'react';
import { Box, Container, CssBaseline, Grid, Toolbar, Typography, useMediaQuery, useTheme, Paper, styled, Button, Rating, Stack, Tooltip, Fab } from '@mui/material';

// pages 
import Header from '../Components/Header';
import Footer from '../Components/Footer';

// images
import imgLogo from '../Images/img-logo.png';

// react icon 
import { IoEyeSharp } from "react-icons/io5";
import { BsDownload } from "react-icons/bs";

import axios from 'axios';
import Aos from 'aos';
import { toast } from 'react-toastify';

import 'aos/dist/aos.css';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const Details = () => {

    const theme = useTheme();

    // breakPoints  
    const isSm = useMediaQuery(theme.breakpoints.up('sm'));

    const [projectData, setProjectData] = useState([]);

    const getProjectData = () => {

        let projectId = sessionStorage.getItem('projectId');

        axios.get(`http://localhost:3000/landingpage/project/read/${projectId}`)
            .then((res) => {
                // console.log(res);
                setProjectData(res.data.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    console.log('projectData', projectData);

    //  category Data 
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

    console.log('categoryData2', categoryData);

    const downloadUpdate = () => {

        let projectId = sessionStorage.getItem('projectId');

        axios.patch(`http://localhost:3000/landingpage/project-details/update/${projectId}`)
            .then((res) => {
                console.log(res);
                getProjectData();
            })
            .catch((err) => {
                console.log(err);
            })
    }


    useEffect(() => {
        getProjectData();
        getCategoryData();
        Aos.init();
        window.scrollTo(0, 0);
        // sessionStorage.setItem('value',null);
    }, [])

    let CategoryId = sessionStorage.getItem('categoryId');

    return (
        <>
            <Header />

            <Box component='main' sx={{ p: 3 }} className='bg-default'>
                <CssBaseline />
                <Toolbar sx={{ position: 'absolute', left: '0px', right: '0px', top: '-112px' }} id="back-to-top-anchor" />
                <Container fixed>
                    <section style={{ padding: '60px 0px 0px' }} data-aos="zoom-in" data-aos-duration="1500">
                        <Typography variant="h4" fontSize={isSm ? '2.125rem' : '1.9rem'} fontWeight='bold' textAlign='center' gutterBottom>
                            <span className='primary-color'>{projectData[0]?.projectName}</span>
                        </Typography>
                        <Typography variant="body1" fontSize='18px' textAlign='center' marginBottom='30px'>
                            {categoryData.find((el) => el._id === CategoryId)?.description}
                        </Typography>
                    </section>

                    <section className='section-py'>
                        <Grid container columnSpacing={4} rowSpacing={7} alignItems='center'>
                            <Grid item md={7} xs={12} >
                                <Item data-aos="fade-up-right" data-aos-duration="1500">
                                    <Box sx={{ height: isSm ? '370px' : 'auto' }}>
                                        <img src={`http://localhost:3000/images/${projectData[0]?.screenshorts[0]}`} width='100%' height='100%' alt={projectData[0]?.projectName} />
                                    </Box>
                                    <a href={projectData[0]?.projectLink} target='_blank' rel="noreferrer">
                                        <Button variant='contained' size={isSm ? 'medium' : 'small'} className='bg-primary' sx={{ marginTop: '10px', textTransform: 'capitalize' }} startIcon={<IoEyeSharp />}>live preview</Button>
                                    </a>
                                </Item>
                            </Grid>
                            <Grid item md={5} xs={12} sx={{ overflow: 'hidden' }}>
                                <Item sx={{ padding: '15px' }} data-aos="fade-left" data-aos-duration="1500">
                                    <Box>
                                        <Stack direction='row' spacing={1.5} alignItems='center' marginBottom='20px' justifyContent='center'>
                                            <Tooltip title="Download" arrow>
                                                <a href={`http://localhost:3000/images/${projectData[0]?.projectZip}`} download='download.zip'>
                                                    <Fab size="small" className='bg-primary' sx={{ zIndex: '0' }} aria-label="add" onClick={downloadUpdate}>
                                                        <BsDownload color='#fff' size={18} />
                                                    </Fab>
                                                </a>
                                            </Tooltip>
                                            <Typography fontWeight='bold' overflow='auto'>
                                                {projectData[0]?.download} Downloads
                                            </Typography>

                                        </Stack>
                                        <Grid container>
                                            <Grid item sm={6} xs={12}>
                                                <Typography variant="subtitle1" className='fw-600' sx={{ overflow: 'auto', marginBottom: isSm ? '5px' : '0px' }}>
                                                    Project Name :
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12} sx={{ marginBottom: isSm ? '0px' : '5px' }}>
                                                <Typography variant="subtitle1" textAlign={isSm ? 'start' : 'center'} sx={{ overflow: 'auto' }} gutterBottom >
                                                    {projectData[0]?.projectName}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Typography variant="subtitle1" className='fw-600' sx={{ overflow: 'auto', marginBottom: isSm ? '5px' : '0px' }}  >
                                                    Category :
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12} sx={{ marginBottom: isSm ? '0px' : '5px' }}>
                                                <Typography variant="subtitle1" textAlign={isSm ? 'start' : 'center'} sx={{ overflow: 'auto' }} gutterBottom >
                                                    {categoryData.find((el) => el?._id === projectData[0]?.category)?.category}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Typography variant="subtitle1" className='fw-600' sx={{ overflow: 'auto', marginBottom: isSm ? '5px' : '0px' }}>
                                                    Technology Use :
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12} sx={{ marginBottom: isSm ? '0px' : '5px' }}>
                                                <Typography variant="subtitle1" textAlign={isSm ? 'start' : 'center'} sx={{ overflow: 'auto' }} gutterBottom >
                                                    {projectData[0]?.technology}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Typography variant="subtitle1" className='fw-600' sx={{ overflow: 'auto', marginBottom: isSm ? '5px' : '0px' }}>
                                                    Tags :
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={6} xs={12} sx={{ marginBottom: isSm ? '0px' : '5px' }}>
                                                <Typography variant="subtitle1" textAlign={isSm ? 'start' : 'center'} sx={{ overflow: 'auto' }} gutterBottom >
                                                    {projectData[0]?.tags}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {/* <Typography variant="subtitle1" sx={{ overflow: 'auto' }} gutterBottom >
                                        <span className='fw-600'>Project Name :</span> {projectData[0]?.projectName}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ overflow: 'auto' }} gutterBottom >
                                        <span className='fw-600'>Category :</span> {categoryData.find((el) => el?._id ===  projectData[0]?.category)?.category}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ overflow: 'auto' }} gutterBottom >
                                        <span className='fw-600'>Technology Use :</span> {projectData[0]?.technology}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ overflow: 'auto' }} gutterBottom >
                                        <span className='fw-600'>Tags :</span> {projectData[0]?.tags}
                                    </Typography> */}

                                    {/* <Box >
                                        <Rating name="read-only" value={3} readOnly />
                                    </Box> */}
                                </Item>
                            </Grid>
                        </Grid>
                    </section>


                    <section className='section-py'>
                        <Grid container spacing={8} alignItems='center'>
                            <Grid item md={6} xs={12} sx={{ order: { md: 1, xs: 2 } }}>
                                <Box data-aos="flip-left" data-aos-duration="1500">
                                    <img src={`http://localhost:3000/images/${projectData[0]?.screenshorts[0]}`} width='100%' alt="" />
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ order: { md: 2, xs: 1 } }}>
                                <Box className='imgLogo' sx={{ position: 'relative' }}>
                                    <img src={imgLogo} width='50px' alt="imglogo" className='unfound-img-logo' />
                                    <Typography sx={{ marginLeft: '20px' }}>first img</Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ order: { md: 3, xs: 4 } }}>
                                <Stack alignItems='flex-end' className='imgLogo2' sx={{ position: 'relative' }}>
                                    <img src={imgLogo} width='50px' alt="imglogo" className='unfound-img-logo' />
                                    <Typography sx={{ marginRight: '20px' }}>second img</Typography>
                                </Stack>
                                {/* <Box className='imgLogo' sx={{ position: 'relative' }}> */}
                                {/* <Typography sx={{ marginLeft: '20px' }}>second img</Typography> */}
                                {/* </Box> */}
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ order: { md: 3, xs: 4 } }}>
                                <Box data-aos="flip-right" data-aos-duration="1500">
                                    <img src={`http://localhost:3000/images/${projectData[0]?.screenshorts[1]}`} width='100%' alt="" />
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ order: { md: 5, xs: 6 } }}>
                                <Box data-aos="flip-left" data-aos-duration="1500">
                                    <img src={`http://localhost:3000/images/${projectData[0]?.screenshorts[2]}`} width='100%' alt="" />
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ order: { md: 6, xs: 5 } }}>
                                <Box className='imgLogo' sx={{ position: 'relative' }}>
                                    <img src={imgLogo} width='50px' alt="imglogo" className='unfound-img-logo' />
                                    <Typography sx={{ marginLeft: '20px' }}>last img</Typography>
                                </Box>
                            </Grid>

                        </Grid>

                    </section>

                </Container>


            </Box>

            <Footer />

        </>
    )
}

export default Details;