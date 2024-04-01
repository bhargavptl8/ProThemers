import React from 'react';
import { Box, Container, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

//React icon
import { LiaThemeco } from "react-icons/lia";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";


const Footer = () => {
    
    const theme = useTheme();
    let history = useHistory();

    const isMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box className='bg-secondary'>
            <Container maxWidth='lg'>
                <Box sx={{ paddingY: '50px' }}>
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12}>
                            <Stack spacing={1} direction="row" marginBottom='15px' alignItems="center" >
                                <LiaThemeco size={40} className='primary-color' />
                                <Typography
                                    // noWrap
                                    component="a"
                                    onClick={() => history.push('/')}
                                    sx={{
                                        color: '#fff',
                                        marginLeft: '5px!important',
                                        marginTop: '4px!important',
                                        fontWeight: 600,
                                        fontSize: "28px",
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Themer<span className='primary-color'>'</span>s
                                </Typography>

                            </Stack>
                            <Typography variant="body1" gutterBottom color='rgba(255,255,255,0.7)'>
                                Themer's is a Website Template platform where you can see everything you need to create a website. Hundreds of independent developers upload their products here so that you could create your own unique project.
                            </Typography>

                        </Grid> 
                        <Grid item md={4} xs={12}>
                            <Box sx={{paddingX : isMd ? '60px' : '0px'}}>
                                <Typography variant='h5' className='primary-color' marginTop='10px' marginBottom='10px'>
                                    Product
                                </Typography>
                                <Stack>
                                    <Typography variant="body1" fontSize='15px' color='rgba(255,255,255,0.7)'>
                                        Website Template
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Typography variant='h5' className='primary-color' marginTop='10px' marginBottom='10px'>
                                Contact us
                            </Typography>
                            <Stack spacing={1}>
                                <Stack direction='row' alignItems='center'>
                                    <FaPhone className='primary-color' size={18} />
                                    <Typography variant="body1" fontSize='15px' color='rgba(255,255,255,0.7)' marginLeft='15px'>
                                        +91 1234567891
                                    </Typography>
                                </Stack>
                                <Stack direction='row' alignItems='center'>
                                    <MdOutlineEmail className='primary-color' size={22} />
                                    <Typography variant="body1" fontSize='15px' color='rgba(255,255,255,0.7)' marginLeft='15px'>
                                        prothemer2024@gmail.com
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer