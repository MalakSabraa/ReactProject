import React, { useState, useEffect } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Checkbox,
  Button,
  Box,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { Todo } from '../types/todo';
import type { User } from '../types/User';
import { fetchUsers } from '../services/users.service';

type Props = {
  onAdd: (todo: Omit<Todo, 'id' | 'documentId'>) => void;
  onCancel: () => void;
};

const AddTodo: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [addData, setAddData] = useState<Partial<Omit<Todo, 'id' | 'documentId'>>>({
    todo: '',
    completed: false,
    userId: undefined, // will hold documentId string of user
  });

  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<{ todo?: string; userId?: string }>({});

  // ✅ fetch users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { users } = await fetchUsers(1, 100, "", ""); // fetch first 100 users
        setUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    loadUsers();
  }, []);

  const handleSave = () => {
    const newErrors: { todo?: string; userId?: string } = {};

    if (!addData.todo?.trim()) {
      newErrors.todo = 'Todo content is required.';
    }

    // ✅ userId can be null/undefined (optional) → so only validate if required
    // if (!addData.userId) {
    //   newErrors.userId = 'A valid user must be selected.';
    // }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onAdd(addData as Omit<Todo, 'id' | 'documentId'>);

    setAddData({ todo: '', completed: false, userId: undefined });
    setErrors({});
  };

  return (
    <TableRow>
      <TableCell>New</TableCell>

      <TableCell>
        <Box display="flex" flexDirection="column">
          <TextField
            value={addData.todo}
            onChange={(e) => setAddData({ ...addData, todo: e.target.value })}
            size="small"
            error={!!errors.todo}
            helperText={errors.todo}
          />
        </Box>
      </TableCell>

      <TableCell>
        <Checkbox
          checked={!!addData.completed}
          onChange={(e) => setAddData({ ...addData, completed: e.target.checked })}
        />
      </TableCell>

      <TableCell>
        <FormControl size="small" fullWidth error={!!errors.userId}>
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            value={addData.userId || ""}
            onChange={(e) =>
              setAddData({ ...addData, userId: e.target.value || undefined })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.documentId} value={user.documentId}>
                {user.FirstName} {user.LastName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.userId}</FormHelperText>
        </FormControl>
      </TableCell>

      <TableCell>
        <Button
          size="small"
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
        <Button
          size="small"
          onClick={onCancel}
          variant="outlined"
          sx={{ ml: 1 }}
        >
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddTodo;
