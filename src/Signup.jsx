import { Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', userRole: 'EMPLOYEE' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Signup successful', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Signup error', error);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Typography variant="h4" sx={{ marginBottom: 3, color: '#0072ff' }}>
                        Signup
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            autoFocus
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                        />
                        <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                            <InputLabel id="userRole-label">User Role</InputLabel>
                            <Select
                                labelId="userRole-label"
                                id="userRole"
                                name="userRole"
                                value={formData.userRole}
                                onChange={handleChange}
                                label="User Role"
                            >
                                <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: '#0072ff',
                                '&:hover': {
                                    backgroundColor: '#005bb5',
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            Signup
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;