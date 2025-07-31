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
import { useLocation } from 'react-router-dom';
import type { TodoData } from '../types/editTodoData';


const EditTodo: React.FC = () => {
  const location = useLocation();
  const todoData = location.state as TodoData;

  const [todo, setTodo] = useState(todoData?.todo || '');
  const [userId, setUserId] = useState(todoData?.userId.toString() || '');
  const [completed, setCompleted] = useState(todoData?.completed || false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !todoData?.id) {
      setStatus('error');
      return;
    }

    const res = await fetch(`https://dummyjson.com/todos/${todoData.id}`, {
      method: 'PUT', 
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
    } else {
      setStatus('error');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Todo
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            type="number"
            required
            sx={{ mb: 2 }}
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
            Update Todo
          </Button>
        </form>

        {status === 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Todo updated successfully!
          </Alert>
        )}
        {status === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to update todo.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default EditTodo;
