import React, { useEffect, useState } from 'react'
import { Box, Breadcrumbs, Button, Container, Grid, InputLabel, Paper, Stack, TextField, Tooltip, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { DataGrid } from '@mui/x-data-grid';
import * as Yup from 'yup';

import {
    Link
} from "react-router-dom";
import axios from 'axios';

import { toast } from 'react-toastify';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const StyledButton = styled(Button)({
    backgroundColor: '#4014147d',
    borderRadius: '15px',
    color: 'white',
    fontSize: '13px',
    textTransform: 'capitalize',
    padding: '5px 12px'
});

const AdminCategory = () => {

    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.up('sm'));

    // category Data 
    const [data, setData] = useState([]);


    const getData = () => {
        // let Token = localStorage.getItem('adminToken');

        axios.get('http://localhost:3000/admin/category/read', 
        // { headers: { Authorization: Token } }
        )
            .then((res) => {
                // console.log(res);
                setData(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getData();
    }, [])

    // single file choose 
    const [categoryPhoto, setCategoryPhoto] = useState();



    const [id, setId] = useState();
    const [categoryDataId, setCategoryDataId] = useState();

    const categorySchema = Yup.object().shape({
        categoryName: Yup.string().required('Category name is required'),
        categoryDescription: Yup.string().required('Category description is required'),
        categoryPhoto: Yup.mixed().test('is-match', 'Upload category img is Required', (value) => {
            if (!value) {
                return false; // Error condition
            }
            return true; // Validation passes
        })

    });


    const formik = useFormik({
        initialValues: {
            categoryName: '',
            categoryDescription: '',
            categoryPhoto: ''
        },
        validationSchema: categorySchema,
        onSubmit: (values, { setSubmitting }) => {
            // Your form submission logic here


            if (id === 0 || id) {

             

                // let file = formik.values.categoryPhoto

                // console.log('file =============', file);

                let formData = new FormData();

                formData.append('category', formik.values.categoryName);
                formData.append('description', formik.values.categoryDescription);
                formData.append('image', formik.values.categoryPhoto);

                let Token = localStorage.getItem('adminToken'); 

                axios.patch(`http://localhost:3000/admin/category/update/${categoryDataId}`, formData,{ headers: { Authorization: Token } })
                    .then((res) => {
                        console.log(res);
                        setSubmitting(values.categoryName = '', values.categoryPhoto = '', values.categoryDescription = '');
                        setCategoryPhoto('');
                        setId('');
                        getData();
                        toast(res.data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
            else {

                let formData = new FormData();

                formData.append("category", values.categoryName);
                formData.append('description', values.categoryDescription);
                formData.append("image", values.categoryPhoto);

                axios.post('http://localhost:3000/admin/category/create', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                    .then((res) => {
                        console.log(res);
                        setSubmitting(values.categoryName = '', values.categoryPhoto = '', values.categoryDescription = '');
                        setCategoryPhoto('');
                        getData();
                        toast(res.data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
        },
    });


    console.log(data);

    const deleteUserData = (categoryId) => {

        let Token = localStorage.getItem('adminToken');

        axios.delete(`http://localhost:3000/admin/category/delete/${categoryId}`,  { headers: { Authorization: Token } })
            .then((res) => {
                console.log(res);
                getData();
                toast(res.data.message);
            })
            .catch((err) => {
                console.log(err);
            })


    }


    const editUserData = (categoryDataId, dataId) => {

        console.log(categoryDataId);
        console.log(dataId);

        setId(dataId);
        setCategoryDataId(categoryDataId);

        let copyData = [...data];

        const editableCategoryData = copyData.at(dataId);

        console.log(editableCategoryData);


        formik.values.categoryName = editableCategoryData.category;

        formik.values.categoryDescription = editableCategoryData.description;

        formik.values.categoryPhoto = editableCategoryData.image;


        setCategoryPhoto(editableCategoryData.image);


    }



    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        {
            field: 'categoryName',
            headerName: 'Category Name',
            width: 130,
            editable: false,
        },
        {
            field: 'categoryPhoto',
            headerName: 'Category Photo',
            width: 170,
            editable: false,
            renderCell: (e) => (
                <Stack direction="row" spacing={1}>
                    {e.value}
                </Stack>
            )
        },
        {
            field: 'categoryDescription',
            headerName: 'Category Description',
            width: 200,
            editable: false,
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 150,
            editable: false,
            sortable: false,
            // disableColumnFilter: false
            disableColumnMenu: true,
            renderCell: (e) => (e.value)
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 150,
            editable: false,
            sortable: false,
            // disableColumnFilter: false
            disableColumnMenu: true,
            renderCell: (e) => (e.value)
        },

    ];

    // const rows = data.map((userData, userId) => (
    //     { id: userId + 1, categoryName: userData.category, categoryPhoto: userData.image, delete: <Button variant='contained' color='error' onClick={() => deleteUserData(userData._id)}>delete</Button>, edit: <Button variant='contained' color='warning' onClick={() => editUserData(userId)}>edit</Button> }
    // ))

    const rows = data.map((categoryData, dataId) => (
        { id: dataId + 1, categoryName: categoryData.category, categoryPhoto: <img src={`http://localhost:3000/images/${categoryData.image}`} width='150px' alt='img'></img>, categoryDescription: categoryData.description, delete: <Button variant='contained' color='error' onClick={() => deleteUserData(categoryData._id)}>delete</Button>, edit: <Button variant='contained' color='warning' onClick={() => editUserData(categoryData._id, dataId)}>edit</Button> }
    ))


    // const rows = [
    //     { id: 1, categoryName: 'blogging', categoryPhoto: <img src={blog} width='150px' alt='img'></img>, delete: <Button variant='contained' color='error'>delete</Button>, edit: <Button variant='contained' color='warning'>edit</Button> },

    // ];

    return (
        <Box>

            <Typography variant="h5"  >
                Category
            </Typography>
            <Breadcrumbs aria-label="breadcrumb" marginBottom="30px">
                <Link className="Breadcrumb" style={{ color: "#808080", fontSize: "14px", textDecoration: "none" }} to="/admin">
                    Home
                </Link>
                <Typography color="#273246" fontSize="14px">Category</Typography>
            </Breadcrumbs>

            <Box>
                <Grid container justifyContent='center' spacing={5}>

                    <Grid item md={5} sm={7} xs={12} >
                        <Item>
                            <form onSubmit={formik.handleSubmit}>
                                <Stack spacing={3}>
                                    <Typography variant='h4' textAlign='center'>Category</Typography>

                                    <TextField
                                        id='categoryName'
                                        name="categoryName"
                                        label="Category Name"
                                        variant="outlined"
                                        fullWidth
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.categoryName}
                                        error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
                                        helperText={formik.touched.categoryName && formik.errors.categoryName}
                                    />
                                    <TextField
                                        id='categoryDescription'
                                        name="categoryDescription"
                                        label="Category Description"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.categoryDescription}
                                        error={formik.touched.categoryDescription && Boolean(formik.errors.categoryDescription)}
                                        helperText={formik.touched.categoryDescription && formik.errors.categoryDescription}

                                    />
                                    <Grid container alignItems='center' columnSpacing={1}>
                                        <Grid item sm={4} xs={12} marginBottom={isSm ? '0px' : '10px'}>
                                            <Tooltip title="Category image" arrow>
                                                <InputLabel className='fw-600'>Image Upload</InputLabel>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item sm={8} xs={12} marginBottom={isSm ? '0px' : '16px'}>

                                            <Grid container alignItems='center'>
                                                <Grid item xs={5}>
                                                    <input
                                                        id="categoryPhoto"
                                                        name="categoryPhoto"
                                                        type="file"
                                                        onChange={(event) => {

                                                            let file = event.currentTarget.files[0];

                                                            formik.setFieldValue("categoryPhoto", file);
                                                            setCategoryPhoto(file?.name);
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        style={{ display: 'none' }} // You might want to hide the input field visually and use a custom button
                                                    />
                                                    <label htmlFor="categoryPhoto">
                                                        <StyledButton component="span" className='choosen-btn'>
                                                            Choose File
                                                        </StyledButton>
                                                    </label>
                                                    {/* <StyledInput
                                                        name='categoryPhoto'
                                                        type="file"
                                                        onChange={handleSingleFileChange}
                                                        id="categoryPhoto"
                                                        error={formik.touched.categoryPhoto && Boolean(formik.errors.categoryPhoto)}

                                                    />
                                                    <label htmlFor="categoryPhoto">
                                                        <StyledButton component="span" className='choosen-btn'>
                                                            Choose File
                                                        </StyledButton>
                                                    </label> */}
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography variant="subtitle2" overflow='auto' width='100%'>
                                                        {categoryPhoto}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {formik.touched.categoryPhoto && formik.errors.categoryPhoto && (
                                            <Typography sx={{ margin: '3px 14px 0px' }} variant="caption" color="error">
                                                {formik.errors.categoryPhoto}
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Button type='submit' variant='contained' sx={{ marginTop: '40px!important' }}>submit</Button>
                                </Stack>
                            </form>
                        </Item>

                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <Container fixed>
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
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                            </Container>
                        </Item>

                    </Grid>





                </Grid>

            </Box>


        </Box>
    )
}

export default AdminCategory;