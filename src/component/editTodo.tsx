import React, { useState, useEffect } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Checkbox,
  Button,
} from '@mui/material';
import type { Todo } from '../types/todo';

type Props = {
  todo: Todo;
  editData: Partial<Todo>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<Todo>>>;
  onSave: () => void;
  onCancel: () => void;
};

const InlineEditRow: React.FC<Props> = ({
  todo,
  editData,
  setEditData,
  onSave,
  onCancel,
}) => {
  const [errors, setErrors] = useState({ todo: '', userId: '' });

  useEffect(() => {
    setErrors({ todo: '', userId: '' }); // reset on new edit row
  }, [todo.id]);

  const handleSave = () => {
    let valid = true;
    const newErrors = { todo: '', userId: '' };

    if (!editData.todo?.trim()) {
      newErrors.todo = 'Todo content is required.';
      valid = false;
    }

    if (editData.userId === undefined || isNaN(editData.userId)) {
      newErrors.userId = 'User ID must be a valid number.';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    onSave();
  };

  return (
    <TableRow>
      <TableCell>{todo.id}</TableCell>
      <TableCell>
        <TextField
          value={editData.todo}
          onChange={(e) => {
            setEditData({ ...editData, todo: e.target.value });
            setErrors((prev) => ({ ...prev, todo: '' }));
          }}
          size="small"
          error={!!errors.todo}
          helperText={errors.todo}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={!!editData.completed}
          onChange={(e) =>
            setEditData({ ...editData, completed: e.target.checked })
          }
        />
      </TableCell>
      <TableCell>
        <TextField
          type="text"
          value={
            editData.userId !== undefined && editData.userId !== null
              ? editData.userId
              : ''
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setEditData({ ...editData, userId: undefined });
              setErrors((prev) => ({ ...prev, userId: '' }));
              return;
            }
            if (!/^\d+$/.test(value)) return;
            setEditData({ ...editData, userId: Number(value) });
            setErrors((prev) => ({ ...prev, userId: '' }));
          }}
          size="small"
          error={!!errors.userId}
          helperText={errors.userId}
        />
      </TableCell>
      <TableCell>
        <Button size="small" onClick={handleSave}>
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
