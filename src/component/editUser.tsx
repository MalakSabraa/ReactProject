import React, { useState, useEffect } from "react";
import { TableRow, TableCell, TextField, Button } from "@mui/material";
import type { User } from "../types/User";

type Props = {
  user: User;
  editData: Partial<User>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  onSave: () => void;
  onCancel: () => void;
};

const InlineEditUserRow: React.FC<Props> = ({
  user,
  editData,
  setEditData,
  onSave,
  onCancel,
}) => {
  const [errors, setErrors] = useState({
    FirstName: "",
    LastName: "",
    Username: "",
    Email: "",
    Age: "",
  });

  useEffect(() => {
    setErrors({
      FirstName: "",
      LastName: "",
      Username: "",
      Email: "",
      Age: "",
    });
  }, [user.documentId]);

  const handleSave = () => {
    let valid = true;
    const newErrors = {
      FirstName: "",
      LastName: "",
      Username: "",
      Email: "",
      Age: "",
    };

    if (!editData.FirstName?.trim()) {
      newErrors.FirstName = "First name is required.";
      valid = false;
    }
    if (!editData.LastName?.trim()) {
      newErrors.LastName = "Last name is required.";
      valid = false;
    }
    if (!editData.Username?.trim()) {
      newErrors.Username = "Username is required.";
      valid = false;
    }
    if (!editData.Email?.trim()) {
      newErrors.Email = "Email is required.";
      valid = false;
    }
    if (
      editData.Age === undefined ||
      isNaN(Number(editData.Age)) ||
      Number(editData.Age) <= 0
    ) {
      newErrors.Age = "Age must be a valid number.";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    onSave();
  };

  return (
    <TableRow>
      <TableCell>{user.Id}</TableCell>
      <TableCell>
        <TextField
          value={editData.FirstName ?? ""}
          onChange={(e) => {
            setEditData({ ...editData, FirstName: e.target.value });
            setErrors((prev) => ({ ...prev, FirstName: "" }));
          }}
          size="small"
          error={!!errors.FirstName}
          helperText={errors.FirstName}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={editData.LastName ?? ""}
          onChange={(e) => {
            setEditData({ ...editData, LastName: e.target.value });
            setErrors((prev) => ({ ...prev, LastName: "" }));
          }}
          size="small"
          error={!!errors.LastName}
          helperText={errors.LastName}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={editData.Username ?? ""}
          onChange={(e) => {
            setEditData({ ...editData, Username: e.target.value });
            setErrors((prev) => ({ ...prev, Username: "" }));
          }}
          size="small"
          error={!!errors.Username}
          helperText={errors.Username}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={editData.Email ?? ""}
          onChange={(e) => {
            setEditData({ ...editData, Email: e.target.value });
            setErrors((prev) => ({ ...prev, Email: "" }));
          }}
          size="small"
          error={!!errors.Email}
          helperText={errors.Email}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          value={editData.Age ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setEditData({ ...editData, Age: value ? Number(value) : undefined });
            setErrors((prev) => ({ ...prev, Age: "" }));
          }}
          size="small"
          error={!!errors.Age}
          helperText={errors.Age}
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

export default InlineEditUserRow;
