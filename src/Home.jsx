import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
                background: 'linear-gradient(to right, #ff7e5f, #feb47b)', 
                fontFamily: "'Poppins', sans-serif",
                textAlign: 'center',
                padding: 3
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
                    padding: 4,
                    textAlign: 'center'
                }}
            >
                <Typography variant="h3" sx={{ marginBottom: 2, color: '#333', fontWeight: 700 }}>
                    TASK TRACKER
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginClick}
                        sx={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            backgroundColor: '#0072ff',
                            '&:hover': {
                                backgroundColor: '#005bb5', 
                                transition: 'background-color 0.3s ease'
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSignupClick}
                        sx={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            borderColor: '#0072ff',
                            color: '#0072ff',
                            '&:hover': {
                                borderColor: '#005bb5',
                                color: '#005bb5',
                                transition: 'color 0.3s ease, border-color 0.3s ease'
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
