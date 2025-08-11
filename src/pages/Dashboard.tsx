import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, TablePagination, Button,
  IconButton, Tooltip, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar,
  CircularProgress
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTodos, updateTodoById, addTodo } from '../services/todos.service';
import Layout from '../component/layout';
import InlineEditRow from '../component/editTodo';
import InlineAddRow from '../component/addTodo';
import type { Todo } from '../types/todo';
import { Search } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filterAttr, setFilterAttr] = useState<'id' | 'todo' | 'userId'>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Todo>>({});
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    todo: '',
    userId: 0,
    completed: false,
  });
  const [property, setProperty] = useState("id"); 
  const [message, setMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [delayedSearch, setDelayedSearch] = useState(searchInput);
  const [viewedTodo, setViewedTodo] = useState<Todo | null>(null);
  const [editErrors, setEditErrors] = useState<{ todo?: string; userId?: string }>({});
  const [addErrors, setAddErrors] = useState<{ todo?: string; userId?: string }>({});
  const [debouncedSearch , setDebouncedSearch] = useState(searchInput);
  const [filterAttribute , setFilterAttribute] = useState('Todo');
  const queryClient = useQueryClient();

  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || undefined;

  useEffect(() => {
  const timeout = setTimeout(() => {
    setDebouncedSearch(searchInput);
  }, 500);

  return () => clearTimeout(timeout);
}, [searchInput]);


  const { data, error, isLoading, isInitialLoading, isFetching, isError } = useQuery({
  queryKey: ['todos', page, rowsPerPage, debouncedSearch, property],
  queryFn: () =>
    fetchTodos(page + 1, rowsPerPage, debouncedSearch, property),
  keepPreviousData: true, 
  });


  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSaveEdit = async (id: number) => {
  const errors: { todo?: string; userId?: string } = {};

  if (!editData.todo || editData.todo.trim() === '') {
    errors.todo = 'Todo content is required.';
  }

  if (
    editData.userId === undefined ||
    isNaN(Number(editData.userId)) ||
    Number(editData.userId) <= 0
  ) {
    errors.userId = 'User ID must be a valid positive number.';
  }

  if (Object.keys(errors).length > 0) {
    setEditErrors(errors);
    return;
  }

  setEditErrors({}); 

  try {
    await updateTodoById(id, editData, token!);
    setEditingId(null);
    refetch();
    setSnackbarMessage(`Todo with ID ${updated.attributes?.id || id} updated successfully`);

  } catch (err) {
    console.error(err);
  }
};



  const handleAddTodo = async () => {
  const errors: { todo?: string; userId?: string } = {};

  if (!newTodo.todo || newTodo.todo.trim() === '') {
    errors.todo = 'Todo content is required.';
  }

  if (
    newTodo.userId === undefined ||
    isNaN(Number(newTodo.userId)) ||
    Number(newTodo.userId) <= 0
  ) {
    errors.userId = 'User ID must be a valid positive number.';
  }

  if (Object.keys(errors).length > 0) {
    setAddErrors(errors);
    return;
  }

  setAddErrors({}); 

  try {
    await addTodo(newTodo);
    setNewTodo({ todo: '', userId: 0, completed: false });
    refetch();
    setSnackbarMessage('New todo added successfully');
    setIsAdding(false);
  } catch (err) {
    console.error(err);
  }
};

  const handleDelete = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:1337/api/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setSnackbarMessage('Todo deleted successfully');
    },
  });

  if (isInitialLoading)
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ mb: 2 }}>Loading...</Typography>
      <CircularProgress />
    </Box>
  );

   
  if (isError)
  {
    return (
      <Box>
      <Typography color="error" sx={{ p: 4 }}>
        Failed to load todos.
      </Typography>
      </Box>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Todos
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
  label="Search"
  variant="outlined"
  size="small"
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
/>


          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={property}
              label="Filter"
              onChange={(e) =>
                setProperty(e.target.value)
              }
            >
              <MenuItem value="id">ID</MenuItem>
  <MenuItem value="todo">Todo</MenuItem>
  <MenuItem value="userId">User ID</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => setIsAdding(true)}
            sx={{ marginLeft: 'auto' }}
          >
            Add Todo
          </Button>
        </Box>

        {message && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="success">{message}</Alert>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Todo</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isAdding && (
                <InlineAddRow
  newTodo={newTodo}
  setNewTodo={setNewTodo}
  onAdd={handleAddTodo}
  onCancel={() => {
    setIsAdding(false);
    setNewTodo({ todo: '', userId: 0, completed: false });
    setAddErrors({});
  }}
  errors={addErrors}
/>

              )}

              {data.data.map((t: Todo) => {
                const todo = t.todo ?? '—';
                const completed = t.completed ?? false;
                const userId = t.userId ?? '—';

                return editingId === t.id ? (
                  <InlineEditRow
  key={t.id}
  todo={{ ...t }}
  editData={editData}
  setEditData={setEditData}
  onSave={() => handleSaveEdit(t.documentId)}
  onCancel={() => setEditingId(null)}
  errors={editErrors}
/>

                ) : (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{todo}</TableCell>
                    <TableCell>{completed ? 'true' : 'false'}</TableCell>
                    <TableCell>{userId}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingId(t.id);
                          setEditData({ todo, completed, userId });
                        }}
                      >
                        Edit
                      </Button>
                      <Tooltip title="View">
                        <IconButton onClick={() => setViewedTodo(t)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete.mutate(t.documentId)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={data?.meta?.pagination?.total || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Rows per page:"
          />
        </TableContainer>

        <Dialog open={!!viewedTodo} onClose={() => setViewedTodo(null)}>
          <DialogTitle>Todo Details</DialogTitle>
          <DialogContent dividers>
            <Typography><strong>ID:</strong> {viewedTodo?.id}</Typography>
            <Typography><strong>Todo:</strong> {viewedTodo?.todo}</Typography>
            <Typography><strong>Completed:</strong> {viewedTodo?.completed ? '✅ Yes' : '❌ No'}</Typography>
            <Typography><strong>User ID:</strong> {viewedTodo?.userId}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewedTodo(null)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={3000}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Layout>
  );
};

export default Dashboard;
