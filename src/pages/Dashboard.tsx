import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination} from '@mui/material';
import type { Todo } from '../types/todo';
import type { SelectChangeEvent } from '@mui/material';

const Dashboard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState('');
  const [filterAttr, setFilterAttr] = useState<'id' | 'todo' | 'userId'>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetch('https://dummyjson.com/todos?limit=150')
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos);
      });
  }, []);

  const filteredTodos = todos.filter((t) => {
    const valueToCheck =
      filterAttr === 'id'
        ? String(t.id)
        : filterAttr === 'todo'
        ? t.todo
        : String(t.userId);
    return valueToCheck.toLowerCase().includes(search.toLowerCase());
  });

  const paginatedTodos = filteredTodos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Todos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Todo</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>User ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTodos.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.todo}</TableCell>
                <TableCell>{t.completed ? 'true' : 'false'}</TableCell>
                <TableCell>{t.userId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredTodos.length}
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
