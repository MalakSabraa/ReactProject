import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, TablePagination, Button,
  IconButton, Tooltip, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, CircularProgress
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTodos, updateTodo, addTodo, deleteTodo } from '../services/todos.service';
import Layout from '../component/layout';
import InlineEditRow from '../component/editTodo';
import AddTodo from '../component/addTodo';
import type { Todo } from '../types/todo';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';

ChartJS.register(ArcElement, Legend);

const Dashboard: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [property, setProperty] = useState<'id' | 'todo' | 'user'>('id'); // ✅ changed userId -> user
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Todo>>({});
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    todo: '',
    completed: false,
    userId: null,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [viewedTodo, setViewedTodo] = useState<(Todo & { numericId?: number }) | null>(null);
  const [editErrors, setEditErrors] = useState<{ todo?: string }>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isInitialLoading, isError, refetch } = useQuery({
    queryKey: ["todos", page, rowsPerPage, debouncedSearch, property],
    queryFn: () => fetchTodos(page + 1, rowsPerPage, debouncedSearch, property),
    keepPreviousData: true,
  });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSaveEdit = async (documentId: string) => {
    const errors: { todo?: string } = {};

    if (!editData.todo || editData.todo.trim() === '') {
      errors.todo = 'Todo content is required.';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setEditErrors({});
    try {
      await updateTodo(documentId, editData as Todo);
      setEditingId(null);
      await refetch();
      setSnackbarMessage("Todo updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      const payload = {
        ...newTodo,
        userId: newTodo.userId || null,
      };
      await addTodo(payload);
      queryClient.invalidateQueries(['todos']);
      setIsAdding(false);
      setSnackbarMessage('New todo added successfully');
    } catch (err) {
      console.error('Add todo failed:', err);
      setSnackbarMessage('Failed to add todo');
    }
  };

  const handleDelete = useMutation({
    mutationFn: async (documentId: string) => {
      await deleteTodo(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setSnackbarMessage('Todo deleted successfully');
    },
  });

  if (isInitialLoading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ mb: 2 }}>Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  }

  const completedCount = data?.nodes.filter((t: Todo) => t.completed).length || 0;
  const notCompletedCount = (data?.nodes.length || 0) - completedCount;

  const assignedCount = data?.nodes.filter((t: Todo) => t.userId).length || 0;
  const unassignedCount = (data?.nodes.length || 0) - assignedCount;

  const pieDataStatus = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        label: 'Todos Status',
        data: [completedCount, notCompletedCount],
        backgroundColor: ["#006400", "#8B0000"],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const pieDataAssigned = {
    labels: ['Assigned', 'Unassigned'],
    datasets: [
      {
        label: 'Todos Assigned',
        data: [assignedCount, unassignedCount],
        backgroundColor: ["#006400", "#8B0000"],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  if (isError) {
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
      {/* ✅ Charts Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, my: 4, flexWrap: 'wrap' }}>
        {/* Todos Percentages */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center', width: 320 }}>
          <Typography variant="h6" gutterBottom>
            Todos Percentages
          </Typography>
          <Box sx={{ width: 250, mx: 'auto' }}>
            <Pie data={pieDataStatus} options={pieOptions} />
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {completedCount}/{completedCount + notCompletedCount} Completed
          </Typography>
          <Typography variant="body2">
            {notCompletedCount}/{completedCount + notCompletedCount} Not Completed
          </Typography>
        </Paper>

        {/* Employees Assigned */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center', width: 320 }}>
          <Typography variant="h6" gutterBottom>
            Employees Assigned
          </Typography>
          <Box sx={{ width: 250, mx: 'auto' }}>
            <Pie data={pieDataAssigned} options={pieOptions} />
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {assignedCount}/{assignedCount + unassignedCount} Assigned
          </Typography>
          <Typography variant="body2">
            {unassignedCount}/{assignedCount + unassignedCount} Unassigned
          </Typography>
        </Paper>
      </Box>

      {/* ✅ Todo Table Section */}
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
              onChange={(e) => setProperty(e.target.value as 'id' | 'todo' | 'user')}
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="user">User</MenuItem> {/* ✅ changed here */}
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
                <TableCell>User</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isAdding && (
                <AddTodo
                  onAdd={handleAddTodo}
                  onCancel={() => setIsAdding(false)}
                />
              )}
              {data?.nodes.map((t: Todo, index: number) => {
                const todoText = t.todo ?? '—';
                const completed = t.completed ?? false;
                const displayId = page * rowsPerPage + index + 1;

                return editingId === t.documentId ? (
                  <InlineEditRow
                    key={t.documentId}
                    todo={{ ...t }}
                    editData={editData}
                    setEditData={setEditData}
                    onSave={() => handleSaveEdit(t.documentId)}
                    onCancel={() => setEditingId(null)}
                    errors={editErrors}
                  />
                ) : (
                  <TableRow key={t.documentId}>
                    <TableCell>{displayId}</TableCell>
                    <TableCell>{todoText}</TableCell>
                    <TableCell>{completed ? 'true' : 'false'}</TableCell>
                    <TableCell>
                      {t.userId ? `${t.userId.FirstName} ${t.userId.LastName}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingId(t.documentId);
                          setEditData({ todo: todoText, completed });
                        }}
                      >
                        Edit
                      </Button>
                      <Tooltip title="View">
                        <IconButton
                          onClick={() =>
                            setViewedTodo({
                              ...t,
                              numericId: displayId,
                            })
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete.mutate(t.documentId)}>
                          <DeleteIcon color = "error" />
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
            count={data?.pageInfo?.total || 0}
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
            <Typography><strong>ID:</strong> {viewedTodo?.numericId}</Typography>
            <Typography><strong>Todo:</strong> {viewedTodo?.todo}</Typography>
            <Typography><strong>Completed:</strong> {viewedTodo?.completed ? '✅ Yes' : '❌ No'}</Typography>
            <Typography><strong>User:</strong>
              {viewedTodo?.userId ? `${viewedTodo.userId.FirstName} ${viewedTodo.userId.LastName}` : '—'}
            </Typography>
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
