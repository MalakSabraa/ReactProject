import React, { useState, useEffect } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import type { Todo } from '../types/todo';
import { fetchUsers } from '../services/users.service';

type Props = {
  todo: Todo;
  editData: Partial<Todo>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<Todo>>>;
  onSave: () => void;
  onCancel: () => void;
  errors?: { todo?: string; userId?: string };
};

const InlineEditRow: React.FC<Props> = ({
  todo,
  editData,
  setEditData,
  onSave,
  onCancel,
  errors,
}) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers(1, 100, "", "")
      .then((res) => {
        setUsers(res.users);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  return (
    <TableRow>
      {/* Keep ID visible but read-only */}
      <TableCell>{todo.Id}</TableCell>

      {/* Editable Todo */}
      <TableCell>
        <TextField
          value={editData.todo ?? ''}
          onChange={(e) => setEditData({ ...editData, todo: e.target.value })}
          size="small"
          error={!!errors?.todo}
          helperText={errors?.todo}
          placeholder="Enter todo"
        />
      </TableCell>

      {/* Editable Completed */}
      <TableCell>
        <Checkbox
          checked={!!editData.completed}
          onChange={(e) =>
            setEditData({ ...editData, completed: e.target.checked })
          }
        />
      </TableCell>

      {/* Editable User */}
      <TableCell>
        <FormControl fullWidth size="small" error={!!errors?.userId}>
          <Select
            displayEmpty
            value={editData.userId?.documentId ?? ""}
            onChange={(e) => {
              if (e.target.value === "") {
                setEditData({ ...editData, userId: null }); // allow null
              } else {
                const selectedUser = users.find(
                  (u) => u.documentId === e.target.value
                );
                setEditData({ ...editData, userId: selectedUser });
              }
            }}
            renderValue={(selected) => {
              if (!selected) {
                return <em>Select User</em>;
              }
              const user = users.find((u) => u.documentId === selected);
              return user ? `${user.FirstName} ${user.LastName}` : <em>No User</em>;
            }}
          >
            <MenuItem value="">
              <em>Select User</em>
            </MenuItem>
            {users.map((u) => (
              <MenuItem key={u.documentId} value={u.documentId}>
                {u.FirstName} {u.LastName}
              </MenuItem>
            ))}
          </Select>
          {errors?.userId && <FormHelperText>{errors.userId}</FormHelperText>}
        </FormControl>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <Button size="small" onClick={onSave}>
          Save
        </Button>
        <Button size="small" onClick={onCancel}>
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default InlineEditRow;
