import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import Layout from '../component/layout';

const AddTodo: React.FC = () => {
  const [todo, setTodo] = useState('');
  const [userId, setUserId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatus('error');
      return;
    }

    const res = await fetch('https://dummyjson.com/auth/todos/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        todo,
        completed,
        userId: Number(userId),
      }),
    });

    if (res.ok) {
      setStatus('success');
      setTodo('');
      setUserId('');
      setCompleted(false);
    } else {
      setStatus('error');
    }
  };

  return (
    <Layout title = "Add Todo">
   <Box sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Todo
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            
            required
            sx={{ mb: 2}}
          />
          <TextField
            fullWidth
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
           
            type="number"
            required
              sx={{ mb: 2}}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
            }
            label="Completed"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Todo
          </Button>
        </form>

        {status === 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Todo added successfully!
          </Alert>
        )}
        {status === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to add todo.
          </Alert>
        )}
      </Paper>
    </Box>
    </Layout>
  );
};

export default AddTodo;
