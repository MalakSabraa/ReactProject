import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

const LoginPage: React.FC = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); 
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Use the same key 'token' to be consistent
      const storage = values.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.accessToken);

      navigate('/dashboard'); // Or change to "/todos"
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username *"
            name="username"
            value={values.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password *"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            margin="normal"
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={handleChange}
                />
              }
              label="Remember Me"
            />
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
               Forgot Password?
            </Link>
          </Box>

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            LOGIN
          </Button>

          <Typography align="center" variant="body2" mt={2}>
            New User? <Link to="/signup">Signup</Link> 
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
