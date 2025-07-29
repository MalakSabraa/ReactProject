import React, { useState } from 'react';
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
  const [form, setForm] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('tokenExpiry');

  if (token && expiry) {
    const expiryTime = parseInt(expiry);
    const now = Date.now();

    if (now < expiryTime) {
      navigate('/dashboard');
      return null; 
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, password, rememberMe } = form;

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      if (rememberMe) {
        const expiresInDays = 7;
        const expiryTimestamp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiry', expiryTimestamp.toString());
      } else {
        localStorage.removeItem('tokenExpiry');
      }

      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            type="text"
            fullWidth
            margin="normal"
            color="primary"
            required
            value={form.username}
            onChange={handleChange}
          />

          <TextField
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            color="primary"
            required
            value={form.password}
            onChange={handleChange}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Remember Me"
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              login
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, gap: 6 }}>
            <Typography variant="body2">
              New User? <Link to="/signup">Sign up</Link>
            </Typography>
            <Typography variant="body2">
              <Link to="/forgot-password">Forget Password</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
