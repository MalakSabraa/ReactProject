import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Checkbox, FormControlLabel} from '@mui/material';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log('Trying login with:', `"${trimmedUsername}"`, `"${trimmedPassword}"`);

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Error response body:', errText);
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Login response:', data);

      localStorage.setItem('token', data.token);

      if (rememberMe) {
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Network or other error during login:', err);
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

        {/* show error if any */}
        {error && (
          <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            type="text"
            fullWidth
            margin="normal"
            color="primary"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            color="primary"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember Me"
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              login
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 2,
              gap: 6,
            }}
          >
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
