import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, CssBaseline, useMediaQuery, Toolbar, Card, CardActionArea, CardContent, CardMedia} from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@emotion/react';


// images 
import heroImg from '../Images/hero-img.png';
import tamplateImg from '../Images/template.png';
import MedalImg from '../Images/medal-img.png';
import ChatImg from '../Images/chat-img.png';
import AwardImg from '../Images/Award-img.png';

// components
import Header from '../Components/Header';
import Footer from '../Components/Footer';


import axios from 'axios';

import Aos from 'aos';
import 'aos/dist/aos.css';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const LandingPage = () => {

  const theme = useTheme();

  const history = useHistory();

  // breakPoints  
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  // const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));


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

  useEffect(() => {
    getCategoryData();
    sessionStorage.setItem('value', null);
    Aos.init();
    window.scrollTo(0, 0);
  }, [])

  console.log('categoryData====', categoryData);

  return (
    <>
      <Header />
      <Box component="main" position='relative' sx={{ p: 3 }}>
        <CssBaseline />

        <Toolbar sx={{ position: 'absolute', left: '0px', right: '0px', top: '-112px' }} id="back-to-top-anchor" />

        <section id='hero'>
          <Container fixed>
            <Box sx={{ flexGrow: 1 }} padding={isLg ? '0px' : '30px 0px'}>
              <Grid container spacing={3} alignItems='center'>
                <Grid item md={6} xs={12} >
                  <Box data-aos="zoom-in" data-aos-duration="1000">
                    <Typography variant="h4" fontSize={isSm ? '2.5rem' : '1.75rem'} paddingTop={isLg ? '0px' : '20px'} className='fw-600' gutterBottom>
                      Professional <span className='primary-color'>Themes</span> & Website <span className='primary-color'>Templates</span> for any project
                    </Typography>
                    <Typography variant="body1" fontSize={isSm ? '18px' : '16px'} marginBottom='30px'>
                      Easy to customize themes, templates  made by world-class developers.
                    </Typography>
                    {/* <Button variant='contained' sx={{ borderRadius: '8px', textTransform: 'capitalize' }} href='#category'>Explore...</Button> */}
                  </Box>
                  {/* <form id='main-search'>
                <Box position='relative' marginBottom={isMd ? '0px' : '18px'}>
                  <TextField fullWidth id="landing-search" color='error' sx={{ backgroundColor: '#fff', border: 'none!Important' }} />
                  <Button variant="contained" sx={{ textTransform: 'capitalize', position: 'absolute', right: '16px', top: '13px' }} className='bg-primary' size={isSm ? 'medium' : 'small'}>search</Button>

                </Box>
              </form> */}
                </Grid>
                <Grid item md={6} xs={12} sx={{ overflow: 'hidden' }}>
                  <Box data-aos="fade-left" data-aos-duration="1500">
                    <img src={heroImg} alt='main-img' style={{ display: 'block', maxWidth: '100%' }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>

        </section>

        <section id='category' className='bg-default section-py'>
          <Container fixed sx={{ padding: isSm ? 'auto' : '0px!important' }}>

            <Box sx={{ marginBottom: '130px' }}>
              <Typography variant="h5" fontWeight='bold' textAlign='center' fontSize={isSm ? '1.9rem' : '1.5rem'} marginBottom='4px'>
                <span className='primary-color'>Category</span> Wise WebSite Template
              </Typography>
              <Typography variant="subtitle1" textAlign='center' gutterBottom>
                Best place for capture idea's or create your own website.
              </Typography>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Grid container columnSpacing={5} rowSpacing={10}>
                {categoryData.map((categoryData, index) => {
                  return <Grid item lg={4} md={6} xs={12} data-aos="fade-up" data-aos-duration="1500" key={index} >
                    <Card sx={{ position: 'relative', overflow: 'visible' }} onClick={() => { sessionStorage.setItem('categoryId', categoryData._id); sessionStorage.setItem('value', index); history.push('/category') }}>
                      <CardActionArea sx={{ padding: '30px', display: 'flex' }}>
                        <CardMedia
                          sx={{ position: 'absolute', top: '-44px', width: '80%', borderRadius: '7px' }}
                          component="img"
                          height="180"
                          image={`http://localhost:3000/images/${categoryData.image}`}
                          alt={categoryData.image}
                        />
                        <CardContent sx={{ marginTop: '113px' }}>
                          <Typography  variant="h5" textAlign='center' fontWeight='bold' marginBottom='10px' >
                            {categoryData.category}
                          </Typography>
                          <Typography variant="body1" textAlign='justify' color="text.secondary" sx={{display : '-webkit-box',WebkitLineClamp : 4,WebkitBoxOrient : 'vertical',overflow : 'hidden'}}>
                            {categoryData.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                })
                }

              </Grid>
            </Box>
          </Container>
        </section>


        <section className='section-py'>
          <Container fixed>
            <Box sx={{ width: '80%', margin: 'auto', marginBottom: '60px' }}>
              <Typography variant="h5" fontWeight='bold' textAlign='center' fontSize={isSm ? '1.9rem' : '1.5rem'} marginBottom='4px'>
                We're the <span className='primary-color'>best</span> and <span className='primary-color'>free themes </span> provider in the word
              </Typography>
            </Box>

            <Box sx={{ width: '90%', margin: 'auto', marginBottom: '60px' }}>
              <Grid container spacing={5} justifyContent='center'>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Card sx={{ padding: '30px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ height: '50px', width: '50px' }}>
                        <img src={MedalImg} className='reviewed-img' alt="Medal-img" />
                      </Box>
                    </Box>
                    <Typography variant="body1" textAlign='center' marginTop='15px' gutterBottom>
                      Most popular themes in the world
                    </Typography>
                  </Card>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Card sx={{ padding: '30px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ height: '50px', width: '50px' }}>
                        <img src={AwardImg} className='reviewed-img' alt="Medal-img" />
                      </Box>
                    </Box>
                    <Typography variant="body1" textAlign='center' marginTop='15px' gutterBottom>
                      Quality reviewed creators and items
                    </Typography>
                  </Card>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Card sx={{ padding: '30px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ height: '50px', width: '50px' }}>
                        <img src={ChatImg} className='reviewed-img' alt="Medal-img" />
                      </Box>
                    </Box>
                    <Typography variant="body1" textAlign='center' marginTop='15px' gutterBottom>
                     theme support available
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={5} alignItems='center'>
                <Grid item md={7} xs={12} sx={{ order: { md: 1, xs: 2 }, marginTop: '30px', display: { sm: 'block', xs: 'none' } }} >
                  <Card sx={{ padding: '30px', boxShadow: '3px 4px 8px #2298ff' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box>
                          <img src="https://neilpatel.com/wp-content/uploads/2015/04/ecommerce.jpg" width='100%' alt="" />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <img src="https://neilpatel.com/wp-content/uploads/2015/04/ecommerce.jpg" width='100%' alt="" />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <img src="https://neilpatel.com/wp-content/uploads/2015/04/ecommerce.jpg" width='100%' alt="" />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <img src="https://neilpatel.com/wp-content/uploads/2015/04/ecommerce.jpg" width='100%' alt="" />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item md={5} xs={12} sx={{ order: { md: 2, xs: 1 } }} >
                  <Box className='templateImg' sx={{ position: 'relative' }}>
                    <img src={tamplateImg} alt="template-logo" width='100px' />
                  </Box>
                  <Typography variant='h5' fontSize={isSm ? '1.9rem' : '1.5rem'}>
                    Unique themes and templates for every project.
                  </Typography>
                </Grid>
              </Grid>
            </Box>


          </Container>
        </section>


      </Box>
      <Footer />
    </>
  )
}

export default LandingPage;
