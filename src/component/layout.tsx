import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LayoutProps } from '../types/layoutProps';


const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || sessionStorage.getItem('fullName') || 'User';
  const firstName = fullName.split(' ')[0];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <Box>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">{title}</Typography>

          <Box>
            <IconButton onClick={handleMenuClick} color="inherit" size="large" edge="end">
              <Avatar>{firstName[0]}</Avatar>
              <Typography sx={{ ml: 1 }}>{firstName}</Typography>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>{fullName}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
};

export default Layout;