import React, { useState } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, TablePagination, CircularProgress, Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { Todo } from '../types/todo';
import type { SelectChangeEvent } from '@mui/material';

const fetchTodos = async (page: number, rowsPerPage: number, token: string) => {
  const skip = page * rowsPerPage;
  const res = await fetch(`https://dummyjson.com/auth/todos?limit=${rowsPerPage}&skip=${skip}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load todos');
  }

  return res.json();
};

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterAttr, setFilterAttr] = useState<'id' | 'todo' | 'userId'>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['todos', page, rowsPerPage],
    queryFn: () => fetchTodos(page, rowsPerPage, token!),
    enabled: !!token,
    staleTime: 1000 * 60, // 1 minute
  });

  if (!token) {
    return <Typography color="error" sx={{ p: 4 }}>You are not authenticated.</Typography>;
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading Todos...</Typography>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return <Typography color="error" sx={{ p: 4 }}>Failed to load todos.</Typography>;
  }

  const filteredTodos = data.todos.filter((t: Todo) => {
    const value = filterAttr === 'id'
      ? String(t.id)
      : filterAttr === 'userId'
      ? String(t.userId)
      : t.todo?.toLowerCase() ?? '';
    return value.includes(search.toLowerCase());
  });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Todos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          label="Search Query"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterAttr}
            label="Filter"
            onChange={(e: SelectChangeEvent) =>
              setFilterAttr(e.target.value as 'id' | 'todo' | 'userId')
            }
          >
            <MenuItem value="id">Id</MenuItem>
            <MenuItem value="todo">Todo</MenuItem>
            <MenuItem value="userId">User ID</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/addTodo')}
          sx={{ height: '40px', marginLeft: 'auto' }}
        >
          Add Todo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Todo</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTodos.map((t: Todo) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.todo}</TableCell>
                <TableCell>{t.completed ? 'true' : 'false'}</TableCell>
                <TableCell>{t.userId}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate('/editTodo', {
                        state: {
                          id: t.id,
                          todo: t.todo,
                          userId: t.userId,
                          completed: t.completed,
                        },
                      })
                    }
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="Rows per page:"
        />
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2 }} align="center">
        Today {new Date().toLocaleDateString()} you use ruffle!
      </Typography>
    </Box>
  );
};

export default Dashboard;
