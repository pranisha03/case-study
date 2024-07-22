import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { jwt, userRole } = response.data;
      localStorage.setItem('token', jwt);
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    } catch (error) {
      console.error('Login error', error);
      alert('Wrong email or password. Please try again.');
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
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
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
              Login
            </Button>
          </Box>
          <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account? <Link to="/signup" style={{ color: '#0072ff', textDecoration: 'none' }}>Signup</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
