import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTodoById, updateTodoById } from '../services/todos.service';
import Layout from '../component/layout';

const EditTodo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const todoId = Number(id);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const { data, isLoading, error } = useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodoById(todoId, token!),
    enabled: !!token && !!todoId,
  });

  const [todo, setTodo] = useState('');
  const [userId, setUserId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);


  useEffect(() => {
    if (data) {
      setTodo(data.todo);
      setUserId(String(data.userId));
      setCompleted(data.completed);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !todoId) {
      setStatus('error');
      return;
    }

    try {
      await updateTodoById(todoId, { todo, completed, userId: Number(userId) }, token);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading Todo...</Typography>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return <Typography color="error" sx={{ p: 4 }}>Failed to load todo.</Typography>;
  }

  return (
    <Layout title='Edit Todo'>
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
    </Layout>
  );
};

export default EditTodo;
