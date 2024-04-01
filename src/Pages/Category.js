import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, CssBaseline, Grid, InputAdornment, Rating, Stack, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';


// components
import Header from '../Components/Header';
import Footer from '../Components/Footer';


// mui icon 
import SearchIcon from "@mui/icons-material/Search";


import Slider from 'react-slick';
import axios from 'axios';
import Aos from 'aos';
import { ToastContainer, toast } from 'react-toastify';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import 'aos/dist/aos.css';
// import 'react-toastify/dist/ReactToastify.css';

const Category = () => {

  const theme = useTheme();

  const history = useHistory();

  // breakPoints  
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  // slider 
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };


  // const[categoryId,setCategoryId] = useState(sessionStorage.getItem('categoryId'));


  // useEffect(() => {

  //   setCategoryId(sessionStorage.getItem('categoryId'));
  //   getCategoryProjectData();
  // },[categoryId])

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

  // console.log('categoryData2',categoryData);


  const [categoryProjectData, setCategoryProjectData] = useState([]);

  const getCategoryProjectData = () => {

    let categoryId = sessionStorage.getItem('categoryId');

    // console.log('categoryId',categoryId);

    axios.get(`http://localhost:3000/landingpage/category/allread/${categoryId}`)
      .then((res) => {
        // console.log(res);
        setCategoryProjectData(res.data.data.filter((project) => project?.status === 'Approved'))
      })
      .catch((err) => {
        console.log(err);
      })
  }

  console.log('categoryProjectData', categoryProjectData);

  console.log('approved', categoryProjectData.filter((project) => project?.status === 'Approved'));

  useEffect(() => {
    getCategoryProjectData();
    getCategoryData();
    Aos.init();
    window.scrollTo(0, 0);
  }, [])


  const [projectData, setProjectData] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  const [searchTerm, setSearchTerm] = useState();

  // console.log(searchTerm);

  // console.log('search', categoryProjectData.filter((project) => project?.projectName.includes(searchTerm)));

  useEffect(() => {
    setProjectData(categoryProjectData.slice(0, 6));

    if (searchTerm) {
      setProjectData(categoryProjectData.filter((project) => project?.projectName.includes(searchTerm)).slice(0, 6));
    }

    if (viewAll) {
      setProjectData([...categoryProjectData]);

      if (searchTerm) {
        setProjectData(categoryProjectData.filter((project) => project?.projectName.includes(searchTerm)));
      }
    }

  }, [categoryProjectData, viewAll, searchTerm])

  // useEffect(() => {

  //   setProjectData(categoryProjectData.filter((project) => project?.projectName.includes(searchTerm)).slice(0,6));

  // },[searchTerm])

  console.log('projectData', projectData);


  const loadData = () => {
    getCategoryProjectData();
    getCategoryData();
    // Aos.init();
  }


  let CategoryId = sessionStorage.getItem('categoryId');

  return (
    <>
      <Header loadData={loadData} />

      <Box component="main" sx={{ p: 3 }}  className='bg-default'>
        <CssBaseline />
        <Toolbar sx={{ position: 'absolute', left: '0px', right: '0px', top: '-112px' }} id="back-to-top-anchor" />
        <section style={{ padding: '60px 0px' }} >
          <Container fixed>
            <Typography variant="h4" fontSize={isSm ? '2.125rem' : '1.9rem'} fontWeight='bold' textAlign='center' data-aos="zoom-in" data-aos-duration="1000" gutterBottom>
              <span className='primary-color'>{categoryData.find((el) => el._id === CategoryId)?.category}</span> Templates
            </Typography>
            <Typography variant="body1" fontSize='18px' textAlign='center' marginBottom='30px' data-aos="zoom-in" data-aos-duration="1000">
              {categoryData.find((el) => el._id === CategoryId)?.description}
            </Typography>
            <form id='main-search'>
              <Box sx={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: '50px' }} data-aos="fade-down" data-aos-duration="1000">

                <TextField
                  id="search"
                  type="search"
                  label="Search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  sx={{ width: isMd ? '70%' : '100%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />


              </Box>

            </form>
          </Container>
        </section>

        <section className='section-py bg-default' >
          <Container fixed>
            <Stack direction='row' justifyContent='space-between' alignItems='center' marginBottom='60px'>
              <Typography variant="h5" fontWeight='bold' textAlign='left'>
                All <span className='primary-color'>Templates</span>
              </Typography>
              {isSm ?
                (<div>
                  {viewAll ? (
                    <Button variant='contained' size='small' className='bg-secondary' sx={{ textTransform: 'capitalize' }} onClick={() => setViewAll(false)}>View less</Button>
                  ) : (
                    <Button variant='contained' size='small' className='bg-secondary' sx={{ textTransform: 'capitalize' }} onClick={() => setViewAll(true)}>View all</Button>
                  )}
                </div>)
                : ''
              }

            </Stack>

            <Box>
              <Grid container spacing={5}>

                {projectData.map((projectData) => (
                  <Grid item lg={4} md={6} sm={6} xs={12} data-aos="fade-up" data-aos-duration="1500">
                    <Card className="project-card">
                      <CardMedia sx={{ borderBottom: '1px solid #e3e3e3', height: '200px' }}>
                        <Slider {...settings} className='User-Project-slider'>
                          <div className='img-container' >
                            <img src={`http://localhost:3000/images/${projectData?.screenshorts[0]}`} width='100%' height='100%' alt='img-1' />
                          </div>
                          <div className='img-container'>
                            <img src={`http://localhost:3000/images/${projectData?.screenshorts[1]}`} width='100%' height='100%' alt='img-2' />
                          </div>
                          <div className='img-container'>
                            <img src={`http://localhost:3000/images/${projectData?.screenshorts[2]}`} width='100%' height='100%' alt='img-3' />
                          </div>
                        </Slider>
                      </CardMedia>
                      <CardContent sx={{ padding: '16px 16px 10px' }}>
                        <Stack spacing={0.7} >
                          {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                           <Rating name="read-only" value={3} readOnly sx={{ fontSize: '20px' }} />
                         </div> */}
                          <Typography variant="h6" className='fw-600' noWrap>
                            {projectData?.projectName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {projectData?.technology}
                          </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ padding: '8px 16px' }}>
                        <Stack direction='row' width='100%' justifyContent='space-between' alignItems='center'>
                          <Button size="small" sx={{ textTransform: 'capitalize', fontSize: '15px' }} onClick={() => { sessionStorage.setItem('projectId', projectData?._id); history.push('/detail') }} >view detail's</Button>
                          <a href={projectData?.projectLink} target='_blank' rel="noreferrer">
                            <Button size="small" variant="outlined" sx={{ textTransform: 'capitalize' }}>live preview</Button>
                          </a>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}

              </Grid>
              {isSm ? ''
                : (<div style={{ textAlign: 'end', marginTop: '30px' }}>
                  {viewAll ? (
                    <Button variant='contained' size='small' className='bg-secondary' sx={{ textTransform: 'capitalize' }} onClick={() => setViewAll(false)}>View less</Button>
                  ) : (
                    <Button variant='contained' size='small' className='bg-secondary' sx={{ textTransform: 'capitalize' }} onClick={() => setViewAll(true)}>View all</Button>
                  )}
                </div>)
              }
            </Box>
          </Container>
        </section>

      </Box>

      <Footer />
    </>
  )
}

export default Category;