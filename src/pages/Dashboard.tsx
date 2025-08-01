import React, { useState } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, TablePagination, CircularProgress,
  Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Todo } from '../types/todo';
import type { SelectChangeEvent } from '@mui/material';
import { fetchTodos } from '../services/todos.service';
import Layout from '../component/layout';

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterAttr, setFilterAttr] = useState<'id' | 'todo' | 'userId'>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
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

  const handleDelete = (id: number) => {
    alert(`Deleting todo with ID: ${id}`);
  };

  return (
    <Layout title="Dashboard">
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
                <TableCell sx={{ pr: 10 }} >
                  Completed
                  </TableCell>
                <TableCell>User ID</TableCell>
                <TableCell sx={{ pl: 9 }}> 
                 Actions
                </TableCell>
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
                      size="small"
                      onClick={() => navigate(`/edit/${t.id}`)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Tooltip title="View Todo Info">
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          setSelectedTodo(t);
                          setOpenDialog(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Todo">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(t.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Todo Info</DialogTitle>
        <DialogContent dividers>
          {selectedTodo ? (
            <>
              <Typography><strong>ID:</strong> {selectedTodo.id}</Typography>
              <Typography><strong>Todo:</strong> {selectedTodo.todo}</Typography>
              <Typography><strong>Completed:</strong> {selectedTodo.completed ? 'Yes' : 'No'}</Typography>
              <Typography><strong>User ID:</strong> {selectedTodo.userId}</Typography>
            </>
          ) : (
            <Typography>No data</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
