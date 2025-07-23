import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper , Checkbox, FormControlLabel} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();


  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    localStorage.setItem('token', 'my-sample-token');
    navigate('/dashboard');
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
        <form onSubmit={handleLogin}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            color="primary"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
             variant="outlined"
             color="primary"
            >
           Login
           </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, gap: 20 }}>
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
