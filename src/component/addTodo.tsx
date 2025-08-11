import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
} from '@mui/material';
import type { Todo } from '../types/todo';

type Props = {
  onAdd: (todo: Omit<Todo, 'id'>) => void;
  onCancel: () => void;
};

const AddTodo: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [addData, setAddData] = useState<Partial<Omit<Todo, 'id'>>>({
    todo: '',
    completed: false,
    userId: undefined,
  });

  const [errors, setErrors] = useState<{ todo?: string; userId?: string }>({});

  const handleSave = () => {
    const newErrors: { todo?: string; userId?: string } = {};

    if (!addData.todo?.trim()) {
      newErrors.todo = 'Todo content is required.';
    }

    if (
      addData.userId === undefined ||
      isNaN(addData.userId) ||
      addData.userId <= 0
    ) {
      newErrors.userId = 'User ID must be a valid positive number.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onAdd(addData as Omit<Todo, 'id'>);
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
          />
          {errors.todo && (
            <Typography variant="body2" color="error">
              {errors.todo}
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Checkbox
          checked={!!addData.completed}
          onChange={(e) =>
            setAddData({ ...addData, completed: e.target.checked })
          }
        />
      </TableCell>
      <TableCell>
        <Box display="flex" flexDirection="column">
          <TextField
            type="text"
            value={
              addData.userId !== undefined && addData.userId !== null
                ? addData.userId
                : ''
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setAddData({ ...addData, userId: undefined });
                return;
              }
              if (!/^\d+$/.test(value)) return;
              setAddData({ ...addData, userId: Number(value) });
            }}
            size="small"
            error={!!errors.userId}
          />
          {errors.userId && (
            <Typography variant="body2" color="error">
              {errors.userId}
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Button size="small" onClick={handleSave}>
          Add
        </Button>
        <Button size="small" onClick={onCancel}>
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddTodo;
